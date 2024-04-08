import * as amqp from 'amqplib';

interface MessageServiceInterface {
	sendMessage(
		queue: string,
		message: any,
		correlationId: string
	): Promise<string | null>;
	sendOrderMessage(order: any): Promise<string | null>;
	sendInventoryMessage(order: any): Promise<string | null>;
	sendNotifierMessage(order: any): Promise<string | null>;
	compensateOrderMessage(orderId: string): Promise<string | null>;
}

class MessageService implements MessageServiceInterface {
	private connObject: amqp.Options.Connect;

	constructor() {
		this.connObject = {
			protocol: process.env.RABBITMQ_PROTOCOL,
			hostname: process.env.RABBITMQ_HOSTNAME,
			port: Number(process.env.RABBITMQ_PORT),
			username: process.env.RABBITMQ_USERNAME,
			password: process.env.RABBITMQ_PASSWORD,
			vhost: process.env.RABBITMQ_VHOST,
		};
	}

	async sendMessage(
		queue: string,
		message: any,
		correlationId: string
	): Promise<string | null> {
		try {
			const connection = await amqp.connect(this.connObject);
			const channel = await connection.createChannel();

			await channel.assertQueue(queue, { durable: false });

			const { queue: replyQueue } = await channel.assertQueue('', {
				exclusive: true,
			});

			channel.sendToQueue(queue, Buffer.from(message), {
				correlationId: correlationId,
				replyTo: replyQueue,
			});

			console.log(`[x] Sent ${message} to ${queue}`);

			let responseMessage: string | null = null;
			await new Promise<void>((resolve, reject) => {
				channel.consume(
					replyQueue,
					(msg) => {
						if (msg?.properties.correlationId === correlationId) {
							responseMessage = msg.content.toString();
							console.log(`Received response from ${queue}: `, responseMessage);
							resolve();
						}
					},
					{ noAck: true }
				);
			});

			setTimeout(() => {
				connection.close();
			}, 500);

			return responseMessage;
		} catch (error) {
			console.error('Error:', error);
			return null;
		}
	}

	async sendOrderMessage(order: any): Promise<string | null> {
		const queueOrders = 'orders';
		const correlationIdOrders = this.generateUuid();
		return await this.sendMessage(
			queueOrders,
			JSON.stringify(order),
			correlationIdOrders
		);
	}

	async sendInventoryMessage(order: any): Promise<string | null> {
		const queueInventory = 'inventory';
		const correlationIdInventory = this.generateUuid();
		return await this.sendMessage(
			queueInventory,
			JSON.stringify(order),
			correlationIdInventory
		);
	}

	async sendNotifierMessage(order: any): Promise<string | null> {
		const queueNotifier = 'notifier';
		const correlationIdNotifier = this.generateUuid();
		return await this.sendMessage(
			queueNotifier,
			JSON.stringify(order),
			correlationIdNotifier
		);
	}

	async compensateOrderMessage(orderId: string): Promise<string | null> {
		const queueOrders = 'compensate-orders';
		const correlationIdOrders = this.generateUuid();
		return await this.sendMessage(
			queueOrders,
			JSON.stringify(orderId),
			correlationIdOrders
		);
	}

	private generateUuid() {
		return (
			Math.random().toString() +
			Math.random().toString() +
			Math.random().toString()
		);
	}
}

export default MessageService;
