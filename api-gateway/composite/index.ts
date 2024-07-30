import express, { Express, Request, Response } from 'express';
import axios from 'axios';

const app: Express = express();
const PORT = process.env.PORT || 3002;

app.get('/user-products/:userId', async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;

		const userResponse = await axios.get(
			`http://users-service:3000/users/${userId}`
		);
		const user = userResponse.data;

		const productsResponse = await axios.get(
			`http://products-service:3001/products?userId=${userId}`
		);
		const products = productsResponse.data;

		const response = {
			user_id: user.id,
			user_name: user.name,
			email: user.email,
			products: products,
		};

		res.json(response);
	} catch (error) {
		console.error('Error fetching user or products:', error);
		res.status(500).json({ error: 'An error occurred while fetching data' });
	}
});

app.listen(PORT, () => {
	console.log(`Composite service listening at http://localhost:${PORT}`);
});
