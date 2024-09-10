import slugify from "slugify";
import Books from "../model/bookModel.js";
import fs from "fs";

export const createBook = async (req, res) => {
  try {
    const {
      name,
      writer,
      purchasePrice,
      sellPrice,
      category,
      publisher,
      quantity,
    } = req.fields;
    const { image } = req.files;

    // Validation checks
    if (!name.trim()) return res.json({ error: "Book name is required" });
    if (!writer.trim()) return res.json({ error: "Writer name is required" });
    if (!purchasePrice)
      return res.json({ error: "Purchase price is required" });
    if (!sellPrice) return res.json({ error: "Sell price is required" });
    if (!category) return res.json({ error: "Category is required" });
    if (!publisher) return res.json({ error: "Publisher is required" });
    if (!quantity) return res.json({ error: "Quantity is required" });
    if (!image) return res.json({ error: "Book cover image is required" });
    if (image.size > 1000000)
      return res.json({ error: "Image size should not be more than 1MB" });
    // Check if book with the same name already exists
    const existingBook = await Books.findOne({ name });
    if (existingBook) {
      return res.status(400).json({ error: "Book name must be unique" });
    }
    const book = new Books({
      bookID: req.bookID, // Add generated bookID here
      name,
      writer,
      purchasePrice,
      sellPrice,
      category,
      publisher,
      quantity,
      slug: slugify(name),
    });

    // Handle image upload
    if (image) {
      book.image.data = fs.readFileSync(image.path);
      book.image.contentType = image.type;
    }

    await book.save();
    res.json(book);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

export const listofBooks = async (req, res) => {
  try {
    const book = await Books.find({})
      .select("-image")
      .populate("category")
      .populate("publisher")
      .limit(12)
      .sort({ createdAt: -1 });
    res.json(book);
  } catch (err) {
    console.log(err);
  }
};

export const imageOfBook = async (req, res) => {
  try {
    const book = await Books.findById(req.params.bookId).select("image");
    if (book.image.data) {
      res.set("Content-Type", book.image.contentType);
      return res.send(book.image.data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const removeBook = async (req, res) => {
  try {
    const book = await Books.findByIdAndDelete(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const readBook = async (req, res) => {
  try {
    const book = await Books.findOne({ slug: req.params.slug })
      .select("-image")
      .populate("category")
      .populate("publisher")
    res.json(book);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const {
      name,
      writer,
      purchasePrice,
      sellPrice,
      category,
      publisher,
      quantity,
    } = req.fields;
    const { image } = req.files;
    const { bookId } = req.params;

    // Validation checks
    if (!name.trim()) return res.json({ error: "Book name is required" });
    if (!writer.trim()) return res.json({ error: "Writer name is required" });
    if (!purchasePrice)
      return res.json({ error: "Purchase price is required" });
    if (!sellPrice) return res.json({ error: "Sell price is required" });
    if (!category) return res.json({ error: "Category is required" });
    if (!publisher) return res.json({ error: "Publisher is required" });
    if (!quantity) return res.json({ error: "Quantity is required" });

    // Fetch the book to be updated
    const book = await Books.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check if updating the name to an existing name
    const existingBook = await Books.findOne({ name, _id: { $ne: bookId } });
    if (existingBook) {
      return res.status(400).json({ error: "Book name must be unique" });
    }

    // Update book fields
    book.name = name;
    book.slug = slugify(name);
    book.writer = writer;
    book.purchasePrice = purchasePrice;
    book.sellPrice = sellPrice;
    book.category = category;
    book.publisher = publisher;
    book.quantity = quantity;

    // Handle image update if provided
    if (image) {
      if (image.size > 1000000) {
        return res.json({ error: "Image size should not be more than 1MB" });
      }
      book.image.data = fs.readFileSync(image.path);
      book.image.contentType = image.type;
    }

    await book.save();
    res.json({ message: "Book updated successfully", book });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};