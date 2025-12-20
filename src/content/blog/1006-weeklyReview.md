---
title: "주간회고- 10월 첫째주"
description: "리액트에 대해 다시 알아가는 중. "
pubDate: "10 06 2024"
heroImage: "/heroImgs/thumb_weekly.png"
tags: ["주간회고"]
---

요즘 출퇴근 시간을 이용하여 리액트 공식문서를 다시 읽고 있다.
조무래기 시절 구현에 집중하여 리액트를 공부하다 보니, 작동원리나, 리액트에서 추구하는 방향에 대해서는 관심이 없었는데, 구현을 충분히 해본 뒤에 문서를 보니 아 내가 이렇게 몰랐나 싶었던 부분들이 많았다.
리액트에서는 왜 선언형으로 코드를 작성해야 할까부터 시작해서, key를 유용하게 사용하는 방법까지.
덕분에 리액트에 대한 깊이를 한층 더 깊게 가져가고 있다.

### 동시접속 기능

https://velog.io/@siwol406/동시-접속-로그아웃에-관한-고민과-수정
이번 스프린트에서는 기기제한 및 동시접속 기능을 구현해야 했다.
지속적인 fetching을 통해 확인해야 해서 socket을 생각했었다. 혹은 interval로 fetching을 구현하거나.
좀더 찾아보면서 sse같은 다양한 방식들이 있음을 알게되었다.

### 리액트 공식문서 뽀개기

리액트는 ui를 포현하는 프레임워크이다.

- 조건부로 JSX 반환하기
  - 이 코드의 단점 : 중복코드가 발생하여 className을 변경할 경우, 두군데를 수정해야하는 유지보수의 어려움이 생긴다. → DRY하게 바꿔보자 (덜 반복적이게)
  ```jsx
  if (isPacked) {
  	return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
  ```
  - 삼항연사자.
  ```jsx
  return <li className="item">{isPacked ? name + " ✅" : name}</li>;
  ```
- State 관리하기

  - 각 컴포넌트는 독립된 state를 가진다 : 컴포넌트에 state를 줄때 state가 컴포넌트안에 살있는건 아님. state는 React 안에 있다.
  - React는 트리의 동일한 컴포넌트를 동일한 위치에 렌더링 하는 동안 상태를 유지. 컴포넌트를 제거하거나 다른 컴포넌트 렌더링시 React는 그 State를 버린다.
  - 리렌더링 시 state를 유지하고 싶다면 트리구조가 같아야 한다.
  - → 따라서 컴포넌트 함수를 중첩해서 정의하면 안된다.
  - 반대로 같은 위치에서 state를 초기화 하고 싶다면?

    1. 다른 위치에 컴포넌트 렌더링 하기

       ```jsx
       {
       	isPlayerA && <Counter person="Taylor" />;
       }
       {
       	!isPlayerA && <Counter person="Sarah" />;
       }
       ```

    2. key를 이용한 초기화 : Key는 배열만을 위한건 아님. 특히 form에서 용의

       (key가 전역적으로 유일하진 않음. 오직 부모 안에서만 자리명시. )

       - img 태그에서의 사용 : `<img>` 태그에 `key`를 줄 수 있습니다. `key`가 바뀌면 React는 `<img>` DOM 노드를 새로 다시 만듭니다. 이미지를 불러오는 동안 이미지가 잠깐 깜박이는데 앱의 모든 이미지가 이처럼 작동하기를 원하지는 않을 것입니다. 하지만 이미지와 설명이 항상 일치하도록 할 때는 일리가 있습니다.

       ```jsx
          {isPlayerA ? (
               <Counter key="Taylor" person="Taylor" />
             ) : (
               <Counter key="Sarah" person="Sarah" />
             )}

           //form
                 <ContactList
               contacts={contacts}
               selectedContact={to}
               onSelect={contact => setTo(contact)}
             />
             <Chat key={to.id} contact={to} />
       ```

       번외3. 제거된 컴포넌트의 state 보존하기

       내생각 : display none or state를 최상위로

       - css 로 사용 : 간단한 ui에서 용이. 숨겨진 트리가 많을 경우 매우 느려짐.
       - state 최상위 : 부모 컴포넌트에서 state관리. 가장 일반적인 방법
       - 로컬 스토리지에 저장.
       - 문제 : text가 리렌더 되는걸 어떻게 없앨 수 있을까?

       ```jsx
       import { useState } from "react";
       //가장 좋은 방법은 같은 자리에서 렌더시키기
       export default function App() {
       	const [showHint, setShowHint] = useState(false);
       	const [text, setText] = useState(""); //위로 올린다.

       	return (
       		<div>
       			{shoHint && (
       				<p>
       					<i>Hint: Your favorite city?</i>
       				</p>
       			)}
       			<Form />
       			<button
       				onClick={() => {
       					setShowHint(false);
       				}}
       			>
       				Hide hint
       			</button>
       		</div>
       	);
       }

       function Form() {
       	return (
       		<textarea value={text} onChange={(e) => setText(e.target.value)} />
       	);
       }
       ```

---

state와 reducer

- state 업데이트가 여러 이벤트 핸들러로 분산되는 경우. state를 업데이트하는 모든 로직을 reducer를 사용해 컴포넌트 외부로 단일함수로 통합해 관리.
- 컴포넌트 내부의 코드양을 줄일 수 있음.

```jsx
import { useState } from "react";
import AddTask from "./AddTask.js";
import TaskList from "./TaskList.js";

export default function TaskApp() {
	const [tasks, setTasks] = useState(initialTasks);

	function handleAddTask(text) {
		setTasks([
			...tasks,
			{
				id: nextId++,
				text: text,
				done: false,
			},
		]);
	}

	function handleChangeTask(task) {
		setTasks(
			tasks.map((t) => {
				if (t.id === task.id) {
					return task;
				} else {
					return t;
				}
			})
		);
	}

	function handleDeleteTask(taskId) {
		setTasks(tasks.filter((t) => t.id !== taskId));
	}

	return (
		<>
			<h1>Prague itinerary</h1>
			<AddTask onAddTask={handleAddTask} />
			<TaskList
				tasks={tasks}
				onChangeTask={handleChangeTask}
				onDeleteTask={handleDeleteTask}
			/>
		</>
	);
}

let nextId = 3;
const initialTasks = [
	{ id: 0, text: "Visit Kafka Museum", done: true },
	{ id: 1, text: "Watch a puppet show", done: false },
	{ id: 2, text: "Lennon Wall pic", done: false },
];
```

- 이 코드의 단점 : state를 업데이트 하기 위해 setTasks를 호출. 컴포넌트가 커질수록 state를 다루는 로직의 양도 증가. 복잡성을 줄이고, 접근성을 높이기 위해서 컴포넌트 내부에 있는 컴포넌트 외부의 reducer라고 하는 단일함수로 옮기자.

  1. state를 설정하는 것에서 action을 dispatch 함수로 전달하는 것으로 **바꾸기**.

     1. setTasks가 있는 로직을 모두 지워보면 add, change, delete 함수가 남음.
     2. 이벤트 핸들러에서 action을 전달하여 사용자가 한일 을 지정. state 업데이트 로직은 다른곳에 있음. → 이벤트 핸들러를 통해 tasks를 설적하는 것이 아닌 task 추가 변경 삭제 하는 action 전달. (사용자의 의도가 명확하게 전달됨)

     ```jsx
     function handleAddTask(text) {
     	dispatch({
     		//action 객체 : 어떤 상황이 발생하는 지에 대한 최소한의 정보를 담고 있어야함.
     		type: "added", //what happend 중요
     		id: nextId++,
     		text: text,
     	});
     }

     function handleChangeTask(task) {
     	dispatch({
     		type: "changed",
     		task: task,
     	});
     }

     function handleDeleteTask(taskId) {
     	dispatch({
     		type: "deleted",
     		id: taskId,
     	});
     }
     ```

  2. reducer 함수 **작성하기**.

     1. reducer 함수는 state(`tasks`)를 인자로 받고 있기 때문에, 이를 **컴포넌트 외부에서 선언**할 수 있습니다. 이렇게 하면 들여쓰기 수준이 줄어들고 코드를 더 쉽게 읽을 수 있습니다.
     2. switch 을 사용하는것이 규칙. 가독성을 위해

     ```jsx
     function tasksReducer(tasks, action) {
     	switch (action.type) {
     		case "added": {
     			return [
     				...tasks,
     				{
     					//다음 state 반환
     					id: action.id,
     					text: action.text,
     					done: false,
     				},
     			];
     		}
     		case "changed": {
     			return tasks.map((t) => {
     				if (t.id === action.task.id) {
     					return action.task;
     				} else {
     					return t;
     				}
     			});
     		}
     		case "deleted": {
     			return tasks.filter((t) => t.id !== action.id);
     		}
     		default: {
     			throw Error("Unknown action: " + action.type);
     		}
     	}
     }
     ```

  3. 컴포넌트에서 reducer **사용하기**.

     1. useState부분을 useReducer로 바꿔주기

     ```jsx
     const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
     ```

—> 결국에 무슨일이 일어났는지 명시만해주면됨. 그일이 어떻게 발생하는지는 몰라도됨.

---

useState vs useReducer

- 코드크기 : useReducer는 여러 이벤트 핸들러에서 비슷한 방식으로 state를 업데이트 하는 경우 코드양을 줄이는데 도움이 됨.
- 가독성 :
- 디버깅: 콘솔로그를 reducer에 추가하면 업데이트 되는 모든 부분을 확인할 수 있다.
- 테스팅:
- 개인적인 취향

state사용에서 버그가 자주 발생한다면 reducer사용을 권장.

---

useReducer 잘 작성하는법

- reducer는 순수해야합니다.
- immer로 간결하게 작성하기. useImmerReducer로 안전하게 state 변경

---

context를 사용하여 데이터를 깊게 전달하기

- props drilling의 문제점
  - 데이터를 깊이 전달하거나, 많은 컴포넌트에서 같은 prop이 필요한 경우 장황하고 불편할 수 있다.
- context 사용하기

  1. context 생성하기

  ```jsx
  //컴포넌트에서 사용할 수 있도록 export해야함.
  export const LevelContext = createContext(1); //유일한 인자는 기본값
  ```

  1. 데이터가 필요한 컴포넌트에서 context 사용

     ```jsx
     export default function Heading({ children }) {
     	const level = useContext(LevelContext);
     	// ...
     }
     ```

  2. 데이터를 지정하는 컴포넌트에서 context 제공

  ```jsx
  export default function Section({ level, children }) {
  	return (
  		<section className="section">
  			<LevelContext.Provider value={level}>{children}</LevelContext.Provider>
  		</section>
  	);
  }
  ```

최종

```jsx
import Heading from "./Heading.js";
import Section from "./Section.js";

export default function Page() {
	return (
		<Section level={1}>
			<Heading>Title</Heading>
			<Section level={2}>
				<Heading>Heading</Heading>
				<Heading>Heading</Heading>
				<Heading>Heading</Heading>
				<Section level={3}>
					<Heading>Sub-heading</Heading>
					<Heading>Sub-heading</Heading>
					<Heading>Sub-heading</Heading>
					<Section level={4}>
						<Heading>Sub-sub-heading</Heading>
						<Heading>Sub-sub-heading</Heading>
						<Heading>Sub-sub-heading</Heading>
					</Section>
				</Section>
			</Section>
		</Section>
	);
}
```

- context를 사용하기 전에 고려해야 할것
  - props 전달하기
  - children으로 전달하기
- context가 유용한 예시
  - 테마지정. 다크모드
  - 현재 계정.
  - 라우팅
  - 상태관리

---

Reducer와 Context로 앱 확장하기

---

https://velog.io/@superlipbalm/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior

리액트 렌더링 동작에 관한 완벽한 가이드

렌더링 프로세스 개요.

자바스크립트가 컴파일되고, 배포를 위해 준비될때 react.createElement() 호출로 변환.

createElement : 의도된 UI의 구조를 설명하는 일반 자바스크립트 객체인 React요소를 반환.

```jsx
// JSX 구문입니다.
return <MyComponent a={42} b="testing">Text here</MyComponent>

// 아래와 같은 호출로 변환됩니다.
return React.createElement(MyComponent, {a: 42, b: "testing"}, "Text Here")

// 그리고 이것은 다음과 같은 요소 객체가 됩니다.
{type: MyComponent, props: {a: 42, b: "testing"}, children: ["Text Here"]}
```

reconciliation 재조정 : 컴포넌트 트리 전체에서 렌더출력을 수집. 새로운 객체트리(가상돔)과 비교해 변경사항 목록을 수집. 계산된 변경사항을 하나의 동기 시퀸스로 dom에 적용.

렌더 및 커밋 단계

렌더페이즈 : 컴포넌트를 렌더링. 변경사항 계산.

커밋페이지 : 렌더단계에서 계산된 변경 상항을 dom에 적용.

그다음 componentdidmount, componentdidupdate,useLayoutEffect훅을 동기적으로 실행.

제한 시간을 설정하고

시간 반료시 useEffect훅 실행. passive effect

usetransition 동시렌더링 기능 : 브라우저가 이벤트를 처리할 수 있도록 렌더링 단계에서 작업을 일시중지 가능.

렌더링 ≠ dom update : 어떠한 가시적인 변경도 일어나지 않고 컴포넌트가 렌더링 될 수 있다.
