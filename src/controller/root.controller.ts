import {Router, Response, Request, NextFunction} from 'express'

const readPkgUp = require('read-pkg-up')

class RootController {

    private readonly startup: { startUp: Date; name: string; description: string; version: string };

    constructor() {
        const contentOfParent = readPkgUp.sync().packageJson
        this.startup = {startUp: new Date(), name: contentOfParent.name, description: contentOfParent.description, version: contentOfParent.version}
    }

    add(router: Router) {
        this._startup(router)
    }

    _startup(router: Router) {
        router.get('/', (req, res) => {
            res.status(200).json(this.startup)
        })
    }

}

export = RootController
