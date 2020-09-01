import ajato, {Ajato, RouterBuilder, CrudController, AuthjwtController, AUser} from '../index'
import SimpleModel from './model/simple.model'

const app:Ajato = ajato()

app.use('/simple', new RouterBuilder()
    .add(new CrudController(new SimpleModel()))
    .routes())

// app.use('/', new RouterBuilder()
//     .add(new AuthjwtController(new AUser()))
//     .routes())

// app.start('mongodb://localhost:27017/ajato-test-db', 3000, () => {
//     console.log('iniciou')
// })

export = app
