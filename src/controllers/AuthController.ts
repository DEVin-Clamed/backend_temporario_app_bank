import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { handleError } from "../middlewares/handleError";

class UserController {
  private userRepository;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  public async login(req: Request, res: Response, next): Promise<void> {
    try {
      const userLogin = req.body;

      const userEntity = await this.userRepository.findOne({
        where: {
          login: userLogin.email,
        },
      });

      if (!userEntity) {
        res.status(400).json("Email e/ou senha inválido!");
        return;
      }

      const isValid = await bcrypt.compare(
        userLogin.password,
        userEntity.password
      );

      if (!isValid) {
        res.status(400).json("Email e/ou senha inválido!");
        return;
      }

      const chaveSecretaJwt = process.env.JWT_SECRET ?? "";

      const payload = {
        firstName: userEntity.firstName,
        userId: userEntity.id,
      };

      const token = jwt.sign(payload, chaveSecretaJwt, { expiresIn: "1h" });

      res.status(200).json({ token: token });
    } catch (error) {
        next(handleError(error))
     
    }
  }
}

export default new UserController();
