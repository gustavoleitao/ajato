
import { ok, notEqual, equal } from "assert"
import request from "request"

const baseUrl: string = 'http://localhost:3000'
let loginId: string
let accessToken: string
let refreshToken: string

before(function (done) {
    request.post(baseUrl + '/user', { form: { name: 'Albert Einsten', username: 'einstein', realm: "emc2", email: 'einstein@gmail.com', password: 'relatividade' } }, (error, response, body) => {
        const result = JSON.parse(body)
        loginId = result._id
        done()
    })
})

describe("Testing restrict crud", () => {

    it("POST /restrict failed", (done) => {
        request.post(baseUrl + '/restrict', { form: { title: 'title-post-teste', body: 'body-post-test' } }, (error, response, body) => {
            ok(response.statusCode > 400)
            done()
        })
    })

    it("POST /login (logging)", (done) => {
        request.post(baseUrl + '/login', { form: { username: 'einstein', password: 'relatividade', realm: 'emc2' } }, (error, response, body) => {
            const result = JSON.parse(body)
            notEqual(undefined, result.accessToken)
            notEqual(undefined, result.refreshToken)
            accessToken = result.accessToken
            refreshToken = result.refreshToken
            done()
        })
    })

    it("POST /restrict OK", (done) => {

        const options = {
            uri: baseUrl + '/restrict',
            method: 'POST',
            headers: {"Authorization": `Bearer ${accessToken}`},
            form: { title: 'title-post-teste', body: 'body-post-test' }
        }

        request(options, (error, response, body) => {
            const result = JSON.parse(body)
            equal(201, response.statusCode)
            equal(loginId, result.createdBy)
            done()
        })

    })

})