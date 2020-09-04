import jwt, {VerifyErrors} from 'jsonwebtoken'
import {Request, Response, Router} from 'express'
import Middleware from "../arq/middleware";
import Controller = require("../arq/controller")
import {AUser} from '../model/user.model'
import MongooseManager from '../datasource/datasource.mongo'
import {Schema, Model} from 'mongoose'

const EXPIRES = process.env.EXPIRES_IN || '1m'

class AuthjwtController implements Controller {

    private refreshTokens: String[]
    private accessSecret:string
    private refreshSecret:string
    private userModel:AUser
    private readonly Model:Model<any>

    constructor(userModel?:AUser) {
        this.refreshTokens = []
        this.accessSecret = 'auth-secret'
        this.refreshSecret = 'refresh-secret'
        process.env.ACCESS_TOKEN_SECRET = this.accessSecret
        process.env.REFRESH_TOKEN_SECRET = this.refreshSecret
        this.userModel = userModel != null ? userModel : new AUser()
        this.Model = MongooseManager.getInstance().getMongooseModel(this.userModel)
    }

    add(router:Router){
        this._login(router)
        this._token(router)
        this._logout(router)
    }

     private _login(router:Router){
        router.post('/login', async (req:Request, res:Response) => {
            const userDb = await this.findUser(req)
            if (userDb != null && userDb !== undefined){
                const payload = userDb.toJSON()
                const accessToken = jwt.sign(payload, this.accessSecret, {expiresIn: EXPIRES})
                const refreshToken = jwt.sign(payload, this.refreshSecret)
                this.refreshTokens.push(refreshToken)
                res.json({accessToken: accessToken, refreshToken: refreshToken})
            }else{
                res.sendStatus(403)
            }
        })
    }

    private async findUser(req:Request) {
        const username: string = req.body.username
        const pass: string = req.body.password
        const realm: string = req.body.realm

        let query: { username: string; password: string; realm?: string; } = { username: username, password: pass }
        if (realm.length > 0) {
            query = { ...query, realm: realm }
        }
        return await this.Model.findOne(query)
    }

    private _logout(router:Router){
        router.delete('/logout', (req:Request, res:Response) => {
            const userToken:String = req.body.token
            this.refreshTokens = this.refreshTokens.filter(token => token !== userToken)
            res.sendStatus(204)
        })
    }

    private _token(router:Router){
        router.post('/token', (req:Request, res:Response) => {
            const refreshToken = req.body.token
            if (refreshToken == null) {
                return res.sendStatus(401)
            }else if (!this.refreshTokens.includes(refreshToken)) {
                res.sendStatus(403)
            }else{
                const decoded:any = jwt.verify(refreshToken, this.refreshSecret)
                const accessToken = this.generateAccessToken({username: decoded.username})
                res.json({accessToken:  accessToken})
            }
        })
    }

    private generateAccessToken(user:any){
        return jwt.sign(user, this.accessSecret, {expiresIn: EXPIRES})
    }

}

export = AuthjwtController