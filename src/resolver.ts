import "reflect-metadata"
import {container} from "tsyringe"

export default class Resolver {

    public static resolve(clazz:any){
        return container.resolve(clazz)
    }

}