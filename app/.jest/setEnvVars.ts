if (process.env.NODE_ENV !== 'test') {
  throw new Error(`This file should only be imported by Jest. NODE_ENV='${process.env.NODE_ENV}'`);
}

process.env.CLIENT_ID = 'test-client-id';
process.env.CLIENT_SECRET = 'test-client-secret';
process.env.REDIRECT_URI = 'http://localhost:5001/callback';
