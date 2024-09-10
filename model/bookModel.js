import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const bookSchema = new mongoose.Schema(
  {
    bookID: {
        type: String,
        unique: true,
        required: true,
      },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 160,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    writer: {
      type: String,
      trim: true,
      required: true,
      maxlength: 160,
    },
    purchasePrice: {
      type: Number,
      trim: true,
      required: true,
    },
    sellPrice: {
      type: Number,
      trim: true,
      required: true,
    },
    category: {
      type: ObjectId,
      ref: "Category", // Reference to Category model
      required: true,
    },
    publisher: {
      type: ObjectId,
      ref: "Publisher", // Reference to Publisher model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
