export function defaultColor() {
    return { hue: 0, saturation: 0, lightness: 50 };
}
export function colorCopy(color) {
    return {
        hue: color.hue,
        saturation: color.saturation,
        lightness: color.lightness,
    };
}
export const hslColorToCssString = (color) => {
    return `hsl(${Math.floor(color.hue)},${Math.floor(color.saturation)}%,${Math.floor(color.lightness)}%)`;
};
