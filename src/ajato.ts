import express, {Application, Request, Response, NextFunction} from 'express'
import bodyParser from 'body-parser'
const mquery = require('express-mquery')
import RouterBuilder from './util/router.builder'
import RootController from './controller/root.controller'
import MongooseManager from './datasource/datasource.mongo'
import AModel from './arq/amodel'
import { Schema } from 'mongoose'

class Ajato {

    private static instance: Ajato
    private express:Application
    private mongo:MongooseManager
    private server:any

    public static getInstance(): Ajato {
        if (!Ajato.instance) {
            Ajato.instance = new Ajato()
        }
        return Ajato.instance
    }

    private constructor(){
        this.mongo = MongooseManager.getInstance()
        this.express = express()
        this.configure()
    }

    private configure():void{
        this.configureExpress()
    }

    private addBasicRoutes():void{
        this.express.use('/', new RouterBuilder()
            .add(new RootController())
            .routes())
    }

    private configureExpress(){
        this.express.use(express.json())
        this.express.use(bodyParser.urlencoded({ extended: true }))
        this.express.use(mquery({ limit: 200, maxLimit: 1000 }))
        this.addBasicRoutes()
    }

    public start(mongoUrl='mongodb://MacBook-Pro-de-Gustavo.local:27017/user-db-2', port=3000, callback?: (...args: any[]) => void){
        this.mongo.connect(mongoUrl)
        this.server = this.express.listen(port, () => {
            console.log(`Server running on port ${port}`)
            if (callback !== undefined) callback()
        })
    }

    public db(){
        return this.mongo.mongoose()
    }

    public app():Application{
        return this.express
    }

    public shutdown(callback?: (...args: any[]) => void){
        this.server.close()
        this.mongo.mongoose().connection.close(callback)
    }

    public registerModel(model:AModel){
        MongooseManager.getInstance().mongoose().model(name, new Schema(model.schemaDefinition()))
    }

    public use(path:string, func:any){
        this.express.use(path, func)
    }

}

export = Ajato
