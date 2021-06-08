import { style } from '@vanilla-extract/css';
import { theme } from './cpStyle.css';

const hoverAndFocus = {
	color: [theme.accent],
	backgroundColor: [theme.secondary],
	borderColor: [theme.accent]
};
export const testingButton = style({
	width: '100%',
	color: [theme.text],
	backgroundColor: [theme.primary],
	borderColor: [theme.text],
	borderRadius: '1em',
	':hover': hoverAndFocus,
	':focus': hoverAndFocus,
	':active': { borderColor: [theme.secondaryAccent] }
});
