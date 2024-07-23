import type { AxiosResponse } from 'axios';

enum State {
	CLOSED,
	OPEN,
	HALF_OPEN,
}

class CircuitBreaker {
	private failureCount: number;
	private successCount: number;
	private state: State;
	private failureThreshold: number;
	private successThreshold: number;
	private timeout: number;
	private nextAttempt: number;

	constructor(
		failureThreshold: number,
		successThreshold: number,
		timeout: number
	) {
		this.failureCount = 0;
		this.successCount = 0;
		this.state = State.CLOSED;
		this.failureThreshold = failureThreshold;
		this.successThreshold = successThreshold;
		this.timeout = timeout;
		this.nextAttempt = Date.now();
	}

	private async callService(
		request: () => Promise<AxiosResponse<any>>
	): Promise<AxiosResponse<any>> {
		try {
			const response = await request();
			this.onSuccess();
			return response;
		} catch (error) {
			this.onFailure();
			throw error;
		}
	}

	public async exec(
		request: () => Promise<AxiosResponse<any>>
	): Promise<AxiosResponse<any>> {
		if (this.state === State.OPEN) {
			if (Date.now() > this.nextAttempt) {
				this.state = State.HALF_OPEN;
			} else {
				throw new Error('Circuit breaker is open');
			}
		}

		try {
			const response = await this.callService(request);
			if (this.state === State.HALF_OPEN) {
				this.successCount++;
				if (this.successCount >= this.successThreshold) {
					this.reset();
				}
			}
			return response;
		} catch (error) {
			if (this.state === State.HALF_OPEN) {
				this.trip();
			}
			throw error;
		}
	}

	private onSuccess() {
		this.failureCount = 0;
	}

	private onFailure() {
		this.failureCount++;
		if (this.failureCount >= this.failureThreshold) {
			this.trip();
		}
	}

	private trip() {
		this.state = State.OPEN;
		this.nextAttempt = Date.now() + this.timeout;
	}

	private reset() {
		this.failureCount = 0;
		this.successCount = 0;
		this.state = State.CLOSED;
	}
}

export default CircuitBreaker;
