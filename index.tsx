import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("앱 초기화 시작...");

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("에러: '#root' 요소를 찾을 수 없습니다.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("React 앱 마운트 성공");
  } catch (error) {
    console.error("React 렌더링 중 오류 발생:", error);
    rootElement.innerHTML = `
      <div style="color: white; padding: 20px; text-align: center; background: #050505; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h2>⚠️ 앱 실행 중 오류가 발생했습니다.</h2>
        <p style="opacity: 0.7; margin: 10px 0;">${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="location.reload()" style="padding: 10px 20px; cursor: pointer; background: white; color: black; border: none; font-family: inherit;">다시 시도</button>
      </div>
    `;
  }
};

// DOM 로드 상태에 따라 즉시 실행 또는 이벤트 등록
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
