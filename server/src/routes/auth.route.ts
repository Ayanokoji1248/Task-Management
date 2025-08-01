import { Router } from "express"
import { userRegister } from "../controllers/auth.controller";
const authRouter = Router();


authRouter.post("/register", userRegister)

export default authRouter;