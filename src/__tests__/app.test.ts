import ajato, {Ajato, RouterBuilder, CrudController, AuthjwtController, AUser} from '../index'
import SimpleModel from './model/simple.model'
import RestrictController from './controller/restrict.controller'

const app:Ajato = ajato()

app.use('/', new RouterBuilder()
    .add(new AuthjwtController())
    .routes())

app.use('/simple', new RouterBuilder()
    .add(new CrudController(new SimpleModel()))
    .routes())

app.use('/restrict', new RouterBuilder()
    .add(new RestrictController(new SimpleModel()))
    .routes())

app.use('/user', new RouterBuilder()
    .add(new CrudController(new AUser()))
    .routes())

export = app
