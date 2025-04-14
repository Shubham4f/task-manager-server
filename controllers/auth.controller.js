import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import { accessTokenGenrator, refreshTokenGenrator } from "../utils/token.js";

export const signUp = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const password = bcryptjs.hashSync(req.body.password, 10);
    const newUser = new User({
      email,
      name,
      password,
    });
    const validUser = await newUser.save();
    const refreshToken = refreshTokenGenrator(
      validUser._id,
      validUser.sessionId
    );
    const accessToken = accessTokenGenrator(validUser._id, validUser.sessionId);
    return res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(201)
      .json({
        name,
        email,
      });
  } catch (error) {
    if (error.code === 11000)
      return next(errorHandler(409, "A user with email already exists."));
    else return next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(401, "Wrong credentials."));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials."));
    validUser.sessionId++;
    await validUser.save();
    const refreshToken = refreshTokenGenrator(
      validUser._id,
      validUser.sessionId
    );
    const accessToken = accessTokenGenrator(validUser._id, validUser.sessionId);
    return res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json({
        email,
        name: validUser.name,
      });
  } catch (error) {
    return next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    if (req.cookies.refresh_token) {
      const refreshToken = req.cookies.refresh_token;
      jwt.verify(refreshToken, process.env.JWT_SECRET, async (error, user) => {
        if (error) return next(errorHandler(401, "Invalid refresh token."));
        const validUser = await User.findById(user.id, "sessionId");
        if (validUser.sessionId === user.sessionId) {
          const accessToken = accessTokenGenrator(
            validUser._id,
            validUser.sessionId
          );
          return res
            .cookie("access_token", accessToken, {
              httpOnly: true,
              secure: true,
              sameSite: "None",
            })
            .status(200)
            .json({ message: "Refreshed." });
        } else {
          return next(errorHandler(401, "Invalid refresh token."));
        }
      });
    } else {
      return next(errorHandler(401, "No refresh token."));
    }
  } catch (error) {
    return next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res
      .clearCookie("refresh_token")
      .clearCookie("access_token")
      .status(200)
      .json({
        message: "User signed out.",
      });
  } catch (error) {
    return next(error);
  }
};
