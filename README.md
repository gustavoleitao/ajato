# Ajato

Ajato is a simple library to write web-based microservices in [Typescript](https://www.typescriptlang.org/)! Ajato uses [MongoDb](https://www.mongodb.com/) as data source and [Express](https://expressjs.com/) as web framework.

## Why use Ajato?

Ajato is simple, fast and small! Ajato uses Mongoose Schema to model your data. You just need write model and Ajato create the API for you.

## Getting start

```typescript
import ajato from 'ajato'
const app:Ajato = ajato()
app.start()
```