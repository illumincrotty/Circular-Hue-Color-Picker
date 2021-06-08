import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import autoprefixer from 'autoprefixer';
import normalize from 'postcss-normalize';
import css from 'rollup-plugin-merge-and-inject-css';

/**
 * @param {'serve'|'build'} command
 * @param {*} mode
 * @return {import('vite').UserConfig}
 */
const config = ({ command, mode }) => {
	if (mode === 'development') {
		return {
			plugins: [vanillaExtractPlugin()],
			build: {
				sourcemap: true,
				minify: false,
			},
			css: {
				postcss: {
					map: true,
					plugins: [autoprefixer(), normalize()],
				},
			},
		};
	}
	// if (mode === 'production') {
	// 	return {
	// 		plugins: [vanillaExtractPlugin()],
	// 		publicDir: false,
	// 		build: {
	// 			lib: {
	// 				entry: 'src/index.ts',
	// 				name: 'hue-color-picker',
	// 			},
	// 			cleanCssOptions: {
	// 				level: {
	// 					1: {
	// 						optimizeBackground: false,
	// 						normalizeUrls: true,
	// 						removeWhitespace: true,
	// 					},
	// 				},
	// 				compatibility: {
	// 					properties: {
	// 						colors: false,
	// 						zeroUnits: false,
	// 					},
	// 				},
	// 				inline: false,
	// 			},
	// 			rollupOptions: {},
	// 		},
	// 		css: {
	// 			postcss: {
	// 				plugins: [autoprefixer(), normalize()],
	// 				map: { inline: false },
	// 			},
	// 		},
	// 	};
	// }
	// if (mode === 'testbuild') {
	// 	return {
	// 		plugins: [vanillaExtractPlugin()],
	// 		publicDir: false,
	// 		build: {
	// 			minify: true,
	// 			lib: {
	// 				entry: 'src/index.ts',
	// 				name: 'hue-color-picker',
	// 			},
	// 			cleanCssOptions: {
	// 				level: {
	// 					1: {
	// 						all: true,
	// 						optimizeBackground: false,
	// 					},
	// 				},
	// 				compatibility: {
	// 					properties: {
	// 						colors: false,
	// 						zeroUnits: false,
	// 					},
	// 				},
	// 				inline: ['none'],
	// 			},
	// 			rollupOptions: {},
	// 		},
	// 		css: {
	// 			postcss: {
	// 				plugins: [autoprefixer, normalize],
	// 			},
	// 		},
	// 	};
	// }

	return {
		publicDir: false,
		build: {
			lib: {
				entry: 'lib/index.ts',
				name: 'hue-color-picker',
				fileName: 'dead-simple-color-picker',
				formats: ['es', 'umd'],
			},
			cleanCssOptions: {
				level: {
					1: {
						all: true,
						optimizeBackground: false,
					},
					2: {
						all: true,
					},
				},
				compatibility: {
					properties: {
						colors: false,
						zeroUnits: false,
					},
				},
			},
			cssCodeSplit: false,
			rollupOptions: {
				plugins: [],
			},
		},
		css: {
			postcss: {
				plugins: [autoprefixer(), normalize()],
			},
			modules: true,
		},
		plugins: [
			{ ...vanillaExtractPlugin(), enforce: 'pre' },

			{
				...css({ id: 'color-picker', css: './dist/style.css' }),
				enforce: 'pre',
			},
		],
	};
};
export default config;
