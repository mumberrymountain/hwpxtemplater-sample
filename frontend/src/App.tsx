import Header from './components/layout/Header';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useMemo } from "react";
import basicSample from './assets/images/basic_sample.webp';
import conditionSample from './assets/images/condition_sample.webp';
import loopSample from './assets/images/loop_sample.webp';
import imageSample from './assets/images/image_sample.webp';
import tableSample from './assets/images/table_sample.webp';
import type { CardDataItem } from "./types/CardDataItem";
import Body from './components/layout/Body';

function App() {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const today = useMemo(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }, []);

  // 카드 데이터 배열 정의
  const [cardData, setCardData] = useState<CardDataItem[]>([
    {
      image: basicSample,
      title: "템플릿 기본 태그",
      description: "템플릿 기본 태그를 활용한 hwpx 파일 다운로드",
      templateParam: {
        company: "㈜무제솔루션",
        author: "김민수",
        department: "마케팅전략기획팀",
        phoneNumber: "010-1234-0000",
        email: "mskim@mujaesolution.com",
      },
      api: "basic",
      fileName: `(주)무제솔루션_마케팅전략기획서_${today}.hwpx`,
      detailTitle: "템플릿 기본 태그 예제",
      detailDescription: "{{data}} 형식으로 표시되는 템플릿 기본 태그에 데이터를 렌더링하여 hwpx 파일을 다운로드합니다.",
    },
    {
      image: conditionSample,
      title: "템플릿 조건문 태그",
      description: "템플릿 조건문 태그를 활용한 hwpx 파일 다운로드",
      templateParam: {
        orderStatus: "배송중",
        hasTrackingNumber: true,
        trackingNumber: "1234-5678-9012",
      },
      api: "condition",
      fileName: `배송안내서_1234-5678-9012_${today}.hwpx`,
      detailTitle: "템플릿 조건문 태그 예제",
      detailDescription: "{{?data}} 형식으로 표시되는 템플릿 조건문 태그로 태그 내부 내용물을 렌더링할지 여부를 결정합니다.",
    },
    {
      image: loopSample,
      title: "템플릿 반복문 태그",
      description: "템플릿 반복문 태그를 활용한 hwpx 파일 다운로드",
      templateParam: {
        year: 2026,
        quarter: 4,
        date: "2026년 12월 26일 (금) 14:00",
        location: "본사 2층 회의실",
        attendee: "김영수 부장 외 7인",
        agenda: [
          {
            title: "2026년 사업 계획 검토",
            description: "내년도 주요 사업 방향과 목표 설정에 대한 논의",
          }, {
            title: "4분기 실적 보고",
            description: "각 팀별 4분기 성과 및 목표 달성률 공유",
          }, {
            title: "신규 프로젝트 제안",
            description: "AI 기반 고객 서비스 개선 프로젝트 기획안 발표",
          }, {
            title: "예산 편성 안건",
            description: "2026년 상반기 부서별 예산 배정 계획 협의",  
          }
        ]
      },
      api: "loop",
      fileName: `회의록_2026년_1분기_정기회의.hwpx`,
      detailTitle: "템플릿 반복문 태그 예제",
      detailDescription: "{{#data}} 형식으로 표시되는 템플릿 반복문 태그로 기본 태그 데이터를 반복하여 렌더링합니다.",
    },
    {
      image: imageSample,
      title: "템플릿 이미지 태그",
      description: "템플릿 이미지 태그를 활용한 hwpx 파일 다운로드",
      templateParam: {
        proBook: "hwpx/image/proBook.png",
        smartBook: "hwpx/image/smartBook.png",
        ecoBook: "hwpx/image/ecoBook.png",
      },
      api: "image",
      fileName: `노트북_제품비교표_${today}.hwpx`,
      detailTitle: "템플릿 이미지 태그 예제",
      detailDescription: "{{$data}} 형식으로 표시되는 템플릿 이미지 태그에 이미지 데이터를 렌더링하여 hwpx 파일을 다운로드합니다.",
    },
    {
      image: tableSample,
      title: "템플릿 테이블 태그",
      description: "템플릿 테이블 태그를 활용한 hwpx 파일 다운로드",
      templateParam: {
      workshopGrantBudget: {
          columns: {
            content: "워크숍 내용",
            budget: "예산내역",
            amount: "금액",
            calculation: "산출내역(기초)"
          },
          rows: [
            { content: "숙박비", budget: "호텔 숙박", amount: 2400, calculation: "120,000원 × 20명" },
            { content: "식비", budget: "중식, 석식", amount: 1800, calculation: "30,000원 × 30명" },
            { content: "강사비", budget: "외부 전문강사", amount: 1500, calculation: "500,000원 × 3회" },
            { content: "대관료", budget: "세미나실 대관", amount: 800, calculation: "400,000원 × 2일" },
            { content: "교재 및 인쇄비", budget: "워크숍 교재 제작", amount: 450, calculation: "15,000원 × 30부" }
          ]
        },
        selfFundedBudget: {
          columns: {
            content: "워크숍 내용",
            budget: "예산내역",
            amount: "금액",
            calculation: "산출내역(기초)"
          },
          rows: [
            { content: "교통비", budget: "버스 대절", amount: 1200, calculation: "600000원 * 2대" },
            { content: "기념품", budget: "참가자 기념품", amount: 900, calculation: "30,000원 × 30명" },
            { content: "운영비", budget: "현장 운영 인력", amount: 600, calculation: "100,000원 × 6명" },
            { content: "예비비", budget: "기타 비용", amount: 300, calculation: "" }
          ]
        }
      },
      api: "table",
      fileName: `워크숍_예산_계획안_${today}.hwpx`,
      detailTitle: "템플릿 테이블 태그 예제",
      detailDescription: "{{@data}} 형식으로 표시되는 템플릿 테이블 태그에 테이블을 렌더링하여 hwpx 파일을 다운로드합니다.",
    },
  ]);

  return (
    <>
      {/* 헤더 */}
      <Header onDemoClick={() => setSelectedCardIndex(null)}/>
      {/* 바디  */}
      <Body cardData={cardData} setCardData={setCardData} selectedCardIndex={selectedCardIndex} setSelectedCardIndex={setSelectedCardIndex} />
    </>
  )
}

export default App
