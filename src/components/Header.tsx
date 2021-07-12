import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'

export function Header() {
  const auth = useAuth()

  const getRole = () => {
    const role = auth.user.current?.role

    switch (role) {
      case 'user':
        return 'Пользователь'
      case 'admin':
        return 'Администратор'
      default:
        return 'Не установлена'
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Земельные участки</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto"></Nav>
          <Nav>
            <Navbar.Text>Вы вошли как:</Navbar.Text>
            <NavDropdown title={auth.user.current?.email} id="collasible-nav-dropdown">
              <NavDropdown.Item>Роль: {getRole()}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={auth.logout}>Выйти</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
