var node_externals = require('webpack-node-externals'),
    webpack = require("webpack"),
    _ = require('lodash'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    path = require('path');

//const vendor = [];
const rules = {
    ts:     { test: /\.tsx?$/, loader: "ts-loader!tslint-loader", /* options: { configFileName: "tsconfig.server.json" } */ },
    tslint: { test: /\.tsx?$/, loader: "tslint-loader", enforce: "pre", options: { failOnHint: true } },
    js:     { test: /\.js$/, loader: "source-map-loader", enforce: "pre" }, // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
    json:   { test: /\.json$/, loader: "json" },
};

const target = "node";
const node = { __dirname: true };

const entry = ["./src/server/app"];
let publicPath = "/build/";


function createConfig(isDebug) {

    const name = `Server : ${isDebug ? "Development" : "Production"}`;

    const devtool = isDebug ? "source-map" : false;
    const plugins = [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(`${process.env.NODE_ENV || "development"}`),
            IS_PRODUCTION: !isDebug,
            IS_DEVELOPMENT: isDebug
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app']
        })
    ];

    if (isDebug) {
        plugins.push(
            new CopyWebpackPlugin([{
                from:   path.join(__dirname, '../', 'views', 'layout.master.pug'),
                to:     path.join(__dirname, '../', 'views', 'layout.pug')
            }])
        );
    } else {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({compress: { warnings: false }})
        );
    }

    return {
        name,
        devtool,
        entry: {
            app: entry,
            //vendor
        },
        output: {
            path: path.join(__dirname, "../", "build"),
            filename: "[name].js",
            publicPath,
            libraryTarget:'umd'
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"], // Add '.ts' and '.tsx' as resolvable extensions
            alias: {
                shared: path.join(__dirname, "../", "src", "shared")
            }
        },
        target,
        node,
        externals: [node_externals()], // Don't follow/bundle these modules, but request them at runtime from the environment
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