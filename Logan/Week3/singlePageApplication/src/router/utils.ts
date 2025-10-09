// 커스텀 이벤트 이름 (pushState는 브라우저가 이벤트를 안 쏘기 때문에 직접 쏴줌)
export const PUSHSTATE_EVENT = 'pushstate';

export const getCurrentPath = () => window.location.pathname;

/** 주소만 바꾸고(히스토리 쌓고) 커스텀 이벤트로 앱에게 알림 */
export const navigateTo = (to: string) => {
  if (to === getCurrentPath()) return;
  window.history.pushState({}, '', to);
  // pushState는 popstate를 발생시키지 않기 때문에, 커스텀 이벤트로 알린다
  window.dispatchEvent(new Event(PUSHSTATE_EVENT));
};
