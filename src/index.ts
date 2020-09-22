// import Controller from './arq/controller'
import CrudController from './controller/crud.controller'
import UserController from './controller/user.controller'
import AuthjwtController from './controller/authjwt.controller'
import Middleware from './arq/middleware'
import authMiddleware from './middleware/auth.middleware'
import { AModel } from './arq/amodel'
import Ajato from './ajato'
import RouterBuilder from './util/router.builder'
import { Schema, SchemaDefinition, Document, Model} from 'mongoose'
import {AUser, IAUser} from './model/user.model'
import {Router, Request, Response, NextFunction} from 'express'
import {Controller, Get, Post, Delete, Put, Patch, All} from './decorators/ajato.decorator'

export default function () {return Ajato.getInstance()}

export {
    Ajato, 
    CrudController, 
    UserController,
    AuthjwtController, 
    RouterBuilder, 
    AModel, 
    Middleware, 
    Schema, 
    Document, 
    SchemaDefinition,
    authMiddleware,
    Model,
    AUser,
    IAUser,
    Router,
    Request,
    Response,
    NextFunction,
    Controller,
    Get,
    Post,
    Delete, 
    Patch,
    Put, 
    All
}
