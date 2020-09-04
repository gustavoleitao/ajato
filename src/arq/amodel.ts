import { Schema, Document, SchemaDefinition } from 'mongoose'

abstract class AModel {

    abstract name():string
    abstract schemaDefinition():SchemaDefinition
    schema(){
        return new Schema(this.schemaDefinition())
    }

}

export = AModel
