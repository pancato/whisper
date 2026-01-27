import type { Request, Response, NextFunction } from "express";
import { getAuth, requireAuth } from "@clerk/express";
import { User } from "../models/User";

export type AuthRequest = Request & {
  userId?: string;
};

export const protectRoute = [
  requireAuth(),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId: clerkId } = getAuth(req);

      const user = await User.findOne({ clerkId });
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      req.userId = user._id.toString();
      next();
    } catch (error) {
      res.status(500);
      next(error);
    }
  },
];
