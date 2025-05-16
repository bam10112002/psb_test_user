import React, { useEffect, useState } from 'react';

const TelegramUserInfo = () => {
  // Используем useState для хранения данных пользователя, состояния загрузки и ошибок
  const [telegramUser, setTelegramUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Функция для загрузки данных пользователя
    const loadTelegramUser = async () => {
      try {
        // Проверяем, доступен ли объект Telegram.WebApp в глобальном объекте window
        // Этот объект инжектируется Telegram клиентом, когда открывает Web App
        if (!window.Telegram?.WebApp) {
          setError("Telegram Web App API не обнаружен. Пожалуйста, откройте это приложение внутри клиента Telegram.");
          setLoading(false);
          return;
        }

        const webApp = window.Telegram.WebApp;

        // Уведомляем Telegram, что приложение готово к отображению
        webApp.ready();
        // (Опционально) Расширяем Web App на весь экран для лучшего UX
        webApp.expand();
        // (Опционально) Можно настроить цвет фона
        // webApp.setBackgroundColor('#17212b');
        // webApp.setHeaderColor('#17212b');


        // Получаем данные инициализации.
        // webApp.initData - это строка со всеми данными для валидации на бэкенде.
        // webApp.initDataUnsafe - это паршенный объект с данными, включая 'user'.
        // ВНИМАНИЕ: Прямое использование webApp.initDataUnsafe.user на фронтенде НЕБЕЗОПАСНО
        // для производственных приложений без серверной валидации!
        // В демонстрационных целях мы получим данные прямо отсюда:
        const user = webApp.initDataUnsafe?.user;

        if (user) {
          // Если данные пользователя доступны, обновляем состояние
          setTelegramUser(user);

          // --- МЕСТО ДЛЯ БЭКЕНД ВАЛИДАЦИИ (РЕКОМЕНДУЕТСЯ В ПРОДАКШЕНЕ) ---
          // Вместо прямого использования 'user' здесь, вы ДОЛЖНЫ отправить
          // webApp.initData на ваш бэкенд, проверить его подпись с токеном бота,
          // и только если валидация успешна, использовать данные пользователя,
          // которые бэкенд может вернуть в ответ.
          //
          // Пример (псевдокод):
          // fetch('/api/validate-telegram-data', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ initData: webApp.initData }),
          // })
          // .then(response => response.json())
          // .then(data => {
          //    if (data.isValid) {
          //       setTelegramUser(data.user); // Использовать данные, подтвержденные бэкендом
          //    } else {
          //       setError("Не удалось подтвердить подлинность данных пользователя.");
          //    }
          // })
          // .catch(err => {
          //    console.error("Ошибка связи с бэкендом:", err);
          //    setError("Ошибка при проверке данных пользователя.");
          // });
          // ---------------------------------------------------------------

        } else {
          // Если объект user не доступен (например, Web App открыт не из чата с ботом или из других мест)
          setError("Данные пользователя не получены. Убедитесь, что приложение открыто через взаимодействие с Telegram Bot.");
        }

      } catch (err) {
        // Обработка любых других ошибок инициализации или загрузки
        console.error("Ошибка при инициализации Telegram Web App:", err);
        setError("Произошла ошибка при загрузке данных пользователя.");
      } finally {
        // Устанавливаем loading в false после завершения (успеха или ошибки)
        setLoading(false);
      }
    };

    // Вызываем функцию загрузки при монтировании компонента
    loadTelegramUser();

  }, []); // Пустой массив зависимостей означает, что useEffect выполнится один раз после первого рендера

  // Условный рендеринг: показываем разное содержимое в зависимости от состояния
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка данных пользователя из Telegram...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Ошибка: {error}</div>;
  }

  if (!telegramUser) {
      // Это состояние может быть достигнуто, если loading=false, error=null, но telegramUser так и не был установлен
      return <div style={{ padding: '20px', textAlign: 'center' }}>Не удалось получить данные пользователя Telegram.</div>;
  }

  // Если данные пользователя успешно загружены, отображаем их
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#0088CC' }}>Привет, {telegramUser.first_name}! 👋</h2>
      {/* Отображаем фото пользователя, если оно доступно */}
      {telegramUser.photo_url && (
        <img
          src={telegramUser.photo_url}
          alt={`${telegramUser.first_name}'s profile`}
          style={{ display: 'block', margin: '0 auto 20px auto', borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover' }}
        />
      )}
      {/* Отображаем другие доступные данные пользователя */}
      <p><strong>ID Пользователя:</strong> {telegramUser.id}</p>
      {telegramUser.username && <p><strong>Ник (Username):</strong> @{telegramUser.username}</p>}
      {telegramUser.last_name && <p><strong>Фамилия:</strong> {telegramUser.last_name}</p>}
      {telegramUser.language_code && <p><strong>Язык:</strong> {telegramUser.language_code}</p>}
      {telegramUser.is_premium && <p>✨ **Telegram Premium Пользователь**</p>}
      {/* Можете добавить другие поля, если они есть в объекте user и вам нужны */}

       <p style={{ fontSize: '0.9em', color: '#666', marginTop: '20px' }}>
           <small>Эти данные получены напрямую из Telegram Web App API.
           <br/>
           Для обеспечения безопасности в реальном приложении необходима серверная валидация данных инициализации (initData).</small>
       </p>
    </div>
  );
};

export default TelegramUserInfo;