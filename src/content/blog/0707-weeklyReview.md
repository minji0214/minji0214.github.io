---
title: "주간회고 - 7월 첫째주"
description: "얕은 복사와 깊은 복사"
pubDate: "07 07 2024"
heroImage: "/minglog.github.io/blog-placeholder-1.jpg"
---

### 캐노니컬 태그

https://growthacking.kr/캐노니컬-태그-canonical-tag로-검색엔진-최적화하기/

- 채널톡에 몇몇 페이지의 경로가 안잡힌다는 제보가 들어왔다.
  채널톡 문서를 아직 자세히 찾아보진 않았지만

---

### 얕은 복사와 깊은 복사

객체를 다루다가 이상함을 발견하게 되었다.
filterResponse를 newfilter에 새롭게 할당하고, newfilter를 가공하였다.
나름 무결성을 유진한다고, 새로운 변수에 할당후 가공하였는데,
filterResponse 자체가 변하게 되었다.
얕은 복사와 깊은복사의 차이를 고려하지 않아서 생긴 버그였다.

```jsx
const newFilterList = useMemo(() => {
  if (!filterResponse) return {};

  let newFilter = filterResponse[filterParams.productType];
  //newfilter 뿐만 아니라 filterResponse자체가 제거됨.
  delete newFilter[SearchQueryKey.CONTENTTYPES];
  delete newFilter[SearchQueryKey.EDITABLES];

  return newFilter;
}, [filterResponse, filterParams.productType]);
```

얕은 복사 : 객체의 참조값

얕은 복사란 객체를 복사할 때 기존 값과 복사된 값이 같은 참조를 가리키고 있는 것을 말한다.

객체 안에 객체가 있을 경우 한 개의 객체라도 기존 변수의 객체를 참조하고 있다면 이를 얕은 복사라고 한다.

=> 객체 자체는 다른 새 객체지만, 객체 내부의 값이 클론 한 객체 값의 참조값을 복사하는 경우 <br/>
=> newfilter는 주소값이 복사됐기 때문

깊은 복사 : 객체의 실제값
object : 변수가 객체의 주소를 가리키는 값이기 때문에 참조값을 복사하여 같은 값을 가리킴. 수정시 원본까지 수정됨.

<깊은 복사 해결방법>

1. JSON.parse && JSON.stringify
2. spread : 1depth까지만 깊은 복사
   방식이 있는데, 나는 간편한 spread 방식을 사용하였다.
   하지만 주의할 점이, spread방식은 1depth까지만 깊은 복사가 적용된다.
   2depth부터는 얕은 복사이다.

```jsx
const newFilterList = useMemo(() => {
  if (!filterResponse) return {};

  // 깊은 복사를 수행하여 원래 객체를 변경하지 않도록 함
  let newFilter = { ...filterResponse[filterParams.productType] };

  delete newFilter[SearchQueryKey.CONTENTTYPES];
  delete newFilter[SearchQueryKey.EDITABLES];

  return newFilter;
}, [filterResponse, filterParams.productType]);
```

---

### suspense 적용해보기

이번 스프린트를 진행하면서 suspense를 전역적으로 도입해보면 어떨까 하는 이야기가 나왔다.
loading시 ui를 각각 넣어주는 것보다,필수로 설정하는것이 앞으로 피쳐를 개발하는데 있어서 더 효율적일것 이라는 예상때문이었다.

<suspense를 검색페이지에 적용해보면서 느낌점 >

1. 전역 사용 이슈 : react-query에 suspense option을 추가하게 되면, 무조건 suspense로 컴포넌트를 감싸줘야함. 한번에 모든 페이지에 suspense를 추가해주기에는 무리가 있음.
2. 성능이슈 : 메모리가 120mb ~ 400mb 까지 증가
3. 느려짐 : waterfall 이슈 필터의 선택이 느려짐.
   => react-query의 useSuspenseQueries를 사용하면 해결가능하다고 한다.
   위와 같은 단점들이 발견되었지만 어느정도 해결방법들은 존재한다. 바로 전역에 도입하기 보다는, 가벼운 페이지부터 적용해보면 좋을것 같다.

---

### 믹스패널 set property 이슈 간단정리

Mixpanel에서 "Session Start"는 사용자가 특정 이벤트를 수행할 때 시작되는 가상 이벤트입니다. 이는 세 가지 방식으로 설정될 수 있습니다: Timeout Based, Event Based, Property Based. 이 중 어떤 방식을 선택하느냐에 따라 "Session Start" 이벤트가 언제 발생하는지가 결정됩니다.

예를 들어, Property Based 세션에서는 사용자가 선택한 속성(예: "session_id")이 "Session Id"로 정의되며, "Session Id" 속성의 값이 일정하게 유지되는 한 세션이 계속됩니다. "Session ID" 값이 변경되면 새로운 세션이 시작됩니다. 이 경우, "Session Id" 값을 포함하지 않는 이벤트는 세션 시작 및 종료 이벤트를 계산하는 데 사용되지 않습니다. 따라서 이런 경우에 "Session Start" 이벤트가 발생하지 않을 수 있습니다.

또한, "Session Start" 이벤트는 특정 세션의 첫 번째 이벤트로부터 특정 속성을 자동으로 상속합니다. 이 속성이 설정되지 않은 경우, 해당 속성은 "(not set)"으로 표시될 수 있습니다.

따라서 "Session Start" 이벤트의 속성이 "not set"으로 표시되는 경우는 주로 두 가지입니다:

1. Property Based 세션에서 "Session Id" 값이 설정되지 않은 경우
2. 세션의 첫 번째 이벤트에서 상속해야 하는 속성이 설정되지 않은 경우

이러한 문제를 해결하려면, 이벤트 페이지를 사용하여 "undefined" 속성 값을 트러블슈팅할 수 있습니다. 이를 통해 어떤 이벤트가 해당 속성 없이 발생하는지 확인하고, 왜 그런지 코드를 확인할 수 있습니다.

참고 링크:

- [Sessions](https://docs.mixpanel.com/docs/features/sessions)
- [Session Computation Deep-Dive](https://docs.mixpanel.com/docs/features/sessions#session-computation-deep-dive)
- [Troubleshooting Tips](https://docs.mixpanel.com/docs/features/advanced#troubleshooting-tips)

https://mixpanel.com/blog/top-user-onboarding-metrics/

https://beforb.tistory.com/23

---

## 정리

일주일이 후다닥 지나갔다.

전보다 시간에 쫓겨 일하는 것들이 많이 줄어든 것 같다.

이번주는 코드리뷰에 대한 고민 있다. 코드리뷰를 열심히 하기 시작했는데,

어떤리뷰가 긍정적인 효과를 불러오는 리뷰일지 고민이 많다.

<블로그에서 찾은 좋은 코드리뷰 문화이다>

```
* 코들뷰는 누구나 할 수 있습니다. 개발자가 아니어도 할 수 있습니다.
* 개발자가 아니어도 이해할 수 있는 코드를 작성할 수 있게 노력해보세요.
* 코드리뷰는 질책하거나 이거 왜 이렇게 했냐고 탓하는 자리가 아닙니다. 코드리뷰를 받았다고 책임이 회피되는 것도 아닙니다.
* 코드리뷰는 실수한 부분이 있는지 서로 확인하고, 개선할 부분이 있는지 같이 보는 겁니다.
* 코드리뷰는 즐거운겁니다. 짤같은걸 써도 됩니다. 쓰세요. 권장합니다. 즐거운 분위기로 만드세요.
* 나봐 잘하는 사람의 코드를 리뷰하게 되면 코드를 보고 배우는게 많습니다. 와 이런 방법도 있군요 같은 코멘트를 다셔도 됩니다.
```

코드리뷰 할때, 개선점이나 버그만 찾으려고 했었는데, 특히 좋은 말도 많이 남겨야겠다.
--
남은시간에 뭘해야 할까 고민이 많았는데,
테스트 코드를 짜야겠다. 이거에 집중해보자.
사실 할게 너무 많아서 우선순위를 정하기 어려운 그런상태인거 같다.
