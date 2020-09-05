import jwt, { VerifyErrors, Secret } from 'jsonwebtoken'
import { Request, Response, Router, NextFunction, RequestHandler } from 'express'
import { IAUser } from '../model/user.model'
import { Middleware } from '..'

interface IAuthRequest extends Request {
    user: IAUser
}

class AuthMiddleware implements Middleware {
    add(router: Router): void {
        throw new Error("Method not implemented.")
        router.use()
    }
}

function callback(isPublic: boolean = true): RequestHandler {
    if (isPublic) {
        return (req, res, next) => {
            next()
        }
    } else {
        return (req, res, next) => {
            const reqAuth = req as IAuthRequest
            loggerMiddleware(reqAuth, res, next)
        }
    }
}

async function loggerMiddleware(req: IAuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as IAUser
        req.user = payload
        req.body.createdBy = payload._id
        next()
    } catch (err) {
        console.log(err)
        return res.sendStatus(403)
    }

}

export = callback

