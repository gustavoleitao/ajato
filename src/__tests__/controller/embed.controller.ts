import { injectable } from "tsyringe"
import GenericController from "../../controller/generic.controller"
import { Controller } from "../../decorators/ajato.decorator"
import EmbedModel from "../model/embed.model"

@Controller('/embed')
@injectable()
class EmbedController extends GenericController {

    constructor(model:EmbedModel){
        super(model)
    }

}

export = EmbedController