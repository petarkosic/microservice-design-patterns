# Saga Orchestration Pattern

The Saga Orchestration pattern is a distributed transactional pattern used in microservices architectures to manage long-running transactions that span multiple services. It ensures that either all steps of a transaction complete successfully or none of them do, maintaining data consistency across services.

## Characteristics:

1. **Distributed Transaction Management**: Saga Orchestration is used for managing distributed transactions across multiple microservices in a distributed system.
2. **Coordination**: It involves coordinating a series of steps or actions across services to ensure the overall transaction's success or failure.
3. **Compensation**: In case of failures, the pattern allows for compensating actions to revert changes made by completed steps and maintain data consistency.

## Advantages:

1. **Scalability**: Allows for scaling individual services independently without compromising the integrity of the overall transaction.
2. **Flexibility**: Enables the composition of complex business transactions by orchestrating multiple services with different functionalities.
3. **Fault Tolerance**: Supports handling failures gracefully by implementing compensating actions to revert partial changes in case of errors.
4. **Maintainability**: Facilitates the maintenance and evolution of microservices architecture by decoupling transaction logic from individual services.
5. **Separation Of Concerns**: Saga participants don't need to know about commands for other participants. Clear separation of concerns simplifies business logic.

## Drawbacks:

1. **Increased Complexity**: Implementing saga orchestration adds complexity to the system due to the need for coordinating multiple services and managing transactional state.
2. **Single Point Of Failure**: There's an additional point of failure, because the orchestrator manages the complete workflow.
3. **Performance Overhead**: Coordinating synchronous communication between services can introduce performance overhead, especially in long-running transactions.

---

In this repository, the Saga Orchestration pattern is implemented to manage the order processing flow across multiple microservices: Orders, Inventory, and Notifier. An Orchestrator service is responsible for coordinating the transactional flow and ensuring the successful completion of each step.

![Saga Orchestration Diagram](./Saga%20Orchestration.png 'Saga Orchestration')

## Services

### 1. Orchestrator

The Orchestrator service is responsible for coordinating the saga, managing the sequence of steps, and ensuring the transaction's successful outcome. It communicates with other services via RabbitMQ messaging.

### 2. Orders

The Orders service handles the creation and management of orders. It receives commands from the Orchestrator to create orders and returns order id.

### 3. Inventory

The Inventory service manages product inventory. It receives commands from the Orchestrator to check if the order item is in stock and returns either success or failure response.

### 4. Notifier

The Notifier service is responsible for sending notifications when the order is placed. It receives commands from the Orchestrator to send notifications to customers.

## Communication

The Orchestrator service communicates with other services via RabbitMQ, using remote procedure calls (RPC) for synchronous communication. When initiating a transaction, it sends RPC requests to other services, waiting for their responses before proceeding to the next step in the saga.

## Docker Setup

All services are containerized using Docker for easy development and management. Docker Compose is used to manage the multi-container application.

#### Routes

- `POST /create-order`: Initiates the order creation process. Expects the order details in the request body. Upon receiving an order creation request, the Orchestrator service begins the saga orchestration process by sending RPC requests to other services to fulfill the order.

## Usage

To run the microservices and start the saga orchestration process:

1. Install Docker and Docker Compose if not already installed.
2. Clone this repository.
3. Navigate to the repository directory and to `/saga/orchestration`.
4. Run `docker compose up` to start all services.
5. Make a POST request to http://localhost:3000/create-order with an order JSON in the request body.
6. The Orchestrator service will begin orchestrating the order processing flow, interacting with other services via RabbitMQ.

## Contributing

Contributions to improve or extend the Saga Orchestration implementation are welcome! If you have suggestions, improvements, or additional features to add, please feel free to submit a pull request.

## Feedback

Your feedback is valuable! If you encounter any issues, have questions, or would like to share your experience with the Saga Orchestration implementation, please open an issue or reach out to the maintainers.
