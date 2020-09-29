import { AModel } from "../arq/amodel"
import { Post, Get, Put, Patch, Delete, Controller } from "../decorators/ajato.decorator"
import CrudController from "./crud.controller"
import {Request, Response} from 'express'

abstract class GenericController {

    controller: CrudController

    constructor(amodel:AModel) {
        this.controller = new CrudController(amodel)
    }

    @Post()
    post(req: Request, res: Response) {
        this.controller.post(req, res)
    }

    @Get()
    get(req: Request, res: Response) {
        this.controller.get(req, res)
    }

    @Get('/:id')
    getById(req: Request, res: Response) {
        this.controller.getById(req, res)
    }

    @Patch('/:id')
    patch(req: Request, res: Response) {
        this.controller.patch(req, res)
    }

    @Put('/:id')
    put(req: Request, res: Response) {
        this.controller.put(req, res)
    }

    @Delete('/:id')
    delete(req: Request, res: Response) {
        this.controller.delete(req, res)
    }

}

export = GenericController