import express, { Express, Request, Response } from 'express';

const PORT = process.env.PORT || 3000;

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Hello orchestrator' });
});

app.listen(PORT, () => console.log(`Orchestrator listening on port ${PORT}`));
