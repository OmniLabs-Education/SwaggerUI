import {Router, Request, Response} from 'express'
import {ensureAuthenticated} from './middleware';

import {v4} from 'uuid';

const routes = Router();

interface IProducts {
  id: string;
  name: string;
  description: string;
  price: number;
}

const products: IProducts[] = [];

routes.get('/products/findByName', ((request: Request, response: Response) => {
  const {name} = request.query;

  const p = products.filter(e => e.name.includes(String(name)))
  return response.json(p)
}))

routes.get('/products/:id', ((request: Request, response: Response) => {
  const {id} = request.params;
  const p = products.find(e => e.id === id)

  if(!p) {
    return response.status(400).json({ message: 'not possible to find product'});
  }

  return response.json(p)
}))

routes.post('/product', ensureAuthenticated, ((request: Request, response: Response) => {
  const {name, description, price} = request.body;
  
  const product: IProducts = {
    id: v4(),
    name,
    description,
    price
  }

  const findProduct = products.find(e => e.name === product.name);

  if(findProduct) {
    return response.status(400).json({ message: 'this product already exist'});
  }

  products.push(product);
  
  return response.json(product)
}))

routes.put('/product/:id', ensureAuthenticated, ((request: Request, response: Response) => {
  const {id} = request.params;
  const {name, description, price} = request.body;

  const productIndex = products.findIndex(p => p.id === id);

  if(productIndex === -1) {
    return response.status(400).json({ message: "Product doesn't exist"});
  }

  const product: IProducts = Object.assign({
    name,
    description,
    price
  })

  products[productIndex] = product

  return response.json(product)
}))

export {routes};