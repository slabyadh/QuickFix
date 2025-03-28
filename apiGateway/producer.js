import amqp from "amqplib";

const queue = "product_inventory";
const message = {
  item_id: "macbook",
  text: "Vérification de disponibilité du produit",
};

(async () => {
  let connection;
  try {
    connection = await amqp.connect({
          protocol: "amqp",
          hostname: "dakara.gganster.fr",
          port: 5672,
          username: "admin",
          password: "admin",
        });
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    console.log(" [x] Sent:", message);
    await channel.close();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    if (connection) await connection.close();
  }
})();
