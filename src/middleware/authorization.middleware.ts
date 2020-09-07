import { Request, Response, Router, NextFunction, RequestHandler } from 'express'
import { IAUser } from '../model/user.model'
import { IRole, Role } from '../model/role.model'

interface IAuthRequest extends Request {
    user: IAUser
}

function authenticationMiddleware(roles:IRole[]): RequestHandler {
    return (req, res, next) => {
        const reqAuth = req as IAuthRequest
        verifyAuth(roles, reqAuth, res, next)
    }
}

async function verifyAuth(roles:IRole[], req: IAuthRequest, res: Response, next: NextFunction) {
     try {
        const user:IAUser = req.user
        user.roles.forEach(role => {
            if (roles.includes(role)){
                next()
                return;
            }
        })
        return res.status(401).send({error: "Unauthorized"})
    } catch (err) {
        return res.status(403).send({error: "Error on Authorization proccess"})
    }
}

export = authenticationMiddleware