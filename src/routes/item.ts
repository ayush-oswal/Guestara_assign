import express from 'express'
import { createItem, getAllItems, getItemByIdOrName, getItemsByCategory, getItemsBySubCategory, updateItem, searchItemsByName } from '../controllers/item'

const Router = express.Router();

Router.post('/create', createItem);

Router.get('/get', getAllItems);

Router.get('/category/:categoryId', getItemsByCategory);

Router.get('/subcategory/:subCategoryId', getItemsBySubCategory);

Router.get('/get/:idOrName', getItemByIdOrName);

Router.put('/update/:id', updateItem);

Router.get('/search/:name', searchItemsByName);

export default Router;