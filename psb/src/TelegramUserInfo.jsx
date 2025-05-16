import React, { useEffect, useState } from 'react';

const TelegramUserIdDisplay = () => {
  // Состояния для хранения User ID, статуса загрузки и ошибок
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null); // Опционально: добавим имя для приветствия
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Консольные логи (полезно, если все же удастся получить к ним доступ)
  console.log('Компонент TelegramUserIdDisplay рендерится.');

  useEffect(() => {
    console.log('useEffect запущен в TelegramUserIdDisplay.');

    const fetchData = async () => {
      console.log('fetchData запущена.');
      try {
        // Проверяем доступность Telegram Web App API
        if (!window.Telegram?.WebApp) {
          console.log('Telegram Web App API НЕ обнаружен.');
          setError("Telegram Web App API не обнаружен. Пожалуйста, откройте это приложение внутри клиента Telegram.");
          setLoading(false); // Загрузка завершена с ошибкой
          return; // Прерываем выполнение
        }

        const webApp = window.Telegram.WebApp;
        console.log('Telegram Web App API найден.', webApp);

        // Уведомляем Telegram, что приложение готово и разворачиваем его
        webApp.ready();
        webApp.expand();
        console.log('webApp.ready() и webApp.expand() вызваны.');

        // Получаем данные инициализации (используем initDataUnsafe для простоты на фронтенде)
        const initDataUnsafe = webApp.initDataUnsafe;
        console.log('initDataUnsafe:', initDataUnsafe);

        // Получаем объект пользователя из initDataUnsafe
        const user = initDataUnsafe?.user;
        console.log('Получен объект user:', user);

        if (user && user.id !== undefined) { // Проверяем, что user существует и у него есть id
          console.log('Данные пользователя найдены, ID:', user.id);
          // Устанавливаем полученные данные в состояние
          setUserId(user.id);
          setFirstName(user.first_name || 'Пользователь'); // Используем имя или дефолтное значение
          // ... (место для бэкенд валидации initData) ...
        } else {
          console.log('Объект user или user.id не найден в initDataUnsafe.');
          setError("Данные пользователя (ID) не получены. Убедитесь, что приложение открыто через взаимодействие с Telegram Bot.");
        }

      } catch (err) {
        // Обработка любых ошибок в процессе
        console.error("Ошибка в fetchData:", err);
        setError("Произошла ошибка при загрузке данных пользователя: " + err.message);
      } finally {
        // Загрузка завершена
        console.log('fetchData завершена. Установка loading в false.');
        setLoading(false);
      }
    };

    fetchData(); // Запускаем функцию получения данных

  }, []); // Пустой массив зависимостей

  // --- Логика Отображения ---

  // 1. Если идет загрузка
  if (loading) {
    console.log('Отображение: Загрузка...');
    return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка данных пользователя...</div>;
  }

  // 2. Если произошла ошибка
  if (error) {
     console.log('Отображение: Ошибка:', error);
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Ошибка: {error}</div>;
  }

  // 3. Если данные пользователя (ID) успешно получены
  if (userId !== null) {
     console.log('Отображение: User ID доступен.');
      return (
          <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
              <h2 style={{ textAlign: 'center', color: '#0088CC' }}>Привет, {firstName}! 👋</h2>
              <p style={{ fontSize: '1.2em', textAlign: 'center' }}>
                  Ваш Telegram User ID: <br/>
                  <strong style={{ color: '#333' }}>{userId}</strong>
              </p>
               <p style={{ fontSize: '0.9em', color: '#666', marginTop: '20px' }}>
                   <small>User ID получен через Telegram Web App API.
                   <br/>
                   Для безопасности в реальном приложении требуется серверная валидация данных инициализации (initData).</small>
               </p>
          </div>
      );
  }

  // 4. Если загрузка завершена, нет ошибки, но User ID не установлен (крайне редкий случай при правильной логике)
   console.log('Отображение: Неизвестное состояние (нет загрузки, нет ошибки, нет User ID).');
  return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
          Не удалось получить данные пользователя.
      </div>
  );
};

export default TelegramUserIdDisplay;