/**
 * LocalStorage 키 상수 관리
 *
 * 앱 전체에서 사용하는 localStorage 키를 중앙에서 관리합니다.
 * 키 이름을 변경할 때 한 곳만 수정하면 됩니다.
 */

export const STORAGE_KEYS = {
  // 토큰
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',

  // 사용자 정보
  USER: 'user',
} as const;

export const QUERY_KEYS = {
  lps: 'lps',
} as const;