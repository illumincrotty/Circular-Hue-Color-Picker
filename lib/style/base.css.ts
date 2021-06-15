import { style, globalStyle, createThemeContract, } from '@vanilla-extract/css';
import { IBMPlexMono } from './font.css';

// Base
export const theme = createThemeContract({
	primary: '',
	secondary: '',
	accent: '',
	secondaryAccent: '',
	text: '',
	width: '',
	themeLightness: '',
});

export const container = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
	alignItems: 'center',
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
	height: 'inherit',
	fontFamily: IBMPlexMono,
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
	},
});

globalStyle(`${root} *`, {
	boxSizing: 'border-box',
	fontSize: '100%',
	margin: '0',
	padding: '0',
	lineHeight: '1.15',
	// FontFamily: 'inherit',
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
