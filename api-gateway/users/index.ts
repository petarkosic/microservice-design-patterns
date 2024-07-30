import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT = process.env.PORT || 3000;

const users = [
	{ id: 1, name: 'Alice', email: 'alice@example.com' },
	{ id: 2, name: 'Bob', email: 'bob@example.com' },
];

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Hello from the Users Service!' });
});

app.get('/users', (req: Request, res: Response) => {
	res.json(users);
});

app.get('/users/:id', (req: Request, res: Response) => {
	const user = users.find((u) => u.id === parseInt(req.params.id, 10));

	if (user) {
		res.json(user);
	} else {
		res.status(404).json({ error: 'User not found' });
	}
});

app.listen(PORT, () => {
	console.log(`Users Service is running on port ${PORT}`);
});
