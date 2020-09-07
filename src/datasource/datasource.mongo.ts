import mongoose, {Connection, Document, Model, Schema} from 'mongoose'
import { AModel } from '../arq/amodel'
const actions = require('mongoose-rest-actions')
import logger from '../util/logger'

class MongooseManager {

    private static instance: MongooseManager
    private db = mongoose

    private constructor() {
        this.configure()
    }

    public static getInstance(): MongooseManager {
        if (!MongooseManager.instance) {
            MongooseManager.instance = new MongooseManager()
        }
        return MongooseManager.instance
    }

     public async connect(url='mongodb://localhost:27017/ajato-db'){
        this.registerEvents()
        await this.db.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    }

    private configure(){
        this.db.plugin(actions)
    }

    public getMongooseModel(amodel:AModel):Model<any>{
        try{
            return this.mongoose().model(amodel.name())
        }catch (err){
            logger.debug('Registering model %s', amodel.name())
            return this.mongoose().model<any>(amodel.name(), amodel.schema())
        }
    }

    private registerEvents(){

        this.db.connection.once('open', _ => {
            logger.info('Database connected!')
        })

        this.db.connection.on('error', err => {
            logger.error('Database connected!', err)
        })

        this.db.connection.on('close', _ => {
            logger.info('Database disconnected!')
        })
        
    }

    public mongoose(){
        return this.db
    }

}

export = MongooseManager
