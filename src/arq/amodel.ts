import { Schema, Document, SchemaDefinition } from 'mongoose'

interface AModel {

    name():string
    schemaDefinition():SchemaDefinition

}

export = AModel
