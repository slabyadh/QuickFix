import amqp from "amqplib";

async function sendMessages() {
  const connection = await amqp.connect({
        protocol: "amqp",
        hostname: "dakara.gganster.fr",
        port: 5672,
        username: "admin",
        password: "admin",
      });
  const channel = await connection.createChannel();
  const queue = "task_queue";

  await channel.assertQueue(queue, { durable: true });

  console.log(" [*] Waiting to send messages. Press CTRL+C to exit.");

  setInterval(() => {
    const msg = JSON.stringify({
      item_id: "macbook",
      text: "Vérification de disponibilité du produit",
    });

    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    console.log(` [x] Sent: ${msg}`);
  }, 5000); // Envoie un message toutes les 5 secondes
}

sendMessages().catch(console.error);
