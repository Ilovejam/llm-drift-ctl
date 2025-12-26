import Fastify from "fastify";

const app = Fastify({ logger: true });

// Health check endpoint
app.get("/health", async () => {
  return { ok: true };
});

// License verification endpoint
app.post("/license/verify", async (req, reply) => {
  const { apiKey } = req.body as any;
  
  if (!apiKey || apiKey !== process.env.MASTER_KEY) {
    return reply.status(401).send({ valid: false });
  }
  
  return {
    valid: true,
    plan: "pro",
    features: ["FORMAT", "CONTENT", "CALIBRATION"]
  };
});

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 8080;
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

