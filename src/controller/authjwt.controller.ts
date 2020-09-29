import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { AUser } from '../model/user.model'
import MongooseManager from '../datasource/datasource.mongo'
import { Model } from 'mongoose'
import Crypt from '../util/crypt'
import { Controller, Delete, Post } from '../decorators/ajato.decorator'
import { injectable, singleton } from 'tsyringe'

const EXPIRES = process.env.EXPIRES_IN || '1m'

@injectable()
@singleton()
@Controller('/')
class AuthJwtController {

    private refreshTokens: String[]
    private accessSecret: string
    private refreshSecret: string
    private userModel: AUser
    private readonly Model: Model<any>
    private crypt: Crypt

    constructor(userModel: AUser) {
        this.refreshTokens = []
        this.accessSecret = 'auth-secret'
        this.refreshSecret = 'refresh-secret'
        process.env.ACCESS_TOKEN_SECRET = this.accessSecret
        process.env.REFRESH_TOKEN_SECRET = this.refreshSecret
        this.userModel = userModel
        this.Model = MongooseManager.getInstance().getMongooseModel(this.userModel)
        this.crypt = new Crypt()
    }

    @Post('/login')
    public async login(req: Request, res: Response) {
        const userDb = await this.findUser(req)
        if (userDb != null && userDb !== undefined) {

            if (await this.checkPassword(req, res, userDb.password)) {
                const payload = userDb.toJSON()
                const accessToken = jwt.sign(payload, this.accessSecret, { expiresIn: EXPIRES })
                const refreshToken = jwt.sign(payload, this.refreshSecret)
                this.refreshTokens.push(refreshToken)
                res.json({ accessToken: accessToken, refreshToken: refreshToken })
            } else {
                res.sendStatus(403)
            }

        } else {
            res.sendStatus(403)
        }
    }

    private async checkPassword(req: Request, res: Response, password: string) {
        try {
            return await this.crypt.compare(req.body.password, password)
        } catch (err) {
            res.sendStatus(403)
        }
    }

    private async findUser(req: Request) {
        const username: string = req.body.username
        const pass: string = req.body.password
        const realm: string = req.body.realm

        let query: { username: string; realm?: string; } = { username: username }
        if (realm !== undefined && realm.length > 0) {
            query = { ...query, realm: realm }
        }
        return await this.Model.findOne(query).populate('roles')
    }

    @Delete('/logout')
    public async logout(req: Request, res: Response) {
        const userToken: String = req.body.token
        this.refreshTokens = this.refreshTokens.filter(token => token !== userToken)
        res.sendStatus(204)
    }

    @Post('/token')
    public token(req: Request, res: Response) {
        const refreshToken = req.body.token
        if (refreshToken == null) {
            return res.sendStatus(401)
        } else if (!this.refreshTokens.includes(refreshToken)) {
            res.sendStatus(403)
        } else {
            const decoded: any = jwt.verify(refreshToken, this.refreshSecret)
            const accessToken = this.generateAccessToken({ username: decoded.username })
            res.json({ accessToken: accessToken })
        }
    }

    private generateAccessToken(user: any) {
        return jwt.sign(user, this.accessSecret, { expiresIn: EXPIRES })
    }

}

export = AuthJwtController