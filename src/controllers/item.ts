import { Request, Response } from "express";
import prisma from "../database/prisma/client";



export const createItem = async (req: Request, res: Response) => {
    try {
      const { name, image, description, taxApplicable, tax, baseAmount, discount, categoryId, subCategoryId } = req.body;

      if (/^\d+$/.test(name)) {
        return res.status(400).json({ error: 'Name cannot be a number' });
      }
  
      const category = await prisma.category.findUnique({
        where: { id: Number(categoryId) },
      });
  
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      if (subCategoryId) {
        const subCategory = await prisma.subCategory.findUnique({
          where: { id: Number(subCategoryId) },
        });
  
        if (!subCategory) {
          return res.status(404).json({ error: 'Subcategory not found' });
        }
      }
  
      const existingItem = await prisma.item.findFirst({
        where: {
          name,
          categoryId: Number(categoryId),
          subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
        },
      });
  
      if (existingItem) {
        return res.status(400).json({ error: 'Item name already exists within this category (and subcategory if specified)' });
      }
  
      const item = await prisma.item.create({
        data: {
          name,
          image,
          description,
          taxApplicable,
          tax,
          baseAmount,
          discount,
          totalAmount: baseAmount - (discount || 0),
          category: {
            connect: { id: Number(categoryId) },
          },
          subCategory: subCategoryId ? {
            connect: { id: Number(subCategoryId) },
          } : undefined,
        },
      });
  
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error });
    }
};

// Get all items
export const getAllItems = async (req: Request, res: Response) => {
    try {
      const items = await prisma.item.findMany();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve items' });
    }
};
  
// Get all items under a specific category
export const getItemsByCategory = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      const items = await prisma.item.findMany({
        where: { categoryId: Number(categoryId) }
      });
      if (items.length === 0) {
        return res.status(404).json({ error: 'No items found for this category' });
      }
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve items' });
    }
};
  
// Get all items under a specific sub-category
export const getItemsBySubCategory = async (req: Request, res: Response) => {
    try {
      const { subCategoryId } = req.params;
      const items = await prisma.item.findMany({
        where: { subCategoryId: Number(subCategoryId) }
      });
      if (items.length === 0) {
        return res.status(404).json({ error: 'No items found for this sub-category' });
      }
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve items' });
    }
};
  
// Get an item by name or ID
export const getItemByIdOrName = async (req: Request, res: Response) => {
    try {
      const { idOrName } = req.params;
  
      const isNumeric = /^\d+$/.test(idOrName);
  
      const item = await prisma.item.findFirst({
        where: isNumeric
          ? { id: Number(idOrName) }
          : { name: idOrName },
      });
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve item' });
    }
};

export const updateItem = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, image, description, taxApplicable, tax, baseAmount, discount, categoryId, subCategoryId } = req.body;
  
      const itemId = Number(id);
      if (isNaN(itemId)) {
        return res.status(400).json({ error: 'Invalid item ID' });
      }

      if (/^\d+$/.test(name)) {
        return res.status(400).json({ error: 'Name cannot be a number' });
      }
  
      // Update item
      const updatedItem = await prisma.item.update({
        where: { id: itemId },
        data: {
          name,               
          image,
          description,
          taxApplicable,
          tax,
          baseAmount,
          discount,
          totalAmount: baseAmount - (discount || 0),
          category: { connect: { id: Number(categoryId) } }, 
          subCategory: subCategoryId ? { connect: { id: Number(subCategoryId) } } : undefined,
        },
      });
  
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(400).json({ error });
    }
};

// Search items by name
export const searchItemsByName = async (req: Request, res: Response) => {
    try {
      const { name } = req.params;
  
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid search query' });
      }
  
      // Search items by name (case-insensitive)
      const items = await prisma.item.findMany({
        where: {
          name: {
            contains: name.trim(),
            mode: 'insensitive',
          },
        },
        include: {
          category: true,
          subCategory: true,
        },
      });
  
      if (items.length === 0) {
        return res.status(404).json({ message: 'No items found' });
      }
  
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error });
    }
};