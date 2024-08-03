import express from "express";
import {registerController, loginController, testController} from '../controllers/authController.js'
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

//routing
//REGISTER || METHOD POST

router.route("/register").post(registerController);

//LOGIN || METHOD POST
router.route("/login").post(loginController);

//test routes
router.get('/test',requireSignIn,isAdmin,testController);

export default router;   