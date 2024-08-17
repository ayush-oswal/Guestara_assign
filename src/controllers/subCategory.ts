import { Request, Response } from "express";
import prisma from "../database/prisma/client";


export const createSubCategory = async (req: Request, res: Response) => {
    try {
      const { name, image, description, taxApplicable, tax, categoryId } = req.body;

      if (/^\d+$/.test(name)) {
        return res.status(400).json({ error: 'Name cannot be a number' });
      }
  
      const category = await prisma.category.findUnique({
        where: { id: Number(categoryId) },
      });
  
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const existingSubCategory = await prisma.subCategory.findFirst({
        where: {
          name,
          categoryId: Number(categoryId),
        },
      });
  
      if (existingSubCategory) {
        return res.status(400).json({ error: 'Subcategory name already exists within this category' });
      }
  
      const subCategory = await prisma.subCategory.create({
        data: {
          name,
          image,
          description,
          taxApplicable: taxApplicable ?? category.taxApplicable,
          tax: tax ?? category.tax,
          category: {
            connect: { id: Number(categoryId) },
          },
        },
      });
  
      res.status(201).json(subCategory);
    } catch (error) {
      res.status(400).json({ error });
    }
};

// Get all sub-categories
export const getAllSubCategories = async (req: Request, res: Response) => {
    try {
      const subCategories = await prisma.subCategory.findMany();
      res.status(200).json(subCategories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve sub-categories' });
    }
};
  
// Get all sub-categories under a specific category
export const getSubCategoriesByCategory = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      const subCategories = await prisma.subCategory.findMany({
        where: { categoryId: Number(categoryId) }
      });
      if (subCategories.length === 0) {
        return res.status(404).json({ error: 'No sub-categories found for this category' });
      }
      res.status(200).json(subCategories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve sub-categories' });
    }
};
  
// Get a sub-category by name or ID
export const getSubCategoryByIdOrName = async (req: Request, res: Response) => {
    try {
      const { identifier } = req.params;
  
      const isNumeric = /^\d+$/.test(identifier);
      
      let subCategory;
  
      if (isNumeric) {
        subCategory = await prisma.subCategory.findUnique({
          where: { id: Number(identifier) }
        });
      } else {
        subCategory = await prisma.subCategory.findUnique({
          where: { name: identifier }
        });
      }
  
      if (!subCategory) {
        return res.status(404).json({ error: 'Sub-category not found' });
      }
  
      res.status(200).json(subCategory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve sub-category' });
    }
};


export const updateSubCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, image, description, taxApplicable, tax, categoryId } = req.body;

      if (name && /^\d+$/.test(name)) {
        return res.status(400).json({ error: 'Name cannot be a number' });
      }
  
      const subCategoryId = Number(id);
      if (isNaN(subCategoryId)) {
        return res.status(400).json({ error: 'Invalid sub-category ID' });
      }

      if (categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: Number(categoryId) },
        });

        if (!category) {
            return res.status(404).json({ error: 'New category not found' });
        }
      }
  
      const updatedSubCategory = await prisma.subCategory.update({
        where: { id: subCategoryId },
        data: {
          name,
          image,
          description,
          taxApplicable,
          tax,
          category: { connect: { id: Number(categoryId) } }
        },
      });
  
      res.status(200).json(updatedSubCategory);
    } catch (error) {
      res.status(400).json({ error });
    }
};