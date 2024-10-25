# Event-Driven Architecture (EDA)

Event-Driven Architecture (EDA) is a software design pattern that revolves around producing, detecting, and reacting to events within a system. In an EDA, applications are designed to publish and subscribe to events, allowing them to communicate with each other in a loosely coupled manner.

## Characteristics:

**Event-Driven**: EDA is based on the concept of events, which are used to trigger reactions in the system.
**Decoupling**: Components are decoupled, allowing them to be developed, tested, and deployed independently without affecting the overall system.
**Asynchronous Messaging**: Services publish and consume messages asynchronously via message queue, allowing independent scaling and fault isolation.

## Advantages:

**Scalability**: Producers and consumers can be scaled independently to handle increased load.
**Decoupling**: Services are loosely coupled and communicate via message queue, reducing interdependencies between them.
**Flexibility**: EDA enables the composition of complex business transactions by orchestrating multiple services with different functionalities.
**Fault Isolation**: Individual service failures do not affect the entire system, improving fault tolerance.
**Extensibility**: New consumers can be added to listen to messages on specific topics without modifying existing services.

## Drawbacks:

**Complexity in Debugging**: The distributed nature of the system can make tracing issues more complex.
**Single Point Of Failure**: There's an additional point of failure, because the event bus manages the complete workflow.
**Message Ordering**: Ensuring message ordering in an event-driven system can be difficult without additional mechanisms.

---

![EDA Diagram](./EDA.png 'EDA')

In this repository, a real-time stock market monitoring system is implemented with the following services:

## Services

### 1. Stock Price Service (Producer)

This service publishes stock price updates to RabbitMQ. It exposes a REST API that allows clients to post stock price updates, which are then published to the `stock_market` exchange with the routing key `stock.price`.

### 2. Market News Service (Producer)

This service publishes market news updates to RabbitMQ. It exposes a REST API that allows clients to post news articles, which are published to the `stock_market` exchange with the routing key `market.news`.

### 3. Portfolio Manager Service (Consumer)

The Portfolio Manager Service listens to stock price updates. It processes these updates and adjusts user portfolios accordingly. This service consumes messages from RabbitMQ that match the `stock.price` routing key.

### 4. Alert Service (Consumer)

The Alert Service listens to both stock price and market news updates. It processes these messages to send notifications to users, such as price alerts or important news. It consumes messages with routing keys `stock.price` and `market.news`.

### 5. Dashboard Service (Consumer)

The Dashboard Service listens to all messages published to the `stock_market` exchange. It updates the dashboard with real-time stock prices and market news for display to users.

## Communication

All services communicate asynchronously via RabbitMQ, using a topic exchange to route messages. Producers publish messages with specific routing keys, and consumers bind to those keys to process relevant messages. This allows for efficient and scalable communication between services.

## Docker Setup

The system is containerized using Docker, and Docker Compose is used to orchestrate the multi-container setup, including RabbitMQ and all services.

## Usage

To run the microservices:

1. Ensure Docker and Docker Compose are installed on your system.
2. Clone this repository to your local machine.
3. Navigate to the repository directory.
4. Run `docker-compose up -d` to start the Docker containers in detached mode.
5. Use the following endpoints to publish data:
   - Stock Prices: `http://localhost:3000`
   - Market News: `http://localhost:3001`
6. The Portfolio Manager, Alert, and Dashboard services will consume the published messages and react accordingly.

## Simulating Data

To simulate stock price updates and market news, run the included `simulate-data.sh` script, which will periodically send stock price and news updates to the Stock Price and Market News services.

```bash
./simulate-data.sh
```

## Endpoints

#### Stock Prices

1. **Update Prices**:
   - Method: `POST`
   - Endpoint: `/update-price`
   - Description: Updates the stock price for a given stock symbol.
   - Request Body: JSON object containing the stock symbol and the new price (e.g., `{"symbol": "AAPL", "price": 150.50}`).

#### Market News

1. **Post News**:
   - Method: `POST`
   - Endpoint: `/publish-news`,
   - Description: Publishes a new market news article.
   - Request Body: JSON object containing the title and content of the news article (e.g., `{"title": "Apple Announces New Product Line", "content": "Apple announces a new line of products..."}`).

## Contributing

Contributions to improve or extend this real-time monitoring system are welcome! Feel free to submit pull requests with new features, bug fixes, or improvements.

## Feedback

Your feedback is valuable! If you encounter any issues or have questions, please open an issue or reach out to the maintainers.
