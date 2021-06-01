# Ajato

Ajato is a simple library to write web-based microservices in [Typescript](https://www.typescriptlang.org/)! Ajato uses [MongoDb](https://www.mongodb.com/) as data source and [Express](https://expressjs.com/) as web framework.

## Why use Ajato?

Ajato is simple, fast and small! Ajato uses Mongoose Schema to model your data. You just need write model and controller and Ajato will create the API for you.

## Getting start

```console
$ npm install ajato
```

Minimum code to start ajato:

```typescript
import ajato, { Ajato } from 'ajato'
const app:Ajato = ajato()
app.start()
```

## Creating models

You need to extends AModel class and implement abstract methods.

```typescript
import {AModel} from 'ajato'

export default class SimpleModel extends AModel {
  name = () => 'SimpleModel'
  schemaDefinition = () =>  {
    return {
      title: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: false
      }
    }
  }
}
```

The schema definition uses moogoose sintaxe. More infos in https://mongoosejs.com/docs/guide.html#definition

## Creating CRUD Operations

Once you have defined the model, you just need create a Controller that extends GenericController.

```typescript
import { Controller, GenericController } from 'ajato'
import SimpleModel from "./model/simple.model"
import { injectable } from "tsyringe"

@Controller('/simplev')
@injectable()
export default class SimpleController extends GenericController {

    constructor(model: SimpleModel) {
        super(model)
    }

}
```

The controllers should use @Controller decorator to inform to ajato that is a controller and also the @injectable decorator to allow the ajato resolve Class and create an instance.

Next step is register the new Controller:

```typescript
import ajato, {Ajato} from 'ajato'
import SimpleController from './controller/simple.controller'
const app:Ajato = ajato()
app.add(SimplController)
app.start()
```

## Authentication

Ajato implements [JWT Token](https://jwt.io/) natively to authentication and authorization:

To add JWT routes and user management, you need register UserController and AuthJwtController:

```typescript
import ajato, {Ajato, AuthJwtController, UserController} from 'ajato'
const app:Ajato = ajato()
app.add(AuthJwtController)
app.add(UserController)
app.start()
```

Once you have authentication enabled, you can protect a controller method through @Auth decorator.

```typescript

import { injectable } from "tsyringe";
import { Request, Response, MongooseManager, Auth, Controller, Post} from 'ajato'
import RestricModel from "./model/restrict.model"; //some model

@injectable()
@Controller('/restrict')
class RestrictController {

    protected AjatoModel?: any

    constructor(amodel: RestricModel) {
        this.AjatoModel = MongooseManager.getInstance().getMongooseModel(amodel)
    }

    @Post('/')
    @Auth()
    protected async postComum(req: Request, res: Response){
        //Only authenticated users can do this
    }

    @Post('/admin')
    @Auth(['admin', 'master'])
    protected async postAdmin(req: Request, res: Response){
       //Only authenticated users with admin or master role can do this
    }

}

export = RestrictController

```

## Options

You can define MongoDB URI, web server port and callback:

```typescript
import ajato, { Ajato } from 'ajato'
const app:Ajato = ajato()
app.start('http://localhost:27017/mydb', 5000, () => {
  console.log('Ajato is on fire on port 5000!')
})
```
