import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DisplayInitData from './TelegramUserInfo'
function App() {
  const [count, setCount] = useState(0)

  return (
<div className="App">
      <header className="App-header">
        {/* Ваш заголовок */}
      </header>
      <main>
        {/* Вставляем наш компонент */}
        <DisplayInitData />
      </main>
    </div>
  )
}

export default App
