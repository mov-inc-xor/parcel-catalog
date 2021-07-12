import Client from 'ftp'
import { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } from 'mongodb-snapshot'

export const registerBackup = (interval=10000000) => {
  const filename = 'backup.tar'

  async function dumpToLocalfile() {
    const mongo_connector = new MongoDBDuplexConnector({
      connection: {
        uri: `mongodb://mongo`,
        dbname: 'parcel-catalog',
      },
    })

    const localfile_connector = new LocalFileSystemDuplexConnector({
      connection: {
        path: './' + filename,
      },
    })

    const transferer = new MongoTransferer({
      source: mongo_connector,
      targets: [localfile_connector],
    })

    for await (const { total, write } of transferer) {
      console.log(`remaining bytes to write: ${total - write}`)
    }
  }

  const makeBackup = async () => {
    await dumpToLocalfile()

    const ftpClient = new Client()

    ftpClient.put(filename, new Date().toISOString() + '-' + filename, function (err) {
      if (err) throw err
      ftpClient.end()
    })

    ftpClient.connect()
  }

  return () => setInterval(makeBackup, interval)
}
