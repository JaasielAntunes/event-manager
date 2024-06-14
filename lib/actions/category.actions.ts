/* eslint-disable prettier/prettier */
"use server";

import { CreateCategoryParams } from "@/types";

import { connectToDB } from "../database";
import Category from "../database/models/category.model";
import { handleError } from "../utils";

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    await connectToDB();

    const newCategory = await Category.create({ name: categoryName });

    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async () => {
  try {
    await connectToDB();

    const categories = await Category.find();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    await connectToDB();

    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (deletedCategory) {
      return JSON.parse(JSON.stringify(deletedCategory));
    }
  } catch (error) {
    handleError(error);
  }
};
