import { colorUtilities } from "./colorUtilities.js";
import sliders from "./sliders.js";
import colorWheel from "./wheel.js";

class component {
	static template = `<div class="colorPickerComponent">
        <div class="colorWheel" ></div>
        <div class="ranges">
            <span>Hue<input type="range" min="0" max ="360" value = 0 class="slider" id = "hueSlider"></span>
            <span>Saturation<input type="range" min="0" max ="100" value = 50 class="slider" id = "saturationSlider"></span>
            <span>Lightness<input type="range" min="0" max ="100" value = 50 class="slider" id = "lightnessSlider"></span>
        </div>
    </div>`;

	wrapper: HTMLDivElement;
	wheel: colorWheel;
	mode: string;
	sliders: sliders;
	static ComponenetCount: number = 0;
	componentID: string;
	colorHistory: colorUtilities.colorPicker_HSLcolor[] = [];

	constructor(element: HTMLDivElement) {
		// element.innerHTML = component.template;
		this.componentID = component.ComponenetCount.toString();
		component.ComponenetCount += 1;
		this.wrapper = document.createElement("div");
		this.wrapper.className = "colorPicker-Component";
		this.wrapper.id = `colorPicker-Component-${this.componentID}`;

		this.wrapper.style.setProperty(
			"--pickerWidth",
			element.getAttribute("size") ?? "15rem"
		);
		this.mode = element.getAttribute("mode") ?? "hsl";
		this.wrapper.addEventListener(
			"colorPicker-colorChange",
			this.colorEvent.bind(this)
		);

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

		element.parentElement!.replaceChild(this.wrapper, element);
	}

	resize = () => {
		if (this.wheel != undefined) {
			// console.log("Resize Componenet");
			this.wheel.resize();
		}
	};

	colorEvent = (e: Event) => {
		if (e instanceof CustomEvent) {
			if (e.detail instanceof colorUtilities.colorDetailClass) {
				const detailDict = e.detail;
				// console.log(detailDict);
				if (detailDict.final) {
					if (typeof detailDict.change.value === "number") {
						if (!detailDict.lock) {
							const prevColor = this.colorHistory[
								this.colorHistory.length - 1
							];
							const type = detailDict.change
								.type as colorUtilities.colorSubtype;
							prevColor[type] = detailDict.change.value;
							this.colorHistory.push(prevColor);
						}
					} else {
						this.colorHistory.push(detailDict.change.value);
					}
				}

				if (
					detailDict.source !== "slider" &&
					detailDict.source !== "lock"
				) {
					this.sliders.colorChange(detailDict);
				}
				if (detailDict.source !== "wheel") {
					this.wheel.colorChange(detailDict);
				}
			} else {
				console.error(
					`${e.type} event thrown to color event without colorDetailDict from ${e.currentTarget}`
				);
			}
		} else {
			console.error(
				`${e.type} event thrown to color event incorrectly from ${e.currentTarget}`
			);
		}
	};
}

const colorPickers = Array.from(
	document.getElementsByClassName("colorPicker-replace")
);

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

const components: component[] = colorPickers.map(
	(e) => new component(e as HTMLDivElement)
);

window.onresize = () => {
	for (const com of components) {
		com.resize();
	}
};
