import * as amqp from 'amqplib';

const connObject = {
	protocol: process.env.RABBITMQ_PROTOCOL,
	hostname: process.env.RABBITMQ_HOSTNAME,
	port: Number(process.env.RABBITMQ_PORT),
	username: process.env.RABBITMQ_USERNAME,
	password: process.env.RABBITMQ_PASSWORD,
	vhost: process.env.RABBITMQ_VHOST,
};

async function receiveMessage() {
	try {
		const connection = await amqp.connect(connObject);
		const channel = await connection.createChannel();

		const queue = 'inventory';
		await channel.assertQueue(queue, { durable: false });

		console.log('[*] Waiting for messages in %s. To exit press CTRL+C', queue);

		channel.consume(queue, async (msg) => {
			if (msg) {
				let messageContent = JSON.parse(msg.content.toString());
				console.log('[x] Received %s', messageContent);

				// Do some processing here
				// Check if item is in stock

				const isInStock = Math.random() > 0.5 ? 'success' : 'failure';

				// Send response back to reply-to queue
				channel.sendToQueue(msg.properties.replyTo, Buffer.from(isInStock), {
					correlationId: msg.properties.correlationId,
				});

				// Acknowledge the message
				channel.ack(msg);
			}
		});
	} catch (error) {
		console.error('Error:', error);
	}
}

receiveMessage();
