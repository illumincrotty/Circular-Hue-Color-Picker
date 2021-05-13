export const debounce = (callback, wait) => {
    let timeout = -1;
    return (...args) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            callback(...args);
        }, wait);
    };
};
export const throttle = (callback, wait) => {
    let first = true;
    let calledBeforeThrottleTimerOver = false;
    let recentArgs;
    const call = () => {
        callback(...recentArgs);
    };
    const delayedCall = () => {
        setTimeout(() => {
            call();
            if (calledBeforeThrottleTimerOver) {
                calledBeforeThrottleTimerOver = false;
                delayedCall();
            }
            else {
                first = true;
            }
        }, wait);
    };
    return (...args) => {
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
