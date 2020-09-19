import { NextFunction, Request, Response, Router } from "express";
import Middleware  from "../arq/middleware"
import Crypt from '../util/crypt'

export default class PasswordMiddleware implements Middleware {

    add(router:Router){
        this.post(router)
    }

    post(router:Router){

        router.post('/', async (req: Request, res: Response, nextFunction:NextFunction) => {

            try{
                const crypt:Crypt = new Crypt()
                const password = req.body.password
                req.body.password = await crypt.encrypt(password)
                nextFunction()
            }catch(err){
                res.sendStatus(500)
            }

        })

    }

}