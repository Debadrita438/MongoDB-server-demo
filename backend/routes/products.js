const Router = require('express').Router;
const mongodb = require('mongodb');

const db = require('../db');
const Decimal128 = mongodb.Decimal128;
const ObjectId = mongodb.ObjectId;

const router = Router();

// Get list of products products
router.get('/', (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  const queryPage = req.query.page;
  const pageSize = 1;
  const products = [];
  db.getDb().db().collection('products').find()
    // .sort({ price: -1 })
    // .skip((queryPage - 1) * pageSize)
    // .limit(pageSize)
    .forEach(productDoc => {
      productDoc.price = productDoc.price.toString();
      products.push(productDoc);
    })
    .then(result => {
      res.status(200).json(products);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occured!' });
    });
});

// Get single product
router.get('/:id', (req, res, next) => {
  db.getDb().db().collection('products').findOne({_id: new ObjectId(req.params.id)})
    .then(product => {
      product.price = product.price.toString();
      res.status(200).json(product);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occured!' });
  });
});

// Add new product
// Requires logged in user
router.post('', (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  db.getDb().db().collection('products').insertOne(newProduct)
      .then(result => {
        res.status(201).json({ message: 'Product added', productId: result.insertedId });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'An error occured!' });
      });
  });

// Edit existing product
// Requires logged in user
router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };

  db.getDb().db().collection('products')
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedProduct })
    .then(() => res.status(200).json({ message: 'Product updated', productId: req.params.id }))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occured!' });
    });
});

// Delete a product
// Requires logged in user
router.delete('/:id', (req, res, next) => {
  db.getDb().db().collection('products')
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(() => res.status(200).json({ message: 'Product deleted' }))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occured!' });
    });
});

module.exports = router;
