const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dirApp = path.join(__dirname, "app");
const dirShared = path.join(__dirname, "assets");
const dirStyles = path.join(__dirname, "styles");
const dirNode = "node_modules";

module.exports = {
	entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],
	resolve: {
		modules: [dirNode, dirApp, dirShared, dirStyles],
	},
};
