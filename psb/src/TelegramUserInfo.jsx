import React, { useEffect, useState } from 'react';

const TelegramUserIdDisplay = () => {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Консольные логи
  console.log('Компонент TelegramUserIdDisplay рендерится.');

  useEffect(() => {
    console.log('useEffect запущен в TelegramUserIdDisplay.');

    const fetchData = async () => {
      console.log('fetchData запущена.');
      try {
        // Проверяем доступность Telegram Web App API (теперь она должна проходить!)
        if (!window.Telegram?.WebApp) {
           // Этот блок теперь, скорее всего, не должен выполняться
           console.log('Telegram Web App API НЕ обнаружен (Неожиданно!).');
           setError("Telegram Web App API не обнаружен. Пожалуйста, откройте это приложение внутри клиента Telegram.");
           setLoading(false);
           return;
        }

        const webApp = window.Telegram.WebApp;
        console.log('Telegram Web App API найден.', webApp);

        webApp.ready();
        webApp.expand();
        console.log('webApp.ready() и webApp.expand() вызваны.');

        // --- Расширенное логирование initDataUnsafe ---
        const initDataUnsafe = webApp.initDataUnsafe;
        console.log('=== Содержимое webApp.initDataUnsafe: ===');
        console.log(initDataUnsafe); // Логируем весь объект
        console.log('=== Конец initDataUnsafe ===');

        // Получаем объект пользователя
        const user = initDataUnsafe?.user;
        console.log('Получен объект user:', user);

        // Проверяем, что user существует и у него есть id
        if (user && user.id !== undefined) {
          console.log('Данные пользователя найдены, ID:', user.id);
          setUserId(user.id);
          setFirstName(user.first_name || 'Пользователь');
          // ... (место для бэкенд валидации initData) ...
        } else {
          console.log('Объект user или user.id не найден в initDataUnsafe.');
          // Устанавливаем ошибку, указывающую на отсутствие данных пользователя
          setError("Данные пользователя (ID) не получены. Убедитесь, что приложение открыто через взаимодействие с Telegram Bot.");
          // --- Можно добавить логи других полей initDataUnsafe, если они нужны ---
          // console.log('initDataUnsafe.query_id:', initDataUnsafe?.query_id);
          // console.log('initDataUnsafe.start_param:', initDataUnsafe?.start_param);
          // и т.д.
          // ---------------------------------------------------------------------
        }

      } catch (err) {
        console.error("Ошибка в fetchData:", err);
        setError("Произошла ошибка при загрузке данных пользователя: " + err.message);
      } finally {
        console.log('fetchData завершена. Установка loading в false.');
        setLoading(false);
      }
    };

    fetchData();

  }, []); // Пустой массив зависимостей

  // --- Логика Отображения (остается прежней) ---

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка данных пользователя...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Ошибка: {error}</div>;
  }

  if (userId !== null) {
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

  return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
          Не удалось получить данные пользователя.
      </div>
  );
};

export default TelegramUserIdDisplay;