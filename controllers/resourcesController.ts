import { Request, Response } from "express";
import { prisma } from "../database/connection";

async function getResources(req: Request, res: Response) {
  try {
    const {
      search,
      type,
      orderBy = "createdAt",
      order = "desc",
      limit = "10",
      page = "1",
    } = req.query;

    // Construir objeto where para filtros
    const where: any = {};

    // Búsqueda por título o descripción
    if (search && typeof search === "string") {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filtro por tipo
    if (type && typeof type === "string") {
      const validTypes = ["VIDEO", "ARTICLE", "BOOK", "COURSE"];
      if (validTypes.includes(type.toUpperCase())) {
        where.type = type.toUpperCase();
      }
    }

    // Configurar ordenamiento
    const validOrderByFields = ["title", "createdAt", "updatedAt", "type"];
    const orderByField = validOrderByFields.includes(orderBy as string)
      ? (orderBy as string)
      : "createdAt";

    const orderDirection = order === "asc" ? "asc" : "desc";

    // Configurar paginación
    const pageNumber = +(page as string);
    const limitNumber = +(limit as string);
    const offset = (pageNumber - 1) * limitNumber;

    // Obtener recursos con filtros, ordenamiento y paginación
    const [resources, total] = await Promise.all([
      prisma.learningResource.findMany({
        where,
        orderBy: {
          [orderByField]: orderDirection,
        },
        take: limitNumber,
        skip: offset,
      }),
      prisma.learningResource.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      ok: true,
      message: "Recursos obtenidos con éxito",
      data: resources,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        count: resources.length,
      },
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
      include: {
        userRatings: true,
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

async function addFavoriteResource(req: Request, res: Response) {
  const { userId, resourceId } = req.body;

  const foundUserFavorite = await prisma.userFavorites.findFirst({
    where: {
      userId,
      resourceId,
    },
  });

  if (foundUserFavorite) {
    return res.status(400).json({
      ok: false,
      message: "El usuario ya tiene este recurso como favorito",
    });
  }

  const newFavorite = await prisma.userFavorites.create({
    data: {
      userId,
      resourceId,
    },
  });

  res.status(201).json({
    ok: true,
    message: "Recurso agregado a favoritos con éxito",
    data: newFavorite,
  });
}

async function removeFavoriteResource(req: Request, res: Response) {
  const { userId, resourceId } = req.body;

  const foundUserFavorite = await prisma.userFavorites.findFirst({
    where: {
      userId: +userId,
      resourceId: +resourceId,
    },
  });

  if (!foundUserFavorite) {
    return res.status(404).json({
      ok: false,
      message: "No se encontró el recurso favorito",
    });
  }

  await prisma.userFavorites.delete({
    where: {
      id: +foundUserFavorite.id,
    },
  });

  res.status(200).json({
    ok: true,
    message: "Recurso eliminado de favoritos con éxito",
  });
}

async function getFavoritesResourcesByUser(req: Request, res: Response) {
  const { userId } = req.params;

  const foundUserFavorites = await prisma.userFavorites.findMany({
    where: {
      userId: +userId,
    },
    include: {
      resource: true,
    },
  });

  res.status(200).json({
    ok: true,
    message: "Recursos favoritos obtenidos con éxito",
    data: foundUserFavorites,
  });
}

async function rateResource(req: Request, res: Response) {
  const { userId, resourceId, rating } = req.body;

  const foundUserRating = await prisma.userRating.findFirst({
    where: {
      userId: +userId,
      resourceId: +resourceId,
    },
  });

  //Delete previous rating if exists
  if (foundUserRating) {
    await prisma.userRating.delete({
      where: {
        id: +foundUserRating.id,
      },
    });
  }

  const newRating = await prisma.userRating.create({
    data: {
      userId: +userId,
      resourceId: +resourceId,
      rating: +rating,
    },
  });

  res.status(201).json({
    ok: true,
    message: "Recurso calificado con éxito",
    data: newRating,
  });
}

export {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  addFavoriteResource,
  removeFavoriteResource,
  getFavoritesResourcesByUser,
  rateResource,
};
