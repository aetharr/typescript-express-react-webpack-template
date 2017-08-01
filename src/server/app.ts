import { Request, Response } from "express";
import { renderSettings } from "./settings";

const express = require("express");

const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const webroutes = require("./routes/web/index");
const apiroutes = require("./routes/api/index");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "../../", "views"));
app.set("view engine", "pug");

// Deal with Cross Origin Requests
app.all("/", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../", "public")));

app.use("/", webroutes);
app.use("/api", apiroutes);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: (err: any) => void) => {
    const err: any = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use((err: any, req: Request, res: Response, next: (err: any) => void) => {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err,
            renderSettings
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req: Request, res: Response, next: (err: any) => void) => {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {},
        renderSettings
    });
});

module.exports = app;
