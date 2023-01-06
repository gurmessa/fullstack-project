/** To switch to using webpack after using parcel:
 * 1. We need webpack tools globally installed:
 * npm install --global webpack@4.43.0 webpack-cli@3.3.12
 *
 * 2. There are a bunch of additional packages that need to be installed locally
 * npm install
 */

// const AntdScssThemePlugin = require('antd-scss-theme-plugin')

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// In production, we extract CSS into separate bundle
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const jsxLoader = [
	{
		loader: 'babel-loader',
		options: {
			presets: [
				[
					'@babel/env',
					{
						modules: false,
						useBuiltIns: 'usage',
					},
				],
				// "react"
				'@babel/preset-react',
				'@babel/preset-typescript',
			],
			plugins: [
				'@babel/proposal-class-properties',
				'add-module-exports',
				'react-hot-loader/babel',
				// "@babel/polyfill"
			],
		},
	},
]
const isProduction = process.env.NODE_ENV === 'production'
if (!isProduction) {
	jsxLoader.push('source-map-loader')
}

module.exports = {
	context: path.resolve(__dirname),
	mode: isProduction ? 'production' : 'development',
	entry: {
		platform: './apps/platform/App.tsx',
		login: './apps/login/App.tsx',
	},
	// Necessary for absolute import paths within modules
	resolve: {
		extensions: ['.ts', '.tsx', '.js', 'scss', '.css'],
		modules: [path.resolve(), 'node_modules'],
		alias: {
			components: path.resolve(__dirname, 'components'),
			// 'react-dom': '@hot-loader/react-dom',
		},
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		libraryTarget: 'umd',
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				loader: 'css-loader',
			},
			// For images
			// {
			// 	test: /\.(png|svg|jpg|jpeg|gif)$/i,
			// 	type: 'asset/resource',
			// },
			// For including css/sass modules (in components dir)
			{
				test: /\.(sa|sc|c)ss$/,
				include: [path.resolve(__dirname, 'components'), path.resolve(__dirname, 'apps')],
				use: [
					{
						loader: 'style-loader',
						options: {
							// sourceMap: process.env.NODE_ENV !== 'production',
						},
					},
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[local]_[hash:base64:5]',
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							additionalData: '@import "style/common/variables";',
						},
					},
				],
			},

			// For including all other sass NOT as modules
			{
				test: /\.(sa|sc|c)ss$/,
				exclude: [path.resolve(__dirname, 'components'), path.resolve(__dirname, 'apps')],
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: false,
						},
					},
					{
						loader: 'sass-loader',
					},
					// AntdScssThemePlugin.themify({
					//   loader: 'sass-loader',
					//   options: {
					//     additionalData: '@import "style/common/partials";',
					//   },
					// }),
				],
			},

			// For ant.d
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					// {
					//   loader: 'style-loader',
					//   options: {
					//     // sourceMap: process.env.NODE_ENV !== 'production',
					//   },
					// },
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							// sourceMap: process.env.NODE_ENV !== 'production',
						},
					},
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								javascriptEnabled: true,
							},
						},
					},
				],
			},

			{
				test: /\.jsx?$/,
				use: jsxLoader,
				exclude: [/node_modules/],
			},
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: { transpileOnly: true },
					},
				],
				exclude: [/node_modules/, /cypress/],
			},
		],
	},
	devServer: {
		hot: false,
		disableHostCheck: true,
	},
	devtool: process.env.NODE_ENV === 'production' ? false : 'eval-cheap-source-map',
	// plugins: [new CleanWebpackPlugin(), new MiniCssExtractPlugin(), new AntdScssThemePlugin('./style/antd/theme.scss')],
	plugins: [new CleanWebpackPlugin(), new MiniCssExtractPlugin()],
	stats: {
		colors: true,
		children: false,
	},
}

// https://developerhandbook.com/webpack/how-to-configure-scss-modules-for-webpack/
