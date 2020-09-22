import express, { Application, Request, Response, NextFunction, Router } from 'express'
import bodyParser from 'body-parser'
const mquery = require('express-mquery')
import RouterBuilder from './util/router.builder'
import RootController from './controller/root.controller'
import MongooseManager from './datasource/datasource.mongo'
import { AModel } from './arq/amodel'
import { Schema } from 'mongoose'
import startupMongo from './datasource/startup.mongo'
import logger from './util/logger'
import Metadata from './util/metadata'
import HttpMethods from './arq/httpmethods'

class Ajato {

    private static instance: Ajato
    private express: Application
    private mongo: MongooseManager
    private server: any

    public static getInstance(): Ajato {
        if (!Ajato.instance) {
            Ajato.instance = new Ajato()
        }
        return Ajato.instance
    }

    private constructor() {
        this.express = express()
        this.configure()
        this.mongo = MongooseManager.getInstance()
    }

    private configure(): void {
        this.configureExpress()
    }

    private addBasicRoutes(): void {
        this.express.use('/', new RouterBuilder()
            .add(new RootController())
            .routes())
    }

    private configureExpress() {
        this.express.use(express.json())
        this.express.use(bodyParser.urlencoded({ extended: true }))
        this.express.use(bodyParser.json())
        this.express.use(mquery({ limit: 200, maxLimit: 1000 }))
        this.addBasicRoutes()
        console.log('finished configureExpress')
    }

    public async start(mongoUrl = 'mongodb://localhost:27017/user-db', port = 3000, callback?: (...args: any[]) => void) {
        await this.mongo.connect(mongoUrl)
        await this.configureDb()
        await this.configureRoutes()
        this.server = this.express.listen(port, () => {
            logger.info(`Server running on port %d`, port)
            if (callback !== undefined) callback()
        })
    }

    public registerController(path: string, func: any){
        const metadata = Metadata.getInstance()
    }

    configureRoutes() {
        const metadata = Metadata.getInstance()
        const router: Router = express.Router()
        const routes = metadata.getRoutes()
        const _self = this

        Object.keys(routes).forEach(function (target) {
            const methodsData = routes[target]
            methodsData.forEach(method => {
                logger.info('Registering %s %s at %s', method.type, method.path, metadata.pathFromTarget(target))
                _self.addMethodToRouter(router, method)
            });
            _self.express.use(metadata.pathFromTarget(target), router)
        });
    }

    addMethodToRouter(router: Router, method: { path: string; type: HttpMethods; name: string; action: Function, object: any}) {
        switch (method.type) {
            case HttpMethods.GET:
                router.get(method.path, async (req: Request, res: Response) => { 
                    await new method.object.constructor()[method.name](req, res)
                })
                break
            case HttpMethods.POST:
                router.post(method.path, async (req: Request, res: Response) => { 
                    await new method.object.constructor()[method.name](req, res)
                })
                break
            case HttpMethods.PATH:
                router.patch(method.path, async (req: Request, res: Response) => { 
                    await new method.object.constructor()[method.name](req, res) 
                })
                break
            case HttpMethods.PUT:
                router.put(method.path, async (req: Request, res: Response) => { 
                    await new method.object.constructor()[method.name](req, res) 
                })
                break
            case HttpMethods.DELETE:
                router.delete(method.path, async (req: Request, res: Response) => { 
                    await new method.object.constructor()[method.name](req, res) 
                })
                break
            case HttpMethods.ALL:
                router.all(method.path, async (req: Request, res: Response) => { 
                    await new method.object.constructor()[method.name](req, res) 
                })
                break
        }
    }

    private async configureDb() {
        await startupMongo.initDb()
    }

    public db() {
        return this.mongo.db
    }

    public app(): Application {
        return this.express
    }

    public shutdown(callback?: (...args: any[]) => void) {
        this.server.close()
        this.mongo.db.connection.close(callback)
    }

    public use(path: string, func: any) {
        this.express.use(path, func)
    }

}

export = Ajato
