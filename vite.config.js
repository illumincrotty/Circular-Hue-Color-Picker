import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import autoprefixer from 'autoprefixer';
import normalize from 'postcss-normalize';
import css from 'rollup-plugin-merge-and-inject-css';
import strip from '@rollup/plugin-strip';
// const path = require('path')

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
				cssCodeSplit: true,
			},
			css: {
				postcss: {
					plugins: [autoprefixer(), normalize()],
				},
				modules: {
					localsConvention: 'camelCase',
				},
			},
		};
	}
	if (mode === 'production') {
		return {
			publicDir: false,
			build: {
				lib: {
					entry: 'lib/index.ts',
					name: 'hue-color-picker',
					fileName: 'dead-simple-color-picker',
					formats: ['es', 'umd'],
				},
				outDir: 'dist',
				cleanCssOptions: {
					level: {
						1: {
							all: true,
							optimizeBackground: false,
							optimizeFont: false,
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
			},
			css: {
				postcss: {
					plugins: [autoprefixer(), normalize()],
				},
				modules: {
					localsConvention: 'camelCase',
					scopeBehaviour: 'local'
				},
			},
			plugins: [
				{ ...vanillaExtractPlugin() },
				{
					...strip({
						include: ['**/*.ts'],
						functions: ['console.debug'],
					})
				},
			],
		};
		
	}
	if (mode === 'fast') {
		return {
			publicDir: false,
			build: {
				minify: false,
				lib: {
					entry: 'lib/index.ts',
					name: 'hue-color-picker',
					fileName: 'dead-simple-color-picker',
					formats: ['es', 'umd'],
				},
				outDir: 'dist',
				cleanCssOptions: {
					level: {
						1: {
							all: true,
							optimizeBackground: false,
							optimizeFont: false,
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
			},
			css: {
				postcss: {
					plugins: [autoprefixer(), normalize()],
				},
				modules: {
					localsConvention: 'camelCase',
					scopeBehaviour: 'local'
				},
			},
			plugins: [
				{ ...vanillaExtractPlugin() },
				{
					...strip({
						include: ['**/*.ts'],
						functions: ['console.debug'],
					})
				},
			],
		};
	}
	if (mode === 'example') {
		return {
			publicDir: false,
			build: {
				lib: {
					entry: 'lib/index.ts',
					name: 'hue-color-picker',
					fileName: 'dead-simple-color-picker',
					formats: ['es'],
				},
				outDir: 'example/build',
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
				// rollupOptions: {
				// 	external: { source: 'distTest/*.css' },
				// },
			},
			css: {
				postcss: {
					plugins: [autoprefixer(), normalize()],
				},
			},
			plugins: [{ ...vanillaExtractPlugin(), enforce: 'pre' }],
		};
	}

	// return {
	// 	publicDir: false,
	// 	build: {
	// 		lib: {
	// 			entry: 'lib/index.ts',
	// 			name: 'hue-color-picker',
	// 			fileName: 'dead-simple-color-picker',
	// 			formats: ['es', 'umd'],
	// 		},
	// 		cleanCssOptions: {
	// 			level: {
	// 				1: {
	// 					all: true,
	// 					optimizeBackground: false,
	// 				},
	// 				2: {
	// 					all: true,
	// 				},
	// 			},
	// 			compatibility: {
	// 				properties: {
	// 					colors: false,
	// 					zeroUnits: false,
	// 				},
	// 			},
	// 		},
	// 		cssCodeSplit: false,
	// 		rollupOptions: {
	// 			plugins: [],
	// 		},
	// 	},
	// 	css: {
	// 		postcss: {
	// 			plugins: [autoprefixer(), normalize()],
	// 		},
	// 		modules: true,
	// 	},
	// 	plugins: [
	// 		{ ...vanillaExtractPlugin(), enforce: 'pre' },

	// 		{
	// 			...css({ id: 'color-picker', css: './dist/style.css' }),
	// 			enforce: 'pre',
	// 		},
	// 	],
	// };
};
export default config;
