// 테이블 데이터 타입 정의
export interface TableData {
  columns: Record<string, string>; // key: 영문 컬럼명, value: 한글 표시명
  rows: Array<Record<string, string | boolean | number>>;
}

export interface CardDataItem {
    image: string;
    title: string;
    description: string;
    templateParam: Record<string, string | boolean | number | Array<{title: string, description: string | boolean | number}> | TableData>;
    api: string;
    fileName: string;
    detailTitle?: string;
    detailDescription?: string;
}