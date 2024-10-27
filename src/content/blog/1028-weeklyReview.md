---
title: "주간회고- 10월 셋째주"
description: "이터레이터와 URLSearchParams"
pubDate: "10 28 2024"
heroImage: "/minglog/heroImgs/thumb_weekly.png"
---

남은 연차를 소진할겸 부산여행을 다녀왔다. 이번 여행에서는 마음도 정리하고, 내가 앞으로 나아가야할 길에 대해서도 정리할 수 있었다.
답은 하나다. 꾸준히 공부할것. 묵묵히 내길을 갈것.

### 첫 오픈소스 기여

과기부에서 주관한 오픈소스 컨트리뷰션 아카데미 활동의 막바지에 왔다. 수료전에 pr을 꼭 한번 날리고자 미뤄덨던 작업을 하였다.
오픈소스에 기여하는 방법은 생각보다 간단하였다.
fork -> commit -> pr -> approve
이번 contribute를 하면서 나도 기여할 수 있구나, 이렇게 쉬운거였구나를 깨닫게 되었다. 앞으로 더 많은 오픈소스에 관심을 갖고 컨트리뷰트를 할것이다!! 백로그 추가.

### RSC 컴포넌트

서버사이드 렌더링 관련된 이슈를 해결하면서 RSC 컴포넌트까지 오게되었다. 이번에 새로 알게된 RSC 컴포넌트의 특징

- RSC 컴포넌트의 자바스크립트 코드는 웹팩 같은 번들러 에서 자동으로 제외 됩니다. 서버에서 실행되므로 클라이언트에서 실행될 필요가 없기 때문인데요. ‘server.js’ 확장자를 가진 파일들이 자동으로 서버 컴포넌트로 인식되어 번들 대상에서 자동으로 제외됩니다. -> Zero-Bundle-Size Components
- Zero-Bundle-Size Components: 클라이언트 자바스크립트 번들 사이즈가 감소하고 브라우저 개발자 도구 Source 탭에서 해당 코드를 볼 수 없습니다.

### 갑자기 든 궁금증 : 모던 프론트엔드의 방향성이 SSR -> CSR -> 다시 SSR로 가게된 이유는 뭘까

1. SSR 에서 CSR로 전환된 이유.

- **빠른 사용자 경험**: CSR은 초기 로딩 속도가 빠르고, 페이지를 전환할 때 필요한 데이터만 불러오기 때문에 더 빠른 사용자 경험을 제공할 수 있습니다.
- **인터랙티브한 웹 애플리케이션**: 자바스크립트로 UI를 즉각적으로 업데이트하고 사용자 인터랙션을 처리할 수 있어 더 동적인 웹 애플리케이션 개발이 가능해졌습니다.
- \*SPA(Single Page Application)\*\*의 등장: CSR을 기반으로 하는 SPA는 페이지 전환 없이 콘텐츠를 동적으로 로드할 수 있는 장점을 가지고 있습니다.

2. CSR에서 다시 SSR로 돌아가는 이유 : 최근에는 서버 사이드 렌더링이 다시 부각되고 있습니다. 이는 CSR의 몇 가지 단점 때문입니다:

- **SEO(검색 엔진 최적화)** 문제: CSR은 자바스크립트가 완료되어야 페이지가 렌더링되기 때문에 검색 엔진 크롤러가 콘텐츠를 제대로 인식하지 못할 수 있습니다.
- **첫 페이지 로딩 시간**: CSR에서 필요한 모든 자바스크립트를 다운로드하고 실행하는 과정이 오히려 초기 로딩 속도를 늦추는 문제를 발생시킵니다.
- **대규모 애플리케이션 성능**: CSR 방식에서는 클라이언트 측에서 모든 UI를 렌더링해야 하므로, 자바스크립트가 복잡해지면서 성능 저하가 일어날 수 있습니다.

이러한 이유로 **Next.js** 같은 프레임워크는 서버 컴포넌트와 클라이언트 컴포넌트를 혼합해서 사용하는 하이브리드 방식(SSR과 CSR 결합)을 도입했습니다. 서버에서 필요한 데이터를 미리 렌더링하여 클라이언트로 전달하고, 클라이언트 측에서 필요한 부분만 CSR 방식으로 동작하게 하는 방식입니다. 이러한 접근 방식은 **SEO 최적화**, **빠른 첫 페이지 로딩**, **최적화된 성능**을 제공할 수 있습니다.

### useEffect를 사용할때는 내부를 간결하게 유지해야 한다. 그 이유는?

- useEffect는 거대하게 쓰면 유지보수성면에서 좋지않다고 생각합니다.

- useEffect는 컴포넌트가 렌더링 될 때마다 Side Effect로직을 다루는 hook입니다.
  만약 컴포넌트의 렌더링과 무관한 연산들이 useEffect내에서 존재한다면 side effect가 됩니다.

무관한 연산을 컴포넌트 내에서 직접 수행하는 것은
개발자가 컴포넌트의 렌더링을 통제할 수 없기 때문에 좋지 않은 개발방식이다.
https://seokzin.tistory.com/entry/React-useEffect의-철학과-Lifecycle

### Revert와 Reset

2년 개발 인생동안 revert를 하는 경우가 없었ek. 약속한 git flow대로 작업하다보니 크개 작업내용을 되돌려야할 일이 없었다. 이번에 작업중인 커밋을 dev브랜치에 올려버리는 실수를 하면서 revert를 해야하는 상황이 발생하였다.
이전 커밋으로 어찌어찌 revert는 하였으나, revert했던 커밋을 다시 원복시키는 경우에 문제가 발생하였다. 현재 dev branch는 a 커밋 이전 코드지만 a커밋 pr을 날리면 변경사항이 없는것으로 인지하는것이다. 그래서 revert에 대해 자세히 찾아보게 되었다.
https://www.yagom-academy.kr/fac3e1ea-b792-420a-a1e3-d95afca093c1

https://okky.kr/questions/1080287

- 정리 : revert는 단순히 commit을 되돌리는것이 아니라, 이전커밋으로 시간여행을 하는것이다. 돌리기 전의 커밋은 브랜치에 살아있다.
  만약 커밋을 완전히 없애고 싶다면 reset을 사용해야 한다.
- 내가 하고자 했던 revert commit을 다시 dev 브랜치에 되돌리고 싶다면? revert한 커밋을 다시 revert하면 된다.

### 핫픽스로 성장하는 주니어

오늘의 버그 : URLSearchParams 이슈
URLSearchParams

- URLSearchParams 객체 인스턴스 반환
- URLSearchParams.append : 주어진 키/값 쌍을 검색 매개변수로 추가
- URLSearchParams.entries : 객체의 모든 키/값 쌍을 쿼리 문자열과 같은 순서로 순회할 수 있는 이터레이터 리턴
- URLSearchParams.forEach : 객체의 모든 값을 순회하면서 지정한 콜백을 호출
- URLSearchParams.keys : 객체에 포함된 키/값 쌍의 모든 키를 반복 하는 이터레이터 반환

```jsx
//이터레이터를 반환하기 때문에 array가 아님.length를 확인할 수 없음.
// Create a test URLSearchParams object
const searchParams = new URLSearchParams("key1=value1&key2=value2");

// Display the keys
for (const key of searchParams.keys()) {
	console.log(key);
}
```

- URLSearchParams.toString() : URL에 사용하기 적합한 쿼리문자열을 반환
- URLSearchParams.values : 객체에 포함된 키/값 쌍의 모든 값을 반복할 수 있는 이터레이터 반환
- URLSearchParams.size :

```jsx
const searchParams = new URLSearchParams("c=4&a=2&b=3&a=1");
searchParams.size; // 4
```

이터레이터와 array from 공부하기

- 이터러블 \_ 자바스크립트 딥다이브
  - ES6에 도입
  - 이터레이션 프로토콜 : 순회가능한 데이터 컬렉션을 만들기 위해 미리 약속한 규칙. for in, forEach 메서드 등 다양한 방법으로 순회가능.
    - 이터러블 프로토콜 : Symbol.iterator를 프로퍼티 키로 사용한 메서드를 직접 구현하거나 프로토타입 체인을 통해 상속 받은 Symbol.iterator 메서드를 호출하면 이터레이터 프로토콜을 준수한 이터레이터를 반환. **이터러블 프로토콜을 준수한 객체를 이터러블.** 이터러블을 for of문으로 순회가능. 스프레드 문법과 배열 디스트럭처링 할당가능.
    - 이터레이터 프로토콜 : 이터러블의 Symbol.iterator 메서드 호출시 이터레이터 반환. **next메서드를 소유**. next 호출시 이터러블을 순회하며 value와 done 프로퍼티를 갖는 이터레이터 리절트 객체 반환. **이터레이터 프로토콜을 준수한 객체를 이터레이터**. `이터레이터는 이터러블의 요소를 탐색하기 위한 포인터 역할.`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/de9c75f0-f0fa-49a9-ad54-da4bbf4f479f/image.png)

```jsx
const isIterable = (v) =>
	v !== null && typeof v[Symbol.iterator] === "function";

//배열, 문자열, Map, Set은 이터러블
isIterable([]); //true
isIterable(""); //true
isIterable(new Map()); //true
isIterable(new Set()); // true
isIterable({}); //false

const [a, ...rest] = array;
console.log(a, rest); // 1, [2, 3]
```

- 일반객체 : Symbol.iterator 메서드를 직접 구현하지 않거나 상속받지 않은 일반객체는 이터러블 프로토콜을 준수한 이터러블이 아님.
- 이터레이터의 next 메서드 : 이터러블의 각 요소를 순회하기 위한 포인터 역할. next메서드를 호출하면 이터러블을 순차적으로 한 단계씩 순회하며 순회결과를 나타내는 이터레이터 리절트 객체를 반환한다.
  ```jsx
  const array = [1, 2, 3];
  //Symbol.iterator 메서드는 이터레이터를 반환. 이터레이터는 next 메서드를 반환
  const iterator = array[Symbol.iterator]();
  //next 메서드를 호출하면 이터러블을 순회하며 순회결과를 나타내는 이터레이터 리절트 객체를 반환
  //이터레이터 리절트 객체는 value와 done 프로퍼티를 갖는 객체
  console.log(interator.next()); //{value: 1, done: false}
  console.log(interator.next()); //{value: 2, done: false}
  console.log(interator.next()); //{value: 3, done: false}
  console.log(interator.next()); //{value: undefined, done: true} //true면 순회를 중단
  ```
- 빌트인 이터러블 : 자바스크립트는 이터레이션 프로토콜을 준수한 빌트인 이터러블을 제공한다. 다음의 표준 빌트인 객체들은 빌트인 이터러블이다.

```jsx
Array.prototype[Symbol.iterator]
String.prototype[Symbol.iterator]
Map.prototype[Symbol.iterator]
Set.prototype[Symbol.iterator]
TypedArray[Symbol.iterator]
arguments[Symbol.iterator]
...
```

- for…of : 이터러블을 순회하면서 이터러블의 요소를 변수에 할당. for…of 문의 문법은 다음과 같다.

```jsx
for (변수선언문 of 이터러블) { ... }
for (변수선언문 in 객체) { ... } //유사

//직접 구현시
const iterable = [1,2,3]
const iterator = iterable[Symbol.iterator]()
for(;;) {
const res = iterator.next()
if(res.done) break
const item = res.value
console.log(item)

}
```

- 이터러블과 유사배열 객체
  - 유사배열객체 : 배열처럼 인덱스로 프로퍼티 값에 접근가능. length 프로퍼티를 갖는 객체. 유사배열 객체는 length 프로퍼티를 갖기 때문에 for문으로 순회할 수 있고, 인덱스를 나타내는 숫자 형식의 문자열을 프로퍼티 키로 가지므로 마치 배열처럼 인덱스로 프로퍼티 값에 접근할 수 있다.
  - 유사배열 객체는 이터러블이 아닌 일반객체다. 따라서 유사배열 객체는 Symbol.iterator 메서드가 없기 때문에 for..of문으로 순회 불가능.
  - arguments, nodelsit, htmlcollection은 유사배열 객체 이면서 이터러블이다. 이터러블이 된 이후에도 프로퍼티를 가지며 인덱스로 접근할 수 있는 것에는 변함이 없으므로 유사배열 객체이면서 이터러블인 것이다.
  - 배열도 이터러블이 도입되면서 이터러블이 됨.
  - **모든 유사배열 객체가 이터러블인 것은 아님. 객체는 유사배열객체지만 이터러블이 아님. 다만, Array.from 메서드를 사용하여 배열로 간단히 변환 할 수 있다. Array.from 메서드는 유사배열 객체 또는 이터러블을 인수로 전달받아 배열로 변환하여 반환한다.**
    - 유사배열객체와 일반객체
    - Array.from이란?
      es6에 도입. 유사배열 객체 또는 이터러블 객체를 인수로 전달받아 변환하여 반환한다.
      Array.from을 사용하면 두번째 인수로 전달한 콜백함수를 통해 값을 만들면서 요소를 채울 수 있음.
      ```jsx
      Array.from({ length: 2, 0: "a", 1: "b" }); //['a', 'b']
      Array.from("Hello"); //-> ['H', 'e','l','l','o']
      ```
  ```jsx
  //유사 배열 객체
  const arrayLike = {
  	0: 1,
  	1: 2,
  	2: 3,
  	length: 3,
  };
  //Array.from은 유사 배열 객체 또는 이터러블을 배열로 반환
  const arr = Array.from(arrayLike);
  console.log(arr); // [1,2,3]
  ```
- 이터레이션 프로토콜의 필요성 : es6이전의 순회 가능한 데이터 컬렉션 등은 통일된 규약 없이 각자 나름의 구조를 가지고 for문, for…in문, forEach 메서드 등 다양한 방법으로 순회할 수 있었다. **es6에서는 순회 가능한 데이터 컬렉션을 이터레이션 프로토콜을 준수하는 이터러블로 통일하여 for..of문, 스프레드 문법, 배열 디스트럭쳐링 할당의 대상으로 사용할 수 있도록 일원화 했다**. 이터러블은 데이터 소비자 (for of문, 스프레드문법, 배열 디스트럭처링 할당)에 의해 사용되므로 데이터 공급자의 역할을 한다. 데이터 소비자와 데이터 공급자를 연결하는 인터페이스 역할을 한다.

### 반성

좋은 이슈해결방식은 어떤걸까 하고 고민하였다.
지금까지 나는 고장난 부분을 찾고 -> 고장난 부분을 작동하는 관점에서 이슈를 해결하였다. 최대한 빠르게 해결을 해야한다고 생각했기 때문이다. 이 방법에는 오류가 있었다. 내가 할 수 있는 최선의 방법이 아닐 수 있다. 약간의 테이프로 붙이는 방식인 것이다.
지속가능한 제품으로 만들기 위해서는
원인을 찾고, 원인을 제거하는 관점에서 이슈를 해결해야 한다는걸 많이 느끼고 있다.
원인파악을 확실히 해야 최선에 결과에 도달할 수 있기 때문이다. 관점을 바꾸고 최선의 해결책에 도달하자.
