import { Header } from '../components/Header'
import { SearchPanel } from '../components/SearchPanel'
import { Parcel } from '../components/Parcel'
import { useCatalog } from '../hooks/useCatalog'

export function ParcelCatalogPage() {
  const catalog = useCatalog()

  return (
    <>
      <Header />

      <SearchPanel catalog={catalog} />

      {catalog.parcels.map((parcel) => (
        <Parcel key={parcel.cadastralNumber} cadastralNumber={parcel.cadastralNumber} address={parcel.address} area={parcel.area} />
      ))}
    </>
  )
}
