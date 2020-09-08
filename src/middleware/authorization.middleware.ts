import { Request } from 'express'
import { IAUser } from '../model/user.model'

interface IAuthRequest extends Request {
    user: IAUser
}

function verifyAuth(roles:string[], user:IAUser):boolean {

    if (roles.includes('$logged')){
        return true
    }

    const userRoles = user.roles;

    for (let role of userRoles) {
        if (roles.includes(role.name)){
            return true
        }
    }

    return false

}

export = verifyAuth