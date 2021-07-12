import { useEffect, useState } from 'react'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export type Parcel = {
  cadastralNumber: string
  address: string
  area: number
}

export type Catalog = {
  parcels: Parcel[]
  applyFilter: (filter: (parcel: Parcel) => boolean) => void
  createParcel: (parcel: Parcel) => void
  exportXlsx: () => void
}

export function useCatalog(): Catalog {
  const [parcels, setParcels] = useState<Parcel[]>([])

  const fetchParcels = async () => {
    return fetch('/api/parcels')
      .then((res) => res.json() as Promise<Parcel[]>)
      .catch((e: Error) => {
        alert('Ошибка: ' + e.message)
        return []
      })
  }

  useEffect(() => {
    fetchParcels().then((parcels) => setParcels(parcels))
  }, [])

  const applyFilter = (filter: (parcel: Parcel) => boolean) => {
    fetchParcels()
      .then((parcels) => parcels.filter((parcel) => filter(parcel)))
      .then((parcels) => setParcels(parcels))
  }

  const createParcel = async (parcel: Parcel) => {
    return fetch('/api/parcel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cadastralNumber: parcel.cadastralNumber,
        address: parcel.address,
        area: parcel.area,
      }),
    })
      .then((res) => res.json())
      .then((json) => (!json['status'] ? alert(json['message']) : fetchParcels().then((parcels) => setParcels(parcels))))
      .catch((e: Error) => alert('Ошибка добавления: ' + e.message))
  }

  const exportXlsx = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const ws = XLSX.utils.json_to_sheet(parcels)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, 'Земельные участки' + fileExtension)
  }

  return {
    parcels,
    applyFilter,
    createParcel,
    exportXlsx,
  }
}
