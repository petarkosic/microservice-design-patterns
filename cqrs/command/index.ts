import express, { Express, Request, Response } from 'express';
import { Client } from 'pg';
import * as amqp from 'amqplib';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

		const queueName = 'command_service_queue';
		await channel.assertQueue(queueName, { durable: false });

		await channel.bindQueue(queueName, exchange, '');

		console.log('Connected to RabbitMQ');
		return channel;
	} catch (error) {
		console.error('Error connecting to RabbitMQ:', error);
	}
};

app.post('/users', async (req: Request, res: Response) => {
	const { name } = req.body;

	try {
		const user = await pg.query(
			`INSERT INTO users(name) VALUES($1) RETURNING *`,
			[name]
		);

		const userData = { id: user.rows[0].id, name: user.rows[0].name };

		const channel = await connectToRabbitMQ();
		await channel?.publish(
			'user_events',
			'',
			Buffer.from(JSON.stringify(userData))
		);
		console.log('User created:', userData);
		res.status(201).json(userData);
	} catch (error) {
		console.error('Error creating user:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.listen(PORT, () => {
	console.log(`Command service listening at http://localhost:${PORT}`);
});
