---
title: "주간회고 - 7월 셋째주"
description: "정말 그 해결이 최선이었을까 "
pubDate: "07 14 2024"
heroImage: "/heroImgs/thumb_weekly.png"
tags: ["주간회고"]
---

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/a24cacee-63ec-470f-92b5-07a5ccf9d0ee/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/78b26f55-45d9-46db-955e-1302bdc49510/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/414b91d9-dd68-4982-a4d9-60c8c33ffd3e/Untitled.png)

[https://velog.io/@wooya/indexOf-findIndex-find의-차이](https://velog.io/@wooya/indexOf-findIndex-find%EC%9D%98-%EC%B0%A8%EC%9D%B4)

### 모바일 브라우저 키보드 이슈 관련 리서치

--> 웹 에서 모바일 쪽으로 중요도가 변하면서
https://velog.io/@tmdan1346/모바일-브라우저에서-키보드의-높이-확인하기-detect-virtual-keyboard-open-using-javascript

https://charmming5.tistory.com/195

새로고침시 current step도 저장되어야 할까 ??????

### 새로운 레이아웃 생성기

레이아웃 스타일에 디폴트로 들어가던, gnb와 footer가 이번에 사라지게 되면서, 새로운 레이아웃 컴포넌트를 만들게 되었다.
레이아웃 컴포넌트를 적용후 문제가 발생하였는데,
기존에 적용되어 있던 theme이 적용되지 않는 이슈 발생.
--> 기존 레이아웃에 theme이 포함되어있었음.

- 기존 레이아웃에서 authstore가 initializing 되었을 때만 렌더되는 로직이 추가되어있었음.

-> theme을 레이아웃 바깥으로 꺼내고, layout안에서 authstore initializing을 추가해 주었다.
--> 한가지 아쉬운점, initializing은 공통로직인데, 레이아웃마다 처리를 해주고 있기때문에, authstore내부로 로직을 옮겨, 레이아웃마다 처리를 해줄 필요가 없게 만들어줘야겠다.

어쨌건 저쨌건 이번 달 목표는 정처기!!!!
현재의 중요한 것에 집중하자.
