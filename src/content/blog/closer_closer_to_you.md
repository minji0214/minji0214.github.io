---
title: "번역 : I never understood Javascript closures"
description: "클로저는 백팩이다. 이거면 정리끝. 이해완."
pubDate: "08 31 2024"
heroImage: "/minglog.github.io/heroImgs/thumb_javascript.png"
---

https://medium.com/dailyjs/i-never-understood-javascript-closures-
<br/>
I never understood Javascript closures 라는 글을 읽고, 번역 및 정리하였습니다.

---

실행컨텍스트 : 현재 코드가 평가되는 환경/범위. 프로그램을 시작할대 글로벌 실행 컨텍스트에서 시작한다. 일부 변수는 글로벌 실행컨텍스트 내에서 선언. `글로벌 변수` 라고 합니다.

**_프로그램이 함수를 호출하면 무슨일이 일어날까요?_**

1. javascript는 새로운 실행컨텍스트, 즉 로컬 실행 컨텍스트를 생성합니다.
2. 해당 로컬 실행 컨텍스트는 자체 변수 집합을 가지며, 이러한 변수는 해당 실행 컨텍스트에만 국한 됩니다.
3. 새로운 실행 컨텍스트가 실행 스택에 던져집니다. 실행스탭을 프로그램이 실행 중 어디에 있는지 추적하는 메커니즘으로 생각해 보세요.

함수는 언제 끝나나요? return 문장을 만나거나 닫는 괄효를 만날때 입니다. 함수가 끝나면 다음과 같은 일이 발생합니다.

1. 로컬 실행 컨테스트가 실행스택에 팝됩니다.
2. 함수는 반환 값을 호출 컨텍스트로 다시 보냅니다. 호출 컨텍스트는 이 함수를 호출한 실행 컨텍스트이며, 글로벌 실행컨텍스트 또는 다른 로컬 실행컨텍스트일 수 있습니다. 호출 실행 컨텍스트가 그 지점에서 반환값을 처리해야 합니다. 반환값은 객체, 배열, 함수 실제로 무엇이든 될 수 있습니다. 함수에 명령문이 없으면 undefined가 반환됩니다.
3. 로컬 실행 컨텍스트가 파괴되고, 로컬 실행 컨텍스트 내에서 선언된 모든 변수가 지워집니다. 더이상 변수는 사용할 수 없게됩니다. 그래서 로컬변수라고 합니다.

_다시 정리_

함수종료 → 실행컨텍스트 pop → 반환값이 호출컨텍스트로 이동 → 반환값 처리 → 로컬 실행 컨텍스트 파괴 → 변수제거

```jsx
a = 3 // 전역 실행 컨텍스트에 새 변수를 선언. a 숫자 할당
addTwo(x) { //함수 내부 코드는 실행되지 않고 단지 나중에 사용하기 위해 변수에 저장.
ret = x + 2 //새로운 변수는 로컬 실행 컨텍스트에서 선언됩니다. 그리고 값이 인수로 전달되었으므로 변수 x에 숫자가 할당됩니다 . 로컬ret 실행 컨텍스트 에서 새 변수를 선언합니다 . 해당 값은 정의되지 않음으로 설정됩니다.
return ret //변수의 내용을 반환. 로컬 실행 컨텍스트에서 조회. 함수는 숫자를 반환. 함수 종료.
 } //로컬 실행 컨텍스트 파괴. x와 ret은 더이상 존재하지 않음.
b = addTwo(a) //실행컨텍스트 전환. 새로운 로컬 실행 컨텍스트 생성. 호출스택에 푸시.
console.log(b)
```

새로운 예시

```jsx
1: let val1 = 2
2: function multiplyThis(n) {
3:   let ret = n * val1
4:   return ret
5: }
6: let multiplied = multiplyThis(6)
7: console.log('example of scope:', multiplied)
```

다른점은 로컬 실행컨텍스트에 변수가 있고, 글로벌 실행컨텍스트에 변수가 있다는점.

로컬 실행 컨택스트에서 변수를 찾을 수 없으면 호출 컨텍스트에서 찾는다.

그리고 찾지 못하면 호출컨텍스트에서 찾는다. 글로벌 실행컨텍스트에서 찾을 때까지 반복적으로 수행한다.

함수를 반환하는 함수

```jsx
 1: let val = 7 //전역에서 변수선언. 변수에 숫자할당
 2: function createAdder() { //변수선언. 정의 할당. 함수는 저장하기만 함.
 3:   function addNumbers(a, b) {
 4:     let ret = a + b
 5:     return ret
 6:   }
 7:   return addNumbers
 8: }
 9: let adder = createAdder() //글로벌 실행 컨텍스트에서 새변수 선언. 일시적 undefined. 글로벌 실행 컨텍스트의 메모리를 쿼리하고. create adder이름을 가진 변수를 찾음. 호출.
10: let sum = adder(val, 8)
11: console.log('example of function returning a function: ', sum)
```

createAdder 함수 호출시

함수호출로 새로운 로컬 실행 컨텍스트 생성.

새로운 실행 컨텍스트에서 로컬 변수를 생성.

엔진이 새로운 컨테스트를 호출 스택에 추가.

3행 : 로컬 실행컨텍스트에서 변수 생성. 단, addNumber를 로컬 실행 컨텍스트에서만 존재.

로컬 변수에 함수 정의를 저장.

addnumber반환.

로컬 실행 컨텍스트 파괴. addNumbers변수는 더이상 없지만, 함수정의는 여전히 존재. adder변수에 할당.

10행에서 sum 글로벌 실행 컨텍스트에서 새 변수 정의. 임시할당은 undefined.

변수에 정의된 함수 실행. 전역 실행 컨테스트에 adder함수 찾기.

adder 함수실행.

정리

1. 함수 정의는 변수에 저장될 수 있고, 함수정의는 호출될 때까지 프로그램에서 볼 수 없다.
2. 함수가 호출될 때마다 로컬 실행 컨텍스트가 일시적으로 생성. 이 실행컨텍스트는 함수가 완료되면 사라진다. 함수는 return 또는 닫는 괄호를 만날때 완료된다.

마지막 마무리 (이제 알것만 같다…)

```jsx
 1: function createCounter() { //글로벌 실행컨텍스트에서 새 변수를 만들고 createCounter 할당된 함수 정의.
 2:   let counter = 0 // 로컬 실행컨텍스트 내에서 새 변수 선언. counter에 0이 할당.
 3:   const myFunction = function() { // 로컬 실행컨텍스트에서 변수 선언.  클로저 생성. 함수 정의의 일부로 포함.
 4:     counter = counter + 1
 5:     return counter
 6:   }
 7:   return myFunction .// 변수의 내용 반환.
 8: }
 9: const increment = createCounter() //createCounter 함수 호출 및 반환된 값 변수에 할당.
10: const c1 = increment()
11: const c2 = increment()
12: const c3 = increment()
13: console.log('example increment', c1, c2, c3)
```

우리가 지금까지 정리해온것에 기반하면, 4행의 counter는 undefined를 반환해야 한다 그리고

0이되어 c1, c2,c3는 1,1,1 이 된다.

하지만 이는 클로저의 개념을 알기 전이다.

---

9: createCounter 함수호출. 반환된값 increment 변수할당.

2: 로컬 실행 컨텍스트 내에서 counter라는 새변수 선언. 0할당.

3-6 : myfunction이라는 이름의 새 변수가 로컬 실행컨텍스트에서 선언.

7: my function 변수의 내용 반환. 로컬 실행 컨텍스트가 삭제되고, 존재하지 않음. 함수정의 클로저가 있는 백팩counter 반환.

9: 호출컨텍스트 즉 글로벌 실행 컨텍스트에서 increment에 값이 할당. 변수는 이제 함수 정의를 포함.

10: 변수를 찾는다. increment 찾고, 호출. 이전에 반환된 함수 정의 포함. 변수가 있는 백팩 포함.

새로운 실행 컨텍스트 생성. 매개변수 없음. 함수 실행.

4: counter 변수를 찾아야한다. (undefined가 아닌게 핵심) 로컬 도는 글로벌 실행컨텍스트를 살펴보기 전에 백팩을 살펴보자. 클로저를 확인해보자.

그렇게 counter

핵심: 함수가 선언될때 함수 정의와 클로저가 포함된다.

클로저는 함수 생성 시점에 범위내에 있던 모든 변수의 집합이다.

모든 함수에 클로저가 있나요? 예

글로벌 범위에서 생성된 함수는 클로저를 생성합니다. 하지만 이러한 함수는 글로벌 범위에서

가끔 클로저는 우리가 알아차리지 못할때 나타난다. partial application(부분적 적용) 이라고 부른다.

```jsx
let c = 4;
function addX(x) {
	return function (n) {
		return n + x;
	};
}
const addThree = addX(3);
let d = addThree(c);
console.log("example partial application", d);
```

addX 는 하나의 매개변수x를 취하고 다른 함수를 반환하는 일반적인 더하기 함수를 선언합니다.

반환된 함수도 하나의 매개변수를 가져와 변수에 추가합니다.

변수는 클로저의 일부입니다. 변수가 addThree로컬 컨텍스트에서 선언되면 함수정의와 클로저가 할당됩니다. 클로저에는 변수가 포함됩니다.

이제 호출되고 실행하면 클로저에서 addThree변수에 접근하고 인수로 전달된 변수에 접근하여 합계를 반환할 수 있습니다.

콘솔은 7을 인쇄합니다.

---

마무리.

클로저를 기억하는 방식은 백팩 비유를 통해서 입니다. 함수가 생성되어 다른 함수에서 전달되거나 반환될 때 백팩을 가지고 다닙니다. 그리고 백팩에는 함수가 선언될 때 있었던 모든 변수가 있습니다.
![스펀지짤](../../contentsImgs/closure.png)
