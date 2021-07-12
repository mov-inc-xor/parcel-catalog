import express, { Response } from 'express'
import cors from 'cors'
import btoa from 'btoa'
import mongoose from 'mongoose'
import { User } from './models/User'
import { Parcel } from './models/Parcel'
import { registerBackup } from './backup'

const connectDB = () => {
  return mongoose.connect('mongodb://mongo/parcel-catalog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
}

const app = express()

app.use(cors())

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

const setCookie = (res: Response, key: string, value: string) => {
  res.cookie(key, value, { maxAge: 900000, encode: String })
}

const clearCookie = (res: Response, key: string) => {
  res.cookie(key, '', { maxAge: 0 })
}

app.post('/api/signin', async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await User.findOne({ email, password }).exec()

  if (!user) {
    res.send({
      status: false,
      message: 'Неверный логин и/или пароль',
    })
    return
  }

  setCookie(res, 'token', btoa(email + ':' + password))

  res.send({
    status: true,
    role: user.role,
  })
})

app.post('/api/signup', async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await User.findOne({ email }).exec()

  if (user) {
    res.send({
      status: false,
      message: 'Такой пользователь уже существует',
    })
    return
  }

  await User.create({ email, password, role: 'user' })

  setCookie(res, 'token', btoa(email + ':' + password))

  res.send({
    status: true,
    role: 'user',
  })
})

app.post('/api/logout', (req, res) => {
  clearCookie(res, 'token')

  res.send({
    status: true,
  })
})

app.get('/api/parcels', async (req, res) => {
  const parcels = await Parcel.find({}).exec()

  res.send(
    parcels.map((parcel: any) => ({
      cadastralNumber: parcel.cadastralNumber,
      address: parcel.address,
      area: parcel.area,
    }))
  )

  // res.send([
  //   {
  //     cadastralNumber: '31:11:1234567:1',
  //     address: 'г. Белгород, п. Майский, ул. Чапаева. д. 41',
  //     area: 1150,
  //   },
  //   {
  //     cadastralNumber: '31:12:1234567:12',
  //     address: 'г. Белгород, п. Майский, ул. Чапаева. д. 42',
  //     area: 1250,
  //   },
  //   {
  //     cadastralNumber: '31:13:1234567:13',
  //     address: 'г. Белгород, п. Майский, ул. Чапаева. д. 43',
  //     area: 1170,
  //   },
  // ])
})

app.post('/api/parcel', async (req, res) => {
  const cadastralNumber = req.body.cadastralNumber
  const address = req.body.address
  const area = req.body.area

  await Parcel.create({ cadastralNumber, address, area })
    .then(() =>
      res.send({
        status: true,
      })
    )
    .catch((e: Error) =>
      res.send({
        status: false,
        message: e.message,
      })
    )
})

app.listen(8080, async () => {
  await connectDB()
    .then(() => console.log('MongoDB connected'))
    .catch((err: Error) => console.log('MongoDB error: ' + err.message))
    .then(() => console.log('Server started...'))

  // Раскомментировать для автоматического создания бэкапов
  // registerBackup()
})
