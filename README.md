# 같은 속도 같은 방향으로 나아가는 방법 <br/> ![CHECKMATE (2)](https://github.com/user-attachments/assets/998d6239-d1e7-4e4d-a7af-60671f9b585f)


![Screenshot 2024-09-12 at 17 06 15](https://github.com/user-attachments/assets/a1b10e99-b0e3-42bc-b724-6a54c3a4cbf2)

<br />

### 서비스 소개

- $\mathrm{\bf{\color{#10B981}체크메이트}}$는 투두리스트를 기반으로 한 협업 툴입니다. 소울메이트처럼 작업을 체크하며 함께 목표를 완성해나가는 동료라는 의미에서, '**체크메이트**'라는 이름이 탄생했습니다. 업무를 세분화 해 맡은 일을 명확히 하고, 팀의 목표 달성도를 시각화하여 함께 성장할 수 있도록 설계된 협업 환경을 제공합니다.

- 매일 들어와서 작업을 확인해야 하는 사이트의 특성상, 시각적으로 편안한 느낌을 주기 위해 안정감과 차분함이 느껴지는 색감으로 구성되어 있습니다. 메인 컬러인 $\mathrm{\bf{\color{#10B981}그린}}$은 체크메이트가 추구하는 조화로운 협업, 성장 가능성을 상징합니다.

#### 서비스 링크

<https://checkmate-645.netlify.app/>

<br />

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
- `PR`은 최소 2명의 승인이 있어야 병합 가능하며, 급하지 않다면 4명 모두 승인한 뒤 병합하도록 합니다.

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

![image](https://github.com/user-attachments/assets/3348f099-60d2-44c9-b268-e3d88f7c86a5)

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

### 1. 랜딩페이지
- 서비스에서 제공하는 기능을 소개합니다.
- 상호작용 가능한 요소를 추가하여 체크메이트가 할 일 완성도를 시각화하는 방식을 보여줍니다.

### 2. 회원가입/로그인 페이지
- 사용자 정보를 `zustand`를 이용해 전역적으로 관리합니다.

### 3. 비밀번호 재설정 페이지
- 사용자가 비밀번호를 잊었을 때, 이메일로 비밀번호 재설정 링크를 전송하여 계정을 복구할 수 있습니다.

### 4. 계정관리 페이지
- 사용자가 자신의 이름, 프로필 이미지, 비밀번호를 수정할 수 있습니다.

### 5. 내 대시보드 페이지
- 사용자가 소속된 팀과 초대받은 팀 목록을 보여줍니다.

### 6. 마이 히스토리 페이지
- 현재까지 완료한 할 일을 타임라인 형식으로 확인할 수 있습니다.

### 7. 팀 대시보드 페이지
- 팀의 오늘 할 일, 완료된 일, 진행 상황을 확인할 수 있습니다.
- 할 일 목록을 생성하고 드래그 앤 드랍으로 순서를 변경할 수 있습니다.
- 관리자는 다른 사용자를 초대할 수 있습니다.

### 8. 할 일 목록 페이지
- 할 일을 생성하고 완료할 수 있습니다.
- 할 일은 드래그 앤 드랍으로 순서 변경이 가능하며, 클릭 시 상세보기를 할 수 있습니다.
- 할 일 상세보기에서는 할 일의 내용을 수정하고 댓글을 작성할 수 있습니다.

### 9. 자유게시판 페이지
- 작성된 글을 카테고리별로 확인할 수 있으며, 게시글의 제목을 검색할 수 있습니다.

### 10. 게시글 작성 페이지
- [팀원](https://github.com/Sombian)이 제작하고 배포한 마크다운 라이브러리 [@sombian/markdown](https://github.com/Sombian/markdown)을 사용하여 게시글 작성 페이지를 제작했습니다.

### 11. 게시글 상세 페이지
- 작성된 글의 내용을 확인하고, 댓글을 달 수 있습니다.
- 게시글과 댓글을 수정하거나 삭제할 수 있는 기능이 있습니다.

<br/>

## 서비스 개선 사항

### 랜딩페이지 개선

- 기존 랜딩페이지는 단순히 사이트를 소개하는 역할만 했기 때문에, 초기에 유입된 트래픽을 실제 고객으로 전환시키기 위한 방안이 필요했습니다.
- 이를 위해 **상호작용 가능한 요소**를 추가하여 사용자가 어떻게 업무 완성도를 **시각적 데이터로 확인**할 수 있는지 직관적으로 이해할 수 있도록 개선했습니다.

### 초대 기능 개선

- 기존 초대 기능은 사용자가 초대 페이지에 토큰을 입력하여 팀에 참가하는 방식이었지만, 토큰이 노출되는 문제를 해결하기 위해 개선이 필요했습니다.
- 이를 해결하기 위해 MongoDB Atlas를 이용하여 초대 정보를 저장하는 DB를 구축하고, Next.js API를 통해 기존 서버의 팀 정보를 바탕으로 초대 링크를 생성하거나 특정 사용자를 초대할 수 있도록 만들었습니다.
- 초대 링크는 UUID를 기반으로 SHA-256 해시를 생성한 후, 8자리로 잘라서 키를 생성하여 DB에 기존 토큰과 함께 저장합니다. 초대 링크는 `checkmate-645.netlify.app/join-team/key` 형식으로 제공되며, 키를 통해 토큰을 매칭하여 초대 정보를 확인할 수 있게 합니다. 사용자가 해당 링크에 접속하면 초대를 수락하거나 거절할 수 있습니다.

### 튜토리얼 기능 추가

- 드래그앤드랍, 마크다운 등 **특정 기능을 사용자가 직접 찾아보지 않으면 알기 어렵다는 문제**가 있었습니다.
- 이를 해결하기 위해 튜토리얼 기능을 추가하여, **페이지에 처음 진입할 때 주요 기능과 사용 방법을 설명하도록 개선**했습니다. 튜토리얼은 최소한의 사용 시 리마인드 이외에는 동작하지 않도록 설정했습니다.

### 자유게시판 및 게시글 작성 기능 개선

- 기존 자유게시판은 최신순, 인기순 정렬 기능만을 가지고 있어서 커뮤니티의 느낌을 살리기에는 부족함이 있었습니다. 이것을 개선하기 위해 **카테고리를 나눠 글을 작성할 수 있는 기능을 추가**했습니다.
- 여러 카테고리의 글을 작성할 수 있는 만큼 게시글을 작성할 때 다양한 방식으로 글을 작성할 수 있는 수단이 필요했습니다. 이에 [팀원](https://github.com/Sombian)이 제작하고 배포한 마크다운 라이브러리 [@sombian/markdown](https://github.com/Sombian/markdown)을 사용하여 게시글 작성 페이지를 새롭게 구성했습니다. 이를 통해 사용자들이 더욱 풍부한 형식의 글을 작성할 수 있게 되었습니다.

### 디자인 수정

- 프로젝트의 차별성을 강조하기 위해, 같은 프로젝트를 진행 중인 다른 팀과는 차별화된 디자인이 필요하다고 판단했습니다. 이에 따라 전체적인 디자인을 수정하여 UI/UX을 전면적으로 개선했습니다.
- 이 과정에서 사용자 흐름을 고려한 레이아웃 재구성, 색상 및 타이포그래피 조정, 인터랙티브 요소 추가 등을 통해 사이트의 시각적 일관성을 높이고, 보다 직관적이고 매력적인 디자인을 구현했습니다. 이를 통해 사용자들이 사이트를 이용하는 동안 더 나은 경험을 할 수 있도록 하였습니다.

<br/>

## 팀원 소개

| <img src="https://github.com/user-attachments/assets/6634fb50-ed04-4315-ac85-231a80352ed3" alt="y" width="150" height="150"> | <img src="https://github.com/user-attachments/assets/814dc111-20bd-43af-8ecd-65bb9d01eb00" alt="KakaoTalk_20240827_220338667_02" width="150" height="150"> | <img src="https://github.com/user-attachments/assets/7ecb6f7d-892c-4597-a795-9ecad61d33e1" alt="KakaoTalk_20240827_220338667_03" width="150" height="150"> | <img src="https://github.com/user-attachments/assets/c7a6e078-d851-4976-b457-616ed0f55fbe" alt="KakaoTalk_20240827_220338667_01" width="150" height="150"> | <img src="https://github.com/user-attachments/assets/d4014af2-2052-407d-aafa-0f2bc911458d" alt="KakaoTalk_20240827_220338667_04" width="150" height="150"> |
| :------------------------------------: | :------------------------------------: | :------------------------------------: | :------------------------------------------: | :------------------------------------: |
|                 유예하                 |                 정민재                 |                 김유정                 |                    임진조                    |                  최건                  |
| [@YehaYoo](https://github.com/YehaYoo) | [@wjsdncl](https://github.com/wjsdncl) | [@Kimyu94](https://github.com/Kimyu94) | [@Sparrowlim](https://github.com/Sparrowlim) | [@Sombian](https://github.com/Sombian) |
|              팀 대시보드               |              소셜 로그인               |            로그인, 회원가입            |                 Drag & Drop                  |             마이 히스토리              |
|            Dropdown          |            비밀번호 재설정             |                계정관리                |                리스트 페이지                 |        자유게시판 / 게시글 등록        |
|               컨셉 및 디자인 변경              |           버튼 / 헤더 컴포넌트           |            자유 게시판 상세            |                   Sidebar                    |      DatePicker / Popover <br/> / Form / API       |
|                 |             초대 기능 개선             |            Message 컴포넌트            |                    Modal                     |                튜토리얼                |
