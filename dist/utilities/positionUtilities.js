export const cartToPolar = (pt) => {
    return {
        theta: Math.atan2(pt.y, pt.x),
        radius: Math.hypot(pt.x, pt.y),
    };
};
export const polarToCart = (pt) => {
    return {
        x: pt.radius * Math.cos(pt.theta),
        y: pt.radius * Math.sin(pt.theta),
    };
};
export function radiansToDegrees(theta) {
    return (theta * 180) / Math.PI;
}
export function degreesToRadians(theta) {
    return theta * (Math.PI / 180);
}
