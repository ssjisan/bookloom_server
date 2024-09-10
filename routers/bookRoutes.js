import express from "express";
const router = express.Router();
import formidable from "express-formidable";

// import controller
import {
  createBook,
  listofBooks,
  imageOfBook,
  removeBook,
  readBook,
  updateBook
} from "../controller/bookController.js";
import { generateBookID } from "../middlewares/bookMiddleware.js";
// import middleware
import { requiredSignIn } from "../middlewares/authMiddleware.js";

router.post(
  "/add_book",
  requiredSignIn,
  formidable(),
  generateBookID,
  createBook
);
router.get("/booklist", requiredSignIn, listofBooks);
router.get("/book/image/:bookId", imageOfBook);
router.delete("/book/:bookId", requiredSignIn, removeBook);
router.get("/book/:slug", requiredSignIn, readBook);
router.put("/book/:bookId", requiredSignIn, formidable(), updateBook);

export default router;
