import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    console.log('Request Body:', req.body); // Add this line to log the request body
    //validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    console.log("Hashed Password:", hashedPassword);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
   
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const {email, password} = req.body;
    if(!email || !password){
      res.status(404).send({
        success:false,
        message:'Invalid email or password'
      })
    }
    const user = await userModel.findOne({email})
    if(!email){
      res.status(404).send({
        success:false,
        message:'email is not registered'
      })
    }
    const match = await comparePassword(password, user.password)
    if(!match){
      res.status(200).send({
        success:false,
        message:'wrong password'
      })
    }
    const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{
      expiresIn:"7d"
    })
    res.status(200).send({
      success:true,
      message:"login successfully",
      user:{
        name:user.name,
        phone:user.phone,
        address:user.address,
        email:user.email

      },
      token,
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
}
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};
