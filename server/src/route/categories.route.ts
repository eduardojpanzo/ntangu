import { FastifyInstance } from "fastify";
import prisma from "../lib/prima";
import { z } from "zod";
import { authenticate } from "../utils/auth";

const bodyRequestShema = z.object({
  name: z.string(),
});

const userCredentials = z.object({
  user: z.object({
    id: z.number(),
    email: z.string(),
  }),
});

export default async function categoryRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authenticate);

  app.post("/categories", async (req, reply) => {
    try {
      const { name } = bodyRequestShema.parse(req.body);
      const {
        user: { id },
      } = userCredentials.parse(req.query);

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          email: true,
          id: true,
        },
      });

      if (!user) {
        reply.code(404).send({ message: "Usúario não existente" });
        return;
      }

      const slug = `${name.toLowerCase().split(" ").join("-")}@${
        user.email.split("@")[0]
      }`;

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          userId: user.id,
        },
      });
      reply.code(201).send({ data: category, message: "Criado com sucesso" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "alguma coisa deu errado" });
    }
  });

  app.get("/categories", async (req, reply) => {
    try {
      const {
        user: { id },
      } = userCredentials.parse(req.query);

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          email: true,
          id: true,
        },
      });

      if (!user) {
        reply.code(404).send({ message: "Usúario não existente" });
        return;
      }

      const categories = await prisma.category.findMany({
        where: { userId: user.id },
      });
      reply.send({ data: categories, message: "econtrado" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "alguma coisa deu errado" });
    }
  });

  app.get("/categories/:categoryId", async (req, reply) => {
    try {
      const {
        user: { id },
      } = userCredentials.parse(req.query);
      const { categoryId } = req.params as { categoryId: string };

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          email: true,
          id: true,
        },
      });

      if (!user) {
        reply.code(404).send({ message: "Usúario não existente" });
        return;
      }

      const category = await prisma.category.findUnique({
        where: { userId: user.id, id: Number(categoryId) },
      });

      if (!category) {
        reply.code(404).send({ message: "Categoria nao encontrada" });
        return;
      }

      reply.send({ data: category, message: "econtrado" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "alguma coisa deu errado" });
    }
  });

  app.put("/categories/:categoryId", async (req, reply) => {
    const { categoryId } = req.params as { categoryId: string };
    try {
      const { name } = bodyRequestShema.parse(req.body);
      const {
        user: { id },
      } = userCredentials.parse(req.query);

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          email: true,
          id: true,
        },
      });

      if (!user) {
        reply.code(404).send({ message: "Usúario não existente" });
        return;
      }

      const slug = `${name.toLowerCase().split(" ").join("-")}@${
        user.email.split("@")[0]
      }`;

      const updatedCategory = await prisma.category.update({
        where: { id: Number(categoryId) },
        data: {
          name,
          slug,
        },
      });

      reply
        .code(201)
        .send({ data: updatedCategory, message: "Atualizado com sucesso" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "alguma coisa deu errado" });
    }
  });

  app.delete("/categories/:categoryId", async (req, reply) => {
    try {
      const { categoryId } = req.params as { categoryId: string };
      await prisma.category.delete({ where: { id: parseInt(categoryId) } });
      reply.code(200).send({ message: "categoria removida com sucesso" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "alguma coisa deu errado" });
    }
  });
}
