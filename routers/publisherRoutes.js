import express from "express";
const router = express.Router();
// import controller
import {
    createPublisher,
    listOfPublishers,
    removePublisher,
    readPublisher,
    updatePublisher
} from "../controller/publisherController.js";

// import middleware
import { requiredSignIn } from "../middlewares/authMiddleware.js";
import { generatePublisherID } from "../middlewares/publisherMiddleware.js";

router.post(
  "/create_publisher",
  requiredSignIn,
  generatePublisherID,
  createPublisher
);
router.get("/publishers", requiredSignIn, listOfPublishers);
router.delete("/publisher/:publisherID", requiredSignIn, removePublisher);
router.get("/publisher/:publisherID",requiredSignIn, readPublisher);
router.put("/publisher/:publisherID", requiredSignIn,updatePublisher);

export default router;
