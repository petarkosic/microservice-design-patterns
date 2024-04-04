import express, { Express, Request, Response } from 'express';
import * as amqp from 'amqplib';

const PORT = process.env.PORT || 3000;

const app: Express = express();

const connObject = {
	protocol: process.env.RABBITMQ_PROTOCOL,
	hostname: process.env.RABBITMQ_HOSTNAME,
	port: Number(process.env.RABBITMQ_PORT),
	username: process.env.RABBITMQ_USERNAME,
	password: process.env.RABBITMQ_PASSWORD,
	vhost: process.env.RABBITMQ_VHOST,
};

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Hello orchestrator' });
});

async function sendMessage() {
	try {
		const connection = await amqp.connect(connObject);
		const channel = await connection.createChannel();

		const queue = 'orders';
		const correlationId = generateUuid();

		await channel.assertQueue(queue, { durable: false });

		// Create a reply queue
		const { queue: replyQueue } = await channel.assertQueue('', {
			exclusive: true,
		});

		// Send a message with reply-to and correlationId properties
		const message = 'Hello orders!';
		channel.sendToQueue(queue, Buffer.from(message), {
			correlationId: correlationId,
			replyTo: replyQueue,
		});

		console.log(`[x] Sent ${message}`);

		channel.consume(
			replyQueue,
			(msg) => {
				if (msg?.properties.correlationId === correlationId) {
					console.log(
						'Received response from Service A:',
						msg.content.toString()
					);
				}
			},
			{ noAck: true }
		);

		// Close the connection
		setTimeout(() => {
			connection.close();
		}, 500);
	} catch (error) {
		console.error('Error:', error);
	}
}

function generateUuid() {
	return (
		Math.random().toString() +
		Math.random().toString() +
		Math.random().toString()
	);
}

app.get('/create-order', async (req, res) => {
	try {
		await sendMessage();
		res.status(201).send('Order placed and confirmed');
	} catch (error) {
		res.status(500).send('Error placing order');
	}
});

app.listen(PORT, () => console.log(`Orchestrator listening on port ${PORT}`));
