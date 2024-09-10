import Publisher from "../model/publisherModel.js";

export const createPublisher = async (req, res) => {
  try {
    const { name, status } = req.body;
    const userId = req.user._id; // Assuming req.user contains the logged-in user's data

    // Validate input fields
    if (!name.trim()) {
      return res.status(400).json({ error: "Publisher name is required" });
    }

    // Ensure the category name is unique
    const existingPublisher = await Publisher.findOne({ name });
    if (existingPublisher) {
      return res.status(400).json({ error: "Publisher name must be unique" });
    }

    // Create a new category with the generated categoryID and author ID
    const newPublisher = new Publisher({
      name,
      publisherID: req.publisherID, // publisherID generated by the middleware
      author: userId, // Author ID from the logged-in user
      status: status || "active", // Default to "active" if status is not provided
    });

    // Save the new Publisher to the database
    await newPublisher.save();

    // Return the newly created category in the response
    res.status(201).json(newPublisher);
  } catch (error) {
    console.error("Error creating publisher:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const listOfPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find().populate("author", "name email");
    res.json(publishers);
  } catch (error) {
    console.error("Error fetching publishers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removePublisher = async (req, res) => {
  try {
    const { publisherID } = req.params;

    const publisher = await Publisher.findByIdAndDelete(publisherID);

    if (!publisher) {
      return res.status(404).json({ error: "Publisher not found" });
    }

    res.json({ message: "Publisher deleted successfully" });
  } catch (error) {
    console.error("Error deleting Publisher:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const readPublisher = async (req, res) => {
  try {
    const { publisherID } = req.params;
    const publisher = await Publisher.findById(publisherID).populate(
      "author",
      "name email"
    );

    if (!publisher) {
      return res.status(404).json({ error: "Publisher not found" });
    }

    res.json(publisher);
  } catch (error) {
    console.error("Error fetching publisher:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePublisher = async (req, res) => {
    try {
      const { publisherID } = req.params;
      const { name, status } = req.body;
      const userId = req.user._id; // Assuming req.user contains the logged-in user's data
  
      // Validate input fields
      if (!name.trim()) {
        return res.status(400).json({ error: "Publisher name is required" });
      }
  
      // Find the publisher to update
      const publisher = await Publisher.findById(publisherID);
  
      if (!publisher) {
        return res.status(404).json({ error: "Publisher not found" });
      }
  
      // Ensure the new publisher name is unique
      const existingPublisher = await Publisher.findOne({ name, _id: { $ne: publisherID } });
      if (existingPublisher) {
        return res.status(400).json({ error: "Publisher name must be unique" });
      }
  
      // Update the publisher with new data
      publisher.name = name;
      publisher.status = status || publisher.status; // Keep the old status if not provided
      publisher.author = userId; // Update the author ID if needed
  
      // Save the updated publisher to the database
      await publisher.save();
  
      // Return the updated publisher in the response
      res.json(publisher);
    } catch (error) {
      console.error("Error updating publisher:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };