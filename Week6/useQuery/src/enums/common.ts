// PAGINATION_ORDER는 정렬 방향을 정의하는 타입입니다.
// 'desc'는 내림차순 (최신순 등), 'asc'는 오름차순을 나타냅니다.

export type PAGINATION_ORDER = 'desc' | 'asc';

// 만약 enum으로 정의하고 싶다면 다음과 같이 사용할 수도 있습니다:
// export enum PAGINATION_ORDER_ENUM {
//     DESC = 'desc',
//     ASC = 'asc',
// }