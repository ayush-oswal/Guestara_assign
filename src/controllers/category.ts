import { Request, Response } from "express";
import prisma from "../database/prisma/client";

export const createCategory = async (req: Request, res: Response) => {
    try{

        const { name, image, description, taxApplicable, tax, taxType } = req.body

        if (/^\d+$/.test(name)) {
            return res.status(400).json({ error: 'Name cannot be a number' });
          }

        const existingCategory = await prisma.category.findUnique({
            where: { name },
          });
      
          if (existingCategory) {
            return res.status(400).json({ error: 'Category name already exists' });
          }

        const category = await prisma.category.create({
            data: {
                name,
                image,
                description,
                taxApplicable,
                tax,
                taxType,
            }
        })

        res.status(201).json(category);

    }
    catch(error) {
        res.status(400).json({ error });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include:{
                subCategories : false,
                items : false
            }
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error });
    }
};
  
// Get a category by name or ID
export const getCategoryByIdOrName = async (req: Request, res: Response) => {
    try {
      const { identifier } = req.params;
  
      // Check if the identifier is numeric
      const isNumeric = /^\d+$/.test(identifier);
  
      // Find the category based on the identifier
      const category = await prisma.category.findFirst({
        where: isNumeric
          ? { id: Number(identifier) }
          : { name: identifier },
        include: {
          subCategories: true,
          items: true,
        },
      });
  
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve category' });
    }
  };

export const updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, image, description, taxApplicable, tax, taxType } = req.body;

      if (name && /^\d+$/.test(name)) {
        return res.status(400).json({ error: 'Name cannot be a number' });
      }
  
      const updatedCategory = await prisma.category.update({
        where: { id: Number(id) },
        data: {
          name,
          image,
          description,
          taxApplicable,
          tax,
          taxType,
        },
      });
  
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(400).json({ error });
    }
};