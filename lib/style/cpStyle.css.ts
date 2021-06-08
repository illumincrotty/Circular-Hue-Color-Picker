import { createThemeContract, createVar, fontFace, globalStyle, style } from '@vanilla-extract/css';

// Base
export const theme = createThemeContract({
	primary: null,
	secondary: null,
	accent: null,
	secondaryAccent: null,
	text: null,
	width: null,
	themeLightness: null,
});

const IBMPlexMono = fontFace({
	src: 'url(https://fonts.gstatic.com/s/ibmplexsans/v8/zYXgKVElMYYaJe8bpLHnCwDKhdHeFQ.woff2) format(\'woff2\')',
	fontDisplay: 'swap',
	fontWeight: 'normal',
	fontStyle: 'normal',
	unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
});

globalStyle('color-picker *', {
	boxSizing: 'border-box',
	fontSize: '100%',
	margin: '0',
	padding: '0',
	lineHeight: '1.15'
});

export const container = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
	alignItems: 'center',
});

export const colorCircleBase = style({
	boxSizing: 'border-box',
	vars: {
		'--circle-color': 'hsl(0, 0%, 50%)'
	},

	transform: 'translateZ(1px)',

	borderRadius: '50%',
	border: 'none',

	background: 'transparent',
	boxShadow: '0rem 0rem 1rem hsla(0, 0%, 0%, 0.3)',

	cursor: 'pointer'
});

const disabled = {
	cursor: 'default',
	fill: [theme.secondary],
	background: 'hsla(0,0%,0%,0)! important'
};

export const svgButtonWrapper = style({
	border: 'none',

	background: 'transparent',
	fill: [theme.accent],

	':active': { fill: [theme.secondary] },
	':disabled': disabled,
	'@media': {
		'(hover: hover) and (pointer: fine)': {
			':hover': {
				fill: [theme.secondaryAccent],
			},
			':disabled': disabled
		}
	},
});

export const svgButton = style({
	fill: 'inherit',
	position: 'absolute',
	transform: 'translate(-50%,-50%)',
	width: 'inherit'
});

export const root = style({
	vars: {
		[theme.primary]: 'hsl(270, 1%, 13%)',
		[theme.secondary]: 'hsl(270, 7%, 24%)',
		[theme.accent]: 'hsl(337, 71%, 60%)',
		[theme.secondaryAccent]: 'hsl(46, 75%, 55%)',
		[theme.text]: 'hsl(53, 20%, 80%)',
		[theme.width]: '15rem',
		[theme.themeLightness]: '0',
	},
	boxSizing: 'border-box',
	'@media': {
		'(prefers-color-scheme:light)': {
			vars: {
				[theme.primary]: 'hsl(256, 14%, 85%)',
				[theme.secondary]: 'hsl(253, 5%, 66%)',
				[theme.accent]: 'hsl(176, 44%, 50%)',
				[theme.secondaryAccent]: 'hsl(337, 71%, 60%)',
				[theme.text]: 'hsl(242, 94%, 7%)',
				[theme.width]: '15rem',
				[theme.themeLightness]: '100',
			},
		},
	}
});


// Open Button

export const launchButton = style({
	position: 'relative',
	transform: 'translateZ(1px)',

	width: '100%',
	height: '100%',

	borderRadius: '25%',
	border: '.2rem solid hsla(0, 0%, 20%, 1)',

	boxShadow: '0 0 0 hsla(0, 0%, 0%, 0.3)',
	background: `radial-gradient(
        circle closest-side,
        hsla(0, 0%, 50%, 1),
        hsla(0, 0%, 50%, 0)
    ),
    conic-gradient(
        hsl(0, 100%, 50%),
        hsl(30, 100%, 50%),
        hsl(60, 100%, 50%),
        hsl(90, 100%, 50%),
        hsl(120, 100%, 50%),
        hsl(150, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(210, 100%, 50%),
        hsl(240, 100%, 50%),
        hsl(270, 100%, 50%),
        hsl(300, 100%, 50%),
        hsl(330, 100%, 50%),
        hsl(360, 100%, 50%)
    )`,

	'@media': {
		'(hover: hover) and (pointer: fine)': {
			':hover': {
				borderColor: 'white'
			}
		}

	}
});


// Component
export const componentStyle = style({
	position: 'absolute',
	left: '50%',
	transform: 'translate(-50%, -50%)',

	width: 'min-content',
	padding: '1rem',

	borderRadius: `calc(${theme.width}*0.1)`,

	color: [theme.text],
	backgroundColor: [theme.primary],
	boxShadow: `0rem 0rem 1.5rem -0.5rem hsl(270, 1%, 13%),
        inset 0 0 calc(${theme.width} / 10)
        calc(${theme.width} / 100)
        hsla(0, 0%, calc(${theme.themeLightness} * 1%), 0.1);`,

	fontFamily: IBMPlexMono,

	visibility: 'hidden',
	opacity: 0,
	transition: 'visibility 300ms, opacity 300ms',

	gap: `calc(${theme.width}/30)`

});

export const appear = style({
	visibility: 'unset',
	opacity: 1,
});

// Wheel
export const wheelLightness = createVar();

const bg = `radial-gradient(
	circle closest-side,
	hsla(0, 0%, ${wheelLightness}, 100%),
	hsla(0, 0%, 50%, 0%)
), 
conic-gradient(
	hsl(0, 100%, ${wheelLightness}),
	hsl(30, 100%, ${wheelLightness}),
	hsl(60, 100%, ${wheelLightness}),
	hsl(90, 100%, ${wheelLightness}),
	hsl(120, 100%, ${wheelLightness}),
	hsl(150, 100%, ${wheelLightness}),
	hsl(180, 100%, ${wheelLightness}),
	hsl(210, 100%, ${wheelLightness}),
	hsl(240, 100%, ${wheelLightness}),
	hsl(270, 100%, ${wheelLightness}),
	hsl(300, 100%, ${wheelLightness}),
	hsl(330, 100%, ${wheelLightness}),
	hsl(360, 100%, ${wheelLightness})
)`;
export const colorWheelstyle = style({

	vars: {
	    [wheelLightness]: '50%',
	},

	position: 'relative',
	transform: 'translateZ(1px)',

	width: `calc(${theme.width}*.9)`,
	height: `calc(${theme.width}*.9)`,

	borderRadius: '50%',
	border: `calc(${theme.width}* .9 * 0.05) solid ${theme.secondary}`,

	boxShadow: '0rem 0rem 1rem hsla(0, 0%, 0%, 0.3)',
	background: bg,

	filter: 'brightness(100%)',

	cursor: 'pointer',

});

export const handleStyle = style({
	vars: {
		'--handleXOffset': '0',
		'--handleYOffset': '0',
		'--scaleFactor': '1',
		'--borderColor': theme.secondary,
		'--colorPickerHandleSize': `calc(${theme.width}*.9 * 0.15)`,
	},

	position: 'absolute',
	top: '50%',
	left: '50%',
	transformOrigin: 'center',
	transform: `translate(
		calc(var(--handleXOffset) * 1px + -50%),
		calc(var(--handleYOffset) * 1px + -50%)
	) scale(var(--scaleFactor))`,

	width: 'var(--colorPickerHandleSize)',
	height: 'var(--colorPickerHandleSize)',

	borderRadius: '50%',
	border: 'calc(var(--colorPickerHandleSize) * 0.1) solid var(--borderColor)',

	background: 'var(--selectedColor)',
	boxShadow: '0rem 0rem 0.15rem hsla(0, 0%, 0%, 0.3)',

	cursor: 'grab',

	':active': {
		cursor: 'grabbing'
	}
});

export const wheelButton = style({
	position: 'absolute',
	width: `calc(${theme.width} * 0.1)`,
	height: `calc(${theme.width} * 0.1)`,
	bottom: 0,
	transform: 'translate(25%, 25%)'
});

// Color Circles

export const circleSize = createVar();

export const colorCircleDynamicStyle = style({

	vars: {
		'--circle-color': 'hsl(0, 0%,50%)',
		[circleSize]: `calc(${theme.width}*.15)`
	},

	width: [circleSize],
	height: [circleSize],

	backgroundColor: 'var(--circle-color)',
	border: `calc(${circleSize} * 0.1) solid ${theme.secondary}`,


	'@media': {
		'(hover: hover) and (pointer: fine)': {
			':hover': {
				fill: [theme.accent],
			}
		}
	},

	':focus-visible': {
		outline: `.4rem solid ${theme.accent}`,
	},
	':focus': {
		borderColor: [theme.accent]
	}
});

// Range Input

export const range = style({
	color: 'inherit',
	width: '100%',
	outline: [theme.accent]
});

export const slider = style({
	cursor: 'pointer',
	outline: [theme.accent]
});


// Text Input

export const textWrap = style({
	textAlign: 'center',
	width: '100%'
});

const numInputActiveAndFocusedStyle = {
	outline: `2px solid ${theme.secondaryAccent}`,
	backgroundColor: [theme.secondary]
};

export const numInput = style({

	display: 'inline-block',

	width: `calc(${theme.width}/7.5)`,

	border: 'none',

	backgroundColor: 'transparent',

	textAlign: 'right',
	color: [theme.text],
	cursor: 'text',
	fontSize: '93%',

	':hover': {
		outline: `1px solid ${theme.accent}`,
		backgroundColor: [theme.secondary],
	},
	':active': numInputActiveAndFocusedStyle,
	':focus': numInputActiveAndFocusedStyle,
});

export const copyButton = 	style({
	width: '1rem',
	height: '1rem',
	marginLeft: '1ch',

	cursor: 'copy',
	verticalAlign: 'middle',
});
