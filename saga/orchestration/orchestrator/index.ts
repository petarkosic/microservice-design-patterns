import express, { Express, Request, Response } from 'express';
import MessageService from './MessageService';

const PORT = process.env.PORT || 3000;

const app: Express = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Hello orchestrator' });
});

app.post('/create-order', async (req, res) => {
	const { order } = req.body;

	try {
		const messageService = new MessageService();

		const orderId = await messageService.sendOrderMessage(order);

		const inventoryResponse = await messageService.sendInventoryMessage(order);

		if (inventoryResponse === 'failure') {
			await messageService.compensateOrderMessage(orderId!);
			return res.status(400).send('Order failed - out of stock');
		}

		await messageService.sendNotifierMessage(orderId);

		res.status(201).send(`Order ${orderId} placed and confirmed`);
	} catch (error) {
		res.status(500).send('Error placing order');
	}
});

app.listen(PORT, () => console.log(`Orchestrator listening on port ${PORT}`));
