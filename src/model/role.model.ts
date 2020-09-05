import AModel from "../arq/amodel";
import { SchemaDefinition } from "mongoose";

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