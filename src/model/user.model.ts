import { Schema, SchemaDefinition, Document } from 'mongoose';
import AModel from '../arq/amodel'
import { type } from 'os';
import {Role, IRole} from './role.model'

interface IAUser extends Document {
    name: string
    realm: string
    username: string
    email: string
    password: string
    createdAt: Date
    roles: [IRole]
}

class AUser extends AModel {

    name = () => 'User'
    
    schemaDefinition(){
        const schema:SchemaDefinition = {
            name: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: [true, 'Email name must be provided']
            },
            realm: {
                type: String,
                required: false,
            },
            password: {
                type: String,
                required: true
            },
            roles: [{type: Schema.Types.ObjectId, ref: new Role().name()}]
        }
        return schema
    }

    postDefinition(schema:Schema):Schema{
        schema.index({ realm: 1, username: 1 }, { unique: true })
        schema.index({ realm: 1, email: 1 }, { unique: true })
        return schema
    }

}

export { AUser }
export type { IAUser }