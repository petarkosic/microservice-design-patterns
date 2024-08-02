# API Gateway Pattern

An API Gateway acts as a single entry point for multiple backend services, routing client requests to the appropriate service and aggregating responses. It simplifies client interactions by providing a unified interface for accessing various services.

## Characteristics:

1. **Unified Entry Point**: The API Gateway serves as a single entry point for all client requests, routing them to the appropriate backend services.
2. **Response Aggregation**: It aggregates responses from multiple services into a single response, reducing the number of client-server interactions.
3. **Service Orchestration**: Coordinates requests and responses between multiple backend services.

## Advantages:

1. **Simplified Client Interface**: Clients interact with a single endpoint, simplifying the client-side logic.
2. **Reduced Round Trips**: Aggregates responses from multiple services, reducing the number of client-server round trips.
3. **Improved Security**: Centralizes authentication and authorization, making it easier to enforce security policies.
4. **Scalability**: Allows for scaling individual services independently without affecting the overall system.

## Drawbacks:

1. **Single Point of Failure**: The API Gateway becomes a critical component, and its failure can affect the entire system.
2. **Increased Complexity**: Adds complexity to the system by introducing another layer that needs to be managed and maintained.
3. **Performance Overhead**: Aggregating responses from multiple services can introduce latency.

---

In this repository, the API Gateway pattern is implemented to manage the interaction between two services: Users and Products. A Composite service is responsible for aggregating data from these services.

![Api Gateway Diagram](./Api%20Gateway.png 'Api Gateway')

## Services

### 1. Users Service

The Users service handles user-related operations such as retrieving user details.

### 2. Products Service

The Products service manages product-related operations such as retrieving products associated with a user.

### 3. Composite Service

The Composite service aggregates data from the Users and Products services, providing a unified response to the client.

## Communication

The Composite service communicates with the Users and Products services via HTTP requests, aggregating their responses into a single object.

## Docker Setup

All services are containerized using Docker for easy development and management. Docker Compose is used to manage the multi-container application.

### Routes

- `GET /user-products/:userId`: Fetches user details and their associated products. Aggregates the responses from the Users and Products services.

## Usage

To run the microservices and start the API Gateway:

1. Install Docker and Docker Compose if not already installed.
2. Clone this repository.
3. Navigate to the repository directory.
4. Run `docker-compose up --build` to start all services.
5. Make a GET request to `http://localhost:8000/user-products/1` to fetch the aggregated user and product data.

## Example Response

```json
{
	"user_id": 1,
	"user_name": "Alice",
	"email": "alice@example.com",
	"products": [
		{
			"id": 1,
			"name": "Laptop"
		},
		{
			"id": 2,
			"name": "Smartphone"
		}
	]
}
```

## Contributing

Contributions to improve or extend the Api Gateway implementation are welcome! If you have suggestions, improvements, or additional features to add, please feel free to submit a pull request.

## Feedback

Your feedback is valuable! If you encounter any issues, have questions, or would like to share your experience with the Api Gateway pattern, please open an issue or reach out to the maintainers.
