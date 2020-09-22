import ajato, {Ajato, RouterBuilder, CrudController, AuthjwtController, AUser, UserController} from '../index'
import SimpleModel from './model/simple.model'
import EmbedModel from './model/embed.model'

import RestrictController from './controller/restrict.controller'
import SimpleController from './controller/simple.controller'
import RestrictV2Controller from './controller/restrictv2.controller'

const app:Ajato = ajato()

app.add(new SimpleController())
app.add(new RestrictV2Controller())

app.use('/', new RouterBuilder()
    .add(new AuthjwtController())
    .routes())

app.use('/simple', new RouterBuilder()
    .add(new CrudController(new SimpleModel()))
    .routes())

app.use('/embed', new RouterBuilder()
    .add(new CrudController(new EmbedModel()))
    .routes())

app.use('/restrict', new RouterBuilder()
    .add(new RestrictController(new SimpleModel()))
    .routes())

app.use('/user', new RouterBuilder()
    .add(new UserController())
    .routes())

export = app
