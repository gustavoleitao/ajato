import { Request, Response, Router, NextFunction, RequestHandler } from 'express'
import { IAUser } from '../model/user.model'
import authenticationMiddleware from './authentication.middleware'
import authorizationMiddleware from './authorization.middleware'

interface IAuthRequest extends Request {
    user: IAUser
}

function authMiddleware(roles:string[]): RequestHandler {
    const rolesFixo = roles;
    return (req, res, next) => {

        const reqAuth = req as IAuthRequest 
        const isPublic = roles.includes('$public')

        if (!isPublic){

            const isAuthenticated = authenticationMiddleware(reqAuth, res, next)

            if (!isAuthenticated){
                res.status(403).send({error: "Failed to authenticate"})
                return
            }else{
                
                const isAuthorizaded = authorizationMiddleware(roles, reqAuth.user)
                if (!isAuthorizaded){
                    res.status(403).send({error: "Unauthorizaded"})
                    return
                }
            }
        }
        
        next()

    }

}

export = authMiddleware