import express, { Express, Request, Response } from 'express';
import { Client } from 'pg';
import * as amqp from 'amqplib';

const app: Express = express();
const PORT = process.env.PORT || 3001;

const rabbitmqConnOject = {
	protocol: process.env.RABBITMQ_PROTOCOL,
	hostname: process.env.RABBITMQ_HOSTNAME,
	port: Number(process.env.RABBITMQ_PORT),
	username: process.env.RABBITMQ_USERNAME,
	password: process.env.RABBITMQ_PASSWORD,
	vhost: process.env.RABBITMQ_VHOST,
};

const pg = new Client({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT),
});

pg.connect();

const connectToRabbitMQ = async () => {
	try {
		const connection = await amqp.connect(rabbitmqConnOject);
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
			const query =
				'INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3)';

			await pg.query(query, [
				eventData.payload.first_name,
				eventData.payload.last_name,
				eventData.payload.email,
			]);

			console.log('User inserted:', eventData.payload);
		}

		if (eventData.type === 'UserUpdated') {
			const query =
				'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4';

			await pg.query(query, [
				eventData.payload.first_name,
				eventData.payload.last_name,
				eventData.payload.email,
				eventData.payload.id,
			]);

			console.log('User updated:', eventData.payload);
		}

		if (eventData.type === 'UserDeleted') {
			const query = 'DELETE FROM users WHERE id = $1';

			await pg.query(query, [eventData.payload.id]);

			console.log('User deleted:', eventData.payload);
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

app.get('/users/:id', async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const query = 'SELECT * FROM users WHERE id = $1';

		const result = await pg.query(query, [id]);

		if (result.rows.length === 0) {
			res.status(404).send('User not found');
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error('Error fetching user:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.listen(PORT, () => {
	console.log(`Query service listening at http://localhost:${PORT}`);
});
