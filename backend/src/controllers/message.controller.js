import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersforSidebar = async (req, res) => {
  try {
    const myId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: { myId } } }).select(
      "-password",
    );
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.staus(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: reciversId } = req.params;
    const sendersId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: sendersId, recieverId: reciversId },
        { senderId: reciversId, recieverId: sendersId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.staus(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { id: reciversId } = req.params;
    const sendersId = req.user._id;
    const { text, image } = require.body;
    let imageUrl;

    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }

    const newMessage = new Message({
      sendersId,
      reciversId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    //todo: real-time functionalty usinf sockets
    res.status(201).json(newMessage);
  } catch (error) {
    res.staus(500).json({ message: "Internal Server Error" });
  }
};
