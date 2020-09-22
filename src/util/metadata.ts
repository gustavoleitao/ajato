import HttpMethod from '../arq/httpmethods'

export default class Metadata {
    
    private static instance: Metadata

    private pathsByClass: { [name: string] : {path: string} }
    private pathsBySuperClass: { [name: string] : {path: string } }
    private routes : { [target: string] : {path: string, type:HttpMethod, name:string, action:Function, object:any}[] }
    private roles : { [target: string] : {roles:string[]} }

    private constructor() { 
        this.pathsByClass  = {}
        this.pathsBySuperClass  = {}
        this.routes  = {}
        this.roles =  {}
    }

    public static getInstance(): Metadata {
        if (!Metadata.instance) {
            Metadata.instance = new Metadata();
        }
        return Metadata.instance;
    }

    public registerPaths(className:string, path:string, superclass:string) {
        this.pathsByClass[className] = {path: path}
        this.pathsBySuperClass[superclass] = {path: path}
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

    public pathFromTarget(target: string){
        if (this.pathsByClass[target] != undefined){
            return this.pathsByClass[target].path
        }else{
            return this.pathsBySuperClass[target].path
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
        console.log(this.pathsByClass)
        console.log(this.routes)
        console.log(this.roles)
    }

}