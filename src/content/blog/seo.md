---
title: "SEO 개선기"
description: "네이버 검색 최상단에 올리기 프로젝트 "
pubDate: "11 10 2023"
heroImage: "/minglog.github.io/heroImgs/polymorphicUi.jpg"
---

- 웹접근성
- 페이지 별로 존재하지 않음. 모든페이지가 쏠북 공통, 상세페이지, 연구소
- 구글은 웹마스터가 존재.
- 할수 있는것: 네이버 블로그연결, 사이트맵 제출 , 사이트 로딩 속도(light house 점수), metatag 추가 , 스키마 마크업 작성 , 백링크 작업
-
- 타깃
  - 구글
  - 네이버
  - 다음
  - 카카오

[](https://validator.w3.org/nu/?doc=https://solvook.com/)

[웹 접근성 진단 도구](https://velog.io/@layssingcar/웹-접근성-진단-도구)

[가비아 라이브러리](https://library.gabia.com/contents/domain/4359/)

[사이트맵 만들기부터 제출하기: 쉬운 단계별 가이드 | TBWA 데이터랩](https://seo.tbwakorea.com/blog/how-to-create-and-submit-a-sitemap/)

seo에 필요한 기반작업은 모두 되어있음.

더 검색어에 잘 걸리기 위한 마케팅 적인 요소가 필요함.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/7a2a8644-c7ce-44f1-ba55-4558c79043fb/Untitled.png)

순위를 높이기 위한 테스크

[](https://pagewriter.kr/content_blog/구글-순위-높은-랭크를-차지하려면-어떻게-해야-할까/)

구글 서치콘솔을 통한 확인 필요

ga를 심어야함.

[](https://search.google.com/search-console/welcome?hl=ko)

a to z

[SEO 개선 초심자 가이드 | 카카오엔터테인먼트 FE 기술블로그](https://fe-developers.kakaoent.com/2022/221208-basic-seo-guide/)

상품상세

- `<meta name="author" content="Dale Seo" />` 추가할 필요 있음

* keywords `<meta name="keywords" content="HTML, CSS, JavaScript" />`추가할 필요 있음

```jsx
 <Head>
				<title key="title">{product?.title} - 쏠북</title>  //타이틀
				<meta name="description" content={product?.description} /> //선생님들이 작성한 description

				<meta key="og:title" property="og:title" content={`${product?.title} - 쏠북`} />
				<meta
					key="og:description"
					property="og:description"
					content={product?.description}
				/>
				<meta key="og:image" property="og:image" content={product?.thumb_img} />
				<meta
					key="og:url"
					property="og:url"
					content={`https://solvook.com/products/${product.id}`}
				/>
			</Head
```

연구소

```jsx
description: "모든 출제유형에 최적화된 서술형 완벽대비 문제 제작";
keyword: "중간고사, 기말고사, 내신, 문제은행, 기출변형, 변형문제, 부교재, 고1영어문제집, 고2영어문제집, 부교재나라, 부스터구문독해, 부스터유형독해, 얇빠 변형문제, 얇빠, 빠바, 빠른독해바른독해, 빠바기초세우기, 빠바독해, 빠바구문독해, 빠바유형독해, 빠른독해바른독해구문독해, 빠른독해바른독해유형독해 , 빠른독해바른독해기초세우기,빠른독해바른독해종합실전편, 빠바종합실전편, 다빈출코드, 리딩잇, 맞수구문독해실전편, 능률기본영어, 더상승, THE상승, 더상승직독직해, 수능만만, 수능만만기본, 수능만만기본문법, 리딩부스터";
title: "부교재나라 내신 전문 연구소, 최다유형 최대문항 최적자료. 저작권 걱정 없는 디지털교재 플랫폼 쏠북\r";
```

—> `최다유형 최대문항 최적자료. 저작권 걱정 없는 디지털교재 플랫폼 쏠북`

마케팅에 도움되는 키워드는 아닌듯함.

- title : 제목 + 키워드
- description : 문장 형식으로 작성하되 주요 키워드를 포함한 형식이 좋습니다.

조직정보 스키마.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/e9ba4072-cac4-4743-a599-c1116a37f5a1/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/1cee04c2-1851-4c95-8d7c-1cb67bfdf2e8/Untitled.png)

결론 : 영양제 먹으면 몸 좋아지는 그런느낌이랄까

[네이버SEO 와 구글SEO의 차이점](https://xodud2972.tistory.com/159)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/bf1ba8e3-9223-47a8-b267-76bb6f95d951/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/79dd28b1-0324-4808-bf99-e7f3f03f82ba/Untitled.png)

[네이버 SEO를 위한 웹마스터도구, 애널리틱스](https://brunch.co.kr/@mobiinside/1664)

프로모션의 클릭율로인해 promotion 링크가 추가된듯함.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/f5492bca-28c9-4d27-94d0-f64e2ad0517a/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/fcb792f3-e6a6-4b7a-aaa6-05e1a94b352d/Untitled.png)

1차이벤트

디폴트

```jsx
title : 쏠북 | 저작권 걱정 없는 디지털 교재 플랫폼
description : 좋은 교재, 더 잘 쓰이게 - 저작권 라이선싱에서 디지털 퍼블리싱까지!
keywords: 라이센스, 저작권, 교재, 이용권, 수업, 콘텐츠
```

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/761018c1-5adf-4597-8a45-55c73660d42d/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/8aea6064-7c80-4be6-a1b3-3d015d62d9a2/Untitled.png)

네이버는 어쩌면 블로그가 더 중요할지도.

다시 돌아와서 핵심

어떻게 하면 우리 교재들이 최상위에 걸리게 할 수 있을까 .

1. 상품상세페이지 성능개선 (국어 개편때 가능 - 라이트 하우스 점수)
2. 키워드 추가 , description과 title 수정
3.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/852f1d16-6362-4f88-aa1b-beff65b1a475/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/1e76f5a1-a53b-4872-a5fd-a3c145989000/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/fe44ebb4-8012-4bd0-b5f6-010e50a4dcf9/Untitled.png)

교재에 특정 키워드들을 decription title, author에 잘 배치해야 할것 같다.

robots.tsx

### 현 상태

- seo에 필요한 작업들은 되어있음.

![네이버 [서치어드바이저-solvook.com](http://서치어드바이저-solvook.com)조회결과](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/7a2a8644-c7ce-44f1-ba55-4558c79043fb/Untitled.png)

네이버 [서치어드바이저-solvook.com](http://서치어드바이저-solvook.com)조회결과

- 해당 계정으로 조회필요
  - 다음 검색등록https://register.search.daum.net/index.daum
  - 구글 서치콘솔 (배포 혹은 ga를 통해 코드를 심고, 트래킹이 가능함. )
  - 네이버 서치어드바이저
- 현재 작업되어 있는 키워드 (실제 검색에 도움되는 키워드 들이 아닌듯함. )
  - 디폴트
    ```jsx
    title : 쏠북 | 저작권 걱정 없는 디지털 교재 플랫폼
    description : 좋은 교재, 더 잘 쓰이게 - 저작권 라이선싱에서 디지털 퍼블리싱까지!
    keywords: 라이센스, 저작권, 교재, 이용권, 수업, 콘텐츠
    ```
  - 상픔상세
  ```jsx
  title: {상품명} - 쏠북
  description: {선생님들이 작성한 description}
  ```
  - 연구소
  ```jsx
  title: "부교재나라 내신 전문 연구소, 최다유형 최대문항 최적자료. 저작권 걱정 없는 디지털교재 플랫폼 쏠북\r";
  description: "모든 출제유형 최적화 서술형 완벽대비 문제 제작";
  keyword: "중간고사, 기말고사, 내신, 문제은행, 기출변형, 변형문제, 부교재, 고1영어문제집, 고2영어문제집, 부교재나라, 부스터구문독해, 부스터유형독해, 얇빠 변형문제, 얇빠, 빠바, 빠른독해바른독해, 빠바기초세우기, 빠바독해, 빠바구문독해, 빠바유형독해, 빠른독해바른독해구문독해, 빠른독해바른독해유형독해 , 빠른독해바른독해기초세우기,빠른독해바른독해종합실전편, 빠바종합실전편, 다빈출코드, 리딩잇, 맞수구문독해실전편, 능률기본영어, 더상승, THE상승, 더상승직독직해, 수능만만, 수능만만기본, 수능만만기본문법, 리딩부스터";
  ```

### 보완 필요한 부분

- 쏠북 블로그 연결

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/79dd28b1-0324-4808-bf99-e7f3f03f82ba/Untitled.png)

- 사이트맵 제출 : 사이트 링크를 정리해줄것.
- 사이트 로딩 속도(light house 점수) : 사이트 로딩 속도가 검색어 상위 노출에 영향을 미침.
- metatag 추가 및 키워드 작업
  - title과 description 개선 필요 + author 추가 필요
  - keywords meta tag는 잘 사용되지 않는다고 함.
  -

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/852f1d16-6362-4f88-aa1b-beff65b1a475/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/1e76f5a1-a53b-4872-a5fd-a3c145989000/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/fe44ebb4-8012-4bd0-b5f6-010e50a4dcf9/Untitled.png)

- 조직정보 스키마 마크업 작성 및 robots.tsx 수정

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/1cee04c2-1851-4c95-8d7c-1cb67bfdf2e8/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/e9ba4072-cac4-4743-a599-c1116a37f5a1/Untitled.png)

크롤링 필요없는 사이트들 제거 필요 (예 : 로그인 페이지)

```jsx
User-agent: *
Allow: /
```

- 백링크 작업 : 사이트가 상단에 올라갈 가능성이 높아짐.
  - 쏠북 블로그 혹은 다른 사이트들에 많이 노출될 수록 좋다.
- 네이버 검색어 상단에는 대부분 광고, 블로그, 카페가 있기 때문에, 어쩌면 쏠북 블로그를 활성화 시키는게 답일지도………
- alt 태그 시맨틱한 키워드 사용필요
  이벤트가 클릭율이 높아서 올라간듯함.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/bf1ba8e3-9223-47a8-b267-76bb6f95d951/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2fc50c45-d830-4bf0-a19c-122e444c1b64/fcb792f3-e6a6-4b7a-aaa6-05e1a94b352d/Untitled.png)

다시 돌아와서 핵심

어떻게 하면 교재들이 검색시 상위에 걸리게 할 수 있을까 .

1. 상품상세페이지 성능개선 (국어 개편때 가능 - 라이트 하우스 점수)
2. 교재들의 description과 title 수정 : tags값으로 description을 변경

---

til

react.fc

지양하라.

다양한 이유들이 있는데 그중에는

props에 children이 들어가 있다.

코드가 길어진다.

default props의 사용 등이 있다.

react의 렌더링

[리액트의 렌더링은 어떻게 일어나는가?](https://yceffort.kr/2022/04/deep-dive-in-react-rendering)

호출 스케줄링

https://ko.javascript.info/settimeout-setinterval

새로 알게된 사실

padstart

setinterval

*const formatTime = (*time*: number): string => {*

타입지정

실제로 사용하는 setinterval

```jsx
useEffect(() => {
  if (direction !== "stable" && isScrollAllowed) {
    scrollTimer.current = setInterval(() => {
      ref.current?.scrollBy(0, scrollSpeed * (direction === "top" ? -1 : 1));
    }, 1);
  }
  return () => {
    if (scrollTimer.current) {
      clearInterval(scrollTimer.current);
    }
  };
}, [isScrollAllowed, direction, ref, scrollSpeed]);
```

[[TypeScript] 타입스크립트 Utility types (2) - Partial, Required, Record](https://chanhuiseok.github.io/posts/ts-4/)

되도록 이면 타입을 만들지 말고, 재사용해보는 방법을 생각해보자. 예를 들면 partial

```jsx
Partial<Type>
```

값을 저장할 때 모든 프로퍼티를 받았는지는 `Required`를 활용하면 손쉽게 검증 가능할 것입니다

```jsx
Required<Type>
```
