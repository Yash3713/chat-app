import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generteJwtToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All Fieds are required " });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      //generate jwt token
      generteJwtToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      });
    } else {
      res.status(400).json({ message: "Invalid Data" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error " });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Looged Out Succesfully" });
  } catch (erroe) {
    res.status(500).json({ message: "Internal Server Error " });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }
    const user = await User.findOne({ email });
    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!user || !isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    generteJwtToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user._id;
    if (!profilePicture) {
      req.status(400).json({ message: "Profile Picture is required" });
    }
    const uploadedPicture = await cloudinary.uploader.upload(profilePicture);

    comnst updatedUser = await User.findByIdAndUpdate(userId,{profilePicture:uploadedPicture.secure_url},{new:true})

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
