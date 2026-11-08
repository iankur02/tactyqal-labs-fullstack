jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

const request = require('supertest');
const app = require('../src/app');
const { createAdminAndLogin } = require('./helpers/auth');

const PNG = Buffer.from('89504e470d0a1a0a0000000d4948445200000001000000010806000000', 'hex');

describe('POST /api/upload', () => {
  it('rejects unauthenticated requests', async () => {
    const res = await request(app).post('/api/upload').attach('image', PNG, 'a.png');
    expect(res.status).toBe(401);
  });

  it('accepts a valid image', async () => {
    const { token } = await createAdminAndLogin();
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', PNG, 'a.png');
    expect(res.status).toBe(201);
    expect(res.body.data.url).toMatch(/^\/uploads\/[a-f0-9]+\.png$/);
  });

  it('rejects disallowed MIME types', async () => {
    const { token } = await createAdminAndLogin();
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', Buffer.from('not a real pdf'), 'a.pdf');
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/JPEG|PNG|WebP/);
  });

  it('rejects files over 5MB', async () => {
    const { token } = await createAdminAndLogin();
    const big = Buffer.alloc(6 * 1024 * 1024, 0);
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', big, 'big.png');
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/too large/i);
  });

  it('rejects requests with no file', async () => {
    const { token } = await createAdminAndLogin();
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});