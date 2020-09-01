import { equal, notEqual, ok } from "assert"
import request from "request"

const baseUrl:string = 'http://localhost:3000'

before(function (done) {
    request.post(baseUrl + '/user', {form:{name: 'Galileu Galilei', username:'galileu', realm: "geo", email: 'galileu@gmail.com', password: 'solcentro'}}, (error, response, body) => {
        done()
    })
})

describe("Testing JWT Authentication", () => {

    let refreshToken:string
    let accessToken:string

    it("POST /login ok", (done) => {
        request.post(baseUrl + '/login', {form:{ username: 'galileu', password: 'solcentro', realm: 'geo' }}, (error, response, body) => {
            const result = JSON.parse(body)
            equal(200, response.statusCode)
            notEqual(undefined, result.accessToken)
            notEqual(undefined, result.refreshToken)
            refreshToken = result.refreshToken
            accessToken = result.accessToken
            done()
        })
      })

      it("POST /login failed", (done) => {
        request.post(baseUrl + '/login', {form:{ username: 'galileu', password: 'error', realm: 'geo' }}, (error, response, body) => {
            equal(403, response.statusCode)
            done()
        })
      })

      it("POST /token ok", (done) => {
        request.post(baseUrl + '/token', {form:{token: refreshToken}}, (error, response, body) => {
            const result = JSON.parse(body)
            equal(200, response.statusCode)
            notEqual(undefined, result.accessToken)
            notEqual(accessToken, result.accessToken)
            done()
        })
      })

      it("POST /token failed", (done) => {
        request.post(baseUrl + '/token', {form:{token: refreshToken + "-"}}, (error, response, body) => {
            ok(response.statusCode > 400)
            done()
        })
      })

})



