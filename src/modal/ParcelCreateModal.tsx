import { useState } from 'react'
import { Modal, Button, FormControl, InputGroup } from 'react-bootstrap'

type ParcelCreateModalProps = {
  show: boolean
  onHide: () => void
  onCreate: (cadastralNumber: string, address: string, area: number) => void
}

export function ParcelCreateModal(props: ParcelCreateModalProps) {
  const [cadastralNumber, setCadastralNumber] = useState('')
  const [address, setAddress] = useState('')
  const [area, setArea] = useState(0)

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Новый участок</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Кадастровый номер:</InputGroup.Text>
          <FormControl
            placeholder="__:__:_______:_____"
            aria-label="cadNumber"
            aria-describedby="basic-addon1"
            value={cadastralNumber}
            onChange={(e) => setCadastralNumber(e.target.value)}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon2">Адрес:</InputGroup.Text>
          <FormControl
            placeholder="Белгородская обл., Белгородский р-н, п. Майский"
            aria-label="address"
            aria-describedby="basic-addon2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon3">Площадь:</InputGroup.Text>
          <FormControl
            placeholder="1500"
            aria-label="address"
            aria-describedby="basic-addon3"
            value={area}
            onChange={(e) => setArea(Number.isInteger(+e.target.value) ? +e.target.value : 0)}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            props.onCreate(cadastralNumber, address, area)
            props.onHide()
          }}
          variant="primary"
        >
          Создать
        </Button>
        <Button onClick={props.onHide} variant="secondary">
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
