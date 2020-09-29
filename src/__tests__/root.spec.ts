import { strictEqual } from "assert"
import request from "request"

const baseUrl: string = 'http://localhost:3000'

describe("Testing ROOT path", () => {

  it("GET /", (done) => {
    request.get(baseUrl + '/', (error, response, body) => {
      strictEqual(200, response.statusCode)
      done()
    })
  })

})