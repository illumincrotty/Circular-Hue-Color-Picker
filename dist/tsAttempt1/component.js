import { colorUtilities } from "./colorUtilities.js";
import sliders from "./sliders.js";
import colorWheel from "./wheel.js";
class component {
    constructor(element) {
        var _a, _b;
        this.colorHistory = [];
        this.resize = () => {
            if (this.wheel != undefined) {
                // console.log("Resize Componenet");
                this.wheel.resize();
            }
        };
        this.colorEvent = (e) => {
            if (e instanceof CustomEvent) {
                if (e.detail instanceof colorUtilities.colorDetailClass) {
                    const detailDict = e.detail;
                    // console.log(detailDict);
                    if (detailDict.final) {
                        if (typeof detailDict.change.value === "number") {
                            if (!detailDict.lock) {
                                const prevColor = this.colorHistory[this.colorHistory.length - 1];
                                const type = detailDict.change
                                    .type;
                                prevColor[type] = detailDict.change.value;
                                this.colorHistory.push(prevColor);
                            }
                        }
                        else {
                            this.colorHistory.push(detailDict.change.value);
                        }
                    }
                    if (detailDict.source !== "slider" &&
                        detailDict.source !== "lock") {
                        this.sliders.colorChange(detailDict);
                    }
                    if (detailDict.source !== "wheel") {
                        this.wheel.colorChange(detailDict);
                    }
                }
                else {
                    console.error(`${e.type} event thrown to color event without colorDetailDict from ${e.currentTarget}`);
                }
            }
            else {
                console.error(`${e.type} event thrown to color event incorrectly from ${e.currentTarget}`);
            }
        };
        // element.innerHTML = component.template;
        this.componentID = component.ComponenetCount.toString();
        component.ComponenetCount += 1;
        this.wrapper = document.createElement("div");
        this.wrapper.className = "colorPicker-Component";
        this.wrapper.id = `colorPicker-Component-${this.componentID}`;
        this.wrapper.style.setProperty("--pickerWidth", (_a = element.getAttribute("size")) !== null && _a !== void 0 ? _a : "15rem");
        this.mode = (_b = element.getAttribute("mode")) !== null && _b !== void 0 ? _b : "hsl";
        this.wrapper.addEventListener("colorPicker-colorChange", this.colorEvent.bind(this));
        const resizeObserver = new ResizeObserver(() => {
            // console.log("Size Change resizeObserver");
            this.resize;
        });
        resizeObserver.observe(this.wrapper);
        this.sliders = new sliders(this.wrapper, this.mode, this.componentID);
        this.wheel = new colorWheel(this.wrapper, this.componentID);
        window.onload = () => {
            this.resize();
        };
        element.parentElement.replaceChild(this.wrapper, element);
    }
}
component.template = `<div class="colorPickerComponent">
        <div class="colorWheel" ></div>
        <div class="ranges">
            <span>Hue<input type="range" min="0" max ="360" value = 0 class="slider" id = "hueSlider"></span>
            <span>Saturation<input type="range" min="0" max ="100" value = 50 class="slider" id = "saturationSlider"></span>
            <span>Lightness<input type="range" min="0" max ="100" value = 50 class="slider" id = "lightnessSlider"></span>
        </div>
    </div>`;
component.ComponenetCount = 0;
const colorPickers = Array.from(document.getElementsByClassName("colorPicker-replace"));
if (colorPickers.length > 0) {
    //Add color picker stylesheet if necessary
    if (!document.getElementById("colorPicker-style")) {
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "/style/tsAttempt1/pickerStyle.css");
        linkElem.id = "colorPicker-style";
        document.head.appendChild(linkElem);
    }
}
const components = colorPickers.map((e) => new component(e));
window.onresize = () => {
    for (const com of components) {
        com.resize();
    }
};
