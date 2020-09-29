import {Router, Response, Request} from 'express'
import { UserController } from '..';
import { Controller, Get } from '../decorators/ajato.decorator';

const readPkgUp = require('read-pkg-up')

@Controller("/")
class RootController {

    private readonly startup: { startUp: Date; name: string; description: string; version: string };

    constructor() {
        const contentOfParent = readPkgUp.sync().packageJson
        this.startup = {startUp: new Date(), name: contentOfParent.name, description: contentOfParent.description, version: contentOfParent.version}
    }

    @Get('/')
    public root(req:Request, res:Response){
        res.status(200).json(this.startup)
    }

}

export = RootController
