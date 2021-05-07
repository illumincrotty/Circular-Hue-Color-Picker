var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export { setUp, coordinateUtilities, colorUtilities };
var setUp;
(function (setUp) {
    // append new child node and complete setup
    setUp.addAndSetUp = (parent, child, position) => __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const observer = new ResizeObserver(() => {
                if (child.getBoundingClientRect().width != 0) {
                    observer.disconnect();
                    return resolve();
                }
            });
            observer.observe(child);
            if (position === "front") {
                if (parent.childNodes.length > 0) {
                    parent.insertBefore(child, parent.childNodes[0]);
                }
                else {
                    position = "end";
                }
            }
            if (position === "end") {
                parent.appendChild(child);
            }
        });
    });
})(setUp || (setUp = {}));
var coordinateUtilities;
(function (coordinateUtilities) {
    coordinateUtilities.cartDistanceSquare = (p1, p2) => {
        const x = p2.x - p1.x;
        const y = p2.y - p1.y;
        return Math.pow(x, 2) + Math.pow(y, 2);
    };
    coordinateUtilities.cartSubtract = (p1, p2) => {
        return {
            x: p2.x - p1.x,
            y: p2.y - p1.y,
        };
    };
    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }
    coordinateUtilities.toRadians = toRadians;
    coordinateUtilities.cartToPolar = (cartCoords) => {
        return {
            radius: Math.sqrt(Math.pow(cartCoords.x, 2) + Math.pow(cartCoords.y, 2)),
            angle: (Math.atan2(cartCoords.y, cartCoords.x) * (180 / Math.PI) +
                360) %
                360,
        };
    };
    coordinateUtilities.polarToCart = (polarCoords) => {
        const angle = toRadians(polarCoords.angle);
        return {
            x: polarCoords.radius * Math.cos(angle),
            y: polarCoords.radius * Math.sin(angle),
        };
    };
})(coordinateUtilities || (coordinateUtilities = {}));
var colorUtilities;
(function (colorUtilities) {
    //actual constant
    colorUtilities.colorSubtypeList = [
        "hue",
        "saturation",
        "lightness",
    ];
    //functions
    colorUtilities.colorToCssString = (color) => {
        return `hsl(${color.hue},${color.saturation}%,${color.lightness}%)`;
    };
    colorUtilities.colorPicker_colorToListOfChangeEvents = (color) => {
        const change = [];
        change.push({ type: "hue", value: color.hue });
        change.push({ type: "saturation", value: color.saturation });
        change.push({ type: "lightness", value: color.lightness });
        return change;
    };
    colorUtilities.createColorEvent = (source, colorChange, options) => {
        const colorDetail = new colorDetailClass(source, colorChange, options);
        return new CustomEvent("colorPicker-colorChange", {
            bubbles: true,
            cancelable: true,
            detail: colorDetail,
        });
    };
    //class
    class colorDetailClass {
        constructor(source, change, options) {
            this.final = false;
            this.reset = false;
            this.mode = "hsl";
            this.source = source;
            this.change = change;
            this.final = (options === null || options === void 0 ? void 0 : options.final) || false;
            this.reset = (options === null || options === void 0 ? void 0 : options.reset) || false;
            this.lock = options === null || options === void 0 ? void 0 : options.lock;
        }
    }
    colorUtilities.colorDetailClass = colorDetailClass;
})(colorUtilities || (colorUtilities = {}));
