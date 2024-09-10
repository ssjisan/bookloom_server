import mongoose from "mongoose";


export const generateCategoryID = async (req, res, next) => {
  try {
    const Category = mongoose.model("Category");

    // Fetch all publisher IDs and sort them in ascending order
    const allCategories = await Category.find({}, { categoryID: 1 }).sort({ categoryID: 1 });

    // Initialize the next available ID as PUB0001
    let nextID = 1;

    // Iterate through the sorted publisher IDs to find the first missing sequence
    for (const category of allCategories) {
      const currentID = parseInt(category.categoryID.slice(3)); // Extract numeric part of the ID

      if (currentID !== nextID) {
        // If there's a gap in the sequence, use the first available slot
        req.categoryID = `CAT${String(nextID).padStart(4, "0")}`;
        next();
        return;
      }

      nextID++; // Increment to check the next ID in sequence
    }

    // If no gaps were found, assign the next sequential ID
    req.categoryID = `CAT${String(nextID).padStart(4, "0")}`;
    next();
  } catch (error) {
    next(error);
  }
};

export default generateCategoryID;
