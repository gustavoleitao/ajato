import { strictEqual, notStrictEqual } from "assert"
import request from "request"

const baseUrl: string = 'http://localhost:3000'

describe("Testing simple restrict crud v2", () => {

    it("GET /restrictv2", (done) => {
        request.get(baseUrl + '/restrictv2', (error, response, body) => {
            const result = JSON.parse(body)
            strictEqual(403, response.statusCode)
            done()
        })
    })
      
})