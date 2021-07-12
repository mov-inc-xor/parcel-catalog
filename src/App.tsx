import { ReactNode, useEffect, useState } from 'react'

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ProvideAuth, useAuth } from './hooks/useAuth'
import { SignInPage } from './pages/SignInPage'
import { ParcelCatalogPage } from './pages/ParcelCatalogPage'
import { SignUpPage } from './pages/SignUpPage'
import { Container, Row, Spinner } from 'react-bootstrap'
// import { LoginPage } from './pages/LoginPage'
// import { RegisterPage } from './pages/RegisterPage'

export default function App() {
  // const [text, setText] = useState('')

  // useEffect(() => {
  //   fetch('/api/hello/')
  //     .then((res) => res.text())
  //     .then((text) => setText(text))
  //     .catch((reason) => setText('Ошибка: + ' + reason))
  // })

  // return <h1>{text}</h1>

  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route path="/signin">
            <SignInPage />
          </Route>
          <Route path="/signup">
            <SignUpPage />
          </Route>
          <PrivateRoute path="/">
            <ParcelCatalogPage />
          </PrivateRoute>
        </Switch>
      </Router>
    </ProvideAuth>
  )
}

// function AuthButton() {
//   let history = useHistory()
//   let auth = useAuth()

//   return auth.user ? (
//     <p>
//       Welcome!{' '}
//       <button
//         onClick={() => {
//           auth.signout(() => history.push('/'))
//         }}
//       >
//         Sign out
//       </button>
//     </p>
//   ) : (
//     <p>You are not logged in.</p>
//   )
// }

type PrivateRouteProps = {
  children: ReactNode
  path: string
}

// OLD
// function PrivateRoute({ children, ...rest }: PrivateRouteProps) {
//   let auth = useAuth()
//   return (
//     <Route
//       {...rest}
//       render={({ location }) =>
//         auth.user ? (
//           children
//         ) : (
//           <Redirect
//             to={{
//               pathname: '/signin',
//               state: { from: location },
//             }}
//           />
//         )
//       }
//     />
//   )
// }

const parseCookie = () => {
  const authString = document.cookie.match(/token=([a-zA-Z0-9=]+)/)?.[1]

  if (!authString) {
    return ['', '']
  }

  const decoded = atob(authString)

  return decoded.split(':')
}

function PrivateRoute({ children, ...rest }: PrivateRouteProps) {
  const auth = useAuth()
  const [authenticated, setAuthenticated] = useState<boolean | undefined>()

  useEffect(() => {
    const [login, password] = parseCookie()

    ;(async () => {
      await auth
        .signin(login, password)
        .then(() => setAuthenticated(true))
        .catch(() => setAuthenticated(false))
    })()
  }, [auth])

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authenticated === undefined ? (
          <Container>
            <Row className="justify-content-md-center my-4">
              <Spinner animation="border" variant="primary" />
            </Row>
          </Container>
        ) : authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

// function PublicPage() {
//   return <h3>Public</h3>
// }

// function ProtectedPage() {
//   return <h3>Protected</h3>
// }

// function LoginPage() {
//   let history = useHistory()
//   let location = useLocation()
//   let auth = useAuth()

//   let { from } = location.state || ({ from: { pathname: '/' } } as any)
//   let login = () => {
//     auth.signin(() => {
//       history.replace(from)
//     })
//   }

//   return (
//     <div>
//       <p>You must log in to view the page at {from.pathname}</p>
//       <button onClick={login}>Log in</button>
//     </div>
//   )
// }
