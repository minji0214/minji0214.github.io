---
title: "Next.js에서 Zustand를 React처럼 쓰면 생기는 일"
description: "nextjs 환경에서 zustand를 잘못사용하며 알게된 Failcon을 기록합니다."
pubDate: "04 27 2026"
tags: ["FE"]
---
## 사건의 경위

서버에서 API를 호출할 때 액세스 토큰이 필요했다. 토큰은 이미 Zustand 스토어에 저장되어 있었기 때문에 자연스럽게 꺼내 쓰는 코드를 작성했다.

```typescript
async function getAccessTokenWithFallback(): Promise<string | null> {
  const accessTokenByMemory = useCommonStore.getState().accessToken;

  if (accessTokenByMemory) {
    return accessTokenByMemory;
  }

  try {
    const accessTokenByCookie = await getAccessToken();
    return accessTokenByCookie || null;
  } catch (error) {
    console.error('[AuthBridge] ❌ 토큰 조회 실패', error);
    return null;
  }
}
```

React 프로젝트였다면 완벽한 코드다. 하지만 이 코드는 Next.js 운영 환경에서 **A 유저가 로그인했는데 B 유저의 화면에 A의 계정 정보가 노출되는** 심각한 버그를 일으켰다.

---

## 왜 이런 일이 생기는가

### Q. React에서는 왜 괜찮았는가?

React(SPA)에서 Zustand 스토어는 **브라우저 메모리에 싱글톤으로 존재**한다.

```
브라우저 탭 하나 = 하나의 JavaScript 런타임 = 하나의 Zustand 스토어 인스턴스
```

유저 A가 로그인하면 A의 토큰이 스토어에 저장된다. 이 스토어는 A의 브라우저 탭 안에만 존재한다. 유저 B는 자신의 브라우저에서 앱을 열고, 자신만의 JavaScript 런타임과 자신만의 Zustand 스토어를 갖는다. 두 스토어는 물리적으로 다른 메모리 공간에 있기 때문에 절대 섞이지 않는다.

**왜 브라우저 탭마다 독립된 런타임을 갖는가?**

브라우저는 탭마다 별도의 JavaScript 엔진을 실행한다. 한 탭의 메모리는 다른 탭에서 접근할 수 없다. 이건 보안 모델의 기본이다. 덕분에 React SPA에서 전역 상태가 아무리 허술해도 다른 유저의 상태와 섞이는 일은 원천적으로 불가능하다.

---

### Q. Next.js 서버 환경은 왜 다른가?

서버(Node.js)는 브라우저와 다르다. **하나의 프로세스가 모든 유저의 요청을 처리한다.**

```
유저 A의 요청  ─┐
유저 B의 요청  ─┤─▶  Node.js 프로세스 하나  ─▶  메모리 하나
유저 C의 요청  ─┘
```

유저마다 독립된 런타임을 주는 게 아니다. 서버는 단 하나의 프로세스 안에서 수천 개의 요청을 동시에 처리한다.

**왜 요청마다 새 프로세스를 만들지 않는가?**

프로세스를 하나 새로 만드는 비용은 크다. 메모리를 할당하고, 코드를 로드하고, 초기화하는 데 시간이 걸린다. 요청이 들어올 때마다 이 작업을 반복하면 서버가 버티지 못한다. 그래서 서버는 하나의 프로세스를 띄워두고 요청을 비동기로 처리하는 방식을 택한다. 효율적이지만, 메모리를 공유한다는 부작용이 따른다.

---

### Q. 그러면 Zustand 스토어는 서버에서 어떻게 존재하는가?

`create()`로 만든 Zustand 스토어는 **JavaScript 모듈의 최상위 스코프에서 딱 한 번 실행**된다.

```typescript
// common.store.ts
const useCommonStore = create<CommonState>()((set) => ({
  accessToken: null,
  // ...
}));

export default useCommonStore; // 이 시점에 스토어가 생성된다
```

이 파일이 처음 `import`되는 순간 스토어가 생성된다. 이후 어디서 `import`해도 **같은 인스턴스**가 반환된다. 이게 JavaScript 모듈 시스템의 동작 방식이다.

**왜 모듈을 import할 때마다 새로 실행하지 않는가?**

Node.js는 한 번 로드한 모듈을 캐시한다. 같은 경로의 모듈을 두 번 `import`하면 두 번째부터는 캐시된 결과를 돌려준다. 이 역시 성능을 위한 설계다. 덕분에 모듈 최상위에 작성된 코드는 서버 전체 생애주기에서 **딱 한 번만** 실행된다.

결론적으로 서버에서 Zustand 스토어의 수명은 이렇다.

```
서버 시작 → 스토어 생성 (딱 한 번) → 서버가 종료될 때까지 동일한 인스턴스 유지
                                       ↑
                          이 사이에 수백만 개의 요청이 같은 스토어를 공유
```

---

### Q. 그래서 구체적으로 어떻게 토큰이 섞이는가?

다음 시나리오를 보자.

```
T=0ms  유저 A가 로그인 → 서버에서 A의 토큰을 Zustand 스토어에 저장
         useCommonStore.setState({ accessToken: 'token_A' })

T=1ms  유저 B가 페이지 요청 → 서버에서 getAccessTokenWithFallback() 실행
         useCommonStore.getState().accessToken
         → 'token_A' 반환  ← B의 요청인데 A의 토큰을 가져옴

T=1ms  B의 요청이 A의 토큰으로 API 호출
         → B 화면에 A의 프로필, 데이터 노출
```

Node.js는 싱글 스레드지만 I/O는 비동기로 처리한다. A의 요청이 처리되는 도중 B의 요청이 끼어드는 건 완전히 정상적인 흐름이다. 그 사이에 스토어 상태가 A의 것으로 오염되어 있으면 B가 그걸 그대로 읽어간다.

**왜 로컬 개발 환경에서는 이 버그가 잘 안 보이는가?**

로컬에서는 혼자 테스트한다. 동시에 두 명의 유저가 요청을 보내지 않기 때문에 타이밍이 겹칠 일이 없다. 트래픽이 높은 운영 환경에서만 드러나는 버그다. 발견하기 어렵고, 발생하면 치명적인 이유가 여기 있다.

---

### Q. 버그가 발생하는 조건을 정리하면?

1. `create()`로 만든 Zustand 스토어를 서버 코드에서 읽거나 쓰는 경우
2. 두 유저의 요청이 시간적으로 겹치는 경우 (운영 환경이면 항시 발생 가능)
3. 스토어에 **요청마다 달라야 할 값** (토큰, 세션, 유저 정보)이 저장된 경우

이 세 가지가 동시에 충족되면 버그는 반드시 발생한다.

---

## Zustand가 Next.js를 위해 권장하는 방식

Zustand 공식 문서는 Next.js 환경에서 `create()` 대신 **`createStore()` + Provider 패턴**을 사용할 것을 명시하고 있다.

> [Next.js Setup Guide](https://zustand.docs.pmnd.rs/learn/guides/nextjs#setup-with-next.js)
> [SSR and Hydration Guide](https://zustand.docs.pmnd.rs/learn/guides/ssr-and-hydration)

### Q. 해결의 핵심 원리는 무엇인가?

문제의 원인은 스토어가 **모듈 수준의 싱글톤**이라는 것이었다. 해결책은 간단하다. **스토어를 싱글톤으로 만들지 않으면 된다.**

구체적으로는 두 가지가 필요하다.

1. 스토어를 **함수가 호출될 때마다** 새로 만든다 (`createStore` + 팩토리 패턴)
2. 그 스토어를 **React Context로 전달**해서, 각 렌더 트리가 자신만의 스토어를 갖게 한다

---

### Q. `create()`와 `createStore()`는 무엇이 다른가?

```typescript
// create() — 스토어를 즉시 생성하고 반환한다
const useStore = create<State>()((set) => ({ ... }));
// 이 시점에 스토어가 만들어진다. 모듈이 로드되는 순간 실행됨.

// createStore() — 스토어를 만드는 함수를 반환한다
const createMyStore = () => createStore<State>()((set) => ({ ... }));
// 이 시점에는 아무것도 만들어지지 않는다. 호출해야 비로소 스토어가 생성된다.
```

`create()`는 선언과 동시에 스토어를 만든다. `createStore()`는 **설계도**만 정의한다. 실제 스토어는 나중에 명시적으로 호출해야 만들어진다.

**왜 이 차이가 중요한가?**

팩토리 함수 `createMyStore()`를 요청마다 호출하면, 요청마다 완전히 새로운 스토어 인스턴스가 만들어진다. 서버 시작 시 한 번 만들어지는 싱글톤이 아니라, **요청 수명에 맞는 스토어**가 된다.

### 1단계: `createStore`로 팩토리 함수 정의

```typescript
// stores/auth.store.ts
import { createStore } from 'zustand';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

// create() 대신 createStore() — 싱글톤을 만들지 않는다
export const createAuthStore = (initialToken: string | null = null) =>
  createStore<AuthState>()((set) => ({
    accessToken: initialToken,
    setAccessToken: (token) => set({ accessToken: token }),
  }));

export type AuthStore = ReturnType<typeof createAuthStore>;
```

### Q. `createStore`로 팩토리 함수를 만드는 것만으로 충분한가?

아니다. 팩토리 함수를 만들었다고 해서 자동으로 요청마다 새 스토어가 생기지 않는다. 누군가 올바른 시점에 이 함수를 호출하고, 만들어진 스토어를 컴포넌트 트리에 전달해야 한다. 그 역할을 하는 것이 Provider다.

### 2단계: 요청마다 새 스토어를 만드는 Provider

```typescript
// providers/auth-store-provider.tsx
'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore } from 'zustand';
import { createAuthStore, type AuthStore } from '@/stores/auth.store';

const AuthStoreContext = createContext<AuthStore | null>(null);

interface AuthStoreProviderProps {
  children: ReactNode;
  initialToken?: string | null;
}

export function AuthStoreProvider({ children, initialToken }: AuthStoreProviderProps) {
  // useRef로 감싸서 렌더링마다 재생성되지 않도록
  const storeRef = useRef<AuthStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createAuthStore(initialToken);
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export function useAuthStore<T>(selector: (state: ReturnType<AuthStore['getState']>) => T): T {
  const store = useContext(AuthStoreContext);
  if (!store) throw new Error('AuthStoreProvider 안에서 사용해야 합니다');
  return useStore(store, selector);
}
```

### Q. Provider 코드에서 `useRef`는 왜 필요한가?

```typescript
const storeRef = useRef<AuthStore | null>(null);

if (!storeRef.current) {
  storeRef.current = createAuthStore(initialToken);
}
```

`useRef` 없이 그냥 `createAuthStore()`를 호출하면 **렌더링마다 스토어가 새로 만들어진다.** 부모 컴포넌트가 리렌더링될 때마다 Provider도 리렌더링되고, 그때마다 스토어가 초기화되면 상태가 모두 날아간다.

`useRef`는 컴포넌트가 마운트된 후 언마운트될 때까지 같은 값을 유지한다. 리렌더링이 발생해도 `storeRef.current`는 처음 만들어진 스토어를 그대로 가리킨다. 덕분에 **클라이언트 사이드에서는 스토어가 딱 한 번만 만들어지고 재사용된다.**

**그러면 결국 클라이언트에서도 싱글톤 아닌가?**

클라이언트에서는 싱글톤이어도 괜찮다. 브라우저에서는 유저 한 명이 하나의 탭(= 하나의 컴포넌트 트리)을 사용한다. 문제는 **서버에서 여러 유저가 하나의 싱글톤을 공유하는 것**이었다. Provider 패턴을 쓰면 서버 렌더링 시에는 요청마다 새 Provider 인스턴스가 만들어지고, 각 Provider가 자신만의 스토어를 갖게 된다.

### Q. 서버에서 초기값을 어떻게 주입하는가?

스토어가 요청마다 새로 만들어진다면, 서버에서 가져온 토큰을 어떻게 스토어에 넣어줄 수 있을까? 바로 이 지점에서 `initialToken`이 역할을 한다. 서버 컴포넌트(`layout.tsx`)에서 쿠키를 읽어 Provider의 prop으로 내려주면, Provider가 스토어를 생성할 때 그 값으로 초기화한다.

### 3단계: 서버에서 초기값을 주입해 Provider로 감싸기

```typescript
// app/layout.tsx
import { cookies } from 'next/headers';
import { AuthStoreProvider } from '@/providers/auth-store-provider';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 요청마다 서버에서 토큰을 읽어 Provider에 주입
  const cookieStore = cookies();
  const initialToken = cookieStore.get('access_token')?.value ?? null;

  return (
    <html>
      <body>
        <AuthStoreProvider initialToken={initialToken}>
          {children}
        </AuthStoreProvider>
      </body>
    </html>
  );
}
```

### Q. 왜 `layout.tsx`에서 쿠키를 읽는가? 쿠키도 공유되지 않는가?

Next.js의 `cookies()` 함수는 **현재 요청의 HTTP 헤더에서 쿠키를 읽는다.** 요청마다 헤더가 다르기 때문에 쿠키도 요청마다 다르다. Zustand 스토어처럼 서버 메모리에 저장된 전역 상태가 아니라, 각 HTTP 요청에 담겨 오는 데이터다.

```
유저 A의 요청  →  Cookie: access_token=token_A  →  cookies()로 읽으면 token_A
유저 B의 요청  →  Cookie: access_token=token_B  →  cookies()로 읽으면 token_B
```

요청이 섞일 이유가 없다. 각 요청이 자신의 쿠키를 갖고 오기 때문이다.

### Q. 그러면 서버 함수에서 토큰이 필요할 때는 무조건 쿠키에서 읽어야 하는가?

그렇다. 서버 환경에서는 Zustand 스토어를 건드리지 않는 것이 원칙이다. 서버에서 실행되는 코드(Server Component, Server Action, Route Handler)에서 토큰이 필요하다면 항상 `cookies()`나 `headers()`에서 직접 읽어야 한다.

**왜 서버에서는 스토어를 읽어도 안 되는가?**

스토어를 읽기만 해도 위험하다. 이전 요청에서 저장된 값이 남아있을 수 있기 때문이다. 서버에서 스토어에 접근하는 코드가 있다면, 그건 항상 잠재적 버그다.

### 4단계: 서버 액션에서 토큰을 스토어가 아닌 쿠키에서 직접 읽기

```typescript
// 서버 환경에서는 스토어를 건드리지 않는다
async function getAccessTokenWithFallback(): Promise<string | null> {
  // 서버: 쿠키에서 직접 읽기
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();
    return cookieStore.get('access_token')?.value ?? null;
  }

  // 클라이언트: 스토어 또는 쿠키 폴백
  try {
    const accessTokenByCookie = await getAccessToken();
    return accessTokenByCookie || null;
  } catch (error) {
    console.error('[AuthBridge] ❌ 토큰 조회 실패', error);
    return null;
  }
}
```

### Q. Provider 패턴을 쓰면 Hydration 문제는 없는가?

Hydration은 서버에서 렌더링한 HTML을 클라이언트가 React 트리로 연결하는 과정이다. 이 과정에서 서버의 초기 상태와 클라이언트의 초기 상태가 다르면 Hydration 불일치 오류가 발생한다.

Provider에 `initialToken`을 주입하는 방식은 이 문제를 자연스럽게 해결한다.

```
서버:  cookies()로 token_A 읽음 → Provider에 initialToken=token_A 주입 → HTML 렌더링
클라이언트:  서버가 보낸 HTML 수신 → 같은 Provider를 마운트하되 initialToken=token_A로 초기화
→ 서버와 클라이언트의 초기 상태가 일치 → Hydration 성공
```

**왜 초기값이 일치하지 않으면 문제가 되는가?**

React는 서버가 렌더링한 HTML을 그대로 쓰면서 거기에 이벤트 핸들러만 붙이는 방식으로 Hydration을 진행한다. 만약 클라이언트에서 초기 상태가 달라서 다른 HTML을 렌더링하면, 이미 그려진 DOM과 React가 기대하는 DOM이 달라져 불일치가 발생한다. 최악의 경우 전체 트리를 다시 렌더링하거나 화면이 깜빡이는 현상이 생긴다.

---

## 정리하면

| | React (SPA) | Next.js (SSR) |
|---|---|---|
| 런타임 환경 | 브라우저 1개 | 서버 1개 (N명 공유) |
| Zustand 스토어 수명 | 탭이 열린 동안 | 서버가 살아있는 동안 |
| `create()` 사용 | 안전 | **위험 — 요청 간 상태 공유** |
| `createStore()` + Provider | 불필요 | **필수** |
| 서버에서 토큰 읽기 | 스토어 OK | <mark>**쿠키/헤더에서 직접**</mark> |

---

## 마치며

React에서 잘 작동하던 패턴이 Next.js에서 치명적인 보안 버그가 됐다. 라이브러리를 새로운 환경에 도입할 때는 **그 환경이 어떻게 동작하는지**를 먼저 이해하는 것이 코드보다 먼저다.

Zustand는 훌륭한 라이브러리다. 다만 Next.js와 함께 쓸 때는 문서의 [Next.js 가이드](https://zustand.docs.pmnd.rs/learn/guides/nextjs)를 반드시 먼저 읽어야 한다.
