import HttpMethod from '../arq/httpmethods'
import logger from './logger'

export default class Metadata {
    
    private static instance: Metadata

    private pathsByClass: { [name: string] : {path: string} }
    private pathsBySuperClass: { [name: string] : {path: string } }
    private controllerByClass: { [name: string] : {constructor: any } }
    private controllerBySuperClass: { [name: string] : {constructor: any } }
    private routes : { [target: string] : {path: string, type:HttpMethod, name:string, action:Function, object:any}[] }
    private roles : { [target: string] : {roles:string[]} }
    private supeclass : { [clazz: string] : {superclass:string} }

    private constructor() { 
        this.pathsByClass  = {}
        this.pathsBySuperClass  = {}
        this.routes  = {}
        this.roles =  {}
        this.controllerByClass = {}
        this.controllerBySuperClass = {}
        this.supeclass = {}
    }

    public static getInstance(): Metadata {
        if (!Metadata.instance) {
            Metadata.instance = new Metadata();
        }
        return Metadata.instance;
    }

    public registerPaths(className:string, path:string, target:any, superclass:string) {
        this.pathsByClass[className] = {path: path}
        this.pathsBySuperClass[superclass] = {path: path}
        this.controllerByClass[className] = {constructor: target}
        this.controllerBySuperClass[superclass] = {constructor: target}
        this.supeclass[className] = {superclass: superclass}
    }

    public registerRoles(target: string, name:string, roles:string[]) {
        const key = `${target}.${name}`
        this.roles[key] = {roles: roles}
    }

    public registerMethods(target: string, path:string, type:HttpMethod, name:string, func:Function, object:any) {
        let routes = this.routes[target]
        if (routes === undefined){
            routes = []
        }
        routes.push({path: path, type: type, name: name, action:func, object: object})
        this.routes[target] = routes
    }

    public getRoutes(){
        return this.routes
    }

    public getControllers(){
        return this.controllerByClass
    }

    public pathFromTarget(target: string){
        if (this.pathsByClass[target] != undefined){
            return this.pathsByClass[target].path
        }else{
            return this.pathsBySuperClass[target].path
        }
    }

    public routesFromTarget(target: string) {

        const routesByTarget:{path: string, type:HttpMethod, name:string, action:Function, object:any}[] = []

        const mysuper = this.supeclass[target].superclass

        if (mysuper !== undefined && mysuper.length > 0){
            logger.debug(`Adding routes from superclass %s in class %s.`, mysuper, target)
            const superRoutes = this.routes[mysuper]
            if (superRoutes !== undefined){
                for (const myroute of superRoutes){
                    routesByTarget.push(myroute)
                }
            }
        }

        const localRoutes = this.routes[target]

        if (localRoutes !== undefined  && localRoutes.length > 0){
            logger.debug(`Adding routes from class %s.`, target)
            for (const myroute of localRoutes){
                routesByTarget.push(myroute)
            }
        }

        return routesByTarget;
    }

    public controllerByClassName(className:string):any{
        if (this.controllerByClass[className] != undefined){
            return this.controllerByClass[className].constructor
        }else{
            return this.controllerBySuperClass[className].constructor
        }
    }

    public rolesFromMethod(target: string, name:string):string[]{
        const key = `${target}.${name}`
        if (this.roles[key] !== undefined){
            return this.roles[key].roles
        }else{
            return ["$public"]
        }
    }

    public print(){
        console.log('this.pathsByClass')
        console.log(this.pathsByClass)
        
        console.log('this.pathsBySuperClass')
        console.log(this.pathsBySuperClass)
        
        console.log('this.controllerByClass')
        console.log(this.controllerByClass)

        console.log('this.controllerBySuperClass')
        console.log(this.controllerBySuperClass)
        
        console.log('this.routes')
        console.log(this.routes)

        console.log('this.roles')
        console.log(this.roles)
    }

}