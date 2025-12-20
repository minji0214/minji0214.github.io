---
title: "양파같은 서버사이드렌더링 이슈 해결기"
description: "seo meta에 오류가 발생하여 서버사이트렌더링을 디버깅하면서 이슈를 해결한 과정을 기록하였습니다. "
pubDate: "11 18 2024"
heroImage: "/heroImgs/thumb_yangpa.jpeg"
tags: ["FE"]
---
---

### TL;DR

문제 상황

- 상품 상세페이지, 엑스퍼트 메인 등 마켓의 seo가 전반적으로 고장나 있었음.
- authprovider 하위에서 서버사이드 렌더링이 작동하지 않고, 컴포넌트가 클라이언트에서만 실행됨. 
우리는 NextSeo라는 seo를 위한 라이브러리를 사용중이다. 하지만 AuthProvider 하위에서는 NextSeo 컴포넌트가 렌더링 되지 않았다. 

해결 시도

- AuthProvider 내부에 initializing 되었을때만, 하위컴포넌트를 렌더시키도록되어있던 로직을 initializing이 되지 않아도 컴포넌트를 렌더할 수 있도록 수정.
- auth정보는 getInitialprops로 받아옴.
- gnb가 렌더링되는 부분에 있어서 클라이언트에서만 작동하는 useMediaQuery에 대한 디테일한 처리 방식에 대해 고민 필요. 임시로 gnb 영역의 height만 고정해둠.
    - [문제 : 기존의 gnb 렌더링 이슈는 해결되었으나, gnb 모바일, 탭뷰의 전환이 csr에서 실행되어, ssr시에 모바일, 태블릿 해상도에서 pc ui가 노출됨. ](https://www.notion.so/gnb-gnb-csr-ssr-pc-ui-120ba496d7b880338e80c18cbffd9e88?pvs=21)
- seo 공통컴포넌트 내에 metadata가 useState로 작동되던 방식을 props가 바로 적용되도록 수정.

---

### 이슈1. AuthStore와 GNB 렌더링 이슈

1. authStore 하위에서 children을 return, gnb만 initializing 이후에 렌더 

```jsx
	return !isInitializing ? (
		<ReactChannelIO
			pluginKey={CHANNEL_ID_PLUGIN_KEY}
			language="ko"
			autoBoot={CHANNEL_USE_AUTO_BOOT}
			{...(isLoggedIn &&
				user?.id && {
					memberId: `${user.id}`,
					profile: { name: user.displayName },
				})}>
			{children}
		</ReactChannelIO>
	) : (
		<>{children}</> //as-is null
	)
})
```

- 문제 : 로그인 정보는 클라이언트에서 확인되어 gnb에서 상태 reflow가 발생 


1. GNB만 initializing된 이후에 렌더

```jsx
	<WebViewWrapper>
			{!isInitializing && isUseFooter && renderGNB}
			<Content>{children}</Content>
			{isUseFooter && <FooterView />}
		</WebViewWrapper>
```

- 문제 : gnb쪽에서 reflow가 발생.    

1. reflow 개선을 위해 gnb영역의 사이즈를 고정 
- 문제 : 리플로우는 개선되었지만 하위 컨텐츠와의 렌더링 시간차는 여전히 존재..
    - 그러면 컴포넌트 전체를 initializing ? : 페이지 자체가 콜드스타트 처럼 보임. + nextjs를 사용하는것이 의미가 있을까..?


1. 서버사이드에서 유저정보를 받아보자. 

```jsx
MyApp.getInitialProps = async (appContext) => {  
	// calls page's `getInitialProps` and fills `appProps.pageProps`
	const appProps = await App.getInitialProps(appContext)
	const req = appContext.ctx.req
	let auth = req?.auth
	let { cookie } = appContext.ctx.req.headers
	let accessToken = cookie.split(';').find((c) => c.trim().startsWith('accessToken'))
	if (accessToken) {
		accessToken = accessToken.split('=')[1]
		try {
			let response = await getMe(accessToken)
			auth = { ...auth, ...response }
		} catch (e) {}
	}

	return { ...appProps, auth: auth }
}
```

### 해결..!

### 된줄 알았지만

- 문제 : 기존의 gnb 렌더링 이슈는 해결되었으나, gnb 모바일, 탭뷰의 전환이 csr에서 실행되어, ssr시에 모바일, 태블릿 해상도에서 pc ui가 노출됨.
    - 왜 그럴까?
        
        ```jsx
        //solvook-ui-library
          const matchMobile = useMediaQuery(theme.breakpoints.down('sm'));
          const matchDownTablet = useMediaQuery(theme.breakpoints.down('lg'));
        ```
        
        gnb의 반응형은 mui의 useMediaquery로 구현되어 있음. 
        
        https://mui.com/material-ui/react-use-media-query/#server-side-rendering
        
        → 서버에서 해상도를 확인할 수 있는 정보를 보내줘야하는것으로 이해. 
        
        → 디자인시스템의 useMediaquery훅은 서버사이드에서도 사용할 수 있도록 개선작업 필요. 
        
        - 실행시
        
        ```jsx
        const theme = useTheme()
        const matchDownTablet = useMediaQuery(theme.breakpoints.down('lg'))
        console.log('matchDownTablet', matchDownTablet, theme.breakpoints.down('lg'))
        ```
        

        클라이언트
        

        
        이와 관련한 논의들
        
        https://www.reddit.com/r/nextjs/comments/n98d8s/usemediaqueryhook_that_actually_works_with_ssr/
        
        https://dev.to/rakshitnayak/how-to-implement-server-side-rendering-for-material-uis-media-queries-in-nextjs-to-avoid-flash-jpi
        
        https://medium.com/@dwinTech/managing-usemediaquery-hydration-errors-in-next-js-9ecc555542c7
        

1. gnb가 mounted된 이후에 렌더되도록 변경

```jsx
const mounted = useMounted()
	return (
		<WebViewWrapper>
			{mounted && isUseFooter && renderGNB}
```

- 문제 : 리렌더링되는 부분때문에 약간의 깜박임 발생.

    
    - _app.tsx에서 2번 렌더링 되는것을 확인
    - 사용하지 않는 useState가 있어 제거 → 리렌더링 해결. 하지만 깜박임은 여전함.
    - layout 컴포넌트 내에서 useAuth() 훅 실행중 → serversideprops로 받아오기 때문에 제거 → 깜박임 해결

1. reflow를 최소화하기 위해 height고정. 
    
    ```jsx
    	const renderGNB = useMemo(() => {
    		if (!mounted) return <SkeletonGNB/>
    		if (goodNotesPage) return <GoodnotesGNB />
    		if (expertPage) return <ExpertGNB />
    		return <MarketGNB />
    	}, [mounted, pathname])
    ```
    

csr 버전

1. 결론 )  
    - 초기 서버사이드 렌더링시 보여줄 수있는 `<SkeletonGNB/> ` 를 생성하여 reflow를 최소화
- useMediaQuery를 수정 어떻게?
    - mui 훅 대신 css방식으로 변경
    - 혹은 링크에서 제안하는 방식처럼 useMediaQuery를 서버에서도 사용가능하게 개선
        - https://dev.to/rakshitnayak/how-to-implement-server-side-rendering-for-material-uis-media-queries-in-nextjs-to-avoid-flash-jpi
    - 혹은 서버사이드를 지원하는 mediaquery 라이브러리 사용
        - https://medium.com/@dwinTech/managing-usemediaquery-hydration-errors-in-next-js-9ecc555542c7

---

### 이슈2. SEO 컴포넌트

- expert component까지 ssr 적용확인.

### 해결..!

### 된줄 알았지만

- 문제 : meta는 적용되지 않음.

- SEO 공통컴포넌트가 아닌, next-seo 컴포넌트 사용시 meta 적용 확인
    
- SEO 컴포넌트 내에서 props로 전송된 meta data가 useState와 useEffect로 변경되는로직으로 확인. 서버사이드에서 nextSeoOptions는 빈객체

```jsx
const SEO = (props: SEOProps) => {
	console.log('SEO props',props)
	const [nextSeoOptions, setNextSeoOptions] = useState<NextSeoProps>({})

	useEffect(() => {
	//....생략
		setNextSeoOptions(transformedProps)
	}, [props])
	console.log('nextSeoOptions', nextSeoOptions)
```

- useEffect에서 props를 변경해 주는 방식이 아닌, 바로 변수를 할당하는 식으로 변경 : 서버사이드 렌더링 시에는 매 요청마다 HTML을 생성하기 때문에 별도의 메모이제이션이나 최적화가 필요하지 않음. props가 변경되면 재렌더링이 되기 때문에 강제로 useState를 사용하지 않아도 될거같다고 판단.

```jsx
const SEO = (props: SEOProps) => {
	const openGraph = _.pickBy(
		{
			url: props.ogUrl,
			title: props.ogTitle,
			description: props.ogDescription,
			images: _.identity(props.ogImage) ? [{ url: props.ogImage }] : undefined,
		},
		_.identity,
	)
	const transformedProps = _.pickBy(
		{
			title: props.title,
			description: props.description,

			additionalMetaTags: _.identity(props.keywords)
				? [
						{
							name: 'keywords',
							content: props.keywords,
						},
				  ]
				: undefined,
			openGraph: _.isEmpty(openGraph) ? undefined : openGraph,
		},
		_.identity,
	)
	return <NextSeo {...transformedProps} />
```

### 진짜 해결!

---

### 남은 개선 작업

- 디자인 시스템의 useMediaQuery가 ssr에서도 작동하도록 개선
- 검색 input의 placerholder관련 api도 serversideprops로 변경한다면 초기 렌더링 경험을 더욱 개선할 수 있지 않을까?

---

참고자료 

- https://develogger.kro.kr/blog/LKHcoding/133
- [왜 getinitialprops를 사용했을까](https://velog.io/@suyeon9456/getInitialProps-vs-getServerSideProps)

https://wnsdufdl.tistory.com/524

https://davidhwang.netlify.app/TIL/(0320)nextjs에서-next-cookies-사용-이슈/