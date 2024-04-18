# Command Query Responsibility Segregation (CQRS) Pattern

## Overview

The Command Query Responsibility Segregation (CQRS) design pattern separates the responsibility of handling write operations (commands) from read operations (queries), enabling better scalability, performance, and flexibility in distributed systems. In this implementation, two services are utilized: a Command service responsible for handling commands and a Query service responsible for handling queries. Each service operates with its dedicated database, allowing for independent scaling and optimization.

## Characteristics

1. **Separation of Concerns**: CQRS divides the application logic into separate components for handling commands and queries, ensuring clear separation of concerns.
2. **Read and Write Optimizations**: Commands and queries often have different optimization requirements. CQRS allows each operation type to be optimized independently, leading to better performance and scalability.
3. **Asynchronous Communication**: CQRS typically involves asynchronous communication between the command and query components, enabling greater resilience and responsiveness in distributed systems.
4. **Event Sourcing (Optional)**: While not strictly a requirement, CQRS is often used in conjunction with event sourcing, where changes to the application state are captured as a sequence of events. This enables auditability, temporal queries, and replayability of system state.

## Advantages

1. **Performance Optimization**: CQRS enables tailored optimization of read and write operations, resulting in improved performance and responsiveness of the system.
2. **Scalability**: Independent scaling of read and write components allows for better utilization of resources and scalability in response to changing demands.
3. **Flexibility and Maintainability**: Separation of concerns simplifies the architecture, making it easier to understand, maintain, and evolve over time.
4. **Enhanced Auditability**: By capturing all changes as events (when used with event sourcing), CQRS provides a comprehensive audit trail of system state transitions, enabling better traceability and accountability.

## Potential Drawbacks

1. **Increased Complexity**: Implementing CQRS introduces additional complexity to the system architecture, including managing separate data models, communication channels, and synchronization between components.
2. **Consistency Challenges**: Maintaining consistency between read and write models can be challenging, especially in systems with high concurrency or eventual consistency requirements. Careful design and implementation are needed to ensure data integrity.
3. **Learning Curve**: Adopting CQRS requires a shift in mindset and familiarity with the principles of distributed systems architecture. Teams may need to invest time in understanding the concepts associated with CQRS.

![CQRS Diagram](./CQRS.png 'CQRS')

## Services

### 1. Command Service

The Command service is responsible for processing commands, which typically involve creating, updating, or deleting data. It interacts with the command-specific database (`command-db`) to execute write operations.

### 2. Query Service

The Query service handles read operations, providing data retrieval functionalities without modifying the underlying data. It communicates with the query-specific database (`query-db`) to serve query requests efficiently.

## Communication

RabbitMQ is employed as the messaging broker for inter-service communication. It facilitates asynchronous communication between the Command and Query services, ensuring reliable message delivery and decoupling between components.

## Docker Setup

The services are containerized using Docker for seamless deployment and management. Docker Compose orchestrates the deployment of the services along with their dependencies, ensuring consistency and ease of setup across different environments.

## Usage

To run the microservices and start the CQRS:

1. Ensure Docker and Docker Compose are installed on your system.
2. Clone this repository to your local machine.
3. Navigate to the repository directory.
4. Run `docker-compose up -d` to start the Docker containers in detached mode.
5. Access the services through their respective endpoints:
   - Command Service: `http://localhost:3000`
   - Query Service: `http://localhost:3001`

## Endpoints

#### Command service

1. **Create a User**:
   - Method: `POST`
   - Endpoint: `/users`
   - Description: Creates a new user with the provided details.
   - Request Body: JSON object containing user details (`first_name`, `last_name`, `email`)
2. **Update a User**:
   - Method: `PUT`
   - Endpoint: `/users/:id`
   - Description: Updates an existing user with the provided details.
   - Parameters: User ID (`id`)
   - Request Body: JSON object containing updated user details (`first_name`, `last_name`, `email`)
3. **Delete a User**:
   - Method: `DELETE`
   - Endpoint: `/users/:id`
   - Description: Deletes the user with the specified ID.
   - Parameters: User ID (`id`)

#### Query service

1. **Get All Users**:
   - Method: `GET`
   - Endpoint: `/users`
   - Description: Retrieves a list of all users.
2. **Get a Specific User**:
   - Method: `GET`
   - Endpoint: `/users/:id`
   - Description: Retrieves the user with the specified ID.
   - Parameters: User ID (`id`)

## Configuration

Customize the configuration settings in the Docker Compose file (`docker-compose.yml`) to suit your requirements. Adjust database connections, RabbitMQ settings, or any other parameters as needed.

## Contributing

Contributions to enhance or extend the CQRS implementation are welcome! If you have suggestions, bug fixes, or additional features to propose, feel free to open an issue or submit a pull request on GitHub.

## Feedback

Your feedback is valuable! If you encounter any issues, have questions, or would like to share your experience with the CQRS pattern implementation, please open an issue or reach out to the maintainers.
