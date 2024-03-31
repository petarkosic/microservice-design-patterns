import express, { Express, Request, Response } from 'express';

const PORT = process.env.PORT || 3003;

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Hello notifier' });
});

app.listen(PORT, () => console.log(`Notifier listening on port ${PORT}`));
