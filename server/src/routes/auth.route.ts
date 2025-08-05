import { Router } from "express"
import { userLogin, userLogout, userRegister } from "../controllers/auth.controller";
import { userMiddlware } from "../middlewares/user.middleware";
const authRouter = Router();


authRouter.post("/register", userRegister)

authRouter.post('/login', userLogin)

authRouter.post('/logout', userMiddlware, userLogout)

export default authRouter;