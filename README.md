# HwpxTemplater Sample

<img width="861" height="512" alt="Image" src="https://github.com/user-attachments/assets/60c475e3-0a04-4703-b4a4-d5f04de11b40" />

## 1. 개요

### About

**한글 문서 자동화의 필요성, HWPX 템플릿 엔진 데모 서비스**

- 국내 공공기관 및 기업에서 널리 사용되는 HWP/HWPX 문서 생성 관련 API 수요 존재
- 하지만 주로 국내 위주로 사용하는 HWP/HWPX 특성상 이를 조작하는 라이브러리가 적었음. 
- **hwplib, hwpxlib**를 통해 HWP/HWPX 파일을 광범위하게 조작할 수 있지만 저수준 api 특성상 학습곡선이 높다는 문제가 있음 
- **docxtemplater, poi-tl** 두 라이브러리를 모델로 HWPX 템플릿 엔진을 만들고, 이에 관한 샘플 데모 서비스를 만듦
- 웹 기반 데모로 사용자가 직접 템플릿에 기입될 데이터를 수정하여 다운로드 결과를 확인할 수 있음

### Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend                                │
│  ┌──────────┐  ┌────────────┐  ┌───────────┐  ┌──────────────┐  │
│  │ React 19 │  │ TypeScript │  │  Vite 7   │  │ Tailwind CSS │  │
│  └──────────┘  └────────────┘  └───────────┘  └──────────────┘  │
│  ┌────────────────┐  ┌───────────────┐  ┌─────────────────────┐ │
│  │ Monaco Editor  │  │ Bootstrap Icons│  │      Sonner        │ │
│  └────────────────┘  └───────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ REST API
┌─────────────────────────────────────────────────────────────────┐
│                          Backend                                 │
│  ┌──────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────┐  │
│  │ Java 17  │  │ AWS Lambda │  │  AWS SAM   │  │ API Gateway │  │
│  └──────────┘  └────────────┘  └────────────┘  └─────────────┘  │
│  ┌────────────────────┐  ┌────────────────────────────────────┐ │
│  │   HwpxTemplater    │  │          Jackson 2.19              │ │
│  └────────────────────┘  └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 특징

### Front-end

<img width="319" height="431" alt="Image" src="https://github.com/user-attachments/assets/741fca01-452f-4367-8072-d5cb5c22df34" />

<img width="319" height="431" alt="Image" src="https://github.com/user-attachments/assets/35a37f63-5307-4893-8128-7317fb03ef92" />

- 샘플 인덱스 페이지는 카드로 구성. 개별 카드 클릭시 개별 샘플 확인 가능.
- 개별 샘플은 세 가지 레이어로 구성됨 
  * 왼쪽은 템플릿 파일 미리보기 이미지로 구성. 최상단 오른쪽 확대 버튼 클릭시 이미지 확대하여 볼 수 있도록 처리함.
  * 중앙은 `HWPXTemplater` API를 서버사이드에서 어떻게 세팅하는지 모나코 에디터로 가시화. 
    템플릿 데이터 입력란 클릭시 input을 띄워 사용자가 데이터를 직접 수정해볼 수 있도록 처리함.
  * 오른쪽은 파일 다운로드 버튼으로 구성. 확장자가 hwpx가 아닌 경우 다운로드를 제한하도록 처리.

### Infrastructure
- 간결한 백엔드 특성상 비용효율적인 측면에서나 가용성 측면에서나 굳이 웹서비스를 EC2로 띄울 이유가 없다고 판단함
- 프런트엔드의 경우 S3 정적 사이트로 배포하여 비용을 최소한으로 절감하고 내구성, 가용성도 향상시킴 
- 백엔드는 API가 적고 15분 이내 시간이 오래 걸리지 않는 동작을 수행함. 따라서 AWS Lambda 서버리스 + API Gateway로 띄워 비용을 줄이고, 가용성을 높이며, 서버 관리 오버헤드도 줄임.
- HTTPS를 지원하기 위해 CloudFront를 S3 앞단에 배치하고, ACM(AWS Certificate Manager)으로 SSL/TLS 인증서 발급하고 관리하도록 설정
- Route 53 통해 커스텀 도메인 연결

---

## 3. 겪은 문제

### 자바 라이브 샘플 구현 문제 
**문제**
- Stackblitz, CodeSandbox처럼 프론트엔드 코드를 브라우저에서 바로 실행할 수 있는 라이브 샘플 구현을 고민
- 하지만 HwpxTemplater는 서버사이드(Java)에서 동작하는 라이브러리 특성상 브라우저에서 직접 실행 불가
- 사용자가 Java 코드를 작성하면 서버로 전송하여 동적으로 실행하는 방안 검토
- 보안 측면에서 임의의 Java 코드를 서버에서 실행하는 것은 심각한 취약점 (RCE 위험)
- 샌드박스 환경 구축도 복잡도가 높고 완벽한 격리 보장 어려움

**해결**
- 정적 코드 샘플을 Monaco Editor로 표시하고, 실제 실행은 기존 API 엔드포인트를 통해 처리
- 사용자가 템플릿 파라미터만 수정하여 결과를 확인할 수 있도록 구성. 사용자 데이터는 서버에 json으로 전송.
- 라이브 코드 실행 대신 "코드 보기 + 파라미터 수정 + 결과 다운로드" 플로우로 대체


### HWPX 파일 다운로드 시 Base64 인코딩 문제

**문제**
- HWPX 파일을 다운로드했을 때 프로덕션 환경에서만 파일이 손상 파일로 열리고 내용이 base64 문자열로 표시되는 현상이 발생함
- 처음에는 `template.yaml`의 BinaryMediaType을 "~*"로 설정하여 모든 MIME 타입을 바이너리로 처리하도록 해결
- 다만 이런 모호한 처리는 앞으로 모든 MIME 타입을 바이너리로 처리하도록 설정한다는 의미라 차후의 유지보수성을 따져보건대 좋은 코드라 보기 힘듦

**해결**

```yaml
BinaryMediaType:
        - application/hwp+zip
        - application/octet-stream
```

```js
const response = await fetch(`${import.meta.env.VITE_API_URL}/${cardData[selectedCardIndex].api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/hwp+zip' // Request 헤더에도 Accept를 설정해줘야 함
    },
    body: JSON.stringify(data)
})
```

- `BinaryMediaTypes`에만 `application/hwp+zip`를 설정해줬을 때 동작하지 않아 확인해보니, 요청 헤더에 `Accept`를 `application/hwp+zip`로 함께 설정하지 않은 게 문제였음
- `API Gateway`는 요청 헤더의 `Accept` 값을 `BinaryMediaType`과 비교하여 응답을 바이너리로 처리할지 텍스트로 처리하는지 결정하는데, `Accept`가 없다보니 `BinarayMediaType` 상관없이 응답이 텍스트로 처리되고 있었음
- 따라서 프런트에도 똑같이 `Accept`를 설정하여 이슈 해결함. `application/hwp+zip`은 HWPX 파일의 실제 MIME 타입 참고. 파일을 zip으로 압축 해제했을 때 확인할 수 있음

### Lambda Cold Start로 인한 다운로드 성능 문제

**문제**
- AWS Lambda는 요청이 없으면 컨테이너를 내리기 때문에, 처음 호출되거나 오랜만에 호출될 경우 컨테이너를 새로 올리는 Cold Start가 발생함
- 이로 인해 초기 응답 속도가 느려 다운로드 성능이 저하되는 문제가 있음

**해결**

- 기존에는 API마다 별도의 Lambda 함수를 사용했으나, 하나의 함수로 통합함. Cold Start 자체를 해결하진 않지만, 여러 API가 하나의 컨테이너를 공유하므로 컨테이너가 내려가는 빈도를 줄일 수 있음. (예를 들어 basic api 호출이 오래 이뤄지고 있지 않아도 condition api가 호출되면 컨테이너가 내려가지 않음.)
- 근본적 해결책은 프로비저닝된 동시성 적용이나, 월 $20 이상의 추가 비용이 발생함. API 호출 빈도가 낮아 비용 대비 효과가 적다고 판단하여 적용하지 않음

## 템플릿 파일을 repository 내부에서 관리할 때 협업 효율성 저하 및 배포 비효율 문제

**문제**

- 처음에는 템플릿 파일을 repository 내부에 포함시키고 사용하도록 처리했으나
  1) 실무에서 이러한 템플릿 파일의 편집자는 보통 개발자가 아님. repository 내부에 파일을 넣으면 매번 개발자가 파일을 받아 교체해야 할텐데 업무 구조상 상당히 비효율적임.
  2) 템플릿 파일을 교체할 때마다 서버가 재배포됨
 
**해결**

<img width="252" height="347" alt="AWS S3" src="https://github.com/user-attachments/assets/08546817-e1ec-464b-b27b-61788289b8e9" />

<br/>

```java
public static Path getTmpResourcePath(String fileName) throws IOException, NoSuchKeyException {
    Path base = Paths.get("/tmp");
    Path target = base.resolve(fileName).normalize();

    if (!target.startsWith(base)) throw new IllegalArgumentException("Invalid fileName");
    if (target.getParent() != null) Files.createDirectories(target.getParent());


    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(S3_BUCKET_NAME)
            .key(fileName)
            .build();

    ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObject(
            getObjectRequest,
            ResponseTransformer.toBytes()
    );

    Files.write(target, objectBytes.asByteArray(),
            StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

    return target;
}
```

- Repository에서 템플릿 파일 제거, AWS S3 버킷으로 이관
- 런타임에 S3에서 템플릿 파일을 동적으로 다운로드하여 사용
- 비개발자 IAM 그룹에 S3 버킷 쓰기 권한 부여하여 코드 배포 없이 템플릿 교체 가능

---

## 4. 아쉬운 점 및 추후 보완점

**완전한 라이브 샘플 구현 관련 고민**
- 서버사이드 실행 코드 특성상 완전한 라이브 샘플을 구현하지 못함
- 이로 인해 사용자 커스텀 템플릿 업로드 기능에도 제약이 따름
- 향후 사용자가 모나코 에디터만으로 보안 문제 없이 백엔드 코드를 직접 수정·실행할 수 있는 방안 검토 필요

**e2e 테스트 추가 필요**
- 현재 웹서비스에 대한 E2E 테스트가 없음
- 추후 Playwright 기반 테스트 코드 추가 필요

---

## 5. 성과

### 기술적 성과

- **서버리스 아키텍처 구축**: AWS Lambda + API Gateway 기반 비용 효율적 구조
- **풀스택 개발 경험**: React 19 + Java 17 최신 스택 활용
- **라이브러리 실사용 데모**: 오픈소스 라이브러리의 실제 활용 사례 제공

### 배포 환경

- **프론트엔드**: 정적 호스팅 (S3 + CloudFront)
- **백엔드**: AWS Lambda + API Gateway
- **도메인**: https://www.hwpxtemplater.link

---

## 7. 실행 방법

### Frontend

```bash
cd frontend
yarn install
yarn dev          # 개발 서버
yarn build        # 프로덕션 빌드
```

### Backend

```bash
cd backend
./gradlew build           # 빌드
sam local start-api       # 로컬 테스트
sam deploy --guided       # AWS 배포
```

---

## 8. 관련 링크

- **HwpxTemplater 라이브러리**: [GitHub](https://github.com/mumberrymountain/hwpxtemplater)
- **데모 사이트**: [https://www.hwpxtemplater.link](https://www.hwpxtemplater.link)
- **Maven Central**: `io.github.mumberrymountain:hwpxtemplater:0.1.0`

---
