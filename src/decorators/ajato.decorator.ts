import Metadata from '../util/metadata'
import HttpMethod from '../arq/httpmethods'

function Controller(path:string) {
    return function(target: Function){
        const superClass = Object.getPrototypeOf(target).name
        Metadata.getInstance().registerPaths(target.name, path, target, superClass)
    }
}

function Auth(roles:string[]=['$logged']){
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Metadata.getInstance().registerRoles(target.constructor.name, propertyKey, roles)
  }
}

function Get(path:string="/") { 
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      Metadata.getInstance().registerMethods(target.constructor.name, path, HttpMethod.GET, 
        propertyKey, descriptor.value, target)
    }
}

function Post(path:string="/") {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      Metadata.getInstance().registerMethods(target.constructor.name, path, HttpMethod.POST, 
        propertyKey, descriptor.value, target)
    }
}

function Patch(path:string="/") {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      Metadata.getInstance().registerMethods(target.constructor.name, path, HttpMethod.PATH, 
        propertyKey, descriptor.value, target)
    }
}

function Put(path:string="/") {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      Metadata.getInstance().registerMethods(target.constructor.name, path, HttpMethod.PUT, 
        propertyKey, descriptor.value, target)
    }
}

function Delete(path:string="/") {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      Metadata.getInstance().registerMethods(target.constructor.name, path, HttpMethod.DELETE, 
        propertyKey, descriptor.value, target)
    }
}

function All(path:string="/") {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      Metadata.getInstance().registerMethods(target.constructor.name, path, HttpMethod.ALL, 
        propertyKey, descriptor.value, target)
    }
}

export {
  Controller as Controller,
  Get as Get,
  Post as Post,
  Patch as Patch,
  Put as Put,
  Delete as Delete,
  All as All,
  Auth as Auth
}