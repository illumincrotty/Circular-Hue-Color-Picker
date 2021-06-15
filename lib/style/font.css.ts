import { fontFace, style } from '@vanilla-extract/css';


export const IBMPlexMono = fontFace({
	src: 'url(https://fonts.gstatic.com/s/ibmplexsans/v8/zYXgKVElMYYaJe8bpLHnCwDKhdHeFQ.woff2) format(\'woff2\')',
	fontDisplay: 'swap',
	fontWeight: 'normal',
	fontStyle: 'normal',
	unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
});

export const fontImport = style({
	fontFamily: IBMPlexMono
});
