import express, { Express, Request, Response } from 'express';

const PORT = process.env.PORT || 3002;

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Hello orders' });
});

app.listen(PORT, () => console.log(`Orders listening on port ${PORT}`));
