const request = require('supertest');
const app = require('../index');

describe('server', () => {
  let token;
  test('register and login', async () => {
    await request(app).post('/register').send({ username: 'test', password: 'pass' });
    const res = await request(app).post('/login').send({ username: 'test', password: 'pass' });
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });
  test('profile requires auth', async () => {
    const res = await request(app).get('/profile').set('Authorization', token);
    expect(res.body.username).toBe('test');
  });

  test('mentor echo', async () => {
    const res = await request(app)
      .post('/mentor')
      .set('Authorization', token)
      .send({ text: 'hello' });
    expect(res.body.reply).toBeDefined();
  });
});
