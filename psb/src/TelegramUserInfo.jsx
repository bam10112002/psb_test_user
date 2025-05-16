import React, { useEffect, useState } from 'react';

const DisplayInitData = () => {
  // Состояние для хранения сырого объекта initDataUnsafe или сообщения об ошибке/загрузке
  const [displayContent, setDisplayContent] = useState('Загрузка данных Telegram...');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    console.log('DisplayInitData useEffect запущен.');

    const fetchData = async () => {
      console.log('fetchData запущена.');
      try {
        // Проверяем доступность Telegram Web App API
        if (!window.Telegram?.WebApp) {
           console.log('Telegram Web App API НЕ обнаружен.');
           setIsError(true);
           setDisplayContent("Ошибка: Telegram Web App API не обнаружен. Пожалуйста, откройте это приложение внутри клиента Telegram.");
           return;
        }

        const webApp = window.Telegram.WebApp;
        console.log('Telegram Web App API найден.', webApp);

        // Уведомляем WebApp, что готовы, и разворачиваем (важно сделать это рано)
        webApp.ready();
        webApp.expand();
        console.log('webApp.ready() и webApp.expand() вызваны.');

        // Получаем сырой объект initDataUnsafe
        const initDataUnsafe = webApp.initDataUnsafe;
        console.log('Получен webApp.initDataUnsafe:', initDataUnsafe);

        // Преобразуем объект в красивую строку для отображения
        if (initDataUnsafe !== undefined && initDataUnsafe !== null) {
             // Используем JSON.stringify с отступами для читаемости
             // В случае пустого объекта {} он так и отобразится
             const dataString = JSON.stringify(initDataUnsafe, null, 2);
             console.log('Данные преобразованы в строку.');
             setDisplayContent(dataString);
        } else {
             console.log('webApp.initDataUnsafe пуст, undefined или null.');
             setIsError(true);
             setDisplayContent("Ошибка: webApp.initDataUnsafe пуст, undefined или null.");
        }


      } catch (err) {
        console.error("Ошибка в fetchData:", err);
        setIsError(true);
        setDisplayContent("Произошла ошибка при получении данных: " + err.message);
      }
    };

    fetchData();

  }, []); // Пустой массив зависимостей

  // --- Логика Отображения ---
  return (
      <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)', wordBreak: 'break-all', backgroundColor: isError ? '#ffe0e0' : '#fff' }}>
          <h2 style={{ textAlign: 'center', color: isError ? 'red' : '#0088CC' }}>
              {isError ? 'Статус/Ошибка:' : 'Содержимое initDataUnsafe:'}
          </h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '0.9em', backgroundColor: isError ? '#ffeaea' : '#f0f0f0', padding: '10px', borderRadius: '4px', color: isError ? 'red' : '#333' }}>
              {displayContent}
          </pre>
           {!isError && typeof displayContent === 'string' && displayContent.length > 0 && (
                <p style={{ fontSize: '0.9em', color: '#666', marginTop: '20px', textAlign: 'center' }}>
                   <small>Это сырые данные, полученные от Telegram при запуске Web App.
                   <br/>
                   Объект 'user' должен быть частью этих данных для получения User ID.</small>
               </p>
           )}
           {/* Если isError и displayContent - это текст ошибки, никаких доп. пояснений не нужно */}
           {isError && typeof displayContent === 'string' && displayContent.startsWith('Ошибка:') && (
               <p style={{ fontSize: '0.9em', color: 'red', marginTop: '20px', textAlign: 'center' }}>
                   <small>Исправьте ошибку выше.</small>
               </p>
           )}

      </div>
  );
};

export default DisplayInitData;