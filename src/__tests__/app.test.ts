import ajato, {Ajato, UserController} from '../index'
import RestrictController from './controller/restrict.controller'
import SimpleController from './controller/simple.controller'
import RestrictV2Controller from './controller/restrictv2.controller'
import RoleController from '../controller/role.controller'
import EmbedController from './controller/embed.controller'
import AuthJwtController from '../controller/authjwt.controller'

const app:Ajato = ajato()

app.add(RestrictV2Controller)
app.add(RestrictController)
app.add(UserController)
app.add(RoleController)
app.add(SimpleController)
app.add(EmbedController, '/embed')
app.add(AuthJwtController)

export = app
