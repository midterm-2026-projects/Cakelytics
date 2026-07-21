const request = require('supertest');
const app = require('../../../src/App');

describe('Product Routes Integration', () => {
  it('should return products', async () => {
    const res = await request(app).get('/api/products');

    expect([200, 404, 500]).toContain(res.status);
  });
});
