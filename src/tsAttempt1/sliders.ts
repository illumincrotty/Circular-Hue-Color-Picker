import { colorUtilities as cu } from "./colorUtilities.js";

class sliders {
	wrapper: HTMLElement;
	ranges!: cu.colorPicker_color<HTMLInputElement>;
	id;

	constructor(parent: HTMLElement, mode: string, id: string) {
		this.id = id;
		this.wrapper = document.createElement("div");
		this.wrapper.className = "colorPicker-ranges";
		parent.appendChild(this.wrapper);

		switch (mode.toLowerCase()) {
			case "hsl":
				this.hslSetUp();
				break;
			case "rgb":
				console.error("Slider set to rgb, RGB is not implemented");
				break;
			default:
				console.warn("Mode Improperly Set, Deaulting to HSL");
				this.hslSetUp();
		}
	}
	hslSetUp = () => {
		type base = [
			number,
			number,
			cu.colorSubtype,
			number[]?,
			number?,
			number?
		];
		const defaults: base[] = [
			[
				0,
				360,
				"hue",
				[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360],
			],
			[100, 100, "saturation"],
			[50, 100, "lightness"],
		];
		this.ranges = {
			hue: this._createSlider(
				this.id,
				defaults[0][0],
				defaults[0][1],
				defaults[0][2],
				defaults[0][3]
			),
			saturation: this._createSlider(
				this.id,
				defaults[1][0],
				defaults[1][1],
				defaults[1][2]
			),
			lightness: this._createSlider(
				this.id,
				defaults[2][0],
				defaults[2][1],
				defaults[2][2]
			),
		};
	};

	_createSlider = (
		parentId: string,
		defaultSliderValue: number,
		max: number,
		label: cu.colorSubtype,
		suggestedVals?: number[],
		min?: number,
		step?: number
	): HTMLInputElement => {
		// const sliderRangeWrap = document.createElement("div");
		// sliderRangeWrap.className = "colorPicker-slider-" + label;

		const rangeWrap = document.createElement("div");
		rangeWrap.style.width = "100%";
		this.wrapper.appendChild(rangeWrap);

		const LabelAndButtonWrapper = document.createElement("div");
		LabelAndButtonWrapper.style.display = "flex";
		LabelAndButtonWrapper.style.width = "100%";
		LabelAndButtonWrapper.style.justifyContent = "space-between";
		LabelAndButtonWrapper.style.alignItems = "center";
		rangeWrap.appendChild(LabelAndButtonWrapper);

		const labelElement = document.createElement("label");
		labelElement.appendChild(document.createTextNode(label));
		labelElement.id = `colorPicker-slider-${parentId}-${label}`;
		labelElement.style.marginRight = "auto";
		LabelAndButtonWrapper.appendChild(labelElement);
		LabelAndButtonWrapper.style.marginBottom =
			"calc(var(--pickerWidth) * 0.02)";

		const input = document.createElement("input");
		input.classList.add("colorPicker-range-input", label);
		input.setAttribute("type", "range");
		input.style.display = "block";
		input.setAttribute("for", `colorPicker-slider-${parentId}-${label}`);
		input.style.width = "100%";
		if (min != undefined) {
			input.setAttribute("min", `${min}`);
		}
		input.setAttribute("max", `${max}`);
		if (step != undefined) {
			input.setAttribute("step", `${step}`);
		}
		if (defaultSliderValue != undefined) {
			input.setAttribute("value", `${defaultSliderValue}`);
		}
		rangeWrap.appendChild(input);

		//Set options list
		if (suggestedVals && suggestedVals.length > 0) {
			const options = document.createElement("datalist");
			options.id = `colorPicker-slider-DataList-${parentId}-${label}`;
			input.setAttribute(
				"list",
				`colorPicker-slider-DataList-${parentId}-${label}`
			);
			for (const option of suggestedVals) {
				const optionElement = document.createElement("option");
				optionElement.setAttribute("value", option.toString());
				options.appendChild(optionElement);
			}
			rangeWrap.appendChild(options);
		}

		const openLockSvg =
			'<svg xmlns="http://www.w3.org/2000/svg" class = "colorPicker-button colorPicker-slider-button" width="24" height="24" viewBox="0 0 24 24" style="fill:var(--colorPicker-text-color);transform:scaleX(-1);-ms-filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)"><path d="M12,4c1.654,0,3,1.346,3,3h2c0-2.757-2.243-5-5-5S7,4.243,7,7v2H6c-1.103,0-2,0.897-2,2v9c0,1.103,0.897,2,2,2h12 c1.103,0,2-0.897,2-2v-9c0-1.103-0.897-2-2-2H9V7C9,5.346,10.346,4,12,4z M18.002,20H13v-2.278c0.595-0.347,1-0.985,1-1.722 c0-1.103-0.897-2-2-2s-2,0.897-2,2c0,0.736,0.405,1.375,1,1.722V20H6v-9h12L18.002,20z"></path></svg>';
		LabelAndButtonWrapper.insertAdjacentHTML("beforeend", openLockSvg);
		const openLockSVGElement = LabelAndButtonWrapper.lastChild as SVGAElement;
		// openLockSVGElement.style.marginLeft = "auto";

		const closedLockSvg =
			'<svg xmlns="http://www.w3.org/2000/svg" class = "colorPicker-button-inverse colorPicker-slider-button" width="24" height="24" viewBox="0 0 24 24" style="fill:var(--colorPicker-text-color);transform:scaleX(-1);-ms-filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)"><path d="M12,2C9.243,2,7,4.243,7,7v2H6c-1.103,0-2,0.897-2,2v9c0,1.103,0.897,2,2,2h12c1.103,0,2-0.897,2-2v-9c0-1.103-0.897-2-2-2 h-1V7C17,4.243,14.757,2,12,2z M9,7c0-1.654,1.346-3,3-3s3,1.346,3,3v2H9V7z M18.002,20H13v-2.278c0.595-0.347,1-0.985,1-1.722 c0-1.103-0.897-2-2-2s-2,0.897-2,2c0,0.736,0.405,1.375,1,1.722V20H6v-9h12L18.002,20z"></path></svg>';
		LabelAndButtonWrapper.insertAdjacentHTML("beforeend", closedLockSvg);
		const closedlockSVGElement = LabelAndButtonWrapper.lastChild as SVGAElement;
		closedlockSVGElement.style.display = "none";

		openLockSVGElement.addEventListener("click", (event) => {
			openLockSVGElement.style.display = "none";
			closedlockSVGElement.style.display = "inline-block";
			input.disabled = true;
			console.log(`Locking ${label}`);
			rangeWrap.dispatchEvent(
				cu.createColorEvent(
					"lock",
					{
						type: label,
						value: parseInt(
							(event.currentTarget as HTMLInputElement).value
						),
					},
					{ lock: true }
				)
			);
		});

		closedlockSVGElement.addEventListener("click", (event) => {
			closedlockSVGElement.style.display = "none";
			openLockSVGElement.style.display = "inline-block";
			input.disabled = false;
			console.log(`Unlocking ${label}`);
			rangeWrap.dispatchEvent(
				cu.createColorEvent(
					"lock",
					{
						type: label,
						value: parseInt(
							(event.currentTarget as HTMLInputElement).value
						),
					},
					{ lock: false }
				)
			);
		});

		const resetSvg =
			'<svg xmlns="http://www.w3.org/2000/svg" class = "colorPicker-button colorPicker-slider-button" width="24" height="24" viewBox="0 0 24 24" style="fill:var(--colorPicker-text-color);transform:;-ms-filter:"><path d="M12,16c1.671,0,3-1.331,3-3s-1.329-3-3-3s-3,1.331-3,3S10.329,16,12,16z"></path><path d="M20.817,11.186c-0.12-0.583-0.297-1.151-0.525-1.688c-0.225-0.532-0.504-1.046-0.83-1.531 c-0.324-0.479-0.693-0.926-1.098-1.329c-0.404-0.406-0.853-0.776-1.332-1.101c-0.483-0.326-0.998-0.604-1.528-0.829 c-0.538-0.229-1.106-0.405-1.691-0.526c-0.6-0.123-1.219-0.182-1.838-0.18V2L8,5l3.975,3V6.002C12.459,6,12.943,6.046,13.41,6.142 c0.454,0.094,0.896,0.231,1.314,0.409c0.413,0.174,0.813,0.392,1.188,0.644c0.373,0.252,0.722,0.54,1.038,0.857 c0.315,0.314,0.604,0.663,0.854,1.035c0.254,0.376,0.471,0.776,0.646,1.191c0.178,0.417,0.314,0.859,0.408,1.311 C18.952,12.048,19,12.523,19,13s-0.048,0.952-0.142,1.41c-0.094,0.454-0.23,0.896-0.408,1.315 c-0.175,0.413-0.392,0.813-0.644,1.188c-0.253,0.373-0.542,0.722-0.858,1.039c-0.315,0.316-0.663,0.603-1.036,0.854 c-0.372,0.251-0.771,0.468-1.189,0.645c-0.417,0.177-0.858,0.314-1.311,0.408c-0.92,0.188-1.906,0.188-2.822,0 c-0.454-0.094-0.896-0.231-1.314-0.409c-0.416-0.176-0.815-0.393-1.189-0.645c-0.371-0.25-0.719-0.538-1.035-0.854 c-0.315-0.316-0.604-0.665-0.855-1.036c-0.254-0.376-0.471-0.776-0.646-1.19c-0.178-0.418-0.314-0.86-0.408-1.312 C5.048,13.952,5,13.477,5,13H3c0,0.611,0.062,1.221,0.183,1.814c0.12,0.582,0.297,1.15,0.525,1.689 c0.225,0.532,0.504,1.046,0.831,1.531c0.323,0.477,0.692,0.924,1.097,1.329c0.406,0.407,0.854,0.777,1.331,1.099 c0.479,0.325,0.994,0.604,1.529,0.83c0.538,0.229,1.106,0.405,1.691,0.526C10.779,21.938,11.389,22,12,22s1.221-0.062,1.814-0.183 c0.583-0.121,1.151-0.297,1.688-0.525c0.537-0.227,1.052-0.506,1.53-0.83c0.478-0.322,0.926-0.692,1.331-1.099 c0.405-0.405,0.774-0.853,1.1-1.332c0.325-0.483,0.604-0.998,0.829-1.528c0.229-0.54,0.405-1.108,0.525-1.692 C20.938,14.221,21,13.611,21,13S20.938,11.779,20.817,11.186z"></path></svg>';
		LabelAndButtonWrapper.insertAdjacentHTML("beforeend", resetSvg);
		const resetSVGElement = LabelAndButtonWrapper.lastChild as SVGAElement;

		resetSVGElement.addEventListener("click", () => {
			rangeWrap.dispatchEvent(
				cu.createColorEvent(
					"reset",
					{
						type: label,
						value: defaultSliderValue,
					},
					{ reset: true }
				)
			);
		});

		input.addEventListener("input", (event) => {
			rangeWrap.dispatchEvent(
				cu.createColorEvent("slider", {
					type: label,
					value: parseInt(
						(event.currentTarget as HTMLInputElement).value
					),
				})
			);
		});

		return input;
	};

	colorChange(changeEvent: cu.colorDetailClass) {
		if (changeEvent.change.type !== "hsl") {
			this.colorChangeSubtype(changeEvent.source, changeEvent.change);
		} else {
			const source = changeEvent.source;

			cu.colorPicker_colorToListOfChangeEvents(
				changeEvent.change.value
			).forEach((element) => {
				this.colorChangeSubtype(source, element);
			});
		}
	}

	colorChangeSubtype = (
		source: cu.colorEventSource,
		change: cu.colorSubtypeChange
	) => {
		const { type, value } = change;
		if (type === "hue") {
			this.ranges.hue.value = value.toString();
		}
		if (type === "saturation") {
			this.ranges.saturation.value = value.toString();
		}
		if (type === "lightness") {
			/*
					Do not update slider lightness from the wheel! it is not tied to the handle, but to the color wheel with complications.
					Saturation is fine because there are no complications, it updates freely
			*/
			if (source !== "wheel") {
				this.ranges.lightness.value = value.toString();
			}
		}
	};
}

export default sliders;
