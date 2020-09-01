# Ajato

Ajtato is a simple library to write web based microservices in Typescript! Ajato use [MongoDb](https://www.mongodb.com/) as datasource and [Express](https://expressjs.com/) as base framework.

## Why use Ajato?

Ajaso is simple, fast and small! Ajato uses Mongoose Schema to model your data. You just need write model and Ajato create the API for you.

## Getting start

```typescript
import ajato from 'ajato'
const app:Ajato = ajato()
app.start()
```