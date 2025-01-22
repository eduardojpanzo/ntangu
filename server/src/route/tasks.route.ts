import { FastifyInstance } from "fastify";
import prisma from "../lib/prima";
import { z } from "zod";
import { authenticate } from "../utils/auth";

const userCredentials = z.object({
  user: z.object({
    id: z.number(),
    email: z.string(),
  }),
});

const bodyRequestShema = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  status: z.enum(["backlog", "todo", "in-progress", "done"]).optional(),
  duration: z.number().optional(),
  categoryId: z.number().optional(),
});

export default async function taskRoutes(app: FastifyInstance) {
  // Middleware para verificar autenticação
  app.addHook("onRequest", authenticate);

  app.post("/tasks", async (req, reply) => {
    try {
      const {
        user: { id },
      } = userCredentials.parse(req.query);

      const { title, description, dueDate, status, categoryId, duration } =
        bodyRequestShema.parse(req.body);

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

      const slug = `geral@${user.email.split("@")[0]}`;

      const geralCategory = await prisma.category.findFirst({
        where: {
          userId: user.id,
          slug,
        },
      });

      const task = await prisma.task.create({
        data: {
          title,
          description,
          dueDate: new Date(dueDate),
          status,
          categoryId: categoryId ? categoryId : Number(geralCategory?.id),
          userId: Number(id),
          duration,
        },
      });
      reply.code(201).send({ data: task, message: "Tarefa criado" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "alguma coisa deu errado" });
    }
  });

  app.get("/tasks", async (req, reply) => {
    try {
      const {
        user: { id },
      } = userCredentials.parse(req.query);

      const tasks = await prisma.task.findMany({
        where: { userId: Number(id) },
      });
      reply.send({ data: tasks, message: "Encotrado!" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "alguma coisa deu errado" });
    }
  });

  app.get("/tasks/:taskId", async (req, reply) => {
    try {
      const { taskId } = req.params as { taskId: string };
      const {
        user: { id },
      } = userCredentials.parse(req.query);

      const tasks = await prisma.task.findUnique({
        where: { userId: Number(id), id: Number(taskId) },
        include: {
          category: true,
        },
      });
      reply.send({ data: tasks, message: "Encotrado!" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "alguma coisa deu errado" });
    }
  });

  app.get("/tasks/category/:categoryId", async (req, reply) => {
    try {
      const { categoryId } = req.params as { categoryId: string };
      const {
        user: { id },
      } = userCredentials.parse(req.query);

      const tasks = await prisma.task.findMany({
        where: { userId: Number(id), categoryId: Number(categoryId) },
      });
      reply.send({ data: tasks, message: "Encotrado!" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "alguma coisa deu errado" });
    }
  });

  app.put("/tasks/:taskId", async (req, reply) => {
    const { taskId } = req.params as { taskId: string };

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

      const slug = `geral@${user.email.split("@")[0]}`;

      const geralCategory = await prisma.category.findFirst({
        where: {
          userId: user.id,
          slug,
        },
      });

      const { title, description, dueDate, status, categoryId, duration } =
        bodyRequestShema.parse(req.body);

      const updatedTask = await prisma.task.update({
        where: { id: parseInt(taskId) },
        data: {
          title,
          description,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          status,
          categoryId: categoryId ? categoryId : geralCategory?.id,
          duration,
        },
      });

      reply
        .code(201)
        .send({ data: updatedTask, message: "Tarefa atualizado com sucesso" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "alguma coisa deu errado" });
    }
  });

  app.put("/tasks/status/:taskId", async (req, reply) => {
    const { taskId } = req.params as { taskId: string };

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

      const { status } = z
        .object({
          status: z.enum(["backlog", "todo", "in-progress", "done"]).optional(),
        })
        .parse(req.body);

      const updatedTask = await prisma.task.update({
        where: { id: parseInt(taskId) },
        data: {
          status,
        },
      });

      reply
        .code(201)
        .send({ data: updatedTask, message: "Tarefa atualizado com sucesso" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "alguma coisa deu errado" });
    }
  });

  app.delete("/tasks/:taskId", async (req, reply) => {
    const { taskId } = req.params as { taskId: string };

    try {
      await prisma.task.delete({ where: { id: Number(taskId) } });
      reply.send({ message: "Tarefa removido" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "algum erro desconhecido" });
    }
  });
}
