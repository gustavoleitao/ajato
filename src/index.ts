import CrudController from './controller/crud.controller'
import Controller from './arq/controller'
import AuthjwtController from './controller/authjwt.controller'
import Middleware from './arq/middleware'
import AModel from './arq/amodel'
import Ajato from './ajato'
import RouterBuilder from './util/router.builder'
import { Schema, Document, Model} from 'mongoose'
import {AUser, IAUser} from './model/user.model'
import {Router} from 'express'

export default function () {return Ajato.getInstance()}

export {
    Ajato, 
    CrudController, 
    Controller, 
    AuthjwtController, 
    RouterBuilder, 
    AModel, 
    Middleware, 
    Schema, 
    Document, 
    Model,
    AUser,
    IAUser,
    Router
}
