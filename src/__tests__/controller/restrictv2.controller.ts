import CrudController from "../../controller/crud.controller";
import { Controller, Get , Auth } from "../../decorators/ajato.decorator";
import SimpleModel from "../model/simple.model";
import { Request, Response } from 'express'

@Controller("/restrictv2")
class RestrictV2Controller {

    private base:CrudController

    constructor(){
        this.base = new CrudController(new SimpleModel())
    }

    @Get('/')
    @Auth()
    public async get(req: Request, res: Response){
        return await this.base.get(req, res)
    }

}

export = RestrictV2Controller