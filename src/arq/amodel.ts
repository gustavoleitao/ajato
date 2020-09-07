import { Schema, SchemaDefinition, Document } from 'mongoose'

abstract class AModel {

    abstract name():string
    abstract schemaDefinition():SchemaDefinition
    schema(){
        const schemaDef:SchemaDefinition = {
            createdAt: {
                type: Date,
                required: true,
                default: Date.now
            },
            createdBy: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
        const schema = new Schema({...this.schemaDefinition(), ...schemaDef})
        return this.postDefinition(schema)
    }

    postDefinition(schema:Schema):Schema{
        return schema
    }

}

export {AModel}