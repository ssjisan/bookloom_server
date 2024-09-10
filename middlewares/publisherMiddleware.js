import mongoose from "mongoose";

export const generatePublisherID = async (req, res, next) => {
  try {
    const Publisher = mongoose.model("Publisher");

    // Fetch all publisher IDs and sort them in ascending order
    const allPublishers = await Publisher.find({}, { publisherID: 1 }).sort({ publisherID: 1 });

    // Initialize the next available ID as PUB0001
    let nextID = 1;

    // Iterate through the sorted publisher IDs to find the first missing sequence
    for (const publisher of allPublishers) {
      const currentID = parseInt(publisher.publisherID.slice(3)); // Extract numeric part of the ID

      if (currentID !== nextID) {
        // If there's a gap in the sequence, use the first available slot
        req.publisherID = `PUB${String(nextID).padStart(4, "0")}`;
        next();
        return;
      }

      nextID++; // Increment to check the next ID in sequence
    }

    // If no gaps were found, assign the next sequential ID
    req.publisherID = `PUB${String(nextID).padStart(4, "0")}`;
    next();
  } catch (error) {
    next(error);
  }
};

export default generatePublisherID;
