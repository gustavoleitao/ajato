import ajato, {Ajato, AModel, Schema, Document} from '../../index'

interface IPost extends Document {
  title: string
  body: string
}

class SimpleModel implements AModel {
  name = () => 'Simple'
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

export = SimpleModel