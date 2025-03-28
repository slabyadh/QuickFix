import express from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("Welcome to the mailMS service!");
})

const RABBITMQ_URL = "amqp://admin:admin@dakara.gganster.fr:5672";
const QUEUE_NAME = "mail_queue";

async function startConsumer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log("📩 MailMS en attente de messages...");

    channel.consume(
      QUEUE_NAME,
      (msg) => {
        if (msg !== null) {
          const content = JSON.parse(msg.content.toString());
          console.log("📬 Message reçu :", content);

          // Simuler l'envoi d'un email (remplace ça par un vrai service d'envoi)
          console.log(
            `✉️ Envoi d'email à ${content.email} : "${content.subject}"`
          );

          // Accuser réception du message
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("❌ Erreur RabbitMQ :", error);
  }
}

// Endpoint de test
app.get("/", (req, res) => {
  res.send("Welcome to the mailMS service!");
});

app.listen(3001, () => {
  console.log("API Gateway is running on port 3000");
});