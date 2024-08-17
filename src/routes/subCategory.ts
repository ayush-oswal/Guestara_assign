import express from 'express'
import { createSubCategory, getAllSubCategories, getSubCategoriesByCategory, getSubCategoryByIdOrName, updateSubCategory } from '../controllers/subCategory'

const Router = express.Router();

Router.post('/create',createSubCategory);

Router.get('/get',getAllSubCategories);

Router.get('/get/byCategories/:categoryId',getSubCategoriesByCategory);

Router.get('/get/:identifier',getSubCategoryByIdOrName);

Router.put('/update/:id',updateSubCategory);

export default Router;