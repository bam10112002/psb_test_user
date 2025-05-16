import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;

    if (tg?.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    } else {
      // Telegram WebApp не инициализирован
      console.warn('Telegram WebApp is not initialized or user not found.');
    }

    tg?.ready(); // Сообщить Telegram, что WebApp готов
  }, []);

  if (!user) {
    return <div>Загрузка данных Telegram...</div>;
  }

  return (
    <div className="App">
      <h1>Привет, {user.first_name}!</h1>
      {user.last_name && <p>Фамилия: {user.last_name}</p>}
      <p>Юзернейм: @{user.username}</p>
      <p>Telegram ID: {user.id}</p>
      <img src={user.photo_url} alt="avatar" width="100" style={{ borderRadius: '50%' }} />
    </div>
  );
}

export default App;
