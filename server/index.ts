import express from 'express'
import cors from 'cors'

import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017/parcel-catalog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', console.log.bind(console, 'MongoDB connected'))

const app = express()

app.use(cors())

app.get('/api/hello/', async (req, res) => {
  res.send('hello')
})

app.listen(8000, () => {
  console.log('Server started...')
})
