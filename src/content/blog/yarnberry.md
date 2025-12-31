---
title: "yarn berry 맛있는 베리"
description: "yarn에서 yarn2로 전환기"
pubDate: "11 10 2023"
tags: ["FE"]
---

yarn berry를 이용하여 초기세팅을 하면서 알게된 점들을 정리하였습니다.

1. yarn berry로 next세팅 하기

- **사용 이유**

  - zero-install : git으로 의존성 관리
  - node modules의 단점 해결: 유령의존성 해결, 중복설치방지

- **설치 방법**

  nextjs typescript설치후

  - 기존 node module파일과, package.lock.json파일 제거

  ```bash
  rm -rf node_modules
  rm -rf package.lock.json
  ```

  - yarn berry로 변경

  ```bash
  yarn set version berry
  ```

  yarnrc.yml파일, .yarn 폴더 > yarn-(버전명).cjs 생성됨.

  - pnp 사용을 위해 .yarnrc.yml 파일의 nodeLinker를 node modules에서 pnp로 변경

  ```bash
  nodeLinker: pnp
  ```

  - yarn install

  ```bash
  yarn install
  ```

  - .gitignore추가 (!중요!)

  ```bash
  .yarn/*
  !.yarn/cache
  !.yarn/patches
  !.yarn/plugins
  !.yarn/releases
  !.yarn/sdks
  !.yarn/versions
  ```

- **참고 문서**

  [[yarn berry + vscode] yarn berry 적용 방법 (with vscode setting)](https://kimyanglogging.tistory.com/8)

  [yarn2와 함께 PnP(Plug'n'Play)를 적용해보자. (feat. Typescript)](https://velog.io/@altmshfkgudtjr/yarn2와-함께-Plug-n-Play를-적용해보자)

  설정 관련

  [Settings (.yarnrc.yml) | Yarn](https://yarnpkg.com/configuration/yarnrc)

- **기타**
  @Moldy (몰디) eslint와 prettier설정 필요
  yarn berry의 plug n play 방식으로 IDE에서 eslint파일을 찾지 못하는 오류가 발생.
  (vscode는 sdk 설치 필요)
  [yarn berry 환경에서 WebStorm, Actions on save 사용하기 (prettier, eslint)](https://memostack.tistory.com/287)
  [](https://youtrack.jetbrains.com/issue/WEB-57519)

### 나의 의문

왜 node modules로 설치하고, 그걸 다시 제거하는 작업을 하지?

처음부터 설치할수는 없을까 ??

그렇게 해서 알게된…..

[yarn2로 next.js 프로젝트 만들기](https://velog.io/@juunini/yarn2로-next.js-프로젝트-만들기)

nextjs manual setup을 하면됨.

그럼 node modules를 까는 시간을 줄일 수 있다.

여기서 yarn berry의 단점이 있었나요?

yarn berry말고 다른 선택지도 있나요?

그것은 pnpm

[Yarn 대신 pnpm으로 넘어간 3가지 이유](https://engineering.ab180.co/stories/yarn-to-pnpm)
