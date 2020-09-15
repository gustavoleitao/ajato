# Ajato

Ajato is a simple library to write web-based microservices in [Typescript](https://www.typescriptlang.org/)! Ajato uses [MongoDb](https://www.mongodb.com/) as data source and [Express](https://expressjs.com/) as web framework.

## Why use Ajato?

Ajato is simple, fast and small! Ajato uses Mongoose Schema to model your data. You just need write model and Ajato create the API for you.

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

You have to extends AModel class and implement abstract methods.

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

The shmema definition uses moogoose sintaxe. More infos in https://mongoosejs.com/docs/guide.html#definition

## Creating CRUD Operations

Once you have defined the model, you just need to use the CrudController class to create CRUD operations.

```typescript
import ajato, {CrudController} from 'ajato'
import SimpleModel from './model/simple.model'

const app:Ajato = ajato()

app.use('/simple', new RouterBuilder()
    .add(new CrudController(new SimpleModel()))
    .routes())

app.start()
```

## Authentication

Ajato implements [JWT Token](https://jwt.io/) natively to authentication and authorization:

```typescript
import ajato, {Ajato, RouterBuilder, AuthjwtController} from 'ajato'
const app:Ajato = ajato()

app.use('/', new RouterBuilder()
    .add(new AuthjwtController())
    .routes())

app.start()
```

Once you have authentication enabled, it is important manage the users. To do that, Ajato provides a basic user model and controller:

```typescript
import ajato, {Ajato, RouterBuilder, AuthjwtController, UserController} from 'ajato'
const app:Ajato = ajato()

app.use('/', new RouterBuilder()
    .add(new AuthjwtController())
    .routes())

app.use('/user', new RouterBuilder()
    .add(new UserController())
    .routes())

app.start()
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