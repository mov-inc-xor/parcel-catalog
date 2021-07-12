import React, { useState } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import md5 from 'md5'

export function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const history = useHistory()
  const location = useLocation()
  const auth = useAuth()

  const { from } = location.state || ({ from: { pathname: '/' } } as any)

  function validateForm() {
    return email.length > 0 && password.length > 0
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    auth
      .signin(email, md5(password))
      .then(() => history.replace(from))
      .catch((e: Error) => alert(e.message))
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} sm={4} md={4}>
          <h1 className="text-center">Авторизация</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Пароль</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateForm()}>
              Войти
            </Button>
            <p className='text-center'>или <Link to='/signup'>зарегистрироваться</Link></p>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
