import mongoose from "mongoose";

export const generateBookID = async (req, res, next) => {
  try {
    const Book = mongoose.model("Book");

    // Fetch all publisher IDs and sort them in ascending order
    const allBooks = await Book.find({}, { bookID: 1 }).sort({ bookID: 1 });

    // Initialize the next available ID as PUB0001
    let nextID = 1;

    // Iterate through the sorted publisher IDs to find the first missing sequence
    for (const book of allBooks) {
      const currentID = parseInt(book.bookID.slice(3)); // Extract numeric part of the ID

      if (currentID !== nextID) {
        // If there's a gap in the sequence, use the first available slot
        req.bookID = `BKC${String(nextID).padStart(4, "0")}`;
        next();
        return;
      }

      nextID++; // Increment to check the next ID in sequence
    }

    // If no gaps were found, assign the next sequential ID
    req.bookID = `BKC${String(nextID).padStart(4, "0")}`;
    next();
  } catch (error) {
    next(error);
  }
};

export default generateBookID;
