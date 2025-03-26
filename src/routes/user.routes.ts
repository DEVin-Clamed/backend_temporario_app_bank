import {AppDataSource} from "../data-source"
import { User } from "../entity/User"
import {Router} from "express"


import UserController from "../controllers/UserController"

const userRepository = AppDataSource.getRepository(User)

const userRouter = Router()

userRouter.post("/", UserController.create)

export default userRouter;