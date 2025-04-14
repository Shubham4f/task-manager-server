import express from "express";

import {
  signUp,
  signIn,
  refresh,
  signOut,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/refresh", refresh);
router.get("/signout", signOut);

export default router;
