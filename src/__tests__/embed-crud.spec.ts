import { equal, notEqual } from "assert"
import request from "request"

const baseUrl:string = 'http://localhost:3000'

describe.skip("Testing embed crud", () => {

  let id:string

  it("POST /embed", (done) => {
    request.post(baseUrl + '/embed', {form:{title:'embed-title-post-teste', body: 'embed-body-post-test', subs: {name: "sub-document-name"}}}, (error, response, body) => {
        const result = JSON.parse(body)
        equal(201, response.statusCode)
        notEqual(undefined, result._id)
        id = result._id
        equal('embed-title-post-teste', result.title)
        equal('embed-body-post-test', result.body)
        equal(1, result.subs.length)
        done()
    })
  })

  it("POST /embed", (done) => {
    request.post(baseUrl + '/embed', {form:{title:'embed-title-post-teste', body: 'embed-body-post-test', subs: [{name: "sub-document-name-1"}, {name: "sub-document-name-2"}]}}, (error, response, body) => {
        const result = JSON.parse(body)
        equal(201, response.statusCode)
        notEqual(undefined, result._id)
        id = result._id
        equal('embed-title-post-teste', result.title)
        equal('embed-body-post-test', result.body)
        equal(2, result.subs.length)
        done()
    })
  })

  it('GET /embed:id', (done) => {
    request.get(baseUrl + `/embed/${id}`, (error, response, body) => {
        const result = JSON.parse(body)
        equal(200, response.statusCode)
        equal(id, result._id)
        equal(2, result.subs.length)
        done()
    })
  })

  it("GET /embed", (done) => {
    request.get(baseUrl + '/embed', (error, response, body) => {
        const result = JSON.parse(body)
        equal(200, response.statusCode)
        done()
    })
  })

  it('PATCH /embed:id', (done) => {
    request.patch(baseUrl + `/embed/${id}`, {form:{body: 'embed-ody-post-test-after-patch', subs: [{"name": 'sub-document-name-3'}]}}, (error, response, body) => {
        const result = JSON.parse(body)
        equal(200, response.statusCode)
        equal(1, result.nModified)
        equal(1, result.ok)

        request.get(baseUrl + `/embed/${id}`, (error, req, body) => {
            const resultGet = JSON.parse(body)
            equal('embed-ody-post-test-after-patch', resultGet.body)
            equal('embed-title-post-teste', resultGet.title)
            done()
        })
    })
  })

  it('PUT /embed:id', (done) => {
    request.put(baseUrl + `/embed/${id}`, {form:{body: 'body-post-test-after-put'}}, (error, response, body) => {
        const result = JSON.parse(body)
        equal(200, response.statusCode)
        equal(1, result.nModified)
        equal(1, result.ok)
        request.get(baseUrl + `/embed/${id}`, (error, req, body) => {
            const resultGet = JSON.parse(body)
            equal('body-post-test-after-put', resultGet.body)
            equal(undefined, resultGet.title)
            done()
        })
    })
  })

  it('DELETE /embed:id', (done) => {
    request.delete(baseUrl + `/embed/${id}`, (error, response, body) => {
        const result = JSON.parse(body)
        equal(200, response.statusCode)
        equal(1, result.deletedCount)
        equal(1, result.ok)
        done()
    })
  })

})