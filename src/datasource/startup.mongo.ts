import MongooseManager from "./datasource.mongo"
import { Role } from "../model/role.model"

class StartupMongo {

    async initDb(){
        await this.createRole({name: "$public"})
        await this.createRole({name: "$owner"})
    }

    async createRole(def: { name: string }){
        try{
            const RoleModel = MongooseManager.getInstance().getMongooseModel(new Role())
            const modelDocument = new RoleModel(def)
            await modelDocument.save()
        }catch (err){
            console.warn(`Falied to create model: ${def}. Probably this role alredy exists in database.`)
        }
    }

}


export = new StartupMongo()