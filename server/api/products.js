const express = require("express");
const router = express.Router();
const {models: { Product } }= require('../db')
const {requireToken, isAdmin} = require( './gatekeepingMiddleware')

router.get('/', async (req, res, next) => {
  try {
    let products = await Product.findAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
})

router.get('/:id', async (req, res, next) => {
  try {
      let productId = req.params.id;
      let product = await Product.findByPk(productId);
      if(product){
        res.json(product)
      } else {
        res.status(404).send("Product Not Found")
       // throw new Error("Product Not Found");
      }
     } catch (error){
    next(error)
  }
})

router.post('/', requireToken, isAdmin, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch(error) {
    next(error)
  }
})

router.put('/:id', requireToken, isAdmin, async (req, res, next) => {
  try {
      let newProduct = req.body;
      let {id} = req.params;
      let  product = await Product.findByPk(id);
      if(product){
        let updatedProduct = await product.update(newProduct);
        res.json(updatedProduct);
      } else {

        res.status(404).send("Product Not Found")
        // throw new Error("Product Not Found")
      }


  } catch(error) {
    next(error)
  }
})

router.delete('/:id', requireToken, isAdmin, async (req, res, next) => {
  try {
      const product = await Product.findByPk(req.params.id);
      if(product){
        await product.destroy();
       res.status(202).send(product);
      } else {
        res.status(404).send("Product not found")
      }

  } catch(error){
    next(error);
  }
})




module.exports = router;
