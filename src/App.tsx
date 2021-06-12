import { useEffect, useState } from 'react'

function App() {
  const [text, setText] = useState('')

  useEffect(() => {
    fetch('/api/hello/')
      .then((res) => res.text())
      .then((text) => setText(text))
      .catch((reason) => setText('Ошибка: + ' + reason))
  })

  return <h1>{text}</h1>
}

export default App