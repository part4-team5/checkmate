# Checkmate

![Screenshot 2024-09-11 at 15 47 09](https://github.com/user-attachments/assets/3496eb75-e6cb-4851-a3a7-8884aa7edb54)

#### 서비스 링크

<https://checkmate-645.netlify.app/>

## 목차

- [기술 스택](#기술-스택)
- [개발 환경](#개발-환경)
- [개발 기간](#개발-기간-20240725--20240901)
- [팀 규칙](#팀-규칙)
- [프로젝트 폴더 구조](#프로젝트-폴더-구조)
- [서비스 상세설명](#서비스-상세설명)
- [팀원 소개](#팀원-소개)

<br />

## 기술 스택

### 개발

<div>
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/next.js-black?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/tailwind_css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</div>

<div>
<img src="https://img.shields.io/badge/fetch-5A29E4?style=for-the-badge&logo=fetch&logoColor=white" />
<img src="https://img.shields.io/badge/react_query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />
<img src="https://img.shields.io/badge/zustand-F66E2D?style=for-the-badge&logo=zustand&logoColor=white" />
</div>

<br/>

## 개발 환경

### 브랜치 전략

`trunk-based` 브랜치 전략을 사용합니다. main, feature를 사용합니다.
<img src="https://media.licdn.com/dms/image/v2/D5612AQHnZaW2J3bcuw/article-inline_image-shrink_1500_2232/article-inline_image-shrink_1500_2232/0/1678254186792?e=1730937600&v=beta&t=k0K7ZcM8gYc_Lrfdi6AkLV320lsE9SvEixm1iwu2qsU"/>

#### 브랜치 종류

- main: 배포를 위한 브랜치 (feature -> PR -> main)
- feature: 기능을 개발을 위한 브랜치

#### 브랜치 관리 전략

- `main`은 `feature`에서 `PR`을 생성하는 방식으로 변경사항을 반영합니다.
- `feature`는 `main`을 base로 `feature/{기능이름}`으로 브랜치를 생성합니다.
- `feature`에서 목표한 작업이 끝나면 `main`으로 `PR`을 생성하는 방식으로 변경사항을 반영하며, `squash and merge`로 병합합니다.
- `PR`은 최소 1명의 승인이 있어야 병합 가능하며, 급하지 않다면 4명 모두 승인한 뒤 병합하도록 합니다.

### 커밋 컨벤션

- commitlintrc설정을 지킵니다.  
   `유형: 제목`의 형식을 준수합니다. (body, footer는 선택적으로)

  ```
  ✨ feat : 새로운 기능 추가
  🐛 fix : 버그 수정
  ♻️ refactor : 코드 리팩토링
  💄 style : 코드 의미에 영향을 주지 않는 변경사항(CSS 수정)
  ⚠️ dependency: 라이브러리 설치, 의존성 버전 변경
  ```

### 코드 컨벤션

- 기본적으로는 `린터`와 `프리티어` 설정에 맞춥니다.
- 컴포넌트 함수는 함수 선언식으로, 이외 모든 함수는 화살표 함수 표현식으로 작성합니다.

<br />

## 개발 기간 (2024.07.25. ~ 2024.09.01.)

#### 프로젝트 기획 회의 : 2024.07.25. ~ 2024.07.26.

- 규칙 정리(팀 규칙, 코드 컨벤션, 커밋 컨벤션, 브랜치 전략 등)
- 프로젝트 선정, 기술 스택 선정
- 프로젝트 초기 설정(Git repo 생성, 각종 설정 완료 및 배포)
- 유저플로우 분석 후 우선순위 설정

#### 스터디 : 2024.07.27. ~ 2024.07.29.

- Next.js App Router
- zustand
- 컴파운드 컴포넌트 패턴
- Class 컴포넌트

#### 공통 컴포넌트 제작 : 2024.07.29. ~ 2024.08.01.

#### 중간 점검 #1 : 2024.08.14.

#### 중간 점검 #2 : 2024.08.20.

#### 중간 점검 #3 : 2024.08.22.

#### 디자인 변경 및 리팩토링 : 2024.08.24. ~ 2024.08.26.

#### 최종 점검 : 2024.08.27.

<br />

## 팀 규칙

- 오전 10시에 데일리 스크럼을 진행합니다.
- 오후 1시 ~ 오후 6시는 코어타임을 진행하여 빠른 의사소통이 가능하도록 합니다.
- 오후 1시 ~ 2시는 PR 리뷰를 진행합니다.

<br />

## 프로젝트 폴더 구조

```
checkmate
├─ app/
│  ├─ (auth)/               // 인증 관련 페이지
│  │  ├─ login/
│  │  │  ├─ google/         // 구글 소셜 로그인 페이지
│  │  │  └─ kakao/          // 카카오 소셜 로그인 페이지
│  │  ├─ reset-password/
│  │  └─ signup/
│  ├─ (board)/              // 자유게시판 관련 페이지
│  │  ├─ boards/
│  │  │  └─ [id]/
│  │  └─ create-post/
│  ├─ (team)/               // 팀 관련 페이지
│  │  ├─ create-team/
│  │  │  └─ components/     // 페이지 종속 컴포넌트
│  │  ├─ get-started/
│  │  ├─ join-team/
│  │  │  └─ [key]/
│  │  └─ [id]/
│  │     └─ todo/
│  ├─ (user)/               // 유저 관련 페이지
│  │  ├─ my-history/
│  │  └─ my-page/
│  ├─ _api/                 // API
│  │  └─ _models/           // API 모델
│  ├─ _components/          // 공용 컴포넌트
│  ├─ _hooks/               // 커스텀 훅
│  ├─ _icons/               // svg 아이콘
│  ├─ _store/               // 전역 상태관리
│  ├─ _utils/               // 유틸리티 함수
│  ├─ page.tsx              // 루트 페이지 컴포넌트
│  └─ layout.tsx            // 전체 앱의 레이아웃 컴포넌트
└─ public/
   ├─ icons/
   └─ images/
```

<br/>

## 서비스 상세설명

| 랜딩페이지 |
| :--------: |
|![image](https://github.com/user-attachments/assets/7b56d54c-35d7-4ff6-9aae-30b16f9bf4be)|

| 회원가입 | 로그인 |
| :------: | :----: |
|![image](https://github.com/user-attachments/assets/fab3f801-b40c-4518-a11d-0fc8b6d419b2)|![image](https://github.com/user-attachments/assets/5ab72886-ae48-4e3f-a0c2-7053a447ebec)|

| 비밀번호 재설정 | 계정관리 |
| :-------------: | :------: |
|![image](https://github.com/user-attachments/assets/88c0f3ed-1952-4948-bd3d-8fd3c5c44f76)|![image](https://github.com/user-attachments/assets/19ce6900-b264-491a-ba61-8a18c5897595)|

| 내 대시보드 | 마이 히스토리 |
| :---------: | :-----------: |
|![image](https://github.com/user-attachments/assets/dfde2a38-d0b6-4974-8c0f-8e7aa43d9871)|![image](https://github.com/user-attachments/assets/7d398b61-86bf-49c8-847e-350cc4d4d566)|

| 팀 생성 | 팀 참가 |
| :-----: | :-----: |
|![image](https://github.com/user-attachments/assets/361e01fe-864f-489b-8138-6bdd1506cd60)|![image](https://github.com/user-attachments/assets/a4abb46f-aae8-45d5-8122-899bda494f8b)|

| 팀 대시보드 | 할 일 목록 | 할 일 상세보기 |
| :---------: | :--------: | :------------: |
|![image](https://github.com/user-attachments/assets/a3f8e482-e477-4032-9dd3-a803593f1a23)|![image](https://github.com/user-attachments/assets/3aa06516-5485-444c-a041-b64f34dd61bf)|![image](https://github.com/user-attachments/assets/cd140065-7994-42f7-822a-a21f594e78a8)|

| 자유게시판 | 게시글 작성 | 게시글 상세 |
| :--------: | :---------: | :---------: |
|![image](https://github.com/user-attachments/assets/108ed62c-89e8-4beb-a377-cc5c12fa0f94)|![image](https://github.com/user-attachments/assets/49884b17-b83a-4c9f-8a83-d028b0599419)|![image](https://github.com/user-attachments/assets/5c21c07b-5c31-4791-a3c6-8874049d8259)|

#### 1. 랜딩페이지

- 서비스에서 제공하는 기능을 소개합니다.
- 상호작용 가능한 요소를 추가하여 할 일 완성도를 시각적으로 보여줍니다.

#### 2. 회원가입/로그인 페이지

- 사용자 정보를 zustand를 이용해 전역적으로 관리합니다.

#### 3. 비밀번호 재설정 페이지

- 사용자가 계정의 비밀번호를 잊어버린 경우 사용자의 이메일로 비밀번호 재설정 링크를 전송합니다.

#### 4. 계정관리 페이지

- 사용자의 이름, 프로필 이미지, 비밀번호를 수정할 수 있습니다.

#### 5. 내 대시보드 페이지

- 사용자가 소속된 팀과 초대받은 팀 목록을 보여줍니다.

#### 6. 마이 히스토리 페이지

- 현재까지 완료한 할 일을 시각적으로 볼 수 있습니다.

#### 7. 팀 대시보드 페이지

- 팀의 오늘 할 일과 한 일 그리고 진행 상황 확인할 수 있습니다.
- 할 일 목록을 생성할 수 있습니다.
- 할 일 목록은 드래드 앤 드랍으로 순서 변경이 가능합니다.
- 관리자는 다른 사용자를 초대할 수 있습니다.
  - MongoDB Atlas를 이용해서 초대 정보를 저장하는 DB를 만들고 Next.js API로 기존 서버의 팀 정보를 바탕으로 초대 링크를 만들거나 특정 사용자를 초대할 수 있게 만들었습니다.

#### 8. 할 일 목록 페이지

- 할 일을 생성하고 완료할 수 있습니다.
- 할 일은 드래그 앤 드랍으로 순서 변경이 가능합니다.
- 할 일을 클릭하면 할 일 상세보기가 가능합니다.
- 할 일 상세보기에서는 댓글을 달 수 있습니다.

#### 9. 자유게시판 페이지

- 자유게시판 페이지는 작성한 글을 카테고리 별로 확인할 수 있습니다.
- 찾고싶은 게시글의 제목을 검색할 수 있습니다.

#### 10. 게시글 작성 페이지

- @sombian/markdown 팀원이 제작, 배포한 마크다운 라이브러리를 사용하여 게시글 작성 페이지를 제작했습니다.

#### 11. 게시글 상세 페이지

<br/>

## 팀원 소개

<table style="width: 100%;">
  <tr>
    <td style="text-align: center;">
      <img src="https://github.com/user-attachments/assets/6634fb50-ed04-4315-ac85-231a80352ed3" width="160" height="160" />
    </td>
    <td style="text-align: center;">
      <img src="https://github.com/user-attachments/assets/814dc111-20bd-43af-8ecd-65bb9d01eb00" width="160" height="160" />
    </td>
    <td style="text-align: center;">
      <img src="https://github.com/user-attachments/assets/7ecb6f7d-892c-4597-a795-9ecad61d33e1" width="160" height="160" />
    </td>
    <td style="text-align: center;">
      <img src="https://github.com/user-attachments/assets/c7a6e078-d851-4976-b457-616ed0f55fbe" width="160" height="160" />
    </td>
    <td style="text-align: center;">
      <img src="https://github.com/user-attachments/assets/d4014af2-2052-407d-aafa-0f2bc911458d" width="160" height="160" />
    </td>
  </tr>
  <tr>
    <td style="text-align: center;">유예하</td>
    <td style="text-align: center;">정민재</td>
    <td style="text-align: center;">김유정</td>
    <td style="text-align: center;">임진조</td>
    <td style="text-align: center;">최건</td>
  </tr>
  <tr>
    <td style="text-align: center;"><a href="https://github.com/YehaYoo">@YehaYoo</a></td>
    <td style="text-align: center;"><a href="https://github.com/wjsdncl">@wjsdncl</a></td>
    <td style="text-align: center;"><a href="https://github.com/Kimyu94">@Kimyu94</a></td>
    <td style="text-align: center;"><a href="https://github.com/Sparrowlim">@Sparrowlim</a></td>
    <td style="text-align: center;"><a href="https://github.com/Sombian">@Sombian</a></td>
  </tr>
  <tr>
    <td style="text-align: center;">팀 대시보드</td>
    <td style="text-align: center;">소셜 로그인</td>
    <td style="text-align: center;">로그인, 회원가입</td>
    <td style="text-align: center;">Darg & Drop</td>
    <td style="text-align: center;">마이 히스토리</td>
  </tr>
  <tr>
    <td style="text-align: center;">(Tasks/Report/Members)</td>
    <td style="text-align: center;">비밀번호 재설정</td>
    <td style="text-align: center;">계정관리</td>
    <td style="text-align: center;">리스트 페이지</td>
    <td style="text-align: center;">자유게시판 / 게시글 등록</td>
  </tr>
  <tr>
    <td style="text-align: center;">Dropdown</td>
    <td style="text-align: center;">버튼/헤더 컴포넌트</td>
    <td style="text-align: center;">자유 게시판 상세</td>
    <td style="text-align: center;">Sidebar</td>
    <td style="text-align: center;">DatePicker/Popover/Form/API</td>
  </tr>
  <tr>
    <td style="text-align: center;">컨셉 및 디자인 변경</td>
    <td style="text-align: center;">초대 기능 개선</td>
    <td style="text-align: center;">Message 컴포넌트</td>
    <td style="text-align: center;">Modal</td>
    <td style="text-align: center;">튜토리얼</td>
  </tr>
</table>
