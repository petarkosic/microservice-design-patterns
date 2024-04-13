import express, { Express, Request, Response } from 'express';
import { Client } from 'pg';
import * as amqp from 'amqplib';

const app: Express = express();
const PORT = process.env.PORT || 3001;

const pg = new Client({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT),
});

pg.connect();

const connectToRabbitMQ = async () => {
	try {
		const connection = await amqp.connect('amqp://rabbitmq');
		const channel = await connection.createChannel();
		const exchange = 'user_events';

		await channel.assertExchange(exchange, 'fanout', { durable: false });

		const queueName = 'query_service_queue';
		await channel.assertQueue(queueName, { durable: false });

		await channel.bindQueue(queueName, exchange, '');

		channel.consume(
			queueName,
			async (msg) => {
				if (msg?.content) {
					const eventData = JSON.parse(msg.content.toString());
					console.log('Received event:', eventData);
					await processEvent(eventData);
				}
			},
			{ noAck: true }
		);

		console.log('Connected to RabbitMQ');
	} catch (error) {
		console.error('Error connecting to RabbitMQ:', error);
	}
};

const processEvent = async (eventData: any) => {
	try {
		if (eventData.type === 'UserCreated') {
			const query = 'INSERT INTO users (id, name) VALUES ($1, $2)';
			const values = [eventData.payload.id, eventData.payload.name];
			await pg.query(query, values);
			console.log('User inserted:', eventData.payload);
		}
	} catch (error) {
		console.error('Error processing event:', error);
	}
};

connectToRabbitMQ();

app.get('/users', async (req: Request, res: Response) => {
	try {
		const query = 'SELECT * FROM users';
		const result = await pg.query(query);
		res.json(result.rows);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.listen(PORT, () => {
	console.log(`Query service listening at http://localhost:${PORT}`);
});
