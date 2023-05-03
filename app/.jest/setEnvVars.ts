if (process.env.NODE_ENV !== 'test') {
  throw new Error(`This file should only be imported by Jest. NODE_ENV='${process.env.NODE_ENV}'`);
}

process.env.CLIENT_ID = 'foo';
process.env.CLIENT_SECRET = 'bar';
process.env.REDIRECT_URI = 'http://localhost:5001/callback';
