import { Request, Response } from "express";
import { prisma } from "../database/connection";
import { generateJWT } from "../helpers/jwt";
import bcrypt from "bcryptjs";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const foundUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (foundUser) {
      return res.status(400).json({
        ok: false,
        message: "El usuario o correo ya existe",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        hashed_password: hashedPassword,
      },
    });

    const returnSafeUser = {
      ...newUser,
      hashed_password: undefined,
    };

    return res.status(201).json({
      ok: true,
      message: "Usuario registrado con éxito",
      user: returnSafeUser,
    });
  } catch (error) {
    console.error("Error registrando usuario:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal Server Error" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const foundUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!foundUser) {
      return res.status(400).json({
        ok: false,
        message: "Credenciales inválidas",
      });
    }

    const isPasswordValid = bcrypt.compareSync(
      password,
      foundUser.hashed_password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        ok: false,
        message: "Credenciales inválidas",
      });
    }

    const token = await generateJWT(foundUser.id.toString());
    return res.status(200).json({
      ok: true,
      message: "Inicio de sesión exitoso",
      token,
    });
  } catch (error) {
    console.error("Error iniciando sesión:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal Server Error" });
  }
};

const authRenewToken = async (req: Request, res: Response) => {
  const { id } = req.body;
  const foundUser = await prisma.user.findFirst({
    where: {
      id,
    },
  });
  const token = await generateJWT(id);
  return res.status(200).json({
    ok: true,
    message: "Renew",
    token,
    user: foundUser,
  });
};

export { registerUser, loginUser, authRenewToken };
