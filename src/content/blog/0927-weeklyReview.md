---
title: "주간회고- 9월 막주"
description: "새로운걸 많이 배우게된 한주. 그리고 다짐."
pubDate: "09 27 2024"
heroImage: "/heroImgs/thumb_weekly.png"
tags: ["주간회고"]
---

한동안 주간회고를 하지않았다.
나는 자주 번아웃이 오는편이라 번아웃이 오기도 했고, 주간회고가 필요한가에 대해 고민이 있었다.
한동안 안해보니 필요성을 느껴 이렇게 다시 시작하게 되었다.

주간회고에서는 주로 한주간 회사에 만난 이슈들, 새로 배운 내용들을 정리하고,
앞으로의 방향성을 다잡는 시간으로 삼고 있다.

### 왜라는 질문을 습관처럼.

1년차 까지는 닥치는 업무를 치는라 cs지식이라던가, 작동원리를 이해하는건 사치였다. 어찌어찌 야매로 오류를 해결하면 다행이었다.
하지만 이제는 곧 3년차! 업무에도 여유가 생기고, 근본적인 문제해결을 위해서는 더 깊게 알아야함을 많이 깨닫고 있다. 더이상 이런식으로 얼렁뚱땅 넘어갈 수는 없다.
이게 왜 오류가 났는지,
리액트는 왜 이렇게 동작하는지,
깊이 고민하자.

### 오픈소스 컨트리뷰션 아카데미

오픈소스 활동에 관심이 생겨 어떻게 시작해볼까 하다가, 우연히 모집글을 보게되었고, 첫시작으로는 너무자 좋은 경험이 될거 같아 참여하게되었다.
내가 참여하게되는 프로젝트는 ant design의 korea사이트를 만드는 일이고, test팀에 참여하였다. test코드를 회사에서 진행하지 않아 따로 경험해 볼 기회가 없었는데 좋은 기회라고 생각되어 테스트팀에 들어갔다.
현직자분들도 계시고, 취준생 분들도 많이계서서 개발이야기도 많이나누고 좋은 커뮤니티의 역할도 되는거 같아서 5주간 열심히 활동해보려고 한다.

### 소프트 스킬이 좋은 개발자가 되자.

내가 생각하는 좋은 개발자는 육각형개발자이다. 개발자라면 모름지기 개발을 잘해야 한다. 하지만 내가 함께 일하고 싶은 개발자를 생각하면, 소통이 잘되고 의지할 수 있고, 편한 동료이다. 그래서 이 모든걸 고르게 갖춘 육각형개발자가 좋은 개발자라고 생각한다. 실제로 고루 갖추기는 어렵고, 쉽지 않다.
나는 원래 성격이 나빠도 개발자만 잘하면 장땡이라고 생각했던 사람이라, 나 또한 소프트 스킬이 부족할거라 생각한다. 그래서 요즘 주변 동료들에게 그런면들을 많이 많이 배우고, 내걸로 만들려고 하고 있다. 주변사람들이 나와 일하기 편해하고, 일하고 싶어하도록 하는 그런 개발자가 되고 싶다.

### nextjs env이슈

이번에 핫픽스를 나간 건이 있다.
너무 바보같은 실수를 했다고 생각한다.
바로 nextjs에서 `NEXT_PUBLIC`이 붙지 않은 환경변수를 사용하여 사이드 이펙트가 생긴것이다. 왜 더 꼼꼼하게 체크하지 않았을까 후회가 된다.

Nextjs의 Env에 대해 다시한번 돌아보자.
https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables

`NEXT_PUBLIC_`이 붙지 않은 환경변수는 오직 nodejs 환경에서만 가능합니다.
즉, 브라우저에서는 접근할 수 없습니다(클라이언트는 다른 환경에서 실행됩니다).
환경 변수의 값을 브라우저에서 액세스할 수 있도록 하기 위해 Next.js는 빌드 시 클라이언트에 전달되는 js 번들에 값을 "인라인"하여 모든 참조를 process.env.[variable]하드코딩된 값으로 대체할 수 있습니다

여기까지가 nextjs 문서에서 설명하는 내용이고
env가 작동하는 원리에 대해서 좀더 알아보자.

nextjs는 빌드시간에 정적으로 최적화 됩니다.
환경변수는 기본적으로 빌드시간에 평가되고 삽입됩니다.
보안상의 이유로 기본적으로 환경변수는 서버에서만 접근이 가능합니다.
Nextjs는 성능최적화를 위해 코드를 여러 번들로 분리하게됩니다. 클라이언트로 전송되는 Javascript 번들에는 필요한 코드만 포함됩니다.
그래서, NEXT_PUBLIC 변수는 정적으로 교체되어 번들 크기를 최소화합니다. 이는 런타임에 동적으로 값을 가져오는 것보다 효율적으로 만들어줍니다. 또한 개발자에게 어떤 변수가 클라이언트에 노출되는지 명확히 알려주는 장점이 있습니다.

작동순서는

1. 빌드 프로세스 중 Next.js는 NEXT_PUBLIC 접두사가 있는 환경변수를 식별
2. 클라이언트 사이드 코드에 인라인으로 삽입
3. 클라이언트 JavaScript 번들의 일부가 되어 브라우저에서 접근 가능

### git revert와 reset

git revert는 그래프자체의 이동입니다.
git reset은 코드의 변환입니다.
그래서 revert 이후에 revert한 코드를 pr을 하려고 하면 이미 머지된 코드이기 때문에 revert를 revert해야합니다.

### safari popup

https://stackoverflow.com/questions/44073069/why-is-my-popup-blocked-on-touch-but-not-click-using-pointerdown-listener

https://stackoverflow.com/questions/2587677/avoid-browser-popup-blockers/40283785#40283785

- 팝업이 사용자 상호작용 없이 JavaScript 코드가 자동으로 팝업을 열려고 시도하면 브라우저가 이를 의심스런 동작으로 판단해 차단할 수 있습니다. 팝업을 백그라운에서 비동기로 열기보다는 사용자에게 명확한 동작 흐름 안에서 열리게 하는게 좋습니다.
- 팝업이 비동기 함수 내에서 열리지 않는 이유는 브라우저의 **팝업 차단 정책** 때문입니다. 대부분의 브라우저는 사용자가 직접 상호작용(예: 버튼 클릭, 링크 클릭 등)을 통해서만 팝업이 열리도록 강제합니다. 비동기 함수 내에서 팝업을 열게 되면, 사용자 상호작용과 팝업 열기 사이에 시간이 발생하기 때문에 브라우저가 이를 비정상적인 동작으로 인식하고 팝업을 차단할 수 있습니다.

비동기 함수에서 팝업이 차단되는 예는 아래와 같습니다.

```jsx
const handleClick = async () => {
	await someAsyncTask(); // 비동기 작업 (예: API 호출, 타이머 등)
	const popup = window.open("about:blank", "_blank"); // 팝업 차단 가능성
};
```

해결방법

```jsx
const handleClick = async () => {
	// 사용자 상호작용 직후에 팝업을 동기적으로 먼저 열기
	const popup = window.open("about:blank", "_blank");
	// 비동기 작업 수행
	await someAsyncTask(); // 예: API 호출, 타이머 등

	// 비동기 작업 완료 후 팝업의 URL 설정
	popup.location.href = "/new-url";
};
```

### 그외......

- PropsWithChildren과 ReactNode
  https://medium.com/@colorsong.nabi/propswithchildren-vs-reactnode-in-typescript-c3182cbf7124
  https://dev.to/maafaishal/unsafe-propswithchildren-utility-type-in-react-typescript-app-3bd3
  https://www.dhiwise.com/post/understanding-react-propswithchildren-a-comprehensive-guide
- React.FC
  https://www.totaltypescript.com/you-can-stop-hating-react-fc
  https://blog.logrocket.com/upgrading-react-18-typescript/
  https://velog.io/@doeunnkimm_/React에서-타입스크립트를-위해-지원하는-타입
- 사파리 쿠키저장안됨
  https://shanepark.tistory.com/454
