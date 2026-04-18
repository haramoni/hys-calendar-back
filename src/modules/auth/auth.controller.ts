import { FastifyReply, FastifyRequest } from "fastify";

type LoginBody = {
  email: string;
  password: string;
};

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return reply.status(400).send({
      message: "Email and password are required",
    });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return reply.status(401).send({
      message: "Invalid credentials",
    });
  }

  const token = await reply.jwtSign(
    {
      email: adminEmail,
      role: "ADMIN",
    },
    {
      sign: {
        sub: "admin",
        expiresIn: "7d",
      },
    },
  );

  return reply.status(200).send({
    accessToken: token,
    user: {
      email: adminEmail,
      role: "ADMIN",
    },
  });
}

export async function meHandler(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send({
    user: request.user,
  });
}
