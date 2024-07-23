import axios from 'axios';
import CircuitBreaker from './CircuitBreaker';

const circuitBreaker = new CircuitBreaker(3, 2, 10000); // failureThreshold, successThreshold, timeout
const NUMBER_OF_REQUESTS = 10;
const TIMEOUT_DELAY = 1000;

type Error = {
	message: string;
};

const makeRequest = async () => {
	try {
		const response = await circuitBreaker.exec(() =>
			axios.get('http://circuit-breaker-server:3000/data')
		);
		console.log('Request succeeded:', response.data);
	} catch (err) {
		const error = err as Error;
		console.error('Request failed:', error.message);
	}
};

// Simulate requests
const simulateRequests = async () => {
	for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
		await makeRequest();
		await new Promise((resolve) => setTimeout(resolve, TIMEOUT_DELAY)); // wait for 1 second between requests
	}
};

simulateRequests();
