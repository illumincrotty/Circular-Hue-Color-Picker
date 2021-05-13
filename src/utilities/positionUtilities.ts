export type angle = number;

export type polarPt = { theta: angle; radius: number };
export type cartPt = { x: number; y: number };
export type pt = polarPt | cartPt;

export const cartToPolar = (pt: cartPt): polarPt => {
	return {
		theta: Math.atan2(pt.y, pt.x),
		radius: Math.hypot(pt.x, pt.y),
	};
};
export const polarToCart = (pt: polarPt): cartPt => {
	return {
		x: pt.radius * Math.cos(pt.theta),
		y: pt.radius * Math.sin(pt.theta),
	};
};
export function radiansToDegrees(theta: angle): angle {
	return (theta * 180) / Math.PI;
}
export function degreesToRadians(theta: angle): angle {
	return theta * (Math.PI / 180);
}
