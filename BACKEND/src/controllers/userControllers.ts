import { Request, Response } from "express";
import User from "../database/models/UserModel";
import bcrypt from "bcrypt";
import generateToken from "../services/generateToken";

class UserController {
  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please Provide username,email,password",
      });
      return;
    }
    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 14),
    });
    res.status(201).json({
      message: "User Registered Suecssfully",
    });
  }
  static async login(req: Request, res: Response) {
    //accept incomming Data --->Email, password
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }
    // Check email exists or not at first
    const user = await User.findAll({
      where: {
        email: email,
      },
    });

    //if yes --> email exist ==> check password too
    if (user.length == 0) {
      res.status(404).json({
        message: "No user with that email 😟😟😟",
      });
    } else {
      //if password is correct --> token generate(jwt)
      const isEqual = bcrypt.compareSync(password, user[0].password);
      if (!isEqual) {
        res.status(200).json({
          message: "Invalid Password",
        });
      } else {
        const token = generateToken(user[0].id);

        res.status(200).json({
          message: "Logged In sucessfully",
          token,
        });
      }
    }
  }
}

export default UserController;
