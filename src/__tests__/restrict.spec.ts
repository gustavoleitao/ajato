
import { ok, notEqual, strictEqual } from "assert"
import request from "request"

const baseUrl: string = 'http://localhost:3000'

let loginIdAdmin: string
let loginIdComum: string
let accessTokenAdmin: string
let accessTokenComum: string
let refreshTokenAdmin: string
let refreshTokenComum: string

before(function (done) {

    request.post(baseUrl + '/user/role', {form: {"name": "admin"}}, (error, response, body) => {

        const result = JSON.parse(body)
        const dataAdmin = { 
            form: { 
                name: 'Albert Einsten', 
                username: 'einstein', 
                realm: "emc2", 
                email: 'einstein@gmail.com', 
                password: 'relatividade',
                roles: [result._id]
            } 
        }

        const dataComum = { 
            form: { 
                name: 'Isaac Newton', 
                username: 'newton', 
                realm: "emc2", 
                email: 'newton@gmail.com', 
                password: 'massa',
            } 
        }

        request.post(baseUrl + '/user', dataAdmin, (error, response, body) => {
            loginIdAdmin = JSON.parse(body)._id
            request.post(baseUrl + '/user', dataComum, (error, response, body) => {
                loginIdComum = JSON.parse(body)._id
                done()
            })
        })
        
    })
    
})

describe("Testing restrict crud", () => {

    it("POST /restrict failed", (done) => {
        request.post(baseUrl + '/restrict', { form: { title: 'title-post-teste', body: 'body-post-test' } }, (error, response, body) => {
            ok(response.statusCode > 400)
            done()
        })
    })

    it("POST /login (admin)", (done) => {
        request.post(baseUrl + '/login', { form: { username: 'einstein', password: 'relatividade', realm: 'emc2' } }, (error, response, body) => {
            const result = JSON.parse(body)
            notEqual(undefined, result.accessToken)
            notEqual(undefined, result.refreshToken)
            accessTokenAdmin = result.accessToken
            refreshTokenAdmin = result.refreshToken
            done()
        })
    })

    it("POST /login (comum)", (done) => {
        request.post(baseUrl + '/login', { form: { username: 'newton', password: 'massa', realm: 'emc2' } }, (error, response, body) => {
            const result = JSON.parse(body)
            notEqual(undefined, result.accessToken)
            notEqual(undefined, result.refreshToken)
            accessTokenComum = result.accessToken
            refreshTokenComum = result.refreshToken
            done()
        })
    })

    it("POST /restrict with logged user", (done) => {

        const options = {
            uri: baseUrl + '/restrict',
            method: 'POST',
            headers: {"Authorization": `Bearer ${accessTokenComum}`},
            form: { title: 'title-post-teste', body: 'body-post-test' }
        }

        request(options, (error, response, body) => {
            const result = JSON.parse(body)
            strictEqual(201, response.statusCode)
            strictEqual(loginIdComum, result.createdBy)
            done()
        })

    })

    it("POST /restrict Only Admin with admin user", (done) => {

        const options = {
            uri: baseUrl + '/restrict/admin/',
            method: 'POST',
            headers: {"Authorization": `Bearer ${accessTokenAdmin}`},
            form: { title: 'title-post-teste', body: 'body-post-test' }
        }

        request(options, (error, response, body) => {
            const result = JSON.parse(body)
            strictEqual(201, response.statusCode)
            strictEqual(loginIdAdmin, result.createdBy)
            done()
        })
    })

    it("POST /restrict Only Admin with common user", (done) => {

        const options = {
            uri: baseUrl + '/restrict/admin/',
            method: 'POST',
            headers: {"Authorization": `Bearer ${accessTokenComum}`},
            form: { title: 'title-post-teste', body: 'body-post-test' }
        }

        request(options, (error, response, body) => {
            const result = JSON.parse(body)
            strictEqual(403, response.statusCode)
            done()
        })

    })

})