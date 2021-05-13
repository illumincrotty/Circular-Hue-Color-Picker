import { colorPickerComponent } from './component.js';
const colorPicker = document.getElementById('colorPicker-app');

if (colorPicker) {
	const component = new colorPickerComponent(colorPicker);
	component.resize();
}
