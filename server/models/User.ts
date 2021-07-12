import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    validate: {
      validator: (u: string) => {
        return /[a-zA-Z0-9.-_]+\@[a-z]+\.[a-z]+/.test(u)
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
    required: [true, 'email required'],
  },
  password: {
    type: String,
    validate: {
      validator: (p: string) => {
        return /\w+/.test(p)
      },
      message: (props) => `${props.value} is not a valid password!`,
    },
    required: [true, 'password required'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: [true, 'role required'],
  },
})

export const User = mongoose.model('User', userSchema)
