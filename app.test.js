const request = require('supertest');
const app = require('./index');

describe('API Endpoints', () => {
  let server;

  beforeAll(async () => {
    server = app.listen();
  });

  afterAll(async () => {
    server.close();
  });

  it('should create a new account', async () => {
    const res = await request(server)
      .post('/accounts')
      .send({ accountId: '1234567890', balance: 1000 });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Account created successfully');
  });

  it('should get balance for an existing account', async () => {
    const accountId = '1234567890'; // Assuming this account exists
    const res = await request(server)
      .get(`/accounts/${accountId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('balance');
  });

  it('should deposit amount into an existing account', async () => {
    const accountId = '1234567890'; // Assuming this account exists
    const res = await request(server)
      .post(`/accounts/${accountId}/deposit`)
      .send({ amount: 500 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Deposit successful');
    expect(res.body).toHaveProperty('balance');
  });

  it('should withdraw amount from an existing account', async () => {
    const accountId = '1234567890'; // Assuming this account exists with balance > 100
    const res = await request(server)
      .post(`/accounts/${accountId}/withdraw`)
      .send({ amount: 100 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Withdrawal successful');
    expect(res.body).toHaveProperty('balance');
  });
});
