import { Request } from "express"
import {IAUser} from './user.model'

export interface IAuthRequest extends Request {
  user: IAUser
}