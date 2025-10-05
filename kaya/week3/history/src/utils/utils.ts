// utils/utils.ts
export function getCurrentPath(): string {
  return window.location.pathname || '/';
}

export function navigateTo(path: string) {
  // pushState로 URL만 변경 (새로고침 없음)
  window.history.pushState({}, '', path);
  // popstate 이벤트를 발생시켜서 useCurrentPath가 반응하도록
  const event = new PopStateEvent('popstate');
  window.dispatchEvent(event);
}
