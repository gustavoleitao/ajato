import {Request, Response, Router, NextFunction} from 'express'
import { AUser } from '../model/user.model'
import { Controller, Delete, Get, Patch, Post, Put } from '../decorators/ajato.decorator'
import CrudController from './crud.controller'
import Crypt from '../util/crypt'
import { injectable } from 'tsyringe'

@Controller('/user')
@injectable()
class UserController {
    
    userCrudController: CrudController

    constructor(){
        // userModel:AUser=new AUser()
        //  this.userCrudController = new CrudController2(userModel)
        this.userCrudController = new CrudController(new AUser())
    }
    

    @Post()
    async post(req:Request, res:Response){
        await this.encyptPassword(req)
        this.userCrudController.post(req, res)
    }

    private async encyptPassword(req:Request) {
        const crypt: Crypt = new Crypt()
        const password = req.body.password
        if (password !== undefined){
            req.body.password = await crypt.encrypt(password)
        }
    }

    @Get()
    get(req:Request, res:Response){
        this.userCrudController.get(req, res)
    }

    @Get('/:id')
    getById(req:Request, res:Response){
        this.userCrudController.getById(req, res)
    }

    @Patch('/:id')
    async patch(req:Request, res:Response){
        await this.encyptPassword(req)
        this.userCrudController.patch(req, res)
    }
    
    @Put('/:id')
    async put(req:Request, res:Response){
        await this.encyptPassword(req)
        this.userCrudController.put(req, res)
    }

    @Delete('/:id')
    delete(req:Request, res:Response){
        this.userCrudController.delete(req, res)
    }

}

export = UserController