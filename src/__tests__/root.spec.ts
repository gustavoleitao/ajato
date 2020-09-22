import { equal } from "assert"
import request from "request"

const baseUrl:string = 'http://localhost:3000'

describe.skip("Testing ROOT path", () => {

  it("GET /", (done) => {
    request.get(baseUrl + '/', (error, response, body) => {
      equal(200, response.statusCode)
      done()
    })
  })

})