import { Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/constants/statuscodes";

const express = require("express");
const router = express.Router();

/* GET base route */
router.get("/", (req: Request, res: Response, next: () => void) => {
    res.status(HttpStatusCode.OK).send(null);
});

router.get("/:id", (req: Request, res: Response, next: () => void) => {
    res.status(HttpStatusCode.OK).send(req.params);
});

module.exports = router;
