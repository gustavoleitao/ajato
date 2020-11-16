import { Get, Post, Patch, Put, Delete, Controller } from "../decorators/ajato.decorator"
import { Role } from "../model/role.model"
import CrudController from "./crud.controller"
import { Request, Response } from 'express'
import { injectable } from "tsyringe"

@Controller('/user/role')
@injectable()
class RoleController {

    userRoleController: CrudController

    constructor() {
        this.userRoleController = new CrudController(new Role())
    }

    @Post()
    post(req: Request, res: Response) {
        this.userRoleController.post(req, res)
    }

    @Get()
    get(req: Request, res: Response) {
        this.userRoleController.get(req, res)
    }

    @Get('/:id')
    getById(req: Request, res: Response) {
        this.userRoleController.getById(req, res)
    }

    @Patch('/:id')
    patch(req: Request, res: Response) {
        this.userRoleController.patch(req, res)
    }

    @Put('/:id')
    put(req: Request, res: Response) {
        this.userRoleController.put(req, res)
    }

    @Delete('/:id')
    delete(req: Request, res: Response) {
        this.userRoleController.delete(req, res)
    }

}

export = RoleController