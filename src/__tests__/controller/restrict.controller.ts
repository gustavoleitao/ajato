import { CrudController, Model, Router} from "../.."

class RestrictController extends CrudController {

    protected post(Model:Model<any>, router:Router){
        super.post(Model, router, false)
    }

}

export = RestrictController