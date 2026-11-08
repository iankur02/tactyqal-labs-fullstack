const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const { createUser } = require('./helpers/auth');

describe('POST /api/auth/login', () => {
  it('rejects unknown email with 401 and a generic message', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@test.com', password: 'whatever' });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ success: false, message: 'Invalid credentials' });
  });

  it('rejects wrong password with 401', async () => {
    const user = await createUser();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'nope' });
    expect(res.status).toBe(401);
  });

  it('returns 200 with accessToken, safe user, and refresh cookie on success', async () => {
    const user = await createUser({ email: 'ok@test.com' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ok@test.com', password: 'Passw0rd!' });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.body.data.user.email).toBe('ok@test.com');
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.headers['set-cookie'].join(';')).toMatch(/refreshToken=/);
    expect(res.headers['set-cookie'].join(';')).toMatch(/HttpOnly/i);
  });

  it('rejects invalid email format with 422', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'x' });
    expect(res.status).toBe(422);
  });
});

describe('GET /api/auth/me', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects an invalid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer bad.token.x');
    expect(res.status).toBe(401);
  });

  it('returns the current user with a valid token', async () => {
    const user = await createUser();
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'Passw0rd!' });
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data.user.password).toBeUndefined();
  });
});

describe('POST /api/auth/refresh', () => {
  it('returns 401 without a cookie', async () => {
    const res = await request(app).post('/api/auth/refresh');
    expect(res.status).toBe(401);
  });

  it('rotates the refresh cookie and returns a new access token', async () => {
    const user = await createUser();
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'Passw0rd!' });
    const cookie = login.headers['set-cookie'];
    const res = await request(app).post('/api/auth/refresh').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.headers['set-cookie']).toBeDefined();
  });
});

describe('POST /api/auth/logout', () => {
  it('clears the refresh cookie', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie'].join(';')).toMatch(/refreshToken=;/);
  });
});

describe('Password storage', () => {
  it('never stores plaintext, always hashes with bcrypt', async () => {
    const user = await createUser({ email: 'hash@test.com', password: 'Secret123!' });
    const raw = await User.findOne({ email: 'hash@test.com' }).select('+password');
    expect(raw.password).not.toBe('Secret123!');
    expect(raw.password).toMatch(/^\$2[aby]\$12\$/);
  });
});