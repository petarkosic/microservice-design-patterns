import express, { Express, Request, Response } from 'express';
import { Client } from 'pg';
import * as amqp from 'amqplib';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

const connectToRabbitMQ = async (): Promise<amqp.Channel | undefined> => {
	try {
		const connection = await amqp.connect(rabbitmqConnOject);
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
	const { first_name, last_name, email } = req.body;

	let channel: amqp.Channel | undefined;

	try {
		const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';

		const result = await pg.query(checkEmailQuery, [email]);

		if (result.rows.length > 0) {
			return res.status(409).send('Email already exists');
		}

		const query =
			'INSERT INTO users(first_name, last_name, email) VALUES($1, $2, $3) RETURNING *';

		const user = await pg.query(query, [first_name, last_name, email]);

		const userData = {
			type: 'UserCreated',
			payload: {
				first_name: user.rows[0].first_name,
				last_name: user.rows[0].last_name,
				email: user.rows[0].email,
			},
		};

		channel = await connectToRabbitMQ();

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
	} finally {
		if (channel) {
			await channel.close();
		}
	}
});

app.put('/users/:id', async (req: Request, res: Response) => {
	const { id } = req.params;
	const { first_name, last_name, email } = req.body;

	let channel: amqp.Channel | undefined;

	try {
		const checkIdQuery = 'SELECT * FROM users WHERE id = $1';

		const result = await pg.query(checkIdQuery, [id]);

		if (result.rows.length === 0) {
			return res.status(404).send('User not found');
		}

		const query =
			'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *';

		const user = await pg.query(query, [first_name, last_name, email, id]);

		const userData = {
			type: 'UserUpdated',
			payload: {
				id: user.rows[0].id,
				first_name: user.rows[0].first_name,
				last_name: user.rows[0].last_name,
				email: user.rows[0].email,
			},
		};

		channel = await connectToRabbitMQ();

		await channel?.publish(
			'user_events',
			'',
			Buffer.from(JSON.stringify(userData))
		);

		console.log('User updated:', userData);
		res.status(200).json(userData);
	} catch (error) {
		console.error('Error updating user:', error);
		res.status(500).send('Internal Server Error');
	} finally {
		if (channel) {
			await channel.close();
		}
	}
});

app.delete('/users/:id', async (req: Request, res: Response) => {
	const { id } = req.params;

	let channel: amqp.Channel | undefined;

	try {
		const checkIdQuery = 'SELECT * FROM users WHERE id = $1';

		const result = await pg.query(checkIdQuery, [id]);

		if (result.rows.length === 0) {
			return res.status(404).send('User not found');
		}

		const query = 'DELETE FROM users WHERE id = $1 RETURNING *';

		const user = await pg.query(query, [id]);

		const userData = {
			type: 'UserDeleted',
			payload: {
				id: user.rows[0].id,
				email: user.rows[0].email,
			},
		};

		channel = await connectToRabbitMQ();

		await channel?.publish(
			'user_events',
			'',
			Buffer.from(JSON.stringify(userData))
		);

		console.log('User deleted:', userData);
		res.status(200).json(userData);
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).send('Internal Server Error');
	} finally {
		if (channel) {
			await channel.close();
		}
	}
});

app.listen(PORT, () => {
	console.log(`Command service listening at http://localhost:${PORT}`);
});
