const request = require('supertest');
const app = require('../src/app');
const Category = require('../src/models/Category');
const { createAdminAndLogin, createCategory, createPost } = require('./helpers/auth');

describe('Categories', () => {
  it('public list works without auth', async () => {
    await createCategory('Alpha');
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body.data.map((c) => c.name)).toContain('Alpha');
  });

  it('rejects unauthenticated create', async () => {
    const res = await request(app).post('/api/categories').send({ name: 'Beta' });
    expect(res.status).toBe(401);
  });

  it('creates a category', async () => {
    const { token } = await createAdminAndLogin();
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Growth', description: 'Growth tactics' });
    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe('growth');
  });

  it('rejects case-insensitive duplicate names', async () => {
    const { token } = await createAdminAndLogin();
    await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Growth' });
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'growth' });
    expect(res.status).toBe(409);
  });

  it('cannot delete a category referenced by posts', async () => {
    const { user, token } = await createAdminAndLogin();
    const cat = await createCategory('Used');
    await createPost(user, cat, { status: 'draft' });
    const res = await request(app)
      .delete(`/api/categories/${cat._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/still reference this category/);
  });

  it('deletes an unused category', async () => {
    const { token } = await createAdminAndLogin();
    const cat = await createCategory('Unused');
    const res = await request(app)
      .delete(`/api/categories/${cat._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(await Category.findById(cat._id)).toBeNull();
  });
});