---
title: "reactQuery 사내 도입하기"
description: "reactQuery 도입후 6개월..."
pubDate: "07 11 2024"
heroImage: "/minglog.github.io/heroImgs/blog-placeholder-1.jpg"
---

기존에 우리 회사의 서비스는 상태관리는 mobx로 하고, 서버의 상태는 관리하지 않고있었다.

이번에 검색페이지를 개편하면서, 개선필요한 부분들을 찾은 결과.

1. fetch 일어난뒤 여러번 fetch가 일어남.
2. 페이지네이션 이용이 불편함.
3. lighthouse 성능 점수 낮음.

이런 이슈들을 발견하였고, react-query의 캐싱기능과, useInfiniteScroll 등의 api를 이용하면, 유저가 사용하기 편리한 무한스크롤을 구현가능하여 도입을 결정하게 되었다.

---

### 주로 어떤 경우에 사용하는 걸까

상태관리는 클라이언트 상태와, 서버 상태로 나눌 수 있다.

클라이언트상태는 주로

서버,외부 소스 데이터

고용량의 데이터 소스,

세션 간에 지속성 유지.

인증및 암호화로 보호가능.

네트어크 요청이 필요.

서버상태

클라이언트 데이터

컴포넌트 상태, 브라우저 쿠키,

왜 분리해서 관리하는 걸까 ?

1. 데이터 동기화
2. 캐싱과 최적화
3. 상태관리의 단순화

---

### 쿼리의 기본 개념

1. 쿼리 : use query 훅 apiendpoint , 원격 데이터소스
2. 뮤테이션 : use mutation 훅 , 새로운 데이터 추가하거나, 기존데이터 수정하는 요청,
3. 쿼리캐싱: query caching , 쿼리 결과를 메모리에 저장
4. 쿼리 무효화 : 쿼리 무효화 하거나 오래된 상태로 표시하는 과정, 쿼리를 무효화 하거나, 오래된 상태로 표시

---

다양한 상황에서 react-query 사용하기

### 1. useInfinite scroll로 무한스크롤 구현하기

[useInfinite scroll ](https://www.notion.so/useInfinite-scroll-0d724160fccf41f0b09dfa90ff66eff5?pvs=21)

[react-query 사내 도입 회고 2편](https://develogger.kro.kr/blog/LKHcoding/153)

---

### 2. ssr 환경에서 react-query 사용하기

---

### 3. 버튼을 클릭했을때는 어떻게 useQuery를 사용할까

refetch

[[Next.js] React Query로 SSR 구현하기](https://tesseractjh.tistory.com/269)

https://github.com/mingdolacucudas/reactquery-searching/blob/main/src/App.js

[SSR 환경에서의 React Query](https://www.univdev.page/posts/react-query-ssr/)

코드 리팩토링

원래

```tsx
const data = useQuery({
  queryKey: ["dataItems"],
  queryFn: () => getDataItems(id),
});
let resultStr = "";
if (data.data) {
  data.data.map((item) => {
    resultStr += item.data_value;
  });
}
```

수정후

```tsx
const data = useQuery(["dataItems"], () => getDataItems(id));
let resultStr = "";
if (data.data) {
  data.data.forEach((item) => {
    resultStr += item.data_value;
  });
}
```

2차 : join이 성능상의 이점이 있다.

```tsx
const data = useQuery(["dataItems"], () => getDataItems(id));
let resultStr = "";
if (data.data) {
  resultStr = data.data.map((item) => item.data_value).join("");
}
```

삽질기

```tsx
fetchtitle 후 action이 4번 실행됨.
react query를 사용하면 페이지가 여러번 렌더링 되어도 한번만 fetch됨.
onsuccess액션을 넣으면 그또한 한번만 실행됨.

```

1. fetch title
2. 저장하기 커맨드
3. pdf커맨드
4. 559-969
5. 성능측정 필요
6. 서버비 이슈
7. 다음 auto save함수

[React Query 와 SSR - React Query 라이브러리 코드보며 이해하기](https://velog.io/@eomttt/React-Query-와-SSR)

setuphandlers 수정해야하나 고민

### 4. 같은 쿼리를 여러번 날려야 한다면 useQueries

### 5. 비동기 요청이 필요하다면 mutateAsync

### 6. response의 모양을 바꾸고 싶다면, stale

### react query 계층정하기

[[꼭꼭] React Query 계층 구조 도입하기](https://velog.io/@rat8397/꼭꼭-React-Query-계층-구조-구분하기)

쿼리키 관리하기

The **unique key** you provide is used internally for refetching, caching, and sharing your queries throughout your application.

refetching, chaching, 다른곳에서 호출 등에 사용된다.

용도

캐시의 키 : 해당 키에 맞는 쿼리결과를 자동으로 캐싱 . 동일한 쿼리키는 이전에 캐시된 결과사용

—> 중복요청 방지, 성능향상

의존성 관리 : 의존하는 데이터의 변경을 감지. 데이터 변경시 해당 쿼리 재실행 —> 데이터 일관성 유지

단, 변경하는 변수를 모두 포함해야 한다.

```tsx
function Todos({ todoId }) {
  const result = useQuery({
    queryKey: ["todos", todoId],
    queryFn: () => fetchTodoById(todoId),
  });
}
```

상세 페이지 작성할때

페이지 마다 캐싱가능할듯 ?

근데 그렇게 해야하나???

다시 안들어갈수도 있는데???

```tsx
const queryKey = ["userData", userId];
```

5,140,691

# ssr과 react-query

server-side props에서 리액트 쿼리를 사용하는 방법에는 두가지가 있다.

1. initialData의 사용
   1. 사용법은 간단하지만, 클라이언트 사이드에서 해당 데이터를 사용하는 컴포넌트까지 props로 넘겨주어야 하는 비효율적인 작업이 동반됩니다.
2. 서버에서 캐시를 dehydrate , 클라이언트에서 hydrate

서버에서 캐시를 디하이드레이트한다는 말은, 서버사이드 렌더링(SSR)을 사용하여 렌더링된 페이지의 데이터를 클라이언트에게 전송하기 전에 캐시된 데이터를 복원하거나 재사용하는 과정을 의미합니다.

보다 자세히 설명하자면, 서버사이드 렌더링을 통해 페이지를 렌더링하면 서버에서 해당 페이지의 데이터를 가져와 HTML로 렌더링한 후 클라이언트에 전송합니다. 이때, 클라이언트에서는 이전에 이미 요청한 데이터나 페이지의 일부분을 캐시로 저장해둘 수 있습니다.

캐시된 데이터는 페이지 이동 시 새로운 요청을 보내지 않고 캐시된 데이터를 사용하여 페이지를 빠르게 로딩하고 성능을 개선하는 데 도움이 됩니다.

따라서 "서버에서 캐시를 디하이드레이트한다"는 말은, 서버에서 가져온 데이터가 캐시에 저장되어 있다면 클라이언트로 전송하기 전에 이 캐시된 데이터를 복원하여 사용한다는 것을 의미합니다. 이로써 클라이언트는 더 빠르게 페이지를 로딩하고 사용자 경험을 향상시킬 수 있습니다.

클라이언트에서 "hydrate"한다는 것은, 서버에서 렌더링된 HTML 콘텐츠를 클라이언트 측 JavaScript와 결합하여 상호작용 가능한 웹 페이지로 만드는 과정을 의미합니다. 이는 주로 서버사이드 렌더링(SSR)이나 정적 생성(Static Generation)을 통해 렌더링된 페이지에 적용됩니다.

더 구체적으로 설명하면, 클라이언트에서 "hydrate"는 다음과 같은 프로세스를 가리킵니다:

1. **서버에서 렌더링된 HTML 수신**: 서버에서 페이지의 초기 렌더링 결과인 HTML을 클라이언트로 전송합니다.
2. **JavaScript와의 결합**: 클라이언트 측 JavaScript 코드가 페이지의 HTML과 결합됩니다. 이때 JavaScript는 페이지의 상호작용과 동적인 부분을 다룹니다.
3. **이벤트 처리 및 상호작용 추가**: 클라이언트 측 JavaScript는 이벤트 처리기를 설정하고 상호작용 가능한 요소들을 구성합니다. 사용자의 동작에 따라 웹 페이지가 업데이트되거나 변경될 수 있도록 준비됩니다.

이 과정을 통해 클라이언트 측 JavaScript와 서버에서 전달된 초기 HTML이 효율적으로 결합되어, 사용자가 웹 페이지를 빠르게 로딩하고 상호작용할 수 있도록 합니다. "hydrate"는 페이지의 초기 로딩을 최적화하고 사용자 경험을 향상시키는 데 도움이 되는 개념입니다.

정리 : serverside로 데이터를 가져올때 , 캐싱되었을 경우, 더 빠르게 데이터를 가져올 수 있다.

# refetch options

refetch여부가 중요하지 않을 경우,

```jsx
const DISABLED_REFETCH_OPTIONS :{
readonly refetchOnWindowFocus : false;
readonly refetchInterval: false ;
readonly refetchOnMount: false;
readonly refetchOnReconnect: false;
readonly refetchIntervalInBackground: false
}
```

# stale time cache time

1. cacheTime은 inactive 상태일 때 카운트 다운하고 staleTime은 active 상태일 때 카운트 다운한다.

### suspense option

# 주의사항.

유저정보와 관련된 경우, 주의해야 한다.

a 유저한테만 보이는 정로를 b유저에게 보여서는 안된다.

퍼포먼스의 이유로 Next.js에서는 SSG -> ISR -> SSR 순으로 페이지 생성을 권고하고 있습니다.

### 처음 접하면서 마주한 오류

onSuccess의 경우 캐싱의 경우 해당 함수를 타지 않는다.

캐싱이 뭔가 이상하다 하면, 쿼리키가 잘못됐을 경우

retry를 0으로 설정해주지 않으면 에러시 무한 요청이 날라감

### 훅으로사용할때는 비동기 처리를 해주자 async

### 같은쿼리를 두번 날려야 할때는 useQueries를 사용해보자.

이 모든 내용들은 대부분 독스에서 얻은지식이다.

react-query는 초보자도 이해하기 쉽도록

근데 이를 어찌하나,

고민해보자.

음.

[React-query 에서 isLoading이랑 isFetching은 뭐가 다르지?](https://velog.io/@himprover/React-query-에서-isLoading이랑-isFetching은-뭐가-다르지)

빡취게 하는 isLoading 과 isFetching
