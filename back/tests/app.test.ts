const request = require('supertest');
import { app } from '../src/app';

describe('Rushing Endpoint', () => {
  it('have the timezone endpoint', async () => {
    const res = await request(app)
      .get('/rushing')
    expect(res.statusCode).toEqual(200)
    expect(res.body.data).toHaveLength(326)
    expect(res.body.lastPage).toBe(0)
  })
})