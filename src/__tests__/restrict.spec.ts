
import { ok} from "assert"
import request from "request"

const baseUrl:string = 'http://localhost:3000'

describe("Testing restrict crud", () => {

    let id:string

    it("POST /restrict", (done) => {
        request.post(baseUrl + '/restrict', {form:{title:'title-post-teste', body: 'body-post-test'}}, (error, response, body) => {
            ok(response.statusCode > 400)
            done()
        })
      })

})