import express, {Router, Response, Request, NextFunction} from 'express'
import ARouter from '../arq/arouter'

class RouterBuilder {

  private readonly router: Router;

  constructor() {
    this.router = express.Router()
  }

  add(arouter:ARouter):RouterBuilder {
    arouter.add(this.router)
    return this
  }

  routes():Router{
    return this.router
  }

}

export = RouterBuilder
