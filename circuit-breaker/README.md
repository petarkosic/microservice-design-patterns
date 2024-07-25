# Circuit Breaker Pattern

## Overview

The Circuit Breaker design pattern helps to prevent a network or service failure from cascading to other services and systems. It allows a service to fail gracefully by providing a fallback mechanism when a downstream service is unavailable or unresponsive. In this implementation, two services are utilized: a Client service that makes requests and a Server service that responds to them. The Client service uses the Circuit Breaker pattern to manage its requests to the Server service.

## Characteristics

1. **Fault Tolerance**: The Circuit Breaker pattern improves the fault tolerance of a system by preventing repeated requests to a failing service.
2. **Fallback Mechanism**: Provides an alternative response or action when a service is unavailable, helping to maintain system stability.
3. **State Management**: Manages different states (CLOSED, OPEN, HALF_OPEN) to control the flow of requests and retries.
4. **Configurable Thresholds**: Allows configuration of failure thresholds, success thresholds, and timeout periods to customize behavior.

## Advantages

1. **Improved Resilience**: Prevents cascading failures by isolating and handling failures at the service level.
2. **Better User Experience**: Ensures that clients receive timely responses, even if a service is down.
3. **Resource Optimization**: Reduces unnecessary load on failing services by limiting the number of retry attempts.
4. **Enhanced Monitoring**: Provides better insights into service health and failure patterns through state transitions.

## Potential Drawbacks

1. **Increased Complexity**: Adds complexity to the service logic with state management and fallback mechanisms.
2. **Latency**: May introduce latency due to retries and state transitions, especially in high-concurrency scenarios.
3. **Tuning Required**: Requires careful tuning of thresholds and timeout values to balance resilience and performance.

![Circuit Breaker Diagram](./Circuit%20Breaker.png 'Circuit Breaker')

## Services

### 1. Server Service

The Server service is a simple Express server that responds to requests at `/data`. It simulates a backend service that the Client service interacts with.

### 2. Client Service

The Client service uses the Circuit Breaker pattern to make requests to the Server service. It manages state transitions and handles failures gracefully, providing a robust interaction with the backend service.

## Communication

HTTP is used for communication between the Client and Server services. The Client service uses Axios to make HTTP requests to the Server service.

## Docker Setup

The services are containerized using Docker for seamless deployment and management. Docker Compose orchestrates the deployment of the services, ensuring consistency and ease of setup across different environments.

## Usage

To run the microservices and start the Circuit Breaker pattern:

1. Ensure Docker and Docker Compose are installed on your system.
2. Clone this repository to your local machine.
3. Navigate to the `circuit-breaker` directory.
4. Run `docker-compose up --build` to start the Docker containers in detached mode.
5. Monitor the logs to observe the Circuit Breaker pattern in action.

## Endpoints

### Server Service

1. **Get Data**:
   - Method: `GET`
   - Endpoint: `/data`
   - Description: Responds with a simple message.

## Configuration

Customize the configuration settings in the Docker Compose file (`docker-compose.yml`) and the Circuit Breaker class to suit your requirements. Adjust thresholds, timeout values, and other parameters as needed.

## Contributing

Contributions to enhance or extend the Circuit Breaker implementation are welcome! If you have suggestions, bug fixes, or additional features to propose, feel free to open an issue or submit a pull request on GitHub.

## Feedback

Your feedback is valuable! If you encounter any issues, have questions, or would like to share your experience with the Circuit Breaker pattern implementation, please open an issue or reach out to the maintainers.
