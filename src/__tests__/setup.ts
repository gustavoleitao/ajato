import app from "./app.test"

before(function (done) {
    //silence the console
    // console.log = function () {}
    console.log('chaou before')
    app.start('mongodb://localhost:27017/ajato-test-db', 3000, () => {
        done()
    })
})

after(function (done) {
    console.log('chaou after')
    app.shutdown(done)
})

