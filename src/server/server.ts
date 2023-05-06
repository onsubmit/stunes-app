import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import ViteExpress from 'vite-express';

import { callback } from './endpoints/callback';
import { login } from './endpoints/login';
import { refresh_token } from './endpoints/refresh_token';

const port = (process.env.PORT && parseInt(process.env.PORT, 10)) || 5001;

const root = path.join(__dirname, '../dist');

const app = express();
app.use('/', express.static(root)).use(cors()).use(cookieParser());

app.get('/login', login);
app.get('/callback', callback);
app.get('/refresh_token', refresh_token);

if (process.env.NODE_ENV !== 'test') {
  ViteExpress.listen(app, port, () => {
    console.log(`Navigate to http://localhost:${port}`);
  });
}

export default app;
