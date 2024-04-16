import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

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

app.post('/create-cookie', (req: Request, res: Response): Response => {
  const { user, rememberMe } = req.body;
  const expires = rememberMe ? THIRTY_DAYS_MS : ONE_DAY_MS
  const token = generateToken(user, expires);

  return res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: expires,
  }).status(201).json({ message: 'Token salvo nos cookies!' });
});

app.get('/delete-cookie', validateToken, (_req: Request, res: Response): Response => {
  return res.clearCookie('token').status(200).json({ message: 'Token deletado dos cookies!' });
});

app.get('/checkout', validateToken, (_req: Request, res: Response): Response => {
  return res.status(201).json({ message: 'https://url-de-checkout.com/stripe' });
});

const port = 3001;

app.listen(port, () => console.log(`Server is running on port ${port}`));
