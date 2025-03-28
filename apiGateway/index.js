import express from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

const RABBITMQ_URL = "amqp://admin:admin@dakara.gganster.fr:5672";
const QUEUE_NAME = "mail_queue";

async function sendToQueue(message) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log("✅ Message envoyé à RabbitMQ :", message);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("❌ Erreur RabbitMQ :", error);
  }
}

// Endpoint pour tester RabbitMQ
app.post("/publish", async (req, res) => {
  const { email, subject, content } = req.body;

  if (!email || !subject || !content) {
    return res.status(400).json({ error: "Données incomplètes" });
  }

  const message = { email, subject, content };
  await sendToQueue(message);

  res.status(200).json({ message: "Message envoyé à RabbitMQ" });
});

app.get("/", (req, res) => {
  for (let i = 0; i < 10000; i++) {} // Simulate a long-running process
  return res.send("OK");
})

app.listen(3000, () => {
  console.log("API Gateway is running on port 3000");
});