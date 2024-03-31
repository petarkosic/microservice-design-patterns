import express, { Express, Request, Response } from 'express';

const PORT = process.env.PORT || 3001;

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Hello inventory' });
});

app.listen(PORT, () => console.log(`Inventory listening on port ${PORT}`));
