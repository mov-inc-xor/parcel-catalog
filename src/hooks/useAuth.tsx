import { createContext, ReactNode, useContext, useRef } from 'react'

type User = {
  email: string
  role: 'user' | 'admin'
}

type UseProvideAuth = {
  user: React.MutableRefObject<User | null>
  signin: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
}

const authContext = createContext<UseProvideAuth | null>(null)

export function useAuth() {
  return useContext(authContext)!
}

function useProvideAuth(): UseProvideAuth {
  const user = useRef<User | null>(null)
  // const history = useHistory()

  const signin = async (email: string, password: string) => {
    return new Promise<void>(async (resolve, reject) => {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!res.ok) {
        reject(new Error('Ошибка отправки запроса: ' + res.status + ', ' + res.statusText))
      }

      const json = await res.json().catch(reject)

      if (!json['status']) {
        reject(new Error(json['message']))
      }

      user.current = {
        email,
        role: json['role'],
      }

      // alert(user)

      resolve()
    })
  }

  const signup = async (email: string, password: string) => {
    return new Promise<void>(async (resolve, reject) => {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!res.ok) {
        reject(new Error('Ошибка отправки запроса: ' + res.status + ', ' + res.statusText))
      }

      const json = await res.json().catch((e: Error) => reject(e.message))

      if (!json['status']) {
        reject(new Error(json['message']))
      }

      user.current = {
        email,
        role: json['role'],
      }

      resolve()
    })
  }

  const logout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    })
    window.location.reload()
  }

  return {
    user,
    signin,
    signup,
    logout,
  }
}

type ProvideAuthProps = {
  children: ReactNode
}

export function ProvideAuth({ children }: ProvideAuthProps) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
