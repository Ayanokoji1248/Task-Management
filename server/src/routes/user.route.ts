import { Router } from "express";
import { userMiddlware } from "../middlewares/user.middleware";
import { getUser } from "../controllers/user.controller";
const userRouter = Router();

userRouter.get('/me', userMiddlware, getUser)

export default userRouter;