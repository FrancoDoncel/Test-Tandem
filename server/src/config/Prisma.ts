//Configuracion de prisma
import { PrismaClient } from "@prisma/client";
import { createSoftDeleteMiddleware } from "prisma-soft-delete-middleware";

//Instancia de prisma
const prisma = new PrismaClient();

//Configuracion para soft delete
prisma.$use(
    createSoftDeleteMiddleware({
        models: {
            Usuario: {
                field: "deleted",
                createValue: Boolean,
            },
        },
    })
);

export { prisma };