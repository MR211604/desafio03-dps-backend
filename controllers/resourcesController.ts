import { Request, Response } from "express";
import { prisma } from "../database/connection";

async function getResources(req: Request, res: Response) {
  try {
    const resource = await prisma.learningResource.findMany();

    res.status(200).json({
      ok: true,
      message: "Recursos obtenidos con éxito",
      data: resource,
    });
  } catch (error) {
    throw new Error("Ha ocurrido un error desconocido" + error);
  }
}

async function getResource(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const resource = await prisma.learningResource.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!resource) {
      return res.status(404).json({
        ok: false,
        message: "Recurso no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Recurso obtenido con éxito",
      data: resource,
    });
  } catch (error) {
    throw new Error("Ha ocurrido un error desconocido" + error);
  }
}

// id          Int          @id @default(autoincrement())
// title       String
// description String
// url         String       @unique
// type        ResourceType
// image       String?
async function createResource(req: Request, res: Response) {
  try {
    const { title, description, url, type, image } = req.body;

    const existingResource = await prisma.learningResource.findFirst({
      where: {
        title,
      },
    });

    if (existingResource) {
      return res.status(400).json({
        ok: false,
        message: "Un recurso con este título ya existe",
      });
    }

    const newResource = await prisma.learningResource.create({
      data: {
        title,
        description,
        url,
        type,
        image,
      },
    });

    res.status(201).json({
      ok: true,
      message: "Recurso creado con éxito",
      data: newResource,
    });
  } catch (error) {
    throw new Error("Ha ocurrido un error desconocido" + error);
  }
}

async function updateResource(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "El id del recurso es obligatorio",
      });
    }

    const { title, description, url, type, image } = req.body;

    const resource = await prisma.learningResource.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!resource) {
      return res.status(404).json({
        ok: false,
        message: "Recurso no encontrado",
      });
    }

    const updatedResource = await prisma.learningResource.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        description,
        url,
        type,
        image,
      },
    });

    res.status(200).json({
      ok: true,
      message: "Recurso actualizado con éxito",
      data: updatedResource,
    });
  } catch (error) {
    throw new Error("Ha ocurrido un error desconocido" + error);
  }
}

async function deleteResource(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "El id del recurso es obligatorio",
      });
    }

    const resource = await prisma.learningResource.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!resource) {
      return res.status(404).json({
        ok: false,
        message: "Recurso no encontrado",
      });
    }

    await prisma.learningResource.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      ok: true,
      message: "Recurso eliminado con éxito",
    });
  } catch (error) {
    throw new Error("Ha ocurrido un error desconocido" + error);
  }
}

export {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
};
