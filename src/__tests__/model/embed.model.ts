import { AModel } from '../../index'

class SubDocumentModel extends AModel {

    name = () => 'SubDocument'
    schemaDefinition = () =>  {
        return {
          name: {
            type: String,
            required: true
          }
        }
      }
}

class EmbedModel extends AModel {
    name = () => 'Embed'
    schemaDefinition = () =>  {
      return {
        title: {
          type: String,
          required: true
        },
        body: {
          type: String,
          required: true
        },
        subs: [new SubDocumentModel().schema()]
      }
    }
  }
  
  export = EmbedModel