const mquery = require('express-mquery')
import express, { Application, Request, Response, NextFunction, Router } from 'express'
import bodyParser from 'body-parser'
import RootController from './controller/root.controller'
import MongooseManager from './datasource/datasource.mongo'
import startupMongo from './datasource/startup.mongo'
import logger from './util/logger'
import Metadata from './util/metadata'
import HttpMethods from './arq/httpmethods'
import authMiddleware from './middleware/auth.middleware'
import Resolver from './resolver'

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
        this.printName()
        this.express = express()
        this.configure()
        this.mongo = MongooseManager.getInstance()
    }

    private printName() {
        console.log(" █████       ██  █████  ████████  ██████  ");
        console.log("██   ██      ██ ██   ██    ██    ██    ██ ");
        console.log("███████      ██ ███████    ██    ██    ██ ");
        console.log("██   ██ ██   ██ ██   ██    ██    ██    ██ ");
        console.log("██   ██  █████  ██   ██    ██     ██████  ");
        console.log("")
    }

    private async configure() {
        this.configureExpress()
        this.addBasicRoutes()
    }

    private configureExpress() {
        this.express.use(express.json())
        this.express.use(bodyParser.urlencoded({ extended: true }))
        this.express.use(bodyParser.json())
        this.express.use(mquery({ limit: 200, maxLimit: 1000 }))
    }

    private addBasicRoutes(): void {
        this.add(RootController)
    }

    public async start(mongoUrl = 'mongodb://localhost:27017/user-db', port = 3000, callback?: (...args: any[]) => void) {

        await this.mongo.connect(mongoUrl)
        await this.configureDb()
        this.configureRoutes()
        this.server = this.express.listen(port, () => {
            logger.info(`Server running on port %d`, port)
            if (callback !== undefined) callback()
        })
    }

    private configureRoutes() {
        const metadata = Metadata.getInstance()
        const routes = metadata.getRoutes()
        const controllers = metadata.getControllers()
        const _self = this

        Object.keys(controllers).forEach(function (target) {
            const path = metadata.pathFromTarget(target)
            const routes = metadata.routesFromTarget(target)
            let router: Router = express.Router()
            if (routes !== undefined) {
                routes.forEach(method => {
                    const roles: string[] = metadata.rolesFromMethod(target, method.name)
                    const constrollerConstrutor = metadata.controllerByClassName(target)
                    logger.info('Registering %s %s%s and roles %s', method.type,
                        metadata.pathFromTarget(target) === "/" ? "" : metadata.pathFromTarget(target), method.path, roles)
                    _self.addMethodToRouter(router, constrollerConstrutor, roles, method)
                });
            }
            _self.express.use(metadata.pathFromTarget(target), router)

        })

    }


    private addMethodToRouter(router: Router, constrollerConstrutor: any, localRoles: string[], method: { path: string; type: HttpMethods; name: string; action: Function, object: any }) {

        const instanceController: any = Resolver.resolve(constrollerConstrutor)

        switch (method.type) {
            case HttpMethods.GET:
                router.get(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next: NextFunction) => {
                    await instanceController[method.name](req, res)
                })
                break
            case HttpMethods.POST:
                router.post(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next: NextFunction) => {
                    await instanceController[method.name](req, res)
                })
                break
            case HttpMethods.PATH:
                router.patch(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next: NextFunction) => {
                    await instanceController[method.name](req, res)
                })
                break
            case HttpMethods.PUT:
                router.put(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next: NextFunction) => {
                    await instanceController[method.name](req, res)
                })
                break
            case HttpMethods.DELETE:
                router.delete(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next: NextFunction) => {
                    await instanceController[method.name](req, res)
                })
                break
            case HttpMethods.ALL:
                router.all(method.path, authMiddleware(localRoles), async (req: Request, res: Response, next: NextFunction) => {
                    await instanceController[method.name](req, res)
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

    public add(controller: Function, path?: string) {
        if (path !== undefined) {
            const superClass = Object.getPrototypeOf(controller).name
            Metadata.getInstance().registerPaths(controller.name, path, controller, superClass)
            logger.debug('Registering Controller %s at specific path %s and superclass [%s]', controller.name, path, superClass)
        } else {
            logger.debug('Registering Controller %s', controller.name)
        }
    }

    public use(path: string, func: any) {
        this.express.use(path, func)
    }

}

export = Ajato
