import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Hello from the Products Service!' });
});

app.get('/products', (req: Request, res: Response) => {
	res.json([
		{ id: 1, name: 'Laptop' },
		{ id: 2, name: 'Smartphone' },
	]);
});

app.listen(PORT, () => {
	console.log(`Products Service is running on port ${PORT}`);
});
