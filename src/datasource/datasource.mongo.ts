import mongoose, {Connection, Document, Model, Schema} from 'mongoose'
const actions = require('mongoose-rest-actions')

class MongooseManager {

    private static instance: MongooseManager

    private constructor() {
        this.configure()
    }

    private db = mongoose

    public static getInstance(): MongooseManager {
        if (!MongooseManager.instance) {
            MongooseManager.instance = new MongooseManager()
        }
        return MongooseManager.instance
    }

    public connect(url='mongodb://localhost:27017/ajato-db'){
        this.registerEvents()
        this.db.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    }

    private configure(){
        console.log('Registering plugin. The order is critical. This plugin may be installed before registering models')
        this.db.plugin(actions)
    }

    private registerEvents(){

        this.db.connection.once('open', _ => {
            console.log('Database connected!')
        })

        this.db.connection.on('error', err => {
          console.error('Database connection error:', err)
        })

        this.db.connection.on('close', _ => {
            console.log('Database disconnected!')
        })
    }

    public mongoose(){
        return this.db
    }

}

export = MongooseManager
