import CrudController2 from "../../controller/crudv2.controller";
import { Controller, Post, Get, Patch, Delete, Put } from "../../decorators/ajato.decorator";
import SimpleModel from "../model/simple.model";
import { Response, Request } from 'express'

@Controller("/simplev2")
class SimpleController {

    private base:CrudController2

    constructor(){
        this.base = new CrudController2(new SimpleModel())
    }

    @Post('/')
    public async post(req:Request, res:Response){
        return await this.base.post(req, res)
    }

    @Get('/')
    public async get(req: Request, res: Response){
        return await this.base.get(req, res)
    }

    @Get('/:id')
    public async getById(req: Request, res: Response){
        return await this.base.getById(req, res)
    }

    @Patch('/:id')
    public async patch(req: Request, res: Response){
        return await this.base.patch(req, res)
    }

    @Put('/:id')
    public async put(req: Request, res: Response){
        return await this.base.put(req, res)
    }

    @Delete('/:id')
    public async delete(req: Request, res: Response){
        return await this.base.delete(req, res)
    }

}

export = SimpleController