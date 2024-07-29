import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Hello from the Users Service!' });
});

app.get('/users', (req: Request, res: Response) => {
	res.json([
		{ id: 1, name: 'Alice' },
		{ id: 2, name: 'Bob' },
	]);
});

app.listen(PORT, () => {
	console.log(`Users Service is running on port ${PORT}`);
});
