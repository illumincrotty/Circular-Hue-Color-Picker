import { createVar, style } from '@vanilla-extract/css';
import type { CSSPropertiesWithVars } from '@vanilla-extract/css/dist/declarations/src/types';
import { theme } from './cpStyle.css';


const size = createVar();

export const sliderWrapper = style({
	boxSizing: 'border-box',
	width: '100%',
	flexDirection: 'column',
	gap: '.5em',
	textAlign: 'left',
	marginTop: '-.5rem'
});

const thumb: CSSPropertiesWithVars = {
	boxSizing: 'content-box',
	background: 'transparent',
	border: `solid ${theme.secondary} .15em`,
	borderRadius: '50%',
	height: [size],
	width: [size],

	transform: 'translateZ(1px)',

	boxShadow: `inset 0 0 0 .15em ${theme.text}`,
};

const track: CSSPropertiesWithVars = {
	boxSizing: 'content-box',
	width: '100%',
	display: 'inline-block',
	height: [size],
	border: `.2em solid ${theme.secondary}`,
	borderRadius: [size],
	boxShadow: '0 0 1em hsla(0,0%,0%,.3)',
};

export const sliderStyleBase = style({
	vars: {
		'--bg': 'linear-gradient(90deg, white, black)',
		'--lightness': '50%',
		'--saturation': '100%',
		'--hue': '0',
		'--hueBG': 'linear-gradient(90deg, hsl(0,var(--saturation),var(--lightness)), hsl(30,var(--saturation),var(--lightness)), hsl(60,var(--saturation),var(--lightness)), hsl(90,var(--saturation),var(--lightness)), hsl(120,var(--saturation),var(--lightness)), hsl(150,var(--saturation),var(--lightness)), hsl(180,var(--saturation),var(--lightness)), hsl(210,var(--saturation),var(--lightness)), hsl(240,var(--saturation),var(--lightness)), hsl(270,var(--saturation),var(--lightness)), hsl(300,var(--saturation),var(--lightness)), hsl(330,var(--saturation),var(--lightness)), hsl(360,var(--saturation),var(--lightness)))',
		'--satBG': 'linear-gradient(90deg,hsl(var(--hue),0%,var(--lightness)),hsl(var(--hue),100%,var(--lightness)) )',
		'--lightBG':
			'linear-gradient(90deg, hsl(var(--hue), var(--saturation), 0%), hsl(var(--hue), var(--saturation),50%),hsl(var(--hue), var(--saturation), 100%))',
		[size]: '1.5rem',
	},

	appearance: 'none',
	background: 'transparent',
	width: '100%',
	borderRadius: '.5em',
	outline: 'none',
	transition: 'opacity .2s',
	marginTop: '.5em',
	transform: 'translateZ(1px)',
	'::-moz-range-thumb': thumb,
	'::-ms-thumb': thumb,
	'::-webkit-slider-thumb': { WebkitAppearance: 'none', ...thumb, transform: 'translateY(-.1em)', },
	selectors: {
		'&::-moz-range-thumb:hover': {
			borderColor: [theme.accent]
		},
		'&::-moz-range-thumb:active': {
			borderColor: [theme.secondaryAccent]
		},
		'&::-ms-thumb:hover': {
			borderColor: [theme.accent]
		},
		'&::-ms-thumb:active': {
			borderColor: [theme.secondaryAccent]
		},
		'&::-webkit-slider-thumb:hover': {
			borderColor: [theme.accent]
		},
		'&::-webkit-slider-thumb:active': {
			borderColor: [theme.secondaryAccent]
		}
	}
});

export const hueSlider = style({
	'::-moz-range-track': { ...track, background: 'var(--hueBG)' },
	'::-ms-track': { ...track, background: 'var(--hueBG)' },
	'::-webkit-slider-runnable-track': { ...track, background: 'var(--hueBG)' },
});

export const saturationSlider = style({
	'::-moz-range-track': { ...track, background: 'var(--satBG)' },
	'::-ms-track': { ...track, background: 'var(--satBG)' },
	'::-webkit-slider-runnable-track': { ...track, background: 'var(--satBG)' },
});

export const lightnessSlider = style({
	'::-moz-range-track': { ...track, background: 'var(--lightBG)' },
	'::-ms-track': { ...track, background: 'var(--lightBG)' },
	'::-webkit-slider-runnable-track': {
		...track,
		background: 'var(--lightBG)',
	}
});
