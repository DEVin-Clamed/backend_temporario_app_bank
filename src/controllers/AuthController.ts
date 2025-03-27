import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {

  private userRepository;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

   login = async (req: Request, res: Response) => {
    try {
      const userLogin = req.body;

      const userEntity = await this.userRepository.findOne({
        where: {
          cpf: userLogin.cpf,
        },
      });

      if (!userEntity) {
        res.status(400).json({error: "Cpf e/ou senha inválido!"});
        return;
      }

      const isValid = await bcrypt.compare(
        userLogin.password,
        userEntity.password_hash
      );

      if (!isValid) {
        res.status(400).json("Email e/ou senha inválido!");
        return;
      }

      const chaveSecretaJwt = process.env.JWT_SECRET ?? "";

      const payload = {
        firstName: userEntity.name,
        userId: userEntity.id,
      };

      const token = jwt.sign(payload, chaveSecretaJwt, { expiresIn: "8h" });

      res.status(200).json({ token: token });
    } catch (error) {
      console.log(error);
      res.status(500).json("Erro ao realizar login");
    }
  };
}

export default new AuthController();
