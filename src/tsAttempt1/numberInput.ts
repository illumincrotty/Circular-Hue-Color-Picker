import { setUp, colorUtilities as cu } from "./colorUtilities.js";

class numberDisplay {
	wrapper = document.createElement("div");
	inputs!: cu.colorPicker_color<HTMLInputElement>;
	constructor(parentElement: HTMLElement) {
		setUp.addAndSetUp(parentElement, this.wrapper, "end").then(() => {
			this.wrapper;
		});
	}
}

export default numberDisplay;
