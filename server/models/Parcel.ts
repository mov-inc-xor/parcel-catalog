import mongoose from 'mongoose'

const parcelSchema = new mongoose.Schema({
  cadastralNumber: {
    type: String,
    index: true,
    unique: true,
    validate: {
      validator: (u: string) => {
        return /^\d{2}:\d{2}:\d{7}:[1-9]\d{0,4}$/.test(u)
      },
      message: (props) => `${props.value} is not a valid cadastral number!`,
    },
    required: [true, 'cadastral number required'],
  },
  address: {
    type: String,
    validate: {
      validator: (p: string) => {
        return /[а-яёА-ЯЁ\.,\-0-9]+/.test(p)
      },
      message: (props) => `${props.value} is not a valid address!`,
    },
    required: [true, 'address required'],
  },
  area: {
    type: Number,
    validate: {
      validator: (p: number) => {
        return p >= 0 && p <= 100000
      },
      message: (props) => `${props.value} is not a valid area!`,
    },
    required: [true, 'area required'],
  },
})

export const Parcel = mongoose.model('Parcel', parcelSchema)
