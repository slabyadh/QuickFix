import amqp from "amqplib";
const queue = "product_inventory";

(async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "dakara.gganster.fr",
      port: 5672,
      username: "admin",
      password: "admin",
    });
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(queue, { durable: false });
    await channel.consume(
      queue,
      (message) => {
        if (message) {
          console.log(" [x] Received:", JSON.parse(message.content.toString()));
        }
      },
      { noAck: true }
    );

    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (err) {
    console.error("Error:", err);
  }
})();
