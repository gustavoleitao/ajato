import express, { Router, Response, Request } from 'express'
import { injectable } from 'tsyringe'
import { AModel } from '../arq/amodel'
import MongooseManager from '../datasource/datasource.mongo'

interface MQueryRequest extends Request {
    mquery: string
}

@injectable()
class CrudController {

    protected AjatoModel?: any

    constructor(amodel: AModel) {
        this.AjatoModel = MongooseManager.getInstance().getMongooseModel(amodel)
    }

    public async post(req: Request, res: Response) {
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

    public async get(req: Request, res: Response) {
        const mqueryreq = req as MQueryRequest
        const options: any = mqueryreq.mquery
        this.AjatoModel.get(options, (error: any, result: any) => {
            if (error) {
                res.status(500).send(error)
            } else {
                res.status(200).send(result)
            }
        })
    }

    public async getById(req: Request, res: Response) {
        try {
            const data = await this.AjatoModel.findById(req.params.id)
            res.status(200).send(data)
        } catch (err) {
            res.status(500).send(err)
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const deletedModel = await this.AjatoModel.deleteOne({ _id: req.params.id })
            res.status(200).send(deletedModel)
        } catch (err) {
            res.status(500).send(err)
        }
    }

    public async put(req: Request, res: Response) {
        try {
            const updatedModel = await this.AjatoModel.replaceOne({ _id: req.params.id }, req.body)
            res.status(200).send(updatedModel)
        } catch (err) {
            res.status(500).send(err)
        }
    }

    public async patch(req: Request, res: Response) {
        try {
            const patchedModel = await this.AjatoModel.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
            res.status(200).send(patchedModel)
        } catch (err) {
            res.status(500).send(err)
        }
    }

}

export = CrudController