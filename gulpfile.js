const gulp = require("gulp");
const path = require("path");
const del = require("del");
const gutil = require("gulp-util");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const nodemon = require("nodemon");

const webpack_server_config = require("./webpack/webpack.server");
const webpack_client_config = require("./webpack/webpack.client");
const server_settings = require("./devenv-settings");

function getWebpackConsoleStats(isProduction) {
    return({
        colors: true,
        chunks: false,
        assets: isProduction || false,
        timings: true,
        modules: false,
        hash: false,
        version: false
    });
}
function printBuildType(name) {
    console.log(`Building ${name} for ${isProduction() ? "Production" : "Development"}`)
};

gulp.task("server:clean", callback => {
    del([
        "./build",
        "./views/layout.pug",
    ]).then(result => { callback(); });
});
gulp.task("server:build",
    gulp.series(
        "server:clean",
        compileServer
    )
);
gulp.task("server:dev",
    gulp.series(
        setDevelopmentEnv,
        "server:build",
        gulp.parallel(
            watchServer,
            runServer
        )
    )
);
gulp.task("server:prod",
    gulp.series(
        "server:clean",
        setProductionEnv,
        compileServer
    )
);

gulp.task("client:clean", callback => {
    del([
        "./public/build",
        "./views/layout.pug",
    ]).then(result => { callback(); });
});
gulp.task("client:build",
    gulp.series(
        "client:clean",
        complileClient
    )
);
gulp.task("client:dev",
    gulp.series(
        "client:clean",
        setDevelopmentEnv,
        watchClient
    )
);
gulp.task("client:prod",
    gulp.series(
        "client:clean",
        setProductionEnv,
        complileClient
    )
);
gulp.task("dev",
    gulp.series(
        gulp.parallel(
            "client:dev",
            "server:dev"
        )
    )
);
gulp.task("clean",
    gulp.series(
        "client:clean",
        "server:clean"
    )
);
gulp.task("prod",
    gulp.series(
        "clean",
        setProductionEnv,
        compileServer,
        complileClient
    )
);

function setDevelopmentEnv(callback) {
    process.env.NODE_ENV = "development";
    callback();
}
function setProductionEnv(callback) {
    process.env.NODE_ENV = "production";
    callback();
}
function isProduction() {
    return process.env.NODE_ENV === "production";
}
function compileServer(callback) {
    printBuildType("Server");
    webpack(webpack_server_config, (err, stats) => {
        if (err) {
            callback(err);
            return;
        }
        console.log(stats.toString(getWebpackConsoleStats(isProduction())));
        callback();
    })
};
function watchServer() {
    return gulp
        .watch([
            "src/server/**/*.ts",
            "views/**/*.pug",
            "!views/layout.pug",
        ], gulp.series(compileServer))
        .on("error", (error) => { console.error(error); })
};
function runServer() {
    return nodemon({
        script: "./bin/www",
        watch: "build",
        ignore: ["**/__tests"]
    });
};

function complileClient(callback) {
    printBuildType("Client");
    webpack(webpack_client_config, (err, stats) => {
        if (err) {
            callback(err);
            return;
        }
        console.log(stats.toString(getWebpackConsoleStats(isProduction())));
        callback();
    })
};
function watchClient() {
    const compiler = webpack(webpack_client_config);
    const server = new WebpackDevServer(compiler, {
        publicPath: "/build/",
        disableHostCheck: true,
        hot: true,
        stats:getWebpackConsoleStats(isProduction()),
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": "true" }
    });

    server.listen(server_settings.clientDevPort, () => {});
};