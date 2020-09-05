import Controller from '../arq/controller'
import {Request, Response, Router, NextFunction} from 'express'
import CrudController from './crud.controller'
import { AUser } from '../model/user.model'
import { Role } from '../model/role.model'

class UserController implements Controller {
    
    userCrudController: CrudController
    userRoleController: CrudController

    constructor(userModel:AUser=new AUser()){
         this.userCrudController = new CrudController(userModel)
         this.userRoleController = new CrudController(new Role(), 'role/')
    }

    add(router:Router):void{
        this.userRoleController.add(router)
        this.userCrudController.add(router)
    }

}

export = UserController