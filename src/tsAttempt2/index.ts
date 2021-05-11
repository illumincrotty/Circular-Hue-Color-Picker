import { colorPickerComponent } from './component.js';
const colorPicker = document.getElementById('colorPicker-app');

if (colorPicker) {
	const linkElem = document.createElement('link');
	linkElem.setAttribute('rel', 'stylesheet');
	linkElem.setAttribute(
		'href',
		'../../style/tsAttempt2/colorPickerStyle.css'
	);
	linkElem.id = 'colorPicker-style';
	document.head.appendChild(linkElem);
	const component = new colorPickerComponent(colorPicker);
	component.resize();
}
