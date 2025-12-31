---
title: "주간회고- 11월 첫째주 Batching, immutable, userAgent"
description: "리액트 독스를 다시 읽으면서 Queueing React, state as Object에 대해 공부하였습니다. 업무 중 userAgent에 대해 자세히 알게 되었습니다. "
pubDate: "11 02 2024"
tags: ["주간회고"]
---

### state as a sanpshot 

- 리액트 state는 snapshot 처럼 동작합니다.
    - 이미 가지고 있는 변수를 교체하지는 않지만 리렌더링을 유발합니다.

```jsx
console.log(count);  // 0
setCount(count + 1); // Request a re-render with 1
console.log(count);  // Still 0!
```

- Setting state triggers renders : setState를 실행할 경우 렌더링이 트리거됩니다.
- Rendering takes a snapshow in time : 렌더링은 시간에 맞춰 스냅샷을 찍습니다.
    - Rendering : 리액트가 function 컴포넌트를 호출하는걸 의미합니다. 그때, function으로 부터 리턴된 JSX는 UI의 스냅샷을 찍습니다. props, event handlers, local variables는 모두 그때 계산된것들이 사용됩니다.
    - 리렌더링 과정
        - 리액트는 함수를 호출
        - 새로운 JSX스냅샷을 리턴
        - 리액트는 화면을 업데이트해줌. 스냅샷과 연결된
    - 예시
        
        ```jsx
          <button onClick={() => {
                setNumber(number + 1); //number는 0이라서 리액트는 다음 렌더에 number를 1로 변경할 준비를 합니다.
                setNumber(number + 1);//number는 0이라서 리액트는 다음 렌더에 number를 1로 변경할 준비를 합니다.
                setNumber(number + 1);//number는 0이라서 리액트는 다음 렌더에 number를 1로 변경할 준비를 합니다.
              }}>+3</button>
             
        ```
        
        setState는 다음 렌더링에 대해서만 변경됩니다.
        
         setNumber는 3회 실행되었지만 event handler에서 number는 항상 0이었습니다. 그래서 1로 세번 세팅되는것입니다. 그ㄹㅐ서 이벤트 핸들러가 종료되면, 리액트는 1로 리렌더링됩니다. 
        
- State over time : 시간에 따른 state
    
    ```jsx
      <button onClick={() => {
            setNumber(number + 5);
            alert(number); 
          }}>+5</button>
    ```
    
    - number는 0으로 보입니다.

```jsx
<button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
```

- settimeout을 사용하면 어떻게 될까요?
- **state 변수는 하나의 렌더안에서 절대 변하지 않습니다.** 이벤트 핸들러가 비동기로 작동한다 할지라도. *해당 렌더링의* `onClick` 내부에서 값은 호출된 후에도 `number`계속 유지됩니다 . React가 구성 요소를 호출하여 UI의 "스냅샷"을 찍었을 때 값이 "고정"되었습니다.`0setNumber(number + 5)`
    - —> 코드가 실행되는 동안 상태가 변경되었는지 걱정할 필요가 없다.
    - 그렇다면 리렌더링 전에 최신 상태를 읽고 싶다면 어떻게 해야할까요? 바로 State updater function을 사용하면 된다. (prev → prev+1 요거 )

Queueing a series of state updates 

- 리액트는 상태 업데이트를 처리하기 전에 이벤트 핸들러의 모든 코드가 실행될 대까지 기다립니다. → 모든 호출 후에만 재렌더링이 발생하는 이유입니다.
- 예시 ) 웨이터가 주문을 받을때 주방으로 달려가지 않고, 주문을 끝내고 변경하고, 다른 사람의 주문을 받고 주방으로 달려간다.
- —> 장점 : 너무 많은 재렌더링을 트리거 하지 않고도 여러 상태변수를 업데이트 할 수 있다. 이벤트 핸들러와 그 안의 모든 코드가 완료될 때까지 UI가 업데이트 되지 않음을 의미.
- batching : 리액트 앱을 훨씬 더 빠르게 실행하며, 반쯤 완료된렌더링을 처리하지 않아도됨.

State updater function 

- 다음 렌더링 이전에 동일한 상태 변수를 여러번 업데이트 하려는 경우, 큐에 있는 이전 상태를 기반으로 다음 상태를 계산하는 함수를 전달 할 수 있습니다.  업데이터 함수 `n => n + 1`라고 합니다 **.**
    - 상태를 세터에 전달 하면
        1. 리액트는 이벤트 핸들러의 다른 모든 코드가 실행된 후에 이 함수를 처리하도록 대기열에 넣습니다 .
        2. 다음 렌더링 에서는 리액트는 대기열을 살펴보고 최종 업데이트된 상태를 제공합니다. 
        3. 
```jsx
export function getFinalState(baseState, queue) {
  let finalState = baseState;
  for(let i = 0 ; i < queue.length; i ++){
    //queue[i]가 number인지 확인 
    if(typeof(queue[i]) === 'number'){
      finalState = queue[i]
    }else {
      const test = (n)=>{
         finalstate = queue[i]
      }
      finalstate = test(queue[i](finalState))
    }
  }

  // TODO: do something with the queue...

  return finalState;
}
```

내 답은 틀렸다. 

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/7d675c4d-8125-46a3-85b3-0945ac2b85ef/image.png)

정답 너무 허무하지만 function으로 내려오기 때문에 추가적인 알고리즘이 필요하지 않았암. 

```jsx
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```
---

# 리액트의 객체 업데이트

리액트는 스냅샷을 찍듯이 값들을 스냅샷을 찍은뒤 이전값과 비교하게된다 

근데 어떤 타이밍에 스냅샷을 찍지?  함수가 호출되면 

언제 함수가 호출되지? 

이 생각을 하게된 계기는 

React는 기본적으로 부모로부터 내려받는 `Props`나 내부 상태인 `State`가 변경되었을 때 컴포넌트를 다시 렌더링 하는 리렌더링 과정이 일어난다. React는 이 `Props`와 `State`의 변경을 불변성을 이용해서 감지한다. **객체의 참조를 복사한다는 점을 이용해 단순히 참조만 비교하는 얕은 비교를 이용해서 변경이 일어났는지 확인한다.**

자바스크립트에서 참조 타입의 데이터인 객체의 경우 메모리 힙 영역에 저장이 되어 내부 프로퍼티를 변경해도 같은 참조를 갖고 있다. 따라서 객체의 특정 프로퍼티만 변경하는 작업을 수행하면 React에서는 변경이 일어나지 않았다고 인식하여 리렌더링이 일어나지 않는다. 따라서 리렌더링을 일으키려면 React에 이전의 참조와 다른 참조로 변경되었음을 알려야 한다.

참조를 바꾸는 방법1 : Object.assign()

```jsx
//첫 번째 객체 인자 이후의 모든 객체 인자를 합쳐주는 메서드. 
//빈객체와 + 사용할 객체를 담아 새로운 객체를 반환 
const obj = { a: 1, b: 2 };
const obj2 = Object.assign({}, obj);

console.log(obj === obj2); // false
```

참조를 바꾸는 방법2 : 스프레드 연산자. 

```jsx
//새로운 객체안에 프로퍼티를 담음. 
const obj = { a: 1, b: 2 };
const obj2 = { ...obj };

console.log(obj === obj2); // false
```

하지만 이 두 방식에는 한계가 있습니다. 모두 얕은 복사를 사용하기 때문. 

이를 해결하기 위해서는 

```jsx
const obj2 = { ...obj, b: { ...obj.b } };

console.log(obj.b === obj2.b); // false
```

스프레드를 두번 진행하여 해결할 수 있습니다. 

하지만 더 깊은 객체가 있다면 매번 코드를 변경해야 하고 깊이가 깊어질수록 헷갈리기도 쉽습니다. 

# 그래서 리액트에서는 객체를 업데이트 할 때 immer의 사용을 권장합니다.

immutable object : `불변객체. 생성 후에 상태를 바꿀 수 없는 객체. 불변 객체의 장점은 상태를 바꿀 수 없기 때문에 동시에 여러곳에서 사용하더라도 해당 객체를 사용하는 쪽에서는 안전하게 사용가능. 불변 객체에 대해 작업하는 코드는 불변객체를 사용하는 곳에 영향을 고려하지 않아도 되고, 불변객체를 복사할 때 객체 전체가 아닌 참조만 복사해 메모리도 아끼도 성능도 향상시킬 수 있다.` 

참조만 복사 하는 방법 : 

```jsx
const original = { name: "John", age: 30 };
const copy = original;

// copy는 original의 참조를 공유합니다.
console.log(copy.name); // "John" 출력

// original을 변경하면 copy도 영향을 받습니다.
original.name = "David";
console.log(copy.name); // "David" 출력
```

immer란? mutable한 객체를 immutable하게 불변성의 유지를 도와준다.

immer는 어떤 방식으로 불변성을 해결해줄까요?

immer의 핵심원리는 Proxy와 Copy-on-write입니다. 

- Proxy
    
    `Proxy는 ES6에서 도입된 기능으로, 객체, 함수 등의 작업을 인터셉트 하여 사용자 정의 동작을 추가할 수 있게 해줍니다. 객체, 함수 등의 작업을 인터셉트 하여 사용자 정의 동작을 추가할 수 있게 해줍니다. Immer는 이 Proxy를 활용하여 작업 중인 객체에 대한 모든 연산을 가로챕니다. 이렇게 해서 원본 객체는 변경되지 않고, 모든 변경 사항은 Proxy를 통해 중간 처리되어 '임시 draft 상태'로 관리됩니다. 이렇게 Proxy를 사용함으로써 사용자는 마치 원본 데이터를 직접 수정하는 것처럼 코드를 작성할 수 있으나, 실제 원본 데이터는 변경되지 않습니다.`
    
    설명만 보아서는 감이 잘 안옵니다. ..
    
- Copy-on-write
    
    `Copy-on-write는 데이터 구조의 변경이 필요할 때만 데이터의 복사본을 만드는 기술입니다. Immer는 내부적으로 이 원칙을 사용하여 실제로 변경이 이루어지는 부분에 대해서만 복사본을 생성합니다. 사용자가 Proxy를 통해 draft 객체를 수정하면, Immer는 변경된 부분의 복사본을 만들고, 이 변경된 복사본에 새로운 값이 적용되도록 합니다. 이 방법은 전체 데이터 구조를 매번 복사하지 않아도 되므로, 메모리 사용과 성능을 크게 개선할 수 있습니다.`
    

이 두가지를 사용하여 동작하는 과정은 아래와 같습니다. 

1. **Draft Stage**: 애플리케이션의 상태를 나타내는 원본 객체를 기반으로, Immer는 Proxy를 사용해서 draft 객체를 생성합니다.
2. **Modifications**: 개발자는 draft 객체를 직접 변경할 수 있습니다. 이때 모든 변경 사항은 Proxy를 통해 잡히고, 실제 데이터에는 영향을 미치지 않습니다.
3. **Produce**: 모든 변경 작업이 끝나면, Immer는 변경된 draft 부분만을 실제 데이터의 복사본에 적용합니다. 이때만 데이터의 복사가 이루어지므로, Copy-on-write 기술이 활용됩니다.
4. **New Immutable State**: 최종적으로, 변경 사항이 적용된 새로운 불변 상태 객체가 생성됩니다. 이 객체는 다음 상태 업데이트 주기까지 불변으로 유지됩니다.

참고문서 
https://ui.toast.com/posts/ko_20220217

번외로 깊은 복사를 하기 위해서 structuredClone이 존재하는것으로 안다. 
structuredClone은 JavaScript에서 제공하는 함수로, 객체를 깊은 복사(deep copy) 하는데 사용됩니다. 이 함수는 원본 객체를 기반으로 완전히 새로운 객체를 생성하며, 원본 객체의 중첩된 구조까지 완전히 복제합니다. structuredClone은 다양한 내장 객체 유형과 데이터를 지원하며, 원본과 동일한 구조의 데이터를 만들지만 독립적인 복사본을 생성합니다.

특징
원본 객체와 구조적으로 동일한 완전한 복사본을 생성합니다.
복사 과정에서 원본 객체에는 영향을 주지 않습니다.
Map, Set, Date, RegExp 등 다양한 내장 자료형을 지원합니다.
순환 참조가 있는 객체도 복사할 수 있습니다.

그럼 structuredClone을 사용하면 되는거 아닌가? 라는 생각을 했는데ㅋㅋ 사용목적 자체가 다르다. <br/>
`structuredClone은 데이터의 깊은 복사를 목적으로 하며, immer의 produce는 상태 변경과 불변성 유지에 초점을 맞춥니다.
작동 방식: structuredClone은 원본 객체를 전혀 수정하지 않는 독립적 복사를 생성하는 반면, produce는 수정 사항을 적용한 새로운 객체를 생성하기 위해 원본 객체의 일부만을 복사합니다.
사용 사례: structuredClone은 데이터를 안전하게 복사할 필요가 있을 때 유용하며, produce는 상태 관리를 하는 애플리케이션에서 특히 유용합니다.`

---
# user Agent와 Header

이번 스프린트에 useragent에 대해 새롭게 알게되었다. 그리고 header에 useragent가 함께 내려온다눈 것도. 

socket의 대체재. sse에 대해서도 새롭게 알게되었다

더불어 이번 스프린트 때에는 useMediaQuery의 ssr 오류도 있었는데, 이럴경우 서버로 userAgent를 보내, mediaQuery 이슈를 해결할 수 있는것도 알 수 있었다. 

# Header에 전송되는 것들

https://scoring.tistory.com/entry/%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-HTTP-%ED%97%A4%EB%8D%941-%ED%97%A4%EB%8D%94%EC%99%80-%ED%97%A4%EB%8D%94%EC%9D%98-%EC%A2%85%EB%A5%98-%EC%A0%84%EC%86%A1%EB%B0%A9%EC%8B%9D-%EC%BF%A0%ED%82%A4#User-Agent-1


그외..
* tolocalestring : date의 현지화, 그리고 1000단위 콤마 
