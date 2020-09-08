import jwt, { VerifyErrors, Secret } from 'jsonwebtoken'
import { Request, Response, Router, NextFunction, RequestHandler } from 'express'
import { IAUser } from '../model/user.model'

interface IAuthRequest extends Request {
    user: IAUser
}


function authorization(req: IAuthRequest, res: Response, next: NextFunction):boolean {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token != null) {
        try {
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as IAUser
            req.user = payload
            req.body.createdBy = payload._id
            return true
        } catch (err) {
            //logg
        }
    }

    return false

}

export = authorization

