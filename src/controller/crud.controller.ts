import {Model, Schema} from 'mongoose'
import {Request, Response, Router, NextFunction} from 'express'
import Controller from '../arq/controller'
import AModel from '../arq/amodel'
import MongooseManager from '../datasource/datasource.mongo'
import authcallback from '../middleware/auth.middleware'
const { deepParseJson } = require('deep-parse-json')

class CrudController implements Controller {

    private readonly Model:Model<any>

    constructor(amodel:AModel) {
        this.Model = MongooseManager.getInstance().getMongooseModel(amodel)
    }

    public add(router:Router){
        this.post(this.Model, router)
        this.get(this.Model, router)
        this.getById(this.Model, router)
        this.patch(this.Model, router)
        this.put(this.Model, router)
        this.delete(this.Model, router)
    }

    private parseBody(req: Request):any{
        try{
            const stringfyBody = JSON.stringify(req.body)
            return deepParseJson(stringfyBody)
        }catch(err) {
            return req.body
        }
    }

    protected post(Model:Model<any>, router:Router, isPublic:boolean=true){

        router.post('/', authcallback(isPublic), async (req: Request, res: Response, nextFunction:NextFunction) => {
        
            try{
                const localModel = new Model(this.parseBody(req))
                let doc = await localModel.save()
                res.status(201).send(doc)
            }catch (err){
                if (err.message !== undefined) {
                    res.status(422)
                        .header('X-Status-Reason', 'Validation failed')
                        .send({error: 'Validation failed', message: err.message})
                }else{
                    res.status(500).send(err)
                }
            }
        })

    }

    protected getById(Model:Model<any>, router:Router){
        router.get('/:id', async (req:Request, res:Response) =>{
            try{
                const data = await Model.findById(req.params.id)
                res.status(200).send(data)
            }catch (err){
                res.status(500).send(err)
            }
        })
    }

    protected get(Model:any, router:Router){
        router.get('/', async (req:any, res: Response) => {
            const options:any = req.mquery
            Model.get(options, (error:any, result:any) => {
                if (error){
                    res.status(500).send(error)
                }else{
                    res.status(200).send(result)
                }
            })
        })
    }

    protected delete(Model:Model<any>, router:Router){
        router.delete('/:id', async (req:Request, res:Response) =>{
            try{
                const deletedModel = await Model.deleteOne({_id: req.params.id})
                res.status(200).send(deletedModel)
            }catch (err){
                res.status(500).send(err)
            }
        })
    }

    protected put(Model:Model<any>, router:Router){
        router.put('/:id', async (req:Request, res: Response) => {
            try{
                const updatedModel = await Model.replaceOne({_id: req.params.id}, this.parseBody(req))
                res.status(200).send(updatedModel)
            }catch (err){
                res.status(500).send(err)
            }
        })
    }

    protected patch(Model:Model<any>, router:Router){
        router.patch('/:id', async (req: Request, res: Response) => {
            try{
                const patchedModel = await Model.updateOne({_id: req.params.id}, this.parseBody(req))
                res.status(200).send(patchedModel)
            }catch (err){
                res.status(500).send(err)
            }
        })
    }

}

export = CrudController
