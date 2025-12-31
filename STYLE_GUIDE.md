# 스타일 관리 가이드

## 문제 상황

`global.css`의 전역 reset 스타일이 컴포넌트별 커스텀 스타일을 덮어쓰는 문제가 발생했습니다.

## 원인 분석

1. **CSS 로드 순서**: `BaseHead.astro`를 통해 `global.css`가 모든 페이지에 로드됨
2. **CSS 특이성(Specificity)**: 전역 reset이 컴포넌트 스타일보다 높은 특이성을 가질 수 있음
3. **스타일 격리 부족**: 전역 스타일과 컴포넌트 스타일 간의 명확한 구분 부족

## 해결 방법

### 1. 전역 Reset 수정 (`global.css`)

```css
/* 전역 reset은 최소한으로 유지 */
h1, h2, h3, h4, h5, h6 {
	margin: 0;
	padding: 0;
	font-size: inherit;
	font-weight: inherit;
}

/* 예외: 특정 컴포넌트는 reset에서 제외 */
.blog-post-body h1,
.blog-post-body h2,
.blog-post-body h3,
.blog-post-body h4,
.blog-post-body h5,
.blog-post-body h6 {
	/* Reset is intentionally not applied */
}
```

### 2. 컴포넌트 스타일 특이성 강화

컴포넌트 스타일을 작성할 때:
- **CSS 특이성 활용**: 클래스 선택자를 추가하여 특이성 높이기
- **`!important` 피하기**: 특이성으로 해결 가능하면 사용하지 않기
- **명확한 스코프**: 클래스 이름을 명확하게 구분

예시:
```css
/* global.css - 낮은 특이성 (0,0,0,1) */
h2 {
	font-size: inherit;
}

/* BlogPost.astro - 높은 특이성 (0,0,1,1) - 자동으로 override됨 */
.blog-post-body h2 {
	font-size: 1.25rem;
	font-weight: 600;
	/* !important 없이도 충분히 작동 */
}
```

**CSS 특이성 계산:**
- 태그 선택자 (h2): 0,0,0,1
- 클래스 선택자 (.blog-post-body): 0,0,1,0
- `.blog-post-body h2`: 0,0,1,1 ← 더 높은 특이성으로 자동 적용

### 3. 스타일 작성 규칙

#### ✅ 권장 사항

1. **스코프된 클래스 사용**
   ```css
   .my-component h2 { /* 좋음 */ }
   h2 { /* 피하기 - 전역에 영향 */ }
   ```

2. **명확한 네이밍**
   ```css
   .blog-post-body h2 { /* 명확함 */ }
   .content h2 { /* 모호함 */ }
   ```

3. **CSS 변수 활용**
   ```css
   :root {
     --heading-size-h2: 1.25rem;
   }
   .blog-post-body h2 {
     font-size: var(--heading-size-h2);
   }
   ```

4. **주석으로 의도 명시**
   ```css
   /* High specificity to override global.css reset */
   .blog-post-body h2 {
     /* ... */
   }
   ```

#### ❌ 피해야 할 것

1. **전역 선택자 남용**
   ```css
   h2 { /* 모든 h2에 영향 - 위험 */ }
   ```

2. **낮은 특이성**
   ```css
   h2 { /* 전역 reset과 충돌 가능 */ }
   ```

3. **인라인 스타일 남용**
   ```html
   <h2 style="font-size: 1.25rem"> <!-- 유지보수 어려움 --> </h2>
   ```

## 재발 방지 체크리스트

새로운 스타일을 추가할 때:

- [ ] 전역 reset과 충돌하지 않는가?
- [ ] 충분한 CSS 특이성을 가지고 있는가?
- [ ] 다른 컴포넌트에 영향을 주지 않는가?
- [ ] 반응형 스타일도 함께 고려했는가?
- [ ] 브라우저 개발자 도구로 실제 적용 여부 확인했는가?

## 디버깅 방법

스타일이 적용되지 않을 때:

1. **브라우저 개발자 도구 확인**
   - Elements 탭에서 Computed 스타일 확인
   - 어떤 스타일이 적용되고 있는지 확인
   - 취소선이 그어진 스타일 확인 (다른 스타일에 의해 override됨)

2. **CSS 특이성 확인**
   - 더 구체적인 선택자 사용 (클래스 추가)
   - 특이성 계산기로 확인: https://specificity.keegan.st/
   - `!important`는 정말 필요할 때만 사용 (최후의 수단)

3. **로드 순서 확인**
   - Network 탭에서 CSS 파일 로드 순서 확인
   - `<style>` 태그의 위치 확인

## 향후 개선 방향

1. **CSS Modules 도입 고려**: 스타일 자동 스코핑
2. **PostCSS 플러그인**: 스타일 격리 자동화
3. **Design System 구축**: 일관된 스타일 관리

