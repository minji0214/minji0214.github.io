---
title: "E2E 테스트 도입에 대한 고민"
description: "E2E테스트를 제품에 도입하기 위한 스터디 "
pubDate: "06 10 2023"
heroImage: "/minglog.github.io/heroImgs/thumb_tdd.png"
---

### 프론트엔드 테스트 방식

- Jest : priceOptionsfactory.spec.ts 처럼 함수의 기능을 확인
- 스냅샷 테스트 : ui 테스트 (모든페이지의 스크린샷을 떠서 스냅샷테스트를 진행하는것도 좋을듯 싶다. —> 스타일을 수정했을 경우 오류를 확인하기 적합하다고 생각됨.)
- cypress : 정책문서 기반 유저플로우 테스트

- 앞으로 추가되는 기능부터 테스트 코드작성
- 처음 시작은 기능을 만들면서 테스트코드도 같이 작성하는 방식으로 진행.
- 당분간은 cicd에 추가하지 않음 : 시간이 오래걸리고, 체계화 되기 전까지는 배포전에 직접 실행.

- 버그를 잡는 유용한 테스트 코드를 작성할려면 어떻게 해야할까 ?-?

---

### cypress의 도입배경 : jest의 한계

jest로 테스트를 해보면서 테스트 바운더리를 어떻게 정해야하는지 고민됨. 목함수가 필수적으로 사용되어 기능의 동작을 정확하게 테스트하기 어렵다고 생각됨. 특히 jest에서 viewmodel이 작동되는 환경을 만들기 어려움.

ui와 프론트엔드 기능을 함께 테스트 하기에 e2e테스트가 유용한거같음.

jest를 삽질하면서 느낀점.

view만 테스트시 : viewmodel에 있는 액션과 커맨드를 더미로 만들어야 함.

viewmodel테스트시 : import되는 애들을 더미로 만들어야함.

실행시 100프로 실행이 안됨.

로그인시 로직을 완벽하게 테스트 하기 어렵.

- mockdata로 불러와야할 지 or 실제 커맨드를 불러와야 할지

mockdata로 불러올 경우: 실제 api와 다를 수 있음 → 테스트의 정확도가 낮음. mock를 만들어야 함 → 번거러움.

실제커맨드를 불러올 경우 : 로그인이 필요한 경우 토큰 값은???

- productdetailviewmodel 테스트

useStore must be used within a StoreProvider. 오류발생.

---

### e2e test

end to end test. 어플리케이션의 흐름을 처음부터 끝까지 테스트.

기능명세가 유저스토리 기반으로 작성되어있는 우리 제품에 적합하다고 생각.

기능명세 기반으로 테스트 코드를 작성하여 테스트하면 버그를 qa이전에 잡을수 있지 않을까 생각.

단점.

유닛테스트와 통합테스트 : 개발자의 의도를 테스트

e2e테스트: 사용자의 동작을 테스트

qa의 업무와 겹치는 지점이 있을 수 있다.

테스트시간이 오래걸림.

테스트 피라미드 : 테스트의 대부분은 unit테스트 여야 한다.

e2e는 비용이 많이 드는 작업이므로 꼭 필요한 작업만 수행해야 한다.

---

### 테스트를 도입하게 될 시 테스트를 어떻게 관리할 건지도 논의되어야함.

cicd에 적용할건지.

배포전에 테스트를 돌릴건지 등.

어떤기준으로 e2e테스트와 unit테스트를 진행할건지.

---

### cypress vs playwright

cypress와 playwright 두개다 사용결과

테스트 작성이 미숙한 나로서는 우선 cypress가 화면을 볼 수 있어서 디버깅 하기 훨씬 편했다.

playwright는 막혀도 어디서 막힌지 몰라서 답답. 잘 된건지 모르겠어서 답답.

playwright: 병렬테스트 가능, 테스트 시간 빠름 , 다양한 브라우저 테스트 지원

cypress: 문서가 잘되어 있음. 디버깅이 쉬움.

action

[locator.fill(](https://playwright.dev/docs/api/class-locator#locator-fill)) : 양식채우기

playwright code

```tsx
import { expect, Page, test } from "@playwright/test";

// describe는 테스트를 묶는 단위
test.describe("하이퍼커넥트 기술블로그 테스트", () => {
	let page: Page;

	// beforeAll hook은 최초 딱 한번 실행. initialize 작업 등을 수행
	test.beforeAll(async ({ browser, contextOptions }) => {
		const browserContext = await browser.newContext(contextOptions);
		// 페이지 생성
		page = await browserContext.newPage();

		// 기술블로그 링크로 이동
		await page.goto("https://hyperconnect.github.io/");
	});

	test("1. document title이 올바르다", async () => {
		// document.title이 올바른지 확인
		await expect(page).toHaveTitle(
			"Hyperconnect Tech Blog | 하이퍼커넥트의 기술블로그입니다."
		);
	});

	test("2. footer의 copyright가 올바르다", async () => {
		// footer element를 가져옴
		const copyrightFooter = await page.locator("body > footer > div > div");

		// 올바른 copyright를 계산
		const currentYear = new Date().getFullYear();
		const validCopyright = `© 2013-${currentYear} Hyperconnect Inc.`;

		// footer의 text가 올바른 copyright인지 확인
		await expect(copyrightFooter).toHaveText(validCopyright);
	});

	test("3. 채용정보 버튼을 누르면, Career 페이지로 이동한다", async () => {
		// 채용정보(Career) 버튼을 클릭
		await page.click("body > header > div > nav > div > a:nth-child(3)");

		// 채용 페이지로 이동했는지 확인
		await expect(page).toHaveURL("https://career.hyperconnect.com/");

		console.log("채용 많은 관심 부탁드립니다 🙏");
		console.log("Epic CPaaS Web 팀도 채용 중 입니다 🙌");
		console.log("채용은 여기서: https://career.hyperconnect.com/");
	});

	// 일부러 추가한 실패하는 케이스
	test("4. 배경을 100번 클릭하면, dark theme으로 바뀐다", async () => {
		// 다시 기술블로그 페이지로 이동
		await page.goBack();

		// 배경을 100번 클릭
		for (let i = 0; i < 100; i++) {
			await page.click("body");
		}

		const body = page.locator("body");

		// background가 검정인지 확인 (dark theme 인지 확인)
		await expect(body).toHaveCSS("background-color", "black");
	});
});
```

초기설정

[Cypress로 e2e 테스트 진행하기](https://velog.io/@071yoon/Cypress로-e2e-테스트-진행하기)

[Cypress Testing Library | Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/)

[Cypress 환경구축 (React, Typescript)](https://velog.io/@averycode/Cypress-환경구축-React-Typescript)

타입오류 해결 !!

[cannot find name 'cy'.ts(2304) 🔎 You.com Search](<https://you.com/search?q=cannot+find+name+'cy'.ts(2304)&tbm=youchat&cfr=chatb&cid=c2_57fd9472-2cb5-4b45-bf90-0db876e94cbc>)

코드

```jsx
// api call도 test할 수 있니??
it('cy.request() - make an XHR request', () => {
  // https://on.cypress.io/request
  cy.request('https://jsonplaceholder.cypress.io/comments')
   .should((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.length(500)
    expect(response).to.have.property('headers')
    expect(response).to.have.property('duration')
   })
 })

it('displays mobile menu on click', () => {
      cy.get('nav .desktop-menu').should('not.be.visible')
      cy.get('nav .mobile-menu')
        .should('be.visible')
        .find('i.hamburger')
        .click()

      cy.get('ul.slideout-menu').should('be.visible')

//dynamic viewport test
const sizes = ['iphone-6', 'ipad-2', [1024, 768]]

describe('Logo', () => {
  sizes.forEach((size) => {
    // make assertions on the logo using
    // an array of different viewports
    it(`Should display logo on ${size} screen`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      cy.visit('https://example.cypress.io')
      cy.get('#logo').should('be.visible')
    })
  })
})
```

[Testing an API with Cypress](https://circleci.com/blog/api-testing-with-cypress/)

스튜디오의 다른 모달을은 유저기반이 아님. ⇒ 이것들도 유저기반으로 해야할까 ?? ??

yarn run cypress open

cypress의 스냅샷 테스트

```tsx
it("리스트 페이지 스냅샷 테스트", () => {
	cy.visit("/list"); // 리스트 페이지로 이동

	// 썸네일을 제외한 나머지 요소 스냅샷 캡처
	cy.get(".list-item").each((item) => {
		cy.wrap(item).within(() => {
			// 썸네일을 제외한 나머지 요소 스냅샷 캡처
			cy.get(".list-item-title").snapshot({ ignore: [".thumbnail"] });
		});
	});
});
```

productdetailviewmodel : useeffect에서 걸림

```tsx
import { ProductDetailViewModel } from "../../modules/products/viewModels/ProductDetailViewModel";
import { mockRouter } from "../../lib/pagination/test-utils";

describe("ProductDetailViewModel", () => {
	let viewModel;
	const mockProduct = { id: "1", title: "Test Product", price: 10 };
	const mockProductStore = {
		products: {
			product: mockProduct,
		},
	};
	beforeEach(() => {
		// 필요한 mock 객체들을 생성하고 전달합니다.
		const authStore = jest.fn();
		const product = mockProduct;
		const productStore = mockProductStore;
		const router = mockRouter;
		const apiService = jest.fn();

		viewModel = ProductDetailViewModel({
			authStore,
			product,
			productStore,
			router,
			apiService,
		});
	});

	test("initialize", async () => {
		console.log("테스트테스트테스트입니다");
		// initialize 액션을 호출합니다.
		await viewModel.actions.initialize({ prodId: "123" });

		// 원하는 동작을 검증하는 코드를 작성합니다.
		expect(viewModel.status.initialized).toBe(true);
		expect(viewModel.status.loading).toBe(false);
		// ...
	});

	test("fetchProduct", async () => {
		// fetchProduct 액션을 호출합니다.
		await viewModel.actions.fetchProduct("123");

		// 원하는 동작을 검증하는 코드를 작성합니다.
		expect(viewModel.status.errors.length).toBe(0);
		expect(viewModel.actions.currentSelectedVariant).not.toBeNull();
		// ...
	});

	// 다른 테스트 케이스 작성...
});
```

cypress와 jest

제품의 안정성을 위해 둘 중 하나의 도구를 선택해야 한다면, 일반적으로는 Cypress를 사용하는 것이 더 적합할 수 있습니다.

Cypress는 엔드 투 엔드(e2e) 테스트에 특화된 도구로, 실제 사용자의 관점에서 애플리케이션을 테스트할 수 있습니다. Cypress를 사용하면 애플리케이션의 실제 동작을 시뮬레이션하고 테스트할 수 있으며, UI 상호작용, 네비게이션, API 호출, 폼 제출 등 다양한 시나리오를 포괄적으로 테스트할 수 있습니다.

Cypress는 브라우저 내에서 애플리케이션을 실행하고 제어하기 때문에 실제 환경과 가장 유사한 환경에서 테스트를 수행할 수 있습니다. 이를 통해 사용자 경험과 실제 동작에 관련된 이슈를 발견하고 해결할 수 있습니다. 또한 Cypress는 강력한 디버깅 기능과 사용자 친화적인 인터페이스를 제공하여 개발자가 효율적으로 테스트를 작성하고 디버깅할 수 있도록 도와줍니다.

반면에 Jest는 주로 단위 테스트와 모듈 테스트에 사용되는 테스트 프레임워크입니다. Jest를 사용하면 코드의 로직을 테스트하고 예상 동작을 확인할 수 있습니다. Jest는 빠르고 가벼우며 단위 테스트를 위한 강력한 기능을 제공하지만, Cypress처럼 실제 사용자 경험을 테스트하는 데는 적합하지 않을 수 있습니다.

따라서, 제품의 안정성을 위해서라면 Cypress를 사용하여 엔드 투 엔드(e2e) 테스트를 수행하는 것이 좋습니다. Cypress를 통해 실제 사용자가 경험하는 시나리오를 테스트하고, 애플리케이션의 실제 동작과 사용자 인터페이스의 안정성을 확인할 수 있습니다.

[[Cypress] Cypress 도입기 (feat. MSW)](https://gyyeom.tistory.com/107)

## [프론트엔드 테스트 팁](https://tech.madup.com/front-test-tips/)

yarn playwright test

테스트코드글 정리하기

오늘의 교훈 : 기존 코드를 수정할때는 사이드 이펙트를 생각하고, 다른 곳에 임포트 된 곳이 있는지 확인하고

정리

jest를 삽질하면서 느낀점.

view만 테스트시 : viewmodel에 있는 액션과 커맨드를 더미로 만들어야 함.

viewmodel테스트시 : import되는 애들을 더미로 만들어야함.

실행시 100프로 실행이 안됨.

로그인시 로직을 완벽하게 테스트 하기 어렵.

### 프론트엔드 테스트 방식

- Jest : priceOptionsfactory.spec.ts 처럼 함수의 기능을 확인
- 스냅샷 테스트 : ui 테스트 (모든페이지의 스크린샷을 떠서 스냅샷테스트를 진행하는것도 좋을듯 싶다. —> 스타일을 수정했을 경우 오류를 확인하기 적합하다고 생각됨.)
- cypress : 정책문서 기반 유저플로우 테스트

- 앞으로 추가되는 기능부터 테스트 코드작성
- 처음 시작은 기능을 만들면서 테스트코드도 같이 작성하는 방식으로 진행.
- 당분간은 cicd에 추가하지 않음 : 시간이 오래걸리고, 체계화 되기 전까지는 배포전에 직접 실행.
- 버그를 잡는 유용한 테스트 코드를 작성할려면 어떻게 해야할까 ?-?

---

### cypress의 도입배경 : jest의 한계

jest로 테스트를 해보면서 테스트 바운더리를 어떻게 정해야하는지 고민됨. 목함수가 필수적으로 사용되어 기능의 동작을 정확하게 테스트하기 어렵다고 생각됨. 특히 jest에서 viewmodel이 작동되는 환경을 만들기 어려움.

ui와 프론트엔드 기능을 함께 테스트 하기에 e2e테스트가 유용한거같음.

---

### e2e test

end to end test. 어플리케이션의 흐름을 처음부터 끝까지 테스트.

기능명세가 유저스토리 기반으로 작성되어있는 우리 제품에 적합하다고 생각.

기능명세 기반으로 테스트 코드를 작성하여 테스트하면 버그를 qa이전에 잡을수 있지 않을까 생각.

단점.

유닛테스트와 통합테스트 : 개발자의 의도를 테스트

e2e테스트: 사용자의 동작을 테스트

qa의 업무와 겹치는 지점이 있을 수 있다.

테스트시간이 오래걸림.

테스트 피라미드 : 테스트의 대부분은 unit테스트 여야 한다.

e2e는 비용이 많이 드는 작업이므로 꼭 필요한 작업만 수행해야 한다.

---

### 테스트를 도입하게 될 시 테스트를 어떻게 관리할 건지도 논의되어야함.

cicd에 적용할건지.

배포전에 테스트를 돌릴건지 등.

어떤기준으로 e2e테스트와 unit테스트를 진행할건지.

---

### cypress vs playwright

cypress와 playwright 두개다 사용결과

테스트 작성이 미숙한 나로서는 우선 cypress가 화면을 볼 수 있어서 디버깅 하기 훨씬 편했다.

playwright는 막혀도 어디서 막힌지 몰라서 답답. 잘 된건지 모르겠어서 답답.

playwright: 병렬테스트 가능, 테스트 시간 빠름 , 다양한 브라우저 테스트 지원

cypress: 문서가 잘되어 있음. 디버깅이 쉬움.

action

[locator.fill(](https://playwright.dev/docs/api/class-locator#locator-fill)) : 양식채우기

playwright code

```tsx
import { expect, Page, test } from "@playwright/test";

// describe는 테스트를 묶는 단위
test.describe("하이퍼커넥트 기술블로그 테스트", () => {
	let page: Page;

	// beforeAll hook은 최초 딱 한번 실행. initialize 작업 등을 수행
	test.beforeAll(async ({ browser, contextOptions }) => {
		const browserContext = await browser.newContext(contextOptions);
		// 페이지 생성
		page = await browserContext.newPage();

		// 기술블로그 링크로 이동
		await page.goto("https://hyperconnect.github.io/");
	});

	test("1. document title이 올바르다", async () => {
		// document.title이 올바른지 확인
		await expect(page).toHaveTitle(
			"Hyperconnect Tech Blog | 하이퍼커넥트의 기술블로그입니다."
		);
	});

	test("2. footer의 copyright가 올바르다", async () => {
		// footer element를 가져옴
		const copyrightFooter = await page.locator("body > footer > div > div");

		// 올바른 copyright를 계산
		const currentYear = new Date().getFullYear();
		const validCopyright = `© 2013-${currentYear} Hyperconnect Inc.`;

		// footer의 text가 올바른 copyright인지 확인
		await expect(copyrightFooter).toHaveText(validCopyright);
	});

	test("3. 채용정보 버튼을 누르면, Career 페이지로 이동한다", async () => {
		// 채용정보(Career) 버튼을 클릭
		await page.click("body > header > div > nav > div > a:nth-child(3)");

		// 채용 페이지로 이동했는지 확인
		await expect(page).toHaveURL("https://career.hyperconnect.com/");

		console.log("채용 많은 관심 부탁드립니다 🙏");
		console.log("Epic CPaaS Web 팀도 채용 중 입니다 🙌");
		console.log("채용은 여기서: https://career.hyperconnect.com/");
	});

	// 일부러 추가한 실패하는 케이스
	test("4. 배경을 100번 클릭하면, dark theme으로 바뀐다", async () => {
		// 다시 기술블로그 페이지로 이동
		await page.goBack();

		// 배경을 100번 클릭
		for (let i = 0; i < 100; i++) {
			await page.click("body");
		}

		const body = page.locator("body");

		// background가 검정인지 확인 (dark theme 인지 확인)
		await expect(body).toHaveCSS("background-color", "black");
	});
});
```

초기설정

[Cypress로 e2e 테스트 진행하기](https://velog.io/@071yoon/Cypress로-e2e-테스트-진행하기)

[Cypress Testing Library | Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/)

[Cypress 환경구축 (React, Typescript)](https://velog.io/@averycode/Cypress-환경구축-React-Typescript)

타입오류 해결 !!

[cannot find name 'cy'.ts(2304) 🔎 You.com Search](<https://you.com/search?q=cannot+find+name+'cy'.ts(2304)&tbm=youchat&cfr=chatb&cid=c2_57fd9472-2cb5-4b45-bf90-0db876e94cbc>)

코드

```jsx
// api call도 test할 수 있니??
it('cy.request() - make an XHR request', () => {
  // https://on.cypress.io/request
  cy.request('https://jsonplaceholder.cypress.io/comments')
   .should((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.length(500)
    expect(response).to.have.property('headers')
    expect(response).to.have.property('duration')
   })
 })

it('displays mobile menu on click', () => {
      cy.get('nav .desktop-menu').should('not.be.visible')
      cy.get('nav .mobile-menu')
        .should('be.visible')
        .find('i.hamburger')
        .click()

      cy.get('ul.slideout-menu').should('be.visible')

//dynamic viewport test
const sizes = ['iphone-6', 'ipad-2', [1024, 768]]

describe('Logo', () => {
  sizes.forEach((size) => {
    // make assertions on the logo using
    // an array of different viewports
    it(`Should display logo on ${size} screen`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      cy.visit('https://example.cypress.io')
      cy.get('#logo').should('be.visible')
    })
  })
})
```

[Testing an API with Cypress](https://circleci.com/blog/api-testing-with-cypress/)

오늘 할일

장바구니 담기버튼

코드 정리
