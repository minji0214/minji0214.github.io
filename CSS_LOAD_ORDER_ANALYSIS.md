# CSS 로드 순서 문제 분석

## 문제 상황

`global.css`의 reset 스타일이 `BlogPost.astro`의 커스텀 스타일보다 우선순위가 높게 적용되고 있습니다.

## 원인 분석

### 1. CSS 로드 순서

**현재 구조:**
```
<head>
  <BaseHead />  <!-- global.css import (외부 스타일시트) -->
  <link rel="stylesheet" href="pretendard.min.css" />
</head>
<body>
  <!-- ... content ... -->
  <style>
    /* BlogPost.astro의 스타일 (내부 스타일시트) */
    .blog-post-body h2 { ... }
  </style>
</body>
```

**문제점:**
- `BaseHead.astro`에서 `import '../styles/global.css'`를 하면
- Astro는 이를 `<head>`에 `<link>` 태그로 추가합니다
- `<style>` 태그는 `<body>` 끝에 있지만, 이것은 HTML 파싱 순서와는 다릅니다

### 2. CSS 우선순위 규칙

CSS 우선순위는 다음 순서로 결정됩니다:

1. **특이성 (Specificity)** - 가장 중요
2. **소스 순서 (Source Order)** - 특이성이 같을 때
3. **중요도 (!important)** - 최후의 수단

**현재 상황:**
- `h2` (특이성: 0,0,0,1) - global.css
- `.blog-post-body h2` (특이성: 0,0,1,1) - BlogPost.astro

이론적으로는 `.blog-post-body h2`가 더 높은 특이성을 가지므로 적용되어야 합니다.

### 3. 실제 문제

하지만 개발자 도구에서 `global.css`의 reset이 우선순위로 보이는 이유:

1. **CSS 로드 순서 문제**
   - 외부 스타일시트(`<link>`)가 나중에 로드되면
   - 특이성이 같을 때 나중에 로드된 것이 우선순위를 가집니다
   - 하지만 특이성이 다르면 특이성이 높은 것이 우선입니다

2. **Astro의 CSS 처리 방식**
   - Astro는 CSS import를 빌드 타임에 처리합니다
   - `<style>` 태그는 컴포넌트가 렌더링될 때 추가됩니다
   - 하지만 실제 DOM에서는 `<head>`에 모두 포함될 수 있습니다

3. **브라우저의 CSS 파싱 순서**
   - 브라우저는 `<head>`의 모든 스타일을 먼저 파싱합니다
   - `<body>`의 `<style>` 태그는 나중에 파싱되지만
   - 특이성이 같으면 나중에 파싱된 것이 우선순위를 가집니다

## 해결 방법

### 방법 1: CSS import를 `<head>`에 명시적으로 추가 (권장)

`BlogPost.astro`에서 CSS를 별도 파일로 분리하고 `<head>`에 추가:

```astro
---
import './BlogPost.css';
---

<head>
  <BaseHead />
  <link rel="stylesheet" href="/styles/BlogPost.css" />
</head>
```

### 방법 2: `<style is:global>` 사용

Astro의 `<style>` 태그는 기본적으로 scoped됩니다. 전역 스타일로 만들기:

```astro
<style is:global>
  .blog-post-body h2 {
    /* ... */
  }
</style>
```

### 방법 3: CSS 특이성 더 높이기

더 구체적인 선택자 사용:

```css
/* global.css */
h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
}

/* BlogPost.astro */
.blog-post-main .blog-post-content .blog-post-body h2 {
  font-size: 1.25rem; /* 더 높은 특이성: 0,0,3,1 */
}
```

### 방법 4: CSS 변수 활용

전역 reset을 CSS 변수로 관리:

```css
/* global.css */
:root {
  --heading-font-size: inherit;
  --heading-font-weight: inherit;
}

h1, h2, h3, h4, h5, h6 {
  font-size: var(--heading-font-size);
  font-weight: var(--heading-font-weight);
}

/* BlogPost.astro */
.blog-post-body {
  --heading-font-size: 1.25rem;
  --heading-font-weight: 600;
}
```

## 실제 적용된 해결책

**`<style is:global>` 사용**

Astro의 `<style>` 태그는 기본적으로 **scoped**됩니다. 즉, 컴포넌트별로 고유한 클래스명을 생성하여 스타일을 격리합니다.

하지만 우리는 `.blog-post-body` 같은 전역 클래스를 사용하고 있으므로, `<style is:global>`을 사용하여 전역 스타일로 만들어야 합니다.

```astro
<style is:global>
  .blog-post-body h2 {
    /* 이제 전역 스타일로 적용됨 */
  }
</style>
```

**왜 이것이 문제였나?**

1. Astro의 scoped 스타일은 컴포넌트별로 고유한 클래스를 생성합니다
2. 하지만 `.blog-post-body`는 마크다운 콘텐츠에서 직접 사용되는 클래스입니다
3. Scoped 스타일이 적용되면 실제 DOM의 클래스명과 매칭되지 않을 수 있습니다

**해결 후:**
- `<style is:global>`을 사용하여 전역 스타일로 변경
- 이제 `.blog-post-body h2`가 실제 DOM과 정확히 매칭됩니다
- CSS 특이성도 정상적으로 작동합니다

## 추가 권장 사항

**더 나은 방법: CSS 파일 분리 (선택사항)**

만약 스타일이 많아지면 별도 파일로 분리하는 것이 좋습니다:

1. `src/styles/blog-post.css` 파일 생성
2. `BlogPost.astro`에서 import
3. `<head>`에 명시적으로 추가

이렇게 하면:
- CSS 로드 순서가 명확해집니다
- 코드가 더 깔끔해집니다
- 유지보수가 쉬워집니다

