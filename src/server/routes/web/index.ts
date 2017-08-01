import {Request, Response} from "express";
import { renderSettings } from "../../settings";

const express = require("express");
const router = express.Router()

/* GET home page. */
router.get("/", (req: Request, res: Response, next: () => void) => {
  res.render("index", { title: "Express", renderSettings })
});

/* GET Page 1. */
router.get("/page1", (req: Request, res: Response, next: () => void) => {
  res.render("index", { title: "Example Page 1", renderSettings })
});

module.exports = router;
