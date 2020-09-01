import ajato, {Ajato, RouterBuilder, CrudController, AuthjwtController, AUser} from '../index'
import SimpleModel from './model/simple.model'

const app:Ajato = ajato()

app.use('/simple', new RouterBuilder()
    .add(new CrudController(new SimpleModel()))
    .routes())

app.use('/user', new RouterBuilder()
    .add(new CrudController(new AUser()))
    .routes())

app.use('/', new RouterBuilder()
    .add(new AuthjwtController())
    .routes())

export = app
