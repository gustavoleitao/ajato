import Controller from './arq/controller'
import CrudController from './controller/crud.controller'
import UserController from './controller/user.controller'
import AuthjwtController from './controller/authjwt.controller'
import Middleware from './arq/middleware'
import { AModel } from './arq/amodel'
import Ajato from './ajato'
import RouterBuilder from './util/router.builder'
import { Schema, SchemaDefinition, Document, Model} from 'mongoose'
import {AUser, IAUser} from './model/user.model'
import {Router} from 'express'


export default function () {return Ajato.getInstance()}

export {
    Ajato, 
    CrudController, 
    UserController,
    Controller, 
    AuthjwtController, 
    RouterBuilder, 
    AModel, 
    Middleware, 
    Schema, 
    Document, 
    SchemaDefinition,
    Model,
    AUser,
    IAUser,
    Router
}
