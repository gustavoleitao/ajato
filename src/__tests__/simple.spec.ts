import { strictEqual, notStrictEqual } from "assert"
import request from "request"

const baseUrl: string = 'http://localhost:3000'

describe("Testing simple crud v2", () => {

    let id:string

    it("POST /simplev2", (done) => {
        request.post(baseUrl + '/simplev2', { form: { title: 'title-post-teste', body: 'body-post-test' } }, (error, response, body) => {
            const result = JSON.parse(body)
            strictEqual(201, response.statusCode)
            notStrictEqual(undefined, result._id)
            id = result._id
            strictEqual('title-post-teste', result.title)
            strictEqual('body-post-test', result.body)
            done()
        })
    })

    it('GET /simplev2/:id', (done) => {
        request.get(baseUrl + `/simplev2/${id}`, (error, response, body) => {
            const result = JSON.parse(body)
            strictEqual(200, response.statusCode)
            strictEqual(id, result._id)
            done()
        })
    })

    it("GET /simplev2", (done) => {
        request.get(baseUrl + '/simplev2', (error, response, body) => {
            const result = JSON.parse(body)
            strictEqual(200, response.statusCode)
            strictEqual(1, result.total)
            done()
        })
    })

    it('PATCH /simplev2:id', (done) => {
        request.patch(baseUrl + `/simplev2/${id}`, {form:{body: 'body-post-test-after-patch'}}, (error, response, body) => {
            const result = JSON.parse(body)
            strictEqual(200, response.statusCode)
            strictEqual(1, result.nModified)
            strictEqual(1, result.ok)
    
            request.get(baseUrl + `/simplev2/${id}`, (error, req, body) => {
                const resultGet = JSON.parse(body)
                strictEqual('body-post-test-after-patch', resultGet.body)
                strictEqual('title-post-teste', resultGet.title)
                done()
            })
        })
      })

      it('PUT /simplev2:id', (done) => {
        request.put(baseUrl + `/simplev2/${id}`, {form:{body: 'body-post-test-after-put'}}, (error, response, body) => {
            const result = JSON.parse(body)
            strictEqual(200, response.statusCode)
            strictEqual(1, result.nModified)
            strictEqual(1, result.ok)
            request.get(baseUrl + `/simplev2/${id}`, (error, req, body) => {
                const resultGet = JSON.parse(body)
                strictEqual('body-post-test-after-put', resultGet.body)
                strictEqual(undefined, resultGet.title)
                done()
            })
        })
      })
    
      it('DELETE /simplev2:id', (done) => {
        request.delete(baseUrl + `/simplev2/${id}`, (error, response, body) => {
            const result = JSON.parse(body)
            strictEqual(200, response.statusCode)
            strictEqual(1, result.deletedCount)
            strictEqual(1, result.ok)
            done()
        })
      })
      
})