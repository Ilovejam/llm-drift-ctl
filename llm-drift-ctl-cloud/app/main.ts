import Fastify from "fastify";

const app = Fastify({ logger: true });

// Health check endpoint
app.get("/health", async () => {
  return { ok: true };
});

// License verification endpoint
app.post("/license/verify", async (req, reply) => {
  const { apiKey } = req.body as any;
  
  if (!apiKey) {
    return reply.status(401).send({ valid: false });
  }
  
  // FREE tier: No API key needed (FORMAT mode only)
  if (apiKey === "free" || !apiKey) {
    return {
      valid: true,
      plan: "free",
      features: ["FORMAT"]
    };
  }
  
  // PRO tier: Valid master key required
  if (apiKey === process.env.MASTER_KEY || apiKey === process.env.PRO_MASTER_KEY) {
    return {
      valid: true,
      plan: "pro",
      features: ["FORMAT", "CONTENT", "CALIBRATION"]
    };
  }
  
  return reply.status(401).send({ valid: false });
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

