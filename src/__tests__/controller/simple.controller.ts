import { Controller, Post, Get, Patch, Delete, Put } from "../../decorators/ajato.decorator";
import SimpleModel from "../model/simple.model";
import GenericController from "../../controller/generic.controller";
import { injectable } from "tsyringe";

@Controller('/simplev2')
@injectable()
class SimpleController extends GenericController {

    constructor(model: SimpleModel) {
        super(model)
    }

}

export = SimpleController