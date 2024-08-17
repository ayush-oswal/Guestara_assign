import express from 'express'
import { createCategory, getAllCategories, getCategoryByIdOrName, updateCategory } from '../controllers/category';

const Router = express.Router();


Router.post('/create',createCategory);

Router.get('/get',getAllCategories);

Router.get('/get/:identifier',getCategoryByIdOrName);

Router.put('/update/:id',updateCategory);


export default Router;
