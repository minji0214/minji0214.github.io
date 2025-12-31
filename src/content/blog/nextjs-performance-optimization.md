---
title: "Next.js 프로젝트 성능 개선기"
description: "빠른 개발 프로세스로 인해 누적된 기술 부채를 해결하기 위한 Next.js 성능 최적화 여정. Lighthouse 진단부터 Dynamic Import, 이미지 최적화, Fetch 최소화까지 실제 적용한 개선 사례를 공유합니다."
pubDate: "12 31 2025"
tags: ["FE", "Next.js"]
---

**3개월간** 빠른 개발 프로세스를 진행하며 실험과 개선을 반복한 결과, **20개의 새로운 기능**이 추가되었습니다. 하지만 이는 **무거워진 프로젝트**라는 기술 부채를 안겨주었습니다. 웹뷰 기반으로 만들어져 있어 기본 브라우저에서 사용하는 것보다 성능이 아쉬웠고, 앱스토어에 올라온 악플을 보고 더 이상 미룰 수 없다는 생각에 **코드 다이어트**를 시작하게 되었습니다.

![앱스토어 악플](../../contentsImgs/251231.jpg)

우선 어떤 상태인지 진단이 필요했습니다.

## 성능 분석의 두 가지 측면

성능 분석에는 **런타임 성능**과 **빌드타임 성능** 두 가지가 있습니다.

- **빌드타임 성능**: 프로젝트 빌드 시 확인 가능한 **번들 크기**와 **빌드 시간**
- **런타임 성능**: **Chrome Lighthouse**, **Performance 탭**에서 확인 가능한 실제 사용자 경험 지표

---

## 1. 진단: 현재 상태 파악하기

우리 아이가 지금 얼마나 아픈지 **Chrome Lighthouse**를 통해 진단을 받아보았습니다.

### 초기 Lighthouse 점수

![초기 Lighthouse 점수](../../contentsImgs/image.png)

![초기 Lighthouse 점수 상세](../../contentsImgs/image%201.png)

- **LCP (Largest Contentful Paint)**: 개선 필요
- **CLS (Cumulative Layout Shift)**: 개선 필요

**LCP**는 화면에서 가장 큰 영역을 그리는데 걸리는 시간을 뜻합니다.

그럼 이제 **LCP 개선**을 중심으로 전반적인 성능 개선 작업을 시작해 보겠습니다.

### LCP Breakdown 분석

**Chrome Performance 탭**에서 분석해 보면 어디서 병목이 생기는지 더 자세하게 알아볼 수 있습니다. 최근에 **AI Debug**가 가능해져서 가장 큰 LCP 방해 요소를 찾을 수 있었습니다.

![LCP Breakdown 분석](../../contentsImgs/image%202.png)

```
Time to first byte (TTFB): 137ms (41.6%)
Resource load delay: 102ms (30.8%)
Element render delay: 91ms (27.6%)
Resource load duration: 0.1ms (0.0%)
```

#### 핵심 발견 사항

**가장 큰 문제는 TTFB (Time to First Byte)**였으며, LCP 요소는 **썸네일 이미지**였습니다.

![LCP 요소 확인](../../contentsImgs/image%203.png)

결국엔 썸네일 이미지 영역이었습니다. 캐러셀 영역이 이미지 사이즈에 비해 큰 용량을 가지고 있어 생긴 이슈였습니다.

---

## 2. 투두리스트를 만들어보자

**Next.js**에 최적화된 방식으로 성능 개선에 도움이 되는 방법들을 리스트업 하였습니다.

이 중에서 우리 프로젝트의 구조에 맞는 방법을 하나씩 적용해 보겠습니다.

| 작업 | 효과 |
| --- | --- |
| **`use client` 최소화** | JS 실행 시간 즉시 감소 |
| **서버 컴포넌트 전환** | JS 번들 size 즉시 감소 |
| **Dynamic import** | 초기 실행 시간 감소 |
| **UI 라이브러리 사용 최소화** | JS 중량 감소 |
| **초기 fetch 줄이기** | Hydration 시간 감소 |
| **코드 스플리팅 적용** | TTI(Time To Interactive) 개선 |
| **이미지 최적화** | CPU/메모리 사용량 감소 |

---

## 3. 이미지 최적화

결국엔 썸네일 이미지 영역이었습니다. 캐러셀 영역이 이미지 사이즈에 비해 큰 용량을 가지고 있어 생긴 이슈여서 홈 > 캐러셀 큐레이션 영역들에는 이미지에 **`loading="lazy"`** 옵션을 추가해 주어 처음 화면에 보이는 이미지들만 불러올 수 있도록 하였습니다.

```jsx
// Before: 모든 이미지가 즉시 로딩
<img src={imageUrl} alt={alt} />

// After: 뷰포트에 진입할 때만 로딩
<img 
  src={imageUrl} 
  alt={alt} 
  loading="lazy"
  fetchPriority="low"
/>
```

![이미지 최적화 후](../../contentsImgs/image%204.png)

---

## 4. Dynamic Import

최적화 전 build시 홈의 first load는 **338KB**였고, 사이즈는 **20.9KB**였습니다.

기존에 루트 레이아웃에서 다양한 목적의 모달들을 import하고 있는데, 초기 로딩에 필수가 아니기 때문에, **dynamic import**로 바꿔주었습니다.

```
ƒ /    20.9 kB    338 kB
```

```jsx
// Before: 모든 모달이 초기 번들에 포함
<div className={cn(responsive.container, 'relative')}>
  {children}
  <LoginModal />
  <ShopAtpisodeLoginModal />
  <PromotionTermsModal />
</div>
<SonnerToaster />
<ChristmasGiftModalProvider />
```

```jsx
// After: 필요할 때만 로딩
const SonnerToaster = dynamic(() => import('@/providers/SonnerProvider'), {
  ssr: false,
});

const LoginModal = dynamic(() => import('@/components/modals/login-modal'), {
  ssr: false,
});

const ShopAtpisodeLoginModal = dynamic(
  () => import('@/components/modals/shop-atpisode-login-modal'),
  { ssr: false },
);

const PromotionTermsModal = dynamic(
  () => import('@/components/modals/promotion-terms.modal'),
  { ssr: false },
);
```

홈 > layout > 모달들 dynamic import 했을때

```
ƒ /    18.5 kB    337 kB
```

---

## 5. 라이브러리 최소화

**analyze bundle**을 통해 가장 많은 부분을 차지하는 라이브러리를 찾았고, **`heic2any`**의 최적화 방법을 고민하였습니다. 같은 고민을 하는 사람들이 많더라구요.

![Bundle Analyzer 결과](../../contentsImgs/image%205.png)

- size는 줄었지만 firstload는 오히려 증가하였습니다. 그래서 스크립트를 루트 레이아웃에서 import 하는 것이 아닌 사용하는 페이지에서 동적 import 하는 방식으로 변경하였습니다.

```jsx
// Before: 전역 레이아웃에서 import
import { heic2any } from 'heic2any';

// After: 사용하는 페이지에서만 동적 로딩
<Script 
  src="heic2any.js" 
  loading="lazy"
  fetchPriority="low"
/>
```

- 라이브러리를 제거하고, 사용처에서만 스크립트 방식으로 변경: 

```
ƒ /    17.9 kB    340 kB
```

1. 전역에서 사용하지 않는 다른 스크립트들도 사용하는 페이지로 이동해주었고, 스크립트에 **`loading="lazy"`** 옵션을 추가해 주었습니다.

![스크립트 lazy 옵션 적용](../../contentsImgs/image%206.png)

기존에 콘솔에 뜨던 오류도 함께 해결되었습니다.

1. 안쓰는 라이브러리 정리 (**`embla-carousel`**)

변경 후 dev

![변경 후 dev 빌드 결과](../../contentsImgs/image%207.png)

prd 배포 후

![prd 배포 후 Lighthouse 점수](../../contentsImgs/image%208.png)

![prd 배포 후 성능 지표](../../contentsImgs/image%209.png)

![prd 배포 후 성능 지표 상세](../../contentsImgs/image%2010.png)

변경 후 dev와 prd 배포 후 결과:

```
Before:
├ ƒ /                   21.1 kB    265 kB
├ ƒ /list/popup         9.61 kB    251 kB
├ ƒ /popup/[id]         121 kB     372 kB

After:
├ ƒ /                   20.6 kB    266 kB
├ ƒ /list/popup         9.44 kB    252 kB
├ ƒ /popup/[id]         38.5 kB    359 kB
```

특히 **팝업 상세 페이지**의 번들 크기가 **121KB → 38.5KB**로 **68% 감소**했습니다.

---

## 6. Fetch 호출 횟수 줄이기

### 왜 Fetch 최소화가 중요한가?

**저속 네트워크 환경**(3G/LTE, 해외, WebView)에서 체감 **로딩 속도** 개선이 중요합니다. 또한 **RSC payload** 감소, **hydration payload** 감소로 **초기 paint 안정성**을 높일 수 있습니다.

- 첫 화면에 필요한 것만 즉시 렌더
- 나머지는 lazy

### 홈 페이지 최적화

1. **투표 API**: **`inView`** 시에만 호출하도록 변경
2. **최신 정보 API**: **`useQueries`**로 묶어서 병렬 처리
3. **인증 상태 확인**: **`isAuthenticated`** 옵션 추가

**as-is**

![홈 페이지 fetch 호출 as-is](../../contentsImgs/image%2011.png)

**to-be**

![홈 페이지 fetch 호출 to-be](../../contentsImgs/image%2012.png)

```
ƒ /    22.5 kB    341 kB
```

### 팝업 리스트 페이지 최적화

- **`/list` prefetch 제거**
- **`isAuthenticated` 스토어 추가**
- **`/list/popup` prefetch 제거**

![팝업 리스트 페이지 최적화 1](../../contentsImgs/image%2013.png)

![팝업 리스트 페이지 최적화 2](../../contentsImgs/image%2014.png)

```
├ ƒ /list/popup    18.9 kB    327 kB
```

### 팝업 상세 페이지 최적화

1. **Review 관련 prefetch 제거**: 탭으로 숨겨져 있는 리뷰 영역이므로 초기 로딩 시 불필요한 prefetch 제거
2. **Dynamic import 추가**: 관련 팝업, 지도 컴포넌트를 dynamic import로 변경
3. **지연 로딩**: 하단 추천 영역 API들은 하단으로 스크롤 내렸을때 호출
4. **이미지 lazy 처리**: 모든 이미지에 **`loading="lazy"`** 적용

![팝업 상세 페이지 최적화 1](../../contentsImgs/image%2015.png)

![팝업 상세 페이지 최적화 2](../../contentsImgs/image%2016.png)

```
├ ƒ /popup/[id]    36.4 kB    353 kB
├ ƒ /popup/[id]    37.4 kB    354 kB
├ ƒ /popup/[id]    35.6 kB    352 kB (관련 팝업, 지도 dynamic import)
```

**JS 청크 개수**도 **56개**로 감소했습니다.

![팝업 상세 페이지 추가 최적화 1](../../contentsImgs/image%2017.png)

![팝업 상세 페이지 추가 최적화 2](../../contentsImgs/image%2018.png)

![팝업 상세 페이지 추가 최적화 3](../../contentsImgs/image%2019.png)

![팝업 상세 페이지 추가 최적화 4](../../contentsImgs/image%2020.png)

---

## 7. 런타임 성능

https://developer.chrome.com/docs/devtools/performance?hl=ko

### 초당 프레임 수 분석

> 애니메이션의 성능을 측정하는 주요 측정항목은 초당 프레임 수 (FPS)입니다. 애니메이션이 60FPS로 실행되면 사용자가 만족합니다.

- **FPS 차트**: 빨간색이 있는 경우 프레임 속도가 느려서 사용자 환경에 영향을 미침
- **CPU 차트**: 메인 스레드 사용량을 확인

![FPS 차트](../../contentsImgs/image%2021.png)

### CPU 4× 기준 분석 결과

> "로딩 성능은 우수하지만, 스크롤/리스트 상호작용 시 JS 실행량이 과도해 메인 스레드가 계속 막히는 구조"
> 
> → 저사양 안드로이드 / 웹뷰에서 **버벅임·프레임 드랍이 충분히 발생할 수 있는 상태**

#### CPU 4× 기준에서 특히 중요한 포인트

**Total Main Thread Time ≈ 20초**

- 이건 **실제 저가형 모바일 디바이스에선 매우 현실적인 수치**
- 단순 로딩 문제가 아니라 **"계속 일하는 앱"** 상태

**Scripting: 3,927ms**

→ **문제의 핵심**

> CPU 감속 상태에서 JS가 4초 가까이 실행
> 
> → 실제 기기에서는 **스크롤 시 프레임 손실, 탭 지연**으로 체감됨

### 타임라인으로 본 문제 구조

#### 네트워크는 문제가 아님

- Loading: **16ms**
- Network waterfall도 고르게 분산
- 병목 ❌

👉 서버 / CDN / API 문제 아님 (확실)

#### Rendering + Painting은 "결과"일 뿐

- Rendering: **1,222ms**
- Painting: **535ms**

👉 이건 **JS가 DOM을 계속 바꾸기 때문에 따라오는 비용**

> 원인은 렌더링 자체가 아니라 "렌더링을 유발하는 JS"

#### Frames 뷰가 말해주는 진짜 문제

프레임 타임이:
- **2,149ms**
- **2,566ms**
- 그 사이에 회색 세로줄이 빽빽

이 의미는👇

> ❗ 한 프레임이 16ms 안에 끝나야 60fps인데
> 
> → 수백~수천 ms 동안 메인 스레드가 점유됨
> 
> → 스크롤은 "움직이지만 손에 안 붙는 느낌"

### CPU 4×에서 발견한 문제들

Performance 탭에서 확인한 결과, 애니메이션이 메인 스레드에 묶여 있어서 스크롤 중에도 계속 실행되고 있었습니다. transform이나 opacity를 사용하더라도 JS로 트리거되면 layout → paint 과정을 거치게 되어 성능에 영향을 줍니다.

또한 Insights에서 나오는 경고들을 보면:
- Optimize DOM size
- Improve image delivery (26MB)
- Use efficient cache lifetimes (21MB)

이런 경고들이 나오는 상태였습니다.

### 왜 LCP / CLS / INP는 괜찮은데 체감은 안 좋을까?

LCP는 초기 1번만 빠르면 통과하고, CLS는 레이아웃 안정성만 봅니다. INP도 대표 상호작용 1회만 측정합니다.

하지만 실제 문제는 지속적인 상호작용 비용이었습니다. 무한 스크롤, 리스트 이미지 로딩, 상태 변경, analytics나 observer 같은 것들이 계속 실행되면서 성능에 영향을 주고 있었는데, 이건 Core Web Vitals로는 측정되지 않는 영역이었습니다.

---

### 개선 성과 요약

- **초기 번들 크기**: **20.9KB → 17.9KB** (약 **14% 감소**)
- **팝업 상세 페이지**: **121KB → 38.5KB** (약 **68% 감소**)
- **LCP 개선**: 이미지 lazy loading으로 초기 로딩 시간 감소
- **Fetch 호출 최소화**: 불필요한 prefetch 제거로 네트워크 사용량 감소

---

## 참고하면 좋은 글

- [우아한형제들 기술블로그 - Next.js 성능 최적화 경험기](https://techblog.woowahan.com/20228/)
- [Chrome DevTools - Performance 패널 가이드](https://developer.chrome.com/docs/devtools/performance?hl=ko)

