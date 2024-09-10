import express from "express";
const router = express.Router();
// import controller
import {
  createCategory,
  listOfCategories,
  removeCategory,
  readCategory,
  updateCategory
} from "../controller/categoryController.js";

// import middleware
import { requiredSignIn } from "../middlewares/authMiddleware.js";
import { generateCategoryID } from "../middlewares/categoryMiddleware.js";

router.post(
  "/create_category",
  requiredSignIn,
  generateCategoryID,
  createCategory
);
router.get("/categories", requiredSignIn, listOfCategories);
router.delete("/category/:categoryID", requiredSignIn, removeCategory);
router.get("/category/:categoryID",requiredSignIn, readCategory);
router.put("/category/:categoryID", requiredSignIn,updateCategory);

export default router;
