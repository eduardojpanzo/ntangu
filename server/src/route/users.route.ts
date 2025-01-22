import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import prisma from "../lib/prima";
import { SignJWT } from "jose";
import { z } from "zod";
import { authenticate } from "../utils/auth";
import { getTasksForChart } from "../utils/tasks";

// Environment variables (replace with dotenv or similar in production)

enum Role {
  OWNER = "owner",
}

const userAcessSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const userParams = z.object({
  id: z.number(),
});

const userCredentials = z.object({
  user: z.object({
    id: z.number(),
    email: z.string(),
  }),
});

export default async function userRoutes(app: FastifyInstance) {
  app.post("/register", async (req, reply) => {
    try {
      const { email, password } = userAcessSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(password, 10);

      const hasUser = await prisma.user.findUnique({ where: { email: email } });

      if (hasUser) {
        reply.code(409).send({ message: "O email já está em uso" });
        return;
      }

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: Role.OWNER,
          name: email.split("@")[0],
        },
      });

      const slug = `geral@${user.email.split("@")[0]}`;

      await prisma.category.create({
        data: {
          name: "Geral",
          slug,
          userId: user.id,
        },
      });

      reply.code(201).send({
        data: { id: user.id, email: user.email },
        message: "Usuário criado com sucesso",
      });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "Erro ao criar a conta" });
    }
  });

  app.post("/login", async (req, reply) => {
    try {
      const { email, password } = userAcessSchema.parse(req.body);

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        reply.code(401).send({ message: "Senha ou e-mail está inválido" });
        return;
      }

      const token = await new SignJWT({ id: user.id, email: user.email })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("12h")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

      await prisma.session.upsert({
        where: { userId: user.id },
        update: { token },
        create: { userId: user.id, token },
      });

      reply.send({ data: { token }, message: "Login feito com sucesso" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "algum erro desconhecido" });
    }
  });

  app.get("/users", { preHandler: authenticate }, async (req, reply) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          email: true,
          id: true,
          tasks: true,
        },
      });

      if (!users.length) {
        reply.send({
          data: users,
          message: "lista vazia",
          total: users.length,
        });
        return;
      }

      reply.send({
        data: users,
        message: "lista encotrada",
        total: users.length,
      });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "algum erro desconhecido" });
    }
  });

  app.get("/profile", { preHandler: authenticate }, async (req, reply) => {
    try {
      const {
        user: { id },
      } = userCredentials.parse(req.query);

      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          email: true,
          id: true,
          name: true,
          role: true,
          tasks: true,
        },
      });

      if (!user) {
        reply.code(204).send({ data: user, message: "Usuário não encotrado" });
        return;
      }
      reply
        .code(200)
        .send({ data: user, message: "Usuário encotrado com sucesso" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "algum erro desconhecido" });
    }
  });

  app.get(
    "/profile/resume",
    { preHandler: authenticate },
    async (req, reply) => {
      try {
        const {
          user: { id },
        } = userCredentials.parse(req.query);

        const user = await prisma.user.findUnique({
          where: {
            id: Number(id),
          },
          select: {
            email: true,
            id: true,
            name: true,
            role: true,
            tasks: true,
            createdAt: true,
          },
        });

        if (!user) {
          reply
            .code(204)
            .send({ data: user, message: "Usuário não encotrado" });
          return;
        }

        const chart = await getTasksForChart(user.id);

        reply.code(200).send({
          data: chart,
          message: "dados encotrado com sucesso",
        });
      } catch (error) {
        reply
          .code(400)
          .send({ erro: error, message: "algum erro desconhecido" });
      }
    }
  );

  app.delete("/profile", { preHandler: authenticate }, async (req, reply) => {
    try {
      const { user } = userCredentials.parse(req.query);

      await prisma.user.delete({ where: { id: Number(user.id) } });

      reply.send({ message: "Usuário removido" });
    } catch (error) {
      reply.code(400).send({ erro: error, message: "algum erro desconhecido" });
    }
  });
}
