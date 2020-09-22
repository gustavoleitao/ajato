const mquery = require('express-mquery')
import express, { Application, Request, Response, NextFunction, Router } from 'express'
import bodyParser from 'body-parser'
import RouterBuilder from './util/router.builder'
import RootController from './controller/root.controller'
import MongooseManager from './datasource/datasource.mongo'
import startupMongo from './datasource/startup.mongo'
import logger from './util/logger'
import Metadata from './util/metadata'
import HttpMethods from './arq/httpmethods'
import authMiddleware from './middleware/auth.middleware'

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

    private configureRoutes() {
        const metadata = Metadata.getInstance()
        const routes = metadata.getRoutes()
        const _self = this

        Object.keys(routes).forEach(function (target) {
            const methodsData = routes[target]
            logger.debug('Generating new router to target %s', target)
            let router: Router = express.Router()
            methodsData.forEach(method => {
                const roles:string[] = metadata.rolesFromMethod(target, method.name)
                logger.info('Registering %s %s at %s and roles %s', method.type, method.path, metadata.pathFromTarget(target), roles)
                _self.addMethodToRouter(router, roles, target, method)
            });
            _self.express.use(metadata.pathFromTarget(target), router)
        });
    }

    private addMethodToRouter(router: Router, localRoles:string[], target:string, method: { path: string; type: HttpMethods; name: string; action: Function, object: any}) {
        switch (method.type) {
            case HttpMethods.GET:
                router.get(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next:NextFunction) => { 
                    await new method.object.constructor()[method.name](req, res)
                })
                break
            case HttpMethods.POST:
                router.post(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next:NextFunction) => { 
                    await new method.object.constructor()[method.name](req, res)
                })
                break
            case HttpMethods.PATH:
                router.patch(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next:NextFunction) => { 
                    await new method.object.constructor()[method.name](req, res)
                })
                break
            case HttpMethods.PUT:
                router.put(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next:NextFunction) => { 
                    await new method.object.constructor()[method.name](req, res)
                })
                break
            case HttpMethods.DELETE:
                router.delete(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next:NextFunction) => { 
                    await new method.object.constructor()[method.name](req, res)
                })
                break
            case HttpMethods.ALL:
                router.all(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next:NextFunction) => { 
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

    public add(controller:any){
        logger.debug('Registering Controller %s', controller.constructor.name)
    }

    public use(path: string, func: any) {
        this.express.use(path, func)
    }

}

export = Ajato
