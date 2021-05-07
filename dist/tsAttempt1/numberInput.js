import { setUp } from "./colorUtilities.js";
class numberDisplay {
    constructor(parentElement) {
        this.wrapper = document.createElement("div");
        setUp.addAndSetUp(parentElement, this.wrapper, "end").then(() => {
            this.wrapper;
        });
    }
}
export default numberDisplay;
