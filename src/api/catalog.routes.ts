import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post(
    "/product", 
    (req: Request, res: Response, next: NextFunction) => {
        (async () => {
            return res.status(201).json({});
        })().catch(next);
    }
);

export default router;