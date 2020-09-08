import { CrudController, Model, Router, Request, Response, NextFunction} from "../.."
import authMiddleware from '../../middleware/auth.middleware'

class RestrictController extends CrudController {

    public add(router:Router){
        super.add(router)
        this.postAdmin(this.Model, router)
    }

    protected post(Model:Model<any>, router:Router){
        super.post(Model, router, ['$logged'])
    }

    protected postAdmin(Model:Model<any>, router:Router){
        router.post(`/admin`, authMiddleware(['admin']), async (req: Request, res: Response, nextFunction:NextFunction) => {
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

}

export = RestrictController


