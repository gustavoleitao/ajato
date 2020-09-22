import { equal, notEqual } from "assert"
import request from "request"

const baseUrl:string = 'http://localhost:3000'

describe.skip("Testing simple crud", () => {

  let id:string

  it("POST /simple", (done) => {
    request.post(baseUrl + '/simple', {form:{title:'title-post-teste', body: 'body-post-test'}}, (error, response, body) => {
        const result = JSON.parse(body)
        equal(201, response.statusCode)
        notEqual(undefined, result._id)
        id = result._id
        equal('title-post-teste', result.title)
        equal('body-post-test', result.body)
        done()
    })
  })

  it('GET /simple:id', (done) => {
    request.get(baseUrl + `/simple/${id}`, (error, response, body) => {
        const result = JSON.parse(body)
        equal(200, response.statusCode)
        equal(id, result._id)
        done()
    })
  })

  it("GET /simple", (done) => {
    request.get(baseUrl + '/simple', (error, response, body) => {
        equal(200, response.statusCode)
        done()
    })
  })

  it('PATCH /simple:id', (done) => {
    request.patch(baseUrl + `/simple/${id}`, {form:{body: 'body-post-test-after-patch'}}, (error, response, body) => {
        const result = JSON.parse(body)
        equal(200, response.statusCode)
        equal(1, result.nModified)
        equal(1, result.ok)

        request.get(baseUrl + `/simple/${id}`, (error, req, body) => {
            const resultGet = JSON.parse(body)
            equal('body-post-test-after-patch', resultGet.body)
            equal('title-post-teste', resultGet.title)
            done()
        })
    })
  })

  it('PUT /simple:id', (done) => {
    request.put(baseUrl + `/simple/${id}`, {form:{body: 'body-post-test-after-put'}}, (error, response, body) => {
        const result = JSON.parse(body)
        equal(200, response.statusCode)
        equal(1, result.nModified)
        equal(1, result.ok)
        request.get(baseUrl + `/simple/${id}`, (error, req, body) => {
            const resultGet = JSON.parse(body)
            equal('body-post-test-after-put', resultGet.body)
            equal(undefined, resultGet.title)
            done()
        })
    })
  })

  it('DELETE /simple:id', (done) => {
    request.delete(baseUrl + `/simple/${id}`, (error, response, body) => {
        const result = JSON.parse(body)
        equal(200, response.statusCode)
        equal(1, result.deletedCount)
        equal(1, result.ok)
        done()
    })
  })

})