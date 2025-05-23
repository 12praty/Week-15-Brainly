import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  userId: string;
}
const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
    if (!decode) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
    req.userId = decode.userId;
    next();
  } catch (err) {
    console.log(err);
  }
};

export default isAuthenticated;
