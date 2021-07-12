import { useEffect, useState } from 'react'
import { Container, Card, FormControl, Button, InputGroup, Badge } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'
import { Catalog, Parcel } from '../hooks/useCatalog'
import { ParcelCreateModal } from '../modal/ParcelCreateModal'

type SearchPanelProps = {
  catalog: Catalog
}

export function SearchPanel({ catalog }: SearchPanelProps) {
  const [AREA_FROM, AREA_TO] = [500, 3000]

  const auth = useAuth()

  const [createParcelModalVisible, setCreateParcelModalVisible] = useState(false)

  const [cadastralNumber, setCadastralNumber] = useState('')
  const [address, setAddress] = useState('')
  const [areaFrom, setAreaFrom] = useState(AREA_FROM)
  const [areaTo, setAreaTo] = useState(AREA_TO)

  const clearFields = () => {
    setCadastralNumber('')
    setAddress('')
    setAreaFrom(AREA_FROM)
    setAreaTo(AREA_TO)
  }

  useEffect(() => {
    catalog.applyFilter(filter)
    // eslint-disable-next-line
  }, [cadastralNumber, address, areaFrom, areaTo])

  const filter = (parcel: Parcel) => {
    if (!parcel.cadastralNumber.includes(cadastralNumber)) return false

    if (
      !address
        .toLowerCase()
        .replaceAll('.,', '')
        .split(' ')
        .every((token) => parcel.address.toLowerCase().includes(token, undefined))
    )
      return false

    if (parcel.area > areaTo || parcel.area < areaFrom) return false

    return true
  }

  const changeCadastralNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCadastralNumber(e.target.value)
  }

  const changeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }

  const changeAreaFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAreaFrom(Number.isInteger(+e.target.value) ? +e.target.value : 0)
  }

  const changeAreaTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAreaTo(Number.isInteger(+e.target.value) ? +e.target.value : 0)
  }

  return (
    <>
      <Container>
        <Card className="mx-auto my-4">
          <Card.Body>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Кадастровый номер:</InputGroup.Text>
              <FormControl
                placeholder="__:__:_______:_____"
                aria-label="cadNumber"
                aria-describedby="basic-addon1"
                value={cadastralNumber}
                onChange={changeCadastralNumber}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon2">Адрес:</InputGroup.Text>
              <FormControl
                placeholder="Белгородская обл., Белгородский р-н, п. Майский"
                aria-label="address"
                aria-describedby="basic-addon2"
                value={address}
                onChange={changeAddress}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon3">Площадь от:</InputGroup.Text>
              <FormControl aria-label="area-from" aria-describedby="basic-addon3" value={areaFrom} onChange={changeAreaFrom} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon4">Площадь до:</InputGroup.Text>
              <FormControl aria-label="area-to" aria-describedby="basic-addon4" value={areaTo} onChange={changeAreaTo} />
            </InputGroup>

            <div className="d-flex justify-content-between">
              <div>
                {auth.user.current?.role === 'admin' && (
                  <Button variant="success" onClick={() => setCreateParcelModalVisible(true)}>
                    + Создать
                  </Button>
                )}{' '}
                <Button variant="primary" onClick={catalog.exportXlsx}>
                  Экспорт в .xlsx
                </Button>
              </div>
              <Badge>{catalog.parcels.length} участков показано</Badge>
            </div>
          </Card.Body>
        </Card>
      </Container>

      <ParcelCreateModal
        show={createParcelModalVisible}
        onHide={() => setCreateParcelModalVisible(false)}
        onCreate={(cadastralNumber, address, area) => {
          catalog.createParcel({ cadastralNumber, address, area })
          clearFields()
        }}
      />
    </>
  )
}
