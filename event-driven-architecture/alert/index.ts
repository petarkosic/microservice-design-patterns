import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const connObject = {
	protocol: process.env.RABBITMQ_PROTOCOL,
	hostname: process.env.RABBITMQ_HOSTNAME,
	port: Number(process.env.RABBITMQ_PORT),
	username: process.env.RABBITMQ_USERNAME,
	password: process.env.RABBITMQ_PASSWORD,
	vhost: process.env.RABBITMQ_VHOST,
};

const EXCHANGE_NAME = 'stock_market';
const QUEUE_NAME = 'alerts';

async function startConsumer() {
	const connection = await amqp.connect(connObject);
	const channel = await connection.createChannel();

	await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: false });
	const q = await channel.assertQueue(QUEUE_NAME, {
		durable: true,
		autoDelete: false,
		exclusive: false,
	});

	console.log(`Waiting for messages in queue: ${q.queue}`);

	channel.bindQueue(q.queue, EXCHANGE_NAME, 'stock.price');
	channel.bindQueue(q.queue, EXCHANGE_NAME, 'market.news');

	channel.consume(q.queue, (msg) => {
		if (msg !== null) {
			console.log(`Received: ${msg.content.toString()}`);
			// Send alerts based on the message content
			channel.ack(msg);
		}
	});
}

startConsumer().catch(console.error);
