const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Category = require('../../src/models/Category');
const { uniqueSlug } = require('../../src/utils/slugify');

async function createUser(overrides = {}) {
  const base = {
    name: 'Test Admin',
    email: `admin-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`,
    password: 'Passw0rd!',
    role: 'admin',
  };
  return User.create({ ...base, ...overrides });
}

async function loginAs(user) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: 'Passw0rd!' });
  return { token: res.body.data?.accessToken, setCookie: res.headers['set-cookie'] };
}

async function createAdminAndLogin(overrides = {}) {
  const user = await createUser(overrides);
  const { token } = await loginAs(user);
  return { user, token };
}

async function createCategory(name = 'Testing') {
  const slug = await uniqueSlug(Category, name);
  return Category.create({ name, slug, description: 'Auto-created in tests' });
}

async function createPost(author, category, overrides = {}) {
  const slug = await uniqueSlug(require('../../src/models/Post'), overrides.title || `Post ${Date.now()}`);
  return require('../../src/models/Post').create({
    title: `Post ${Date.now()}`,
    slug,
    excerpt: 'A test excerpt for the automated test suite.',
    content: '<p>Body content.</p>',
    category: category._id,
    author: author._id,
    status: 'draft',
    ...overrides,
  });
}

module.exports = {
  createUser,
  loginAs,
  createAdminAndLogin,
  createCategory,
  createPost,
};