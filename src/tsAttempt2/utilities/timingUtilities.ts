export const debounce = <
	fn extends (...args: never[]) => never | void
>(
	callback: fn,
	wait: number
): ((...args: Parameters<fn>) => void) => {
	let timeout = -1;

	return (...args: Parameters<fn>) => {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			callback(...args);
		}, wait);
	};
};

export const throttle = <
	fn extends (...args: never[]) => never | void
>(
	callback: fn,
	wait: number
): ((...args: Parameters<fn>) => void) => {
	let first = true;
	let calledBeforeThrottleTimerOver = false;
	let recentArgs: Parameters<fn>;

	const call = () => {
		callback(...recentArgs);
	};

	const delayedCall = () => {
		setTimeout(() => {
			call();
			if (calledBeforeThrottleTimerOver) {
				calledBeforeThrottleTimerOver = false;
				delayedCall();
			} else {
				first = true;
			}
		}, wait);
	};

	return (...args: Parameters<fn>) => {
		recentArgs = args;
		if (first) {
			first = false;
			call();
			delayedCall();
			return;
		}
		if (!calledBeforeThrottleTimerOver) {
			calledBeforeThrottleTimerOver = true;
		}
	};
};
