export { colorUtils, positionsUtils, timingUtils, stateUtils };
var colorUtils;
(function (colorUtils) {
    // export interface colorChangeFunction {
    // 	(...any: any[]): colorChange;
    // }
    // export interface colorChangeFunctionNoArgs
    // 	extends colorChangeFunction {
    // 	(): colorChange;
    // }
    // export function colorChangeFunctionClosure(
    // 	callback: colorChangeFunction,
    // 	...args: Parameters<colorChangeFunction>
    // ): colorChangeFunctionNoArgs {
    // 	return () => {
    // 		return callback(...args);
    // 	};
    // }
    function colorCopy(color) {
        return {
            hue: color.hue,
            saturation: color.saturation,
            lightness: color.lightness,
        };
    }
    colorUtils.colorCopy = colorCopy;
    colorUtils.hslColorToCssString = (color) => {
        return `hsl(${Math.floor(color.hue)},${Math.floor(color.saturation)}%,${Math.floor(color.lightness)}%)`;
    };
})(colorUtils || (colorUtils = {}));
var positionsUtils;
(function (positionsUtils) {
    positionsUtils.cartToPolar = (pt) => {
        return {
            theta: Math.atan2(pt.y, pt.x),
            radius: Math.hypot(pt.x, pt.y),
        };
    };
    positionsUtils.polarToCart = (pt) => {
        return {
            x: pt.radius * Math.cos(pt.theta),
            y: pt.radius * Math.sin(pt.theta),
        };
    };
    function radiansToDegrees(theta) {
        return (theta * 180) / Math.PI;
    }
    positionsUtils.radiansToDegrees = radiansToDegrees;
    function degreesToRadians(theta) {
        return theta * (Math.PI / 180);
    }
    positionsUtils.degreesToRadians = degreesToRadians;
})(positionsUtils || (positionsUtils = {}));
var timingUtils;
(function (timingUtils) {
    timingUtils.throttle = (callback, timeout = 300) => {
        let ready = true;
        return (...args) => {
            // console.log('throttled inner');
            if (!ready) {
                // console.log('throttled deny');
                return;
            }
            ready = false;
            setTimeout(() => {
                ready = true;
            }, timeout);
            return callback(...args);
        };
    };
})(timingUtils || (timingUtils = {}));
var stateUtils;
(function (stateUtils) {
    class subComponents {
    }
    stateUtils.subComponents = subComponents;
})(stateUtils || (stateUtils = {}));
