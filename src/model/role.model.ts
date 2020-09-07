import { AModel } from "../arq/amodel"
import { SchemaDefinition, Document } from 'mongoose'

interface IRole extends Document {
    name: string
}

class Role extends AModel {

    name(): string {
        return 'Role'
    }

    schemaDefinition(): SchemaDefinition {
        return {
            name: {
                type: String,
                required: true,
                unique: true
            }
         }
    }

}

export { Role }
export type { IRole }