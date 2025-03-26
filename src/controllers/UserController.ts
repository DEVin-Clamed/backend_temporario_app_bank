import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

class UserController {
  private userRepository;

  constructor() {
     this.userRepository = AppDataSource.getRepository(User);
   }

   create = async (req: Request, res: Response) => {
    try {
      const { name, cpf, email, password } = req.body;

      if (!name || !cpf || !email || !password) {
        res.status(400).json({ message: "All fields are required." });
      }

      const body = {
        name,
        cpf,
        email,
        password_hash: password,
      };

      const user = await this.userRepository.save(body);

      res
        .status(201)
        .json(user);
    } catch (error) {
    
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

export default new UserController();
