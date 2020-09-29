import { AModel, Document } from '../../index'

interface IPost extends Document {
  title: string
  body: string
}

class RestricModel extends AModel {
  name = () => 'Restric'
  schemaDefinition = () =>  {
    return {
      title: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: true
      }
    }
  }
}

export = RestricModel