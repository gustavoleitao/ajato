import { Request } from 'express'
import { IAUser } from '../model/user.model'
import logger from '../util/logger'

interface IAuthRequest extends Request {
    user: IAUser
}

function verifyAuth(roles:string[], user:IAUser):boolean {

    const userRoles = user.roles
    const userRolesName = userRoles.map(role => role.name)

    if (roles.includes('$logged')){
        logger.debug('Access granted. The user %s is logged and method requires only \'$logged\' permission.', user.email)
        return true
    }
    
    for (let role of userRoles) {
        if (roles.includes(role.name)){
            logger.debug('Access granted. The user %s have roles %s that include role \'%s\' required permission.', 
                user.email, userRolesName, role.name)
            return true
        }
    }

    logger.debug('Access denied. The user %s have %s roles and the method requires at least %s role.', 
    user.email, userRolesName, roles)
    return false

}

export = verifyAuth