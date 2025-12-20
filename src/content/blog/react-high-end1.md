---
title: "React톺아보기 1 : useState 동작원리와 클로저"
description: "리액트의 가장 대표적인 훅인 useState의 동작원리를 직접 useState 구현을 통해 알아보고 이해하는 과정입니다."
pubDate: "08 24 2024"
heroImage: "/heroImgs/thumb_react.png"
tags: ["FE"]
---

# 리액트 Hooks와 Closure

useState hook은 어떤 원리로 상태관리를 할까요?

제목에서 알수 있듯이 클로저의 원리로 상태관리를 합니다.

### 함수형 컴포넌트의 상태관리

클래스형 컴포넌트가 render()메서드를 통해 상태변경을 감지하는 것과 달리

함수형 컴포넌트는 렌더링이 발생하면 함수자체를 호출합니다.

따라서 상태관리를 위해서는 함수가 다시 호출되었을때 이전 상태를 기억하고 있어야 합니다.

이전상태를 기억하려면 어떻게 해야할까요?

바로 이부분에서 **클로저**를 통해 이전상태를 기억합니다.

- 클로저는 내부함수에서 상위 함수 스코프의 변수에 접근할 수 있는 개념입니다.

우선 실제 코드를 보기전에 직접 코드로 접근해보겠습니다.

### 제가 생각하는 useState는 이렇게 구현되어 있을것 같습니다.

```jsx
const useState = (initialValue) => {
	let state = initialValue;
	const setState = (newValue) => {
		state = newValue;
	};

	return [state, setState];
};

const [counter, setCounter] = useState(0);

console.log(counter()); // 0
setCounter(1);
```

이 코드의 문제점은 , `state`는 함수 스코프 내의 지역 변수라는 것입니다.

따라서 `setState` 함수가 `state` 값을 변경하더라도, 이 변경된 값은 함수 밖에서 확인할 수 없습니다. 즉, `setState`가 `state`를 업데이트하지만, 원래의 `state` 변수는 변경된 값을 반영하지 않게 됩니다.

정리하자면, 클로저함수가 구현되지 않았기 때문입니다.

state는 변수이기 때문에 useState로 리턴된 순간 더이상 변경할 수 없는 상태가 됩니다.

### 조금 더 개선해보기 :

```jsx
const useState = (initialValue) => {
	let state = initialValue;
	const setState = (newValue) => {
		state = newValue;
		return state;
	};

	state = setState(2);
	return [state, setState];
};
const [state, setState] = useState(0);

console.log(setState()); // 0
setState(1); //1
```

이제 기존의 문제였던 setState 값을 변경해줄 수 있게 되었습니다.

하지만 여기서도 다양한 문제가 발생하게 됩니다.

### 1. **상태의 불변성 문제:**

- React의 `useState`는 상태가 변경되더라도 초기 상태 값(`initialValue`)은 변하지 않고, 상태가 변경될 때마다 새로운 상태 값이 반환됩니다.
- 하지만, 이 코드에서는 상태를 설정할 때마다 `state`를 직접 변경하고 있습니다. 이는 상태의 불변성을 위반하는 것이며, 이로 인해 예기치 않은 동작이 발생할 수 있습니다.

### 2. **`setState`의 반환값 문제:**

- React에서 `setState`는 상태를 설정하고 리렌더링을 트리거하지만, 아무런 값을 반환하지 않습니다.
- 이 코드에서는 `setState`가 새로운 상태 값을 반환합니다. 이는 React의 `setState`와 다릅니다. `setState`가 반환하는 값이 무엇이든 상관없이 호출 후 기존의 상태는 그대로 유지됩니다.

### 3. **즉시 호출되는 `setState`:**

- `useState` 함수 내에서 `state = setState(2);` 부분은 `useState`를 호출하는 즉시 `setState`가 호출되어 상태가 `2`로 변경됩니다. 이로 인해 초기 상태 값 `0`이 의미가 없어지고, `useState(0)` 호출 시 초기 상태가 무조건 `2`가 됩니다.
- React의 `useState`는 초기 상태를 설정한 후, `setState`가 호출되기 전까지 상태를 변경하지 않습니다.

### 4. **`setState`의 무조건적인 상태 변경:**

- 현재 코드에서는 `setState`가 호출되면 상태가 바로 변경됩니다. React에서는 `setState`가 호출될 때 리렌더링을 트리거하여 컴포넌트를 다시 렌더링하고, 이 과정에서 새로운 상태가 적용됩니다. 그러나 이 코드에서는 리렌더링 로직이 없으므로 상태가 변경되더라도 그 변경이 즉시 반영되지 않습니다.

### 조금 더더 개선해보기

클로저를 다른 클로저 내부로 옮겨보자

```jsx
const MyReact = (function () {
	let value;
	return {
		render(Component) {
			const Comp = Component();
			Comp.render();
			return Comp;
		},
		useState(initialValue) {
			value = value || initialValue;
			function setState(newVal) {
				value = newVal;
			}
			return [value, setState];
		},
	};
})();

function Counter() {
	const [count, setCount] = MyReact.useState(0);
	return {
		click: () => setCount(count + 1),
		render: () => console.log("render:", { count }),
	};
}
let App;
App = MyReact.render(Counter); // render: { count: 0 }
App.click();
App = MyReact.render(Counter); // render: { count: 1 }
```

모듈 패턴을 사용하여 작은 react 복제본을 만들었다.

react와 마찬가지로 컴포넌트 상태를 추적한다.

### useEffect 만들어보기

useEffect는 setState와 달리 비동기로 작동하기 때문에 클로저 문제가 발생할 가능성이 크다.

```jsx
function Counter() {
	const [count, setCount] = MyReact.useState(0);
	return {
		click: () => setCount(count + 1),
		render: () => console.log("render:", { count }),
	};
}
let App;
App = MyReact.render(Counter); // render: { count: 0 }
App.click();
App = MyReact.render(Counter); // render: { count: 1 }
```

useEffect와 useState는 둘다 싱글톤이다.각각 하나만 존재할 수 있고, 그렇지 않으면 버그가 발생한다.

마법이 아니라 배열일뿐. 클로저를 가능하게 하려면 임의의 수의 상태와 효과를 받도록 일반화 해야한다.

```
const MyReact = (function() {
  let hooks = [],
    currentHook = 0 // array of hooks, and an iterator!
  return {
    render(Component) {
      const Comp = Component() // run effects
      Comp.render()
      currentHook = 0 // reset for next render
      return Comp
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const deps = hooks[currentHook] // type: array | undefined
      const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true
      if (hasNoDeps || hasChangedDeps) {
        callback()
        hooks[currentHook] = depArray
      }
      currentHook++ // done with this hook
    },
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue // type: any
      const setStateHookIndex = currentHook // for setState's closure!
      const setState = newState => (hooks[setStateHookIndex] = newState)
      return [hooks[currentHook++], setState]
    }
  }
})()
```

setStateHookIndex는 아무것도 하지 않는듯 하지만 변수를 닫는것을 방지하는데 사용된다.

```jsx
// Example 4 continued - in usage
function Counter() {
	const [count, setCount] = MyReact.useState(0);
	const [text, setText] = MyReact.useState("foo"); // 2nd state hook!
	MyReact.useEffect(() => {
		console.log("effect", count, text);
	}, [count, text]);
	return {
		click: () => setCount(count + 1),
		type: (txt) => setText(txt),
		noop: () => setCount(count),
		render: () => console.log("render", { count, text }),
	};
}
let App;
App = MyReact.render(Counter);
// effect 0 foo
// render {count: 0, text: 'foo'}
App.click();
App = MyReact.render(Counter);
// effect 1 foo
// render {count: 1, text: 'foo'}
App.type("bar");
App = MyReact.render(Counter);
// effect 1 bar
// render {count: 1, text: 'bar'}
App.noop();
App = MyReact.render(Counter);
// // no effect run
// render {count: 1, text: 'bar'}
App.click();
App = MyReact.render(Counter);
// effect 2 bar
// render {count: 2, text: 'bar'}
```

각 hook이 호출될 때마다 증하가하고, 구성요소가 렌더링 될때마다 설정되는 배열과 인덱스를 갖게된다.

```jsx
function Component() {
	const [text, setText] = useSplitURL("www.netlify.com");
	return {
		type: (txt) => setText(txt),
		render: () => console.log({ text }),
	};
}
function useSplitURL(str) {
	const [text, setText] = MyReact.useState(str);
	const masked = text.split(".");
	return [masked, setText];
}
let App;
App = MyReact.render(Component);
// { text: [ 'www', 'netlify', 'com' ] }
App.type("www.reactjs.org");
App = MyReact.render(Component);
```

**Only Call Hooks at the Top Level**

반복문 조건문 중첩함수에서 Hook을 호출하면 안된다.

state는 컴포넌트의 실행 순서대로 배열에 저장된다.

### 왜 최상위 레벨에서만 Hooks를 호출해야하는 것일까?

hook 을 일반적인 javascript 함수에서 호출하면 안된다.

함수, 컴포넌트, 커스텀 훅 내에서만 호출 할 수 있다.

### 왜 리액트 함수에서만 Hooks를 호출해야 할까?

—> 이 두 규칙을 따라야만 컴포넌트가 렌더링 될 때마다 동일한 순서로 hook이 호출되는 것을 보장한다.

```jsx
// ReactHooks.js

export function useState<S>(
	initialState: (() => S) | S
): [S, Dispatch<BasicStateAction<S>>] {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
}
```

리액트 모듈에서 찾아본 useState의 초기 상태는 다음과 같다.

resolveDispatcher의 리턴 값을 dispatcher에 할당한다.

이후 dispathcher의 useState 메서드에 initialState 인자로 전달 .

```jsx
function resolveDispatcher() {
	const dispatcher = ReactCurrentDispatcher.current;

	if (__DEV__) {
		if (dispatcher === null) {
			console.error("Some error msg...");
		}
	}

	return ((dispatcher: any): Dispatcher);
}
```

resolveDispathcer 함수는 reactCurrentDispathcher의 current값을 할당받는다.

```jsx
const ReactCurrentDispatcher = {
	/**
	 * @internal
	 * @type {ReactComponent}
	 */
	current: (null: null | Dispatcher),
};
```

reactCurrentDispathcer.current는 전역에서 선언된 객체의 프로퍼티이다.

핵심은 useState의 리턴 값의 출처가 전역에서 온다는 점이다.

리액트가 실제로 클로저를 활용해 함수 외부의 값에 접근하는 사실을 알 수 있다.

### setState(prev → prev+1 ) 로 사용해야 하는 이유

```jsx
const Counter = () => {
	const [count, setCount] = useState(0);

	const increase1 = () => {
		setCount(count + 1);
		setCount(count + 1);
		setCount(count + 1); //1
	};

	const increase2 = () => {
		setCount((count) => count + 1);
		setCount((count) => count + 1);
		setCount((count) => count + 1); //3
	};
};

export default Counter;
```

setState의 인자가 변수인가 함수인가의 차이

If the new state is computed using the previous state, you can pass a function to setState.

새로운 상태가 바로 이전 상태를 통해 계산되어야 하면 함수를 써야 한다.

리액트는 퍼포먼스 향상을 위해 특별한 배치 프로세스를 사용하기 때문입니다.

여러 setState 업데이트를 한번에 묶어서 처리한 후 마지막 값을 통해 state를 결정하는 방식이다.

useState의 내부구조를 보면 왜 함수형 인자가 값을 실시간으로 업데이트 하는지 알수 있습니다.

usestate의 내부구조 : 실제 hook을 변수에 할당하여 출력했을대 나타나는 결과물.

next는 연결리스트의 일종으로, 한 컴포넌트 안에서 여러 번의 실행되는 hook들을 연결해 주는 역할.

```jsx
{
  memoizedState: 0, // first hook
  baseState: 0,
  queue: { /* ... */ },
  baseUpdate: null,
  next: { // second hook
    memoizedState: false,
    baseState: false,
    queue: { /* ... */ },
    baseUpdate: null,
    next: { // third hook
      memoizedState: {
        tag: 192,
        create: () => {},
        destory: undefined,
        deps: [0, false],
        next: { /* ... */ }
      },
      baseState: null,
      queue: null,
      baseUpdate: null,
      next: null
    }
  }
}
```

---

참고자료

[https://seokzin.tistory.com/entry/React-useState의-동작-원리와-클로저](https://seokzin.tistory.com/entry/React-useState%EC%9D%98-%EB%8F%99%EC%9E%91-%EC%9B%90%EB%A6%AC%EC%99%80-%ED%81%B4%EB%A1%9C%EC%A0%80)

https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/

https://seokzin.tistory.com/entry/JavaScript-%EC%8B%A4%ED%96%89-%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8-Execution-Context#%25F-%25-F%25--%25-E%25--%ED%25--%25B-%EB%25A-%25-C%EC%25A-%25--%25---Closure-
