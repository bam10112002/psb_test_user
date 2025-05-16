import React, { useEffect, useState } from 'react';

const TelegramUserInfo = () => {
  const [telegramUser, setTelegramUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Компонент TelegramUserInfo рендерится. loading:', loading, 'error:', error, 'user:', telegramUser);

  useEffect(() => {
    console.log('useEffect запущен');

    const loadTelegramUser = async () => {
      console.log('loadTelegramUser запущена');

      try {
        console.log('Проверка window.Telegram?.WebApp...');
        if (!window.Telegram?.WebApp) {
          console.log('Telegram Web App API НЕ найден.');
          setError("Telegram Web App API не обнаружен. Пожалуйста, откройте это приложение внутри клиента Telegram.");
          setLoading(false);
          return;
        }

        const webApp = window.Telegram.WebApp;
        console.log('Telegram Web App API найден:', webApp);

        console.log('Вызов webApp.ready()...');
        webApp.ready();
        console.log('webApp.ready() выполнен.');

        console.log('Вызов webApp.expand()...');
        webApp.expand();
        console.log('webApp.expand() выполнен.');

        console.log('Доступ к initDataUnsafe...');
        const initDataUnsafe = webApp.initDataUnsafe;
        console.log('initDataUnsafe:', initDataUnsafe);

        const user = initDataUnsafe?.user;
        console.log('Получен объект user:', user);

        if (user) {
          console.log('Данные пользователя найдены, устанавливаем состояние.');
          setTelegramUser(user);
          // ... (место для бэкенд валидации, как обсуждалось ранее) ...
        } else {
          console.log('Объект user не найден в initDataUnsafe.');
          setError("Данные пользователя не получены. Убедитесь, что приложение открыто через взаимодействие с Telegram Bot.");
        }

      } catch (err) {
        console.error("Ошибка в loadTelegramUser:", err);
        setError("Произошла ошибка при загрузке данных пользователя.");
      } finally {
        console.log('loadTelegramUser завершена. Установка loading в false.');
        setLoading(false);
      }
    };

    loadTelegramUser();

  }, []); // Пустой массив зависимостей

  // Рендеринг на основе состояния
  if (loading) {
    console.log('Рендеринг: Загрузка...');
    return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка данных пользователя из Telegram...</div>;
  }

  if (error) {
     console.log('Рендеринг: Ошибка:', error);
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Ошибка: {error}</div>;
  }

  if (!telegramUser) {
     console.log('Рендеринг: Данные пользователя не получены.');
      return <div style={{ padding: '20px', textAlign: 'center' }}>Не удалось получить данные пользователя Telegram.</div>;
  }

  console.log('Рендеринг: Отображение данных пользователя:', telegramUser);
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#0088CC' }}>Привет, {telegramUser.first_name}! 👋</h2>
      {telegramUser.photo_url && (
        <img
          src={telegramUser.photo_url}
          alt={`${telegramUser.first_name}'s profile`}
          style={{ display: 'block', margin: '0 auto 20px auto', borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover' }}
        />
      )}
      <p><strong>ID Пользователя:</strong> {telegramUser.id}</p>
      {telegramUser.username && <p><strong>Ник (Username):</strong> @{telegramUser.username}</p>}
      {telegramUser.last_name && <p><strong>Фамилия:</strong> {telegramUser.last_name}</p>}
      {telegramUser.language_code && <p><strong>Язык:</strong> {telegramUser.language_code}</p>}
      {telegramUser.is_premium && <p>✨ **Telegram Premium Пользователь**</p>}

       <p style={{ fontSize: '0.9em', color: '#666', marginTop: '20px' }}>
           <small>Эти данные получены напрямую из Telegram Web App API.
           <br/>
           Для обеспечения безопасности в реальном приложении необходима серверная валидация данных инициализации (initData).</small>
       </p>
    </div>
  );
};

export default TelegramUserInfo;