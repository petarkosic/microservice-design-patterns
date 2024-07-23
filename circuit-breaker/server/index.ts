import express, { Express, Request, Response } from 'express';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.get('/data', (req: Request, res: Response) => {
	// Introduce random failure
	if (Math.random() < 0.5) {
		res.status(500).send('Server Error');
	} else {
		res.send('Server Response');
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
