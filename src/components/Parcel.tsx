import { Container, Card } from 'react-bootstrap'

type ParcelProps = {
  cadastralNumber: string
  address: string
  area: number
}

export function Parcel(props: ParcelProps) {
  return (
    <Container>
      <Card className="mx-auto my-4">
        <Card.Header>Кадастровый номер: <b>{props.cadastralNumber}</b></Card.Header>
        <Card.Body>
          <Card.Text>Адрес: {props.address}</Card.Text>
          <Card.Text>Площадь: {props.area}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}
