import app from "./app.test"

const mongoURL:string = process.env.MONGO_TEST_URL || 'mongodb://localhost:27017/ajato-test-db'

before(function (done) {
    //silence the console
    // console.log = function () {}
    app.start(mongoURL, 3000, async () => {
        const mongoose =  app.db()
        const collections = await mongoose.connection.db.collections()
        for (let collection of collections) {
            await collection.deleteOne({})
       }
        done()
    })
})

after(function (done) {
    app.shutdown(done)
})

