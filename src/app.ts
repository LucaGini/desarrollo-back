import 'reflect-metadata';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { RequestContext } from '@mikro-orm/core';
import { orm } from './shared/db/orm.js';
import { createDefaultAdmin } from './user/admin.seed.js';
import { categoryRouter } from './category/category.routes.js';
import { supplierRouter } from './supplier/supplier.routes.js';
import { provinceRouter } from './province/province.routes.js';
import { userRouter } from './user/user.routes.js';
import { cityRouter } from './city/city.routes.js';
import { productRouter } from './product/product.routes.js';
import { authRouter } from './auth/auth.routes.js';
import { orderRouter } from './order/order.routes.js';

dotenv.config();

const app = express();
const allowedOrigins = ['https://desarrollo-front-indol.vercel.app'];

// Middleware CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins[0]);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

// Middleware de contexto de base de datos
app.use((req: Request, res: Response, next) => {
  RequestContext.create(orm.em, next);
});

// Rutas
app.use('/api/categories', categoryRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/provinces', provinceRouter);
app.use('/api/users', userRouter);
app.use('/api/cities', cityRouter);
app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);

// Configuración para servir archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Manejo de rutas no encontradas
app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on https://desarrollo-back-production.up.railway.app`);
  await createDefaultAdmin();
});
