import {Model, Schema} from 'mongoose'
import {Request, Response, Router} from 'express'
import Controller from '../arq/controller'
import AModel from '../arq/amodel'
import MongooseManager from '../datasource/datasource.mongo'

class CrudController implements Controller {

    private readonly Model:Model<any>

    constructor(amodel:AModel) {
        this.Model = MongooseManager.getInstance().getMongooseModel(amodel)
    }

    public add(router:Router){
        this._post(this.Model, router)
        this._get(this.Model, router)
        this._getById(this.Model, router)
        this._patch(this.Model, router)
        this._put(this.Model, router)
        this._delete(this.Model, router)
    }

    private _post(Model:Model<any>, router:Router){

        router.post('/', async (req: Request, res: Response) => {
            try{
                const localModel = new Model(req.body)
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

    private _getById(Model:Model<any>, router:Router){
        router.get('/:id', async (req:Request, res:Response) =>{
            try{
                const data = await Model.findById(req.params.id)
                res.status(200).send(data)
            }catch (err){
                res.status(500).send(err)
            }
        })
    }

    private _get(Model:any, router:Router){
        router.get('/', async (req:any, res: Response) => {
            const options:any = req.mquery
            console.log(options)

            Model.get(options, (error:any, result:any) => {
                if (error){
                    res.status(500).send(error)
                }else{
                    res.status(200).send(result)
                }
            })
        })
    }

    private _delete(Model:Model<any>, router:Router){
        router.delete('/:id', async (req:Request, res:Response) =>{
            try{
                const deletedModel = await Model.deleteOne({_id: req.params.id})
                res.status(200).send(deletedModel)
            }catch (err){
                res.status(500).send(err)
            }
        })
    }

    private _put(Model:Model<any>, router:Router){
        router.put('/:id', async (req:Request, res: Response) => {
            try{
                const updatedModel = await Model.replaceOne({_id: req.params.id}, req.body)
                res.status(200).send(updatedModel)
            }catch (err){
                res.status(500).send(err)
            }
        })
    }

    private _patch(Model:Model<any>, router:Router){
        router.patch('/:id', async (req: Request, res: Response) => {
            try{
                const patchedModel = await Model.updateOne({_id: req.params.id}, req.body)
                res.status(200).send(patchedModel)
            }catch (err){
                res.status(500).send(err)
            }
        })
    }

}

export = CrudController
