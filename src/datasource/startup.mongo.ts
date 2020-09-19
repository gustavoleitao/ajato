import MongooseManager from "./datasource.mongo"
import { Role } from "../model/role.model"
import logger from '../util/logger'

class StartupMongo {

    async initDb(){
        await this.createRole({name: "$logged"})
        await this.createRole({name: "$owner"})
        await this.createRole({name: "$public"})
    }

    async createRole(def: { name: string }){
        try{
            const RoleModel = MongooseManager.getInstance().getMongooseModel(new Role())
            const modelDocument = new RoleModel(def)
            await modelDocument.save()
        }catch (err){
            logger.warn(`Failed to create model: ${def.name}. Probably this role alredy exists in database.`)
        }
    }

}


export = new StartupMongo()