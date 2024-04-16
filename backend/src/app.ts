import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const url = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: url, credentials: true }));
// app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const secret = 'secret';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * ONE_DAY_MS;

const generateToken = (data: Object, expires: number): string => jwt.sign(data, secret, { expiresIn: `${expires}ms` });

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'Token is required' });
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: 'Invalid Token' });
  req.body.user = decoded;
  return next();
};

app.get('/', (_req: Request, res: Response): Response => {
  return res.status(200).json({ message: 'Hello World!' });
});

app.post('/create-cookie', (req: Request, res: Response): Response => {
  const { user, rememberMe } = req.body;
  const expires = rememberMe ? THIRTY_DAYS_MS : ONE_DAY_MS
  const token = generateToken(user, expires);

  return res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    // maxAge: expires,
  }).send();
});

app.get('/delete-cookie', validateToken, (_req: Request, res: Response): Response => {
  return res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  }).send();
});

app.get('/checkout', validateToken, (_req: Request, res: Response): Response => {
  return res.status(201).json({ message: 'https://url-de-checkout.com/stripe' });
});

const port = 3001;

app.listen(port, () => console.log(`Server is running on port ${port}`));
