import { Schema, SchemaDefinition, Document } from 'mongoose';
import MongooseManager from '../datasource/datasource.mongo'
import AModel from '../arq/amodel'
import { type } from 'os';

interface IAUser extends Document {
    name: string
    realm: string
    username: string
    email: string
    password: string
}

class AUser implements AModel {

    name = () => 'User'
    
    schemaDefinition(){
        const schema:SchemaDefinition = {
            name: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
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
            }
        }
        return schema
    }

}

export = AUser