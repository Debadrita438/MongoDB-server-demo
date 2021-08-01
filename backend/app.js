const path = require('path');
const express = require('express');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const db = require('./db');

const app = express();


app.use(express.json());
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/products', productRoutes);
app.use('/', authRoutes);

db.initDb((err, db) => {
  if (err) {
    console.log(error);
  } else {
    app.listen(3100);
  }
})

