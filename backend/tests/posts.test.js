const request = require('supertest');
const app = require('../src/app');
const Post = require('../src/models/Post');
const { createAdminAndLogin, createCategory, createPost, createUser, loginAs } = require('./helpers/auth');

describe('Public endpoints', () => {
  it('returns only published posts on GET /api/posts', async () => {
    const { user } = await createAdminAndLogin();
    const cat = await createCategory('Public-Test');
    await createPost(user, cat, { status: 'draft', title: 'Draft One', slug: 'draft-one' });
    await createPost(user, cat, { status: 'published', title: 'Live One', slug: 'live-one', publishedAt: new Date() });

    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].slug).toBe('live-one');
    expect(res.body.data[0].content).toBeUndefined(); // excluded from list
  });

  it('returns 404 for a draft slug without an admin token', async () => {
    const { user } = await createAdminAndLogin();
    const cat = await createCategory();
    await createPost(user, cat, { status: 'draft', slug: 'hidden-draft' });
    const res = await request(app).get('/api/posts/slug/hidden-draft');
    expect(res.status).toBe(404);
  });

  it('returns a draft to an admin', async () => {
    const { user, token } = await createAdminAndLogin();
    const cat = await createCategory();
    await createPost(user, cat, { status: 'draft', slug: 'preview-draft' });
    const res = await request(app)
      .get('/api/posts/slug/preview-draft')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('draft');
  });

  it('filters by category', async () => {
    const { user } = await createAdminAndLogin();
    const catA = await createCategory('Category A');
    const catB = await createCategory('Category B');
    await createPost(user, catA, { status: 'published', slug: 'a-1', publishedAt: new Date() });
    await createPost(user, catB, { status: 'published', slug: 'b-1', publishedAt: new Date() });

    const res = await request(app).get(`/api/posts?category=${catA.slug}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].slug).toBe('a-1');
  });

  it('filters by tag', async () => {
    const { user } = await createAdminAndLogin();
    const cat = await createCategory();
    await createPost(user, cat, { status: 'published', tags: ['launch'], slug: 'launch-post', publishedAt: new Date() });
    await createPost(user, cat, { status: 'published', tags: ['growth'], slug: 'growth-post', publishedAt: new Date() });

    const res = await request(app).get('/api/posts?tag=launch');
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].slug).toBe('launch-post');
  });

  it('paginates with correct meta', async () => {
    const { user } = await createAdminAndLogin();
    const cat = await createCategory();
    for (let i = 0; i < 5; i++) {
      await createPost(user, cat, { status: 'published', slug: `p-${i}`, publishedAt: new Date() });
    }
    const res = await request(app).get('/api/posts?page=1&limit=2');
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toMatchObject({ page: 1, limit: 2, total: 5, totalPages: 3 });
  });

  it('safely handles regex metacharacters in search', async () => {
    const { user } = await createAdminAndLogin();
    const cat = await createCategory();
    await createPost(user, cat, { status: 'published', title: 'Special (chars) test', slug: 'special-1', publishedAt: new Date() });

    const res = await request(app).get('/api/posts?search=(chars)');
    expect(res.status).toBe(200); // no 500 from bad regex
  });
});

describe('Admin endpoints', () => {
  it('rejects unauthenticated create', async () => {
    const res = await request(app).post('/api/posts').send({});
    expect(res.status).toBe(401);
  });

  it('creates a post with auto-generated slug', async () => {
    const { token } = await createAdminAndLogin();
    const cat = await createCategory();
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My First Post',
        excerpt: 'A perfectly adequate excerpt.',
        content: '<p>Body</p>',
        category: cat._id.toString(),
        status: 'draft',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe('my-first-post');
    expect(res.body.data.status).toBe('draft');
  });

  it('generates a unique slug on duplicate titles', async () => {
    const { token } = await createAdminAndLogin();
    const cat = await createCategory();
    const payload = {
      title: 'Duplicate Title',
      excerpt: 'A perfectly adequate excerpt.',
      content: '<p>Body</p>',
      category: cat._id.toString(),
    };
    const r1 = await request(app).post('/api/posts').set('Authorization', `Bearer ${token}`).send(payload);
    const r2 = await request(app).post('/api/posts').set('Authorization', `Bearer ${token}`).send(payload);
    expect(r1.body.data.slug).toBe('duplicate-title');
    expect(r2.body.data.slug).toBe('duplicate-title-1');
  });

  it('sets publishedAt on publish and clears on unpublish', async () => {
    const { token } = await createAdminAndLogin();
    const cat = await createCategory();
    const create = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Pub Toggle',
        excerpt: 'A perfectly adequate excerpt.',
        content: '<p>Body</p>',
        category: cat._id.toString(),
        status: 'draft',
      });
    const id = create.body.data._id;

    const pub = await request(app)
      .put(`/api/posts/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'published' });
    expect(pub.body.data.publishedAt).toBeTruthy();

    const unpub = await request(app)
      .put(`/api/posts/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'draft' });
    expect(unpub.body.data.publishedAt).toBeNull();
  });

  it('rejects invalid body with 422 and field errors', async () => {
    const { token } = await createAdminAndLogin();
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'x' }); // too short, missing excerpt/content/category
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('rejects unknown category id', async () => {
    const { token } = await createAdminAndLogin();
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'No Cat',
        excerpt: 'A perfectly adequate excerpt.',
        content: '<p>B</p>',
        category: '507f1f77bcf86cd799439011', // valid hex, no doc
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Category not found/);
  });

  it('editor cannot edit another author’s post', async () => {
    const { user: admin } = await createAdminAndLogin();
    const editor = await createUser({ role: 'editor', email: 'ed@test.com' });
    const { token: editorToken } = await loginAs(editor);
    const cat = await createCategory();
    const post = await createPost(admin, cat);

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ title: 'Hijacked' });
    expect(res.status).toBe(403);
  });

  it('admin can edit anyone’s post', async () => {
    const { user: admin, token } = await createAdminAndLogin();
    const editor = await createUser({ role: 'editor' });
    const cat = await createCategory();
    const post = await createPost(editor, cat);

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Admin Edit' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Admin Edit');
  });

  it('deletes a post', async () => {
    const { user: admin, token } = await createAdminAndLogin();
    const cat = await createCategory();
    const post = await createPost(admin, cat);
    const res = await request(app)
      .delete(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(await Post.findById(post._id)).toBeNull();
  });

  it('returns stats', async () => {
    const { token } = await createAdminAndLogin();
    const cat = await createCategory();
    const { user: admin } = await createAdminAndLogin({ email: 'stats@test.com' });
    await createPost(admin, cat, { status: 'published', slug: 's1', publishedAt: new Date() });
    await createPost(admin, cat, { status: 'draft', slug: 's2' });
    const res = await request(app).get('/api/posts/stats').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(2);
    expect(res.body.data.published).toBe(1);
    expect(res.body.data.draft).toBe(1);
  });
});