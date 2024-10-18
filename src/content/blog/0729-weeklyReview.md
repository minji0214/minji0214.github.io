---
title: "주간회고- 7월 막주"
description: "배포했는데 컴포넌트가 안보인다...삽질주간"
pubDate: "07 29 2023"
heroImage: "/minglog/heroImgs/thumb_weekly.png"
---

### 마법의 height 0

height가 반응형인데, 고정된 element사이에 남은 영역을 가변으로 주고 싶을때 마법의 height 0 + flex grow를 주면
딱 남은 공간까지만 차지할 수 있게 된다.

### focus in/out animation

input이 focus in 에서 타이틀 영역이 사라지고, 컨텐츠가 위로 올라가게 된다.
focus out(blur)에서 다시 타이틀 영역이 생기고, 컨텐츠는 내려오게 된다.
요 과정에서 input 바깥에 있는 버튼 혹은 다른 요소를 클릭했을때, 클릭이벤트가 발생하지않고, focus out 이벤트만 발생하게 된다.
해결 -> outside click으로 버튼이 포함되는 영역을 focus in 영역으로 잡아주었다.
--> 이 해결방법은 근본적인 해결책이 아니다. 역시나 outside click 바깥영역은 focus in 상태에서 클릭이 안되기 때문.
--> 원인을 찾아보니, 이벤트버블링이었다.
이벤트가 발생한 요소에서부터 최상위 요소까지 이벤트를 전파합니다. 예를 들어, 버튼을 클릭하면 클릭 이벤트가 버튼에서 시작해 상위 요소로 전파됩니다.

blur 이벤트 특성: blur 이벤트는 포커스를 잃었을 때 발생하는 이벤트입니다. 포커스를 잃는 순간 blur 이벤트가 발생하고, 이때 click 이벤트가 발생합니다. 하지만 blur 이벤트는 동기적으로 실행되므로, blur 이벤트 핸들러가 먼저 실행되고 나서야 click 이벤트 핸들러가 실행됩니다.

발생하는 현상
input이 포커스를 잃으면서 blur 이벤트가 발생하고, 이 이벤트 핸들러가 실행됩니다.
blur 이벤트 핸들러가 실행된 후에야 버튼의 click 이벤트가 발생합니다.
만약 blur 이벤트 핸들러에서 어떤 이유로 이벤트 처리를 막거나, DOM 변경이 발생하면, 이후의 click 이벤트가 정상적으로 처리되지 않을 수 있습니다.
해결 방법
이벤트 순서 조정: blur 이벤트에서 애니메이션을 실행할 때, 이벤트 처리를 비동기적으로 수행하도록 조정합니다. 이를 통해 click 이벤트가 먼저 처리되도록 할 수 있습니다.

const handleBlur = (event) => {
setTimeout(() => {
// blur 이벤트 시 애니메이션 실행 코드
}, 0);
};
이벤트 핸들링 조건 추가: blur 이벤트 핸들러에서 특정 조건을 추가하여, 버튼 클릭 시의 처리를 확인할 수 있습니다.
javascript
코드 복사
const handleBlur = (event) => {
if (document.activeElement.tagName === 'BUTTON') {
// 버튼이 클릭된 경우 처리
return;
}
// blur 이벤트 시 애니메이션 실행 코드
};

### funnel컴포넌트의 리렌더

리렌더의원인은 내가찾던 내부가 아니라 funnel에 있었다.
funnel의 props가 바뀔때마다 값이 변동

### 논리 OR (`||`)

- 왼쪽 피연산자가 falsy (예: `false`, `0`, `""`, `null`, `undefined`, `NaN`)일 경우 오른쪽 피연산자를 반환합니다.
- 예:

  ```jsx
  javascriptCopy code
  const result = value || 'default';

  ```

### 널 병합 (`??`)

- 왼쪽 피연산자가 `null` 또는 `undefined`일 경우에만 오른쪽 피연산자를 반환합니다.
- 예:

  ```jsx
  javascriptCopy code
  const result = value ?? 'default';

  ```

### 차이점 요약

- `||`는 모든 falsy 값을 처리합니다.
- `??`는 오직 `null`과 `undefined`만 처리합니다.

https://medium.com/@technicadil_001/how-to-write-better-typescript-codes-dbfe43d85103

https://joshua1988.github.io/ts/usage/mapped-type.html#맵드-타입-실용-예제-2

https://www.albertgao.xyz/2017/10/31/why-this-react-code-not-work-in-production/

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/c133c558-e85c-44e8-8438-92fcfeeb988a/Untitled.png)

문제의 원인은 코드 압축 과정에서 컴포넌트 이름이 변경되어 발생합니다.

압축 과정에서 컴포넌트 이름이 변경되는 이유는 코드의 크기를 줄이고 성능을 최적화하기 위해 코드 압축 도구(예: UglifyJS, Terser)가 변수와 함수의 이름을 짧게 변경하기 때문입니다. 이 과정에서 긴 이름은 짧은 문자 하나 또는 두 개로 변환됩니다. 이렇게 하면 전체 코드 크기가 줄어들어 로딩 속도가 빨라지지만, 이름 기반으로 로직이 동작하는 경우 문제가 발생할 수 있습니다. 이를 방지하기 위해 `displayName` 속성을 사용해 컴포넌트 이름을 명시적으로 설정하면 압축 과정에서도 이름이 변경되지 않습니다.

https://velog.io/@th_velog/웹뷰-Fixed-가상-키보드-VisualViewport-사용

사파리 height 이슈 a-z

```jsx
useEffect(() => {
	// 뷰포트 높이를 기반으로 --vh 변수를 설정하는 함수
	const setElementHeight = () => {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
		window.addEventListener("resize", setElementHeight);
	};
	setElementHeight();

	return () => {
		window.removeEventListener("resize", setElementHeight);
	};
}, [selectedBookList])`'calc(var(--vh, 1vh) * 100 - 450px)'};`;
```

마지막 나에게 한마디
문제를 테이프붙여서 문제를 회피하는 방식으로 해결하는 것이 아닌,
원인을 찾아서 문제를 해결하자.
