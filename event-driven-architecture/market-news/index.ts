import express from 'express';
import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

const connObject = {
	protocol: process.env.RABBITMQ_PROTOCOL,
	hostname: process.env.RABBITMQ_HOSTNAME,
	port: Number(process.env.RABBITMQ_PORT),
	username: process.env.RABBITMQ_USERNAME,
	password: process.env.RABBITMQ_PASSWORD,
	vhost: process.env.RABBITMQ_VHOST,
};

const EXCHANGE_NAME = 'stock_market';

async function publishMessage(routingKey: string, message: any) {
	const connection = await amqp.connect(connObject);
	const channel = await connection.createChannel();

	await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: false });
	channel.publish(
		EXCHANGE_NAME,
		routingKey,
		Buffer.from(JSON.stringify(message))
	);

	console.log(`Sent ${routingKey}: ${JSON.stringify(message)}`);

	setTimeout(() => {
		connection.close();
	}, 500);
}

app.post('/publish-news', async (req, res) => {
	const { title, content } = req.body;

	await publishMessage('market.news', { title, content });

	res.status(200).json({ message: 'News published' });
});

app.listen(PORT, () =>
	console.log(`Market News Service listening on port ${PORT}`)
);
