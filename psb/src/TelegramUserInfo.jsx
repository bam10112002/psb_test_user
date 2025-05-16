import React, { useEffect } from 'react';

const SimpleTestComponent = () => {
  // Этот useEffect просто для теста, выполняется ли код
  useEffect(() => {
    console.log('=== SimpleTestComponent: useEffect запущен! ===');
    // Тут можно еще раз попробовать обратиться к Telegram API для диагностики,
    // но главное - убедиться, что этот лог появляется
    if (window.Telegram?.WebApp) {
         console.log('=== SimpleTestComponent: Telegram API ДОСТУПЕН ===');
         // Если API доступен, можно попробовать вызвать ready/expand
         try {
             window.Telegram.WebApp.ready();
             window.Telegram.WebApp.expand();
             console.log('=== SimpleTestComponent: ready/expand вызваны успешно ===');
         } catch (e) {
             console.error('=== SimpleTestComponent: Ошибка при вызове ready/expand ===', e);
         }
    } else {
         console.log('=== SimpleTestComponent: Telegram API НЕ доступен ===');
    }
  }, []); // Пустой массив зависимостей - выполнится один раз

  // Просто выводим текст, который должен быть виден
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontSize: '20px', color: 'green' }}>
      ✅ ПРИЛОЖЕНИЕ ЗАПУЩЕНО И РЕНДЕРИТСЯ! ✅
      <p style={{fontSize: '14px', color: '#333'}}>Если вы видите это, React работает.</p>
    </div>
  );
};

export default SimpleTestComponent;