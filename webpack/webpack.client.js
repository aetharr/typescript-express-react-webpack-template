var node_externals = require('webpack-node-externals'),
    webpack = require("webpack"),
    path = require('path'),
    _ = require('lodash'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    HtmlWebpackPugPlugin = require("html-webpack-pug-plugin"),
    server_settings = require('../devenv-settings');

const vendor = [
    "react", "react-dom"
];

const rules = {
    ts:     { test: /\.tsx?$/, loader: "ts-loader!tslint-loader", /* options: { configFileName: "tsconfig.json" } */},
    tslint: { test: /\.tsx?$/, loader: "tslint-loader", enforce: "pre", options: { failOnHint: true } },
    js:     { test: /\.js$/, loader: "source-map-loader", enforce: "pre" }, // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
    json:   { test: /\.json$/, loader: "json-loader" },
    css:    { test: /\.css$/, loader: "style-loader!css-loader?sourceMap" },
    sass:   { test: /\.scss$/, loader: "style-loader!css-loader?sourceMap!sass-loader?sourceMap" },
    files:  { test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, loader: "url-loader?limit=5000" }
};

const target = "web";
const node = { __dirname: true };

const entry = ["./src/client/app"];
let publicPath = "/build/";


function createConfig(isDebug) {

    const name = `Client : ${isDebug ? "Development" : "Production"}`;

    const filenames = `[name]${!isDebug ? ".[hash]" : ""}`;
    const devtool = isDebug ? "source-map" : false;
    const plugins = [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(`${process.env.NODE_ENV || "development"}`),
            IS_PRODUCTION: !isDebug,
            IS_DEVELOPMENT: isDebug
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor']
        })
    ];

    if (isDebug) {
        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new webpack.NamedModulesPlugin());
        entry.unshift(
            "react-hot-loader/patch",
            `webpack-dev-server/client?${server_settings.clientDevAddr}/`,
            "webpack/hot/only-dev-server");
        publicPath = `${server_settings.clientDevScriptPath}/`;
        rules.ts.loader = "react-hot-loader/webpack!ts-loader!tslint-loader";
    } else {
        plugins.push(
            new ExtractTextPlugin(`${filenames}.css`),
            new webpack.optimize.UglifyJsPlugin({compress: { warnings: false}}),
            new HtmlWebpackPlugin({
                template: './views/layout.master.pug',
                filename:  path.join(__dirname, '../', 'views', 'layout.pug')
            }),
            new HtmlWebpackPugPlugin()
        );

        rules.css.loader = ExtractTextPlugin.extract({fallback: "style-loader", use:["css-loader"]});
        rules.sass.loader = ExtractTextPlugin.extract({fallback: "style-loader", use: ["css-loader", "sass-loader"]});
    }

    return {
        name,
        devtool,
        entry: {
            app: entry,
            vendor
        },
        output: {
            path: path.join(__dirname, "../", "public", "build"),
            filename: `${filenames}.js`,
            publicPath
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"], // Add '.ts' and '.tsx' as resolvable extensions
            alias: {
                shared: path.join(__dirname, "../", "src", "shared")
            }
        },
        target,
        node,
        //externals: [node_externals()], // Don't follow/bundle these modules, but request them at runtime from the environment
        module: {
            rules: _.values(rules)
        },
        plugins,

        /* When importing a module whose path matches one of the follwing,
         * just assume a corresponding global variable exists and use that
         * instead.
         *
         * This is important because it allows us to avoid bundling all of
         * our dependencies, which allows browsers to cache those
         * libraries between builds.
         */
        /*
        externals: {
            "react": "React",
            "react-dom": "ReactDOM"
        }*/
    };
};

module.exports = createConfig(process.env.NODE_ENV !== 'production');
//module.exports.create = createConfig;