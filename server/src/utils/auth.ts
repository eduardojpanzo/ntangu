import { FastifyReply, FastifyRequest } from "fastify";
import { jwtVerify } from "jose";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("Missing authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    req.query = req.query ? { ...req.query, user: payload } : { user: payload };
  } catch (err) {
    reply.code(401).send({ message: "Não Autorizado!" });
  }
}
