import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT = process.env.PORT || 3001;

const products = [
	{ id: 1, userId: 1, name: 'Laptop' },
	{ id: 2, userId: 1, name: 'Smartphone' },
	{ id: 3, userId: 2, name: 'Tablet' },
];

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Hello from the Products Service!' });
});

app.get('/products', (req: Request, res: Response) => {
	const userId = parseInt(req.query.userId as string, 10);

	if (userId) {
		const userProducts = products.filter((p) => p.userId === userId);

		res.json(userProducts);
	} else {
		res.json(products);
	}
});

app.listen(PORT, () => {
	console.log(`Products Service is running on port ${PORT}`);
});
