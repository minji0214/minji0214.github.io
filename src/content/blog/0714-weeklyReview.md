---
title: "주간회고 - 7월 둘째주"
description: "검색페이지 테스트코드 작성기"
pubDate: "07 14 2024"
tags: ["주간회고"]
---

첫 테스트 코드 작성 후기

- 사내 제품을 제대로 테스트 코드를 작성하고, 테스트를 완료한게 처음이다.예전의 나보다 성장해서 안보이던 것들이 보이는걸까. 아니면 조금의 여유가 생겨서 가능했던것일까. 아마도 둘 다일터이다. 암턴 이게뭐라고, 만들어 놓고, 테스트 까지 완료하니 아주 든든하다.
- 하나의 기능에 대해 직접 만들고, 운영을 하다보면, 어디가 잘 고장나고, 어디를 체크해야하는지 알게된다.검색페이지를 만들고, 운영하고, 개편하는 싸이클을 돌아본뒤 어떤 기능들이 테스트가 필요한지 알게되었다. <br/>
  - 다중필터 선택이 되는지
  - 필터 선택시 router가 정상적으로 작동하는지
  - 라우터 변경에 따른 fetching이 제대로 일어나는지
  - sidesheet가 선택한 필터에 따라 열리는지.
    <br/>
    주로 이런 기능들이 매던 테스트 하기 번거롭지만, 자주 고장날 수 있는 부분들이다.
- 테스트 코드를 짜다보면, 또 테스트 케이스를 고민하다보면, 미쳐 찾지 못했던 버그도 발견하게 된다.

---

### 우리 작업방식에 맞는 폴더구조 찾기

- 폴더구조 정리
  https://reactnext-central.xyz/blog/nextjs/code-structure-and-maintenance-strategies-for-nextjs
  https://bluemiv.tistory.com/87

기능과 구조 파악이 용이하고, 유지보수를 작업의 효율을 목적으로 한 폴더구조 개선

1. 피쳐가 늘어날때마다 component내부 폴더 중가 (사실상 modules의 기능과 동일) → 사실상 components라는 명에 맞지 않음.
2. customhook, zustand store사용 → hook,store파일의 관리의 어려움
3. hooks와 uitls 동일한 폴더가 여러곳에 있음.
4. 해당 기능과 관련된 파일을 찾는데 효율적이지 못하다고 생각됨.

```jsx
modules > coupons >
components / types / hooks / store / constants /styles /test

* modules : 피쳐단위 개발을 하므로, modules로 분리. 공통컴포넌트만 components에서 관리
* constants: 따로 분리할 만큼 필요가 있는가
* types: 기존에 api에 타입들을 모아둠. 이사의 필요성이 있을까
* style을 분리하면 코드자체는 간결해지지만, 사용하는 컴포넌트와 분리되어 유지보수의 불편함 (누가 어떤 스타일을 호출하는지,)
* test : 앞으로 테스트코드를 작성해 나갈것인가?

```

```

components // 기존 components는 공통컴포넌트에 사용
│
modules
├── common
│   └── (여러 기능이 공통으로 사용하는 코드)
├── coupons
│   ├── components
│   │   ├── CartItem.tsx
│   │   └── CartTotal.tsx
│   ├── styles
│   │   └── index.tsx
│   ├── hooks
│   │   ├── applyDiscount.ts
│   │   └── getCartSum.ts
│		├── styles //옵셔널
│   │   └── index.tsx
│		├── types //옵셔널
│   │   └── index.tsx
│		├── test //옵셔널
│   │   └── index.tsx
│   └── store //zustand store
│       ├── applyDiscount.ts
│       └── getCartSum.ts
│

```

아래와 같은 고민들이 있다..

- modules : 피쳐단위 개발을 하므로, modules로 분리. 공통컴포넌트만 components에서 관
- constants: 따로 분리할 만큼 필요가 있는가
- types: 기존에 api에 타입들을 모아둠. 이사의 필요성이 있을까
- style을 분리하면 코드자체는 간결해지지만, 사용하는 컴포넌트와 분리되어 유지보수의 불편함 (누가 어떤 스타일을 호출하는지,)
- test : 앞으로 테스트코드를 작성해 나갈것인가?

최근 fsd라는 폴더구조가 뜨고 있다. 계속 피쳐들이 늘어나고 있기 때문에, 이런 구조도 고려해보면 좋을것 같다.
