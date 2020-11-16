import { injectable } from "tsyringe";
import { Request, Response } from "../.."
import MongooseManager from "../../datasource/datasource.mongo";
import { Auth, Controller, Post } from "../../decorators/ajato.decorator";
import RestricModel from "../model/restrict.model";

@injectable()
@Controller('/restrict')
class RestrictController {

    protected AjatoModel?: any

    constructor(amodel: RestricModel) {
        this.AjatoModel = MongooseManager.getInstance().getMongooseModel(amodel)
    }

    @Post('/admin')
    @Auth(['admin'])
    protected async postAdmin(req: Request, res: Response){
        await this.post(req, res);
    }

    @Post('/')
    @Auth()
    protected async postComum(req: Request, res: Response){
        await this.post(req, res);
    }

    private async post(req:Request, res: Response<any>) {
        try {
            const localModel = new this.AjatoModel(req.body)
            let doc = await localModel.save()
            res.status(201).send(doc)
        } catch (err) {
            if (err.message !== undefined) {
                res.status(422)
                    .header('X-Status-Reason', 'Validation failed')
                    .send({ error: 'Validation failed', message: err.message })
            } else {
                res.status(500).send(err)
            }
        }
    }
}

export = RestrictController


