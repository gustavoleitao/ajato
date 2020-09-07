import { equal, notEqual, ok } from "assert"
import request from "request"

const baseUrl:string = 'http://localhost:3000'

describe("Testing User API", () => {

    it("POST /user ok", (done) => {

        request.post(baseUrl + '/user', {form:{name: 'Alan Turing', username: 'alan', realm: 'ajato', email: 'alan@gmail.com', password: 'enigma'}}, (error, response, body) => {
            equal(201, response.statusCode)
            done()
        })

      })

      it("POST /user same user same realm", (done) => {

        request.post(baseUrl + '/user', {form:{name: 'Alan Moore', username: 'alan', realm: 'ajato', email: 'alan.moore@gmail.com', password: 'writter'}}, (error, response, body) => {
            ok(response.statusCode > 400)
            done()
        })

      })

      it("POST /user other realm same username", (done) => {

        request.post(baseUrl + '/user', {form:{name: 'Alan Greenspan', username: 'alan', realm: 'other', email: 'alan.greenspan@gmail.com', password: 'greenspa'}}, (error, response, body) => {
            equal(201, response.statusCode)
            done()
        })

      })

      it("POST /user same email other realm", (done) => {

        request.post(baseUrl + '/user', {form:{name: 'Alan Moore', username: 'alan.moore', realm: 'other', email: 'alan@gmail.com', password: 'moore'}}, (error, response, body) => {
            equal(201, response.statusCode)
            done()
        })

      })

      it("POST /user same email same realm other username", (done) => {

        request.post(baseUrl + '/user', {form:{name: 'Alan Frankling', username: 'alan.frankling', realm: 'ajato', email: 'alan@gmail.com', password: 'frankling'}}, (error, response, body) => {
            ok(response.statusCode > 400)
            done()
        })

      })

})