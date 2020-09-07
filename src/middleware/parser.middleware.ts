import Middleware from "../arq/middleware"
import { Request, Response, Router, NextFunction } from "express"
const { deepParseJson } = require('deep-parse-json')

async function parserMiddleware(req: Request, res: Response, next: NextFunction) {
    try{
        const stringfyBody = JSON.stringify(req.body)
        return deepParseJson(stringfyBody)
    }catch(err) {
        return req.body
    }
}

export = parserMiddleware
