import Fastify from "fastify";
import cors from "@fastify/cors";
import userRoutes from "./route/users.route";
import taskRoutes from "./route/tasks.route";
import categoryRoutes from "./route/categories.route";

const app = Fastify();

//app.register(fastifyJwt, { secret: process.env.API_KEY ?? "" });

app.register(cors);

app.register(userRoutes);
app.register(taskRoutes);
app.register(categoryRoutes);

app.listen(
  { port: Number(process.env.PORT || 5000), host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
