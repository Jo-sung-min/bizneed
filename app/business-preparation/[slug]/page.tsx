import { AppShell } from "@/components/AppShell";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  Factory,
  FileCheck2,
  Lightbulb,
  ShieldCheck,
  ShoppingBag,
  Tags,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../detail.css";

type Step = {
  slug: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  objective: string;
  items: { title: string; description: string; result: string }[];
  questions: string[];
  done: string[];
  related?: { label: string; href: string }[];
};

const steps: Step[] = [
  {
    slug: "product-profit", title: "제품·손익 설계", subtitle: "팔릴 제품보다 남는 제품을 먼저 찾는 단계", icon: Calculator,
    objective: "누구에게 어떤 제품을 얼마에 팔지 정의하고, 모든 비용을 반영한 실제 이익을 계산합니다.",
    items: [
      { title: "제품과 고객 정의", description: "판매 제품, 핵심 고객층, 주요 불편과 구매 이유를 한 문장으로 정리합니다.", result: "제품·고객 정의문" },
      { title: "시장과 경쟁 제품 조사", description: "경쟁 가격, 후기 불만, 검색량, 계절성, 반품 가능성을 비교합니다.", result: "경쟁 제품 비교표" },
      { title: "실제 입고원가 계산", description: "제품대금, 운송, 관세, 부가세, 인증, 포장과 국내 입고비를 합산합니다.", result: "제품별 원가표" },
      { title: "판매 손익 계산", description: "판매 수수료, 결제 수수료, 배송, 광고, 반품 충당금을 차감합니다.", result: "예상이익·손익분기표" },
    ],
    questions: ["광고비와 반품비를 포함해도 이익이 남나요?", "최소 주문 수량을 모두 판매할 수 있나요?", "인증과 파손 위험이 감당 가능한가요?"],
    done: ["후보 제품 3개 비교 완료", "제품별 실제 입고원가 계산", "첫 사입 한도와 목표 이익률 확정"],
  },
  {
    slug: "business-foundation", title: "사업 운영 기반", subtitle: "돈과 증빙이 섞이지 않도록 기반을 만드는 단계", icon: Building2,
    objective: "사업자등록부터 사업용 금융수단, 회계 증빙 보관 체계까지 운영에 필요한 기본 구조를 만듭니다.",
    items: [
      { title: "사업자등록", description: "상호, 사업장, 업태·종목, 과세 유형과 개업일을 정합니다.", result: "사업자등록증" },
      { title: "사업용 계좌와 카드", description: "생활비와 사업 자금을 분리하고 반복 비용을 사업용 카드로 결제합니다.", result: "사업 전용 금융수단" },
      { title: "사업자 통관고유부호", description: "판매 목적 수입을 사업자 명의로 신고할 수 있도록 준비합니다.", result: "통관고유부호" },
      { title: "회계·증빙 폴더", description: "견적서, 계약서, 인보이스, 송금증과 수입신고필증을 제품별로 보관합니다.", result: "문서 보관 체계" },
    ],
    questions: ["사업 자금과 개인 자금이 완전히 분리되어 있나요?", "해외 송금과 수입 비용을 증명할 수 있나요?", "업종 코드가 실제 판매·수입 활동과 맞나요?"],
    done: ["사업자등록 완료", "사업용 계좌·카드 준비", "제품별 증빙 폴더 생성"],
    related: [{ label: "사업자등록 안내", href: "/business-registration" }, { label: "내 사업 문서", href: "/my-assets" }],
  },
  {
    slug: "brand-protection", title: "브랜드 보호", subtitle: "브랜드를 공개하기 전에 이름과 권리를 확보하는 단계", icon: Tags,
    objective: "브랜드명과 콘텐츠를 안전하게 사용할 수 있는지 확인하고 상표, 도메인, 주요 계정을 확보합니다.",
    items: [
      { title: "브랜드명 선행 조사", description: "키프리스, 쇼핑몰, 검색엔진과 SNS에서 동일·유사 이름을 검색합니다.", result: "브랜드 후보 목록" },
      { title: "상표 출원 검토", description: "판매 제품과 가까운 확장 품목을 포함해 지정상품 범위를 검토합니다.", result: "상표 출원 계획" },
      { title: "디자인·저작권 확인", description: "제품 외관, 로고, 사진, 상세페이지 이미지의 권리 관계를 확인합니다.", result: "사용권 확인 자료" },
      { title: "도메인·SNS 확보", description: "브랜드 공개 전에 핵심 도메인, SNS 아이디와 스토어 이름을 확보합니다.", result: "브랜드 온라인 자산" },
    ],
    questions: ["유사 상표 때문에 판매가 중단될 위험은 없나요?", "공급처 이미지의 국내 사용권이 있나요?", "도메인 자동 갱신과 소유자 이메일을 관리하나요?"],
    done: ["브랜드명 선행 조사", "상표 출원 가능성 검토", "핵심 도메인과 SNS 확보"],
    related: [{ label: "도메인 기록하기", href: "/my-assets" }],
  },
  {
    slug: "china-sourcing", title: "중국 공급처 선정", subtitle: "가격이 아닌 품질과 대응 능력을 검증하는 단계", icon: Factory,
    objective: "복수 공급처를 비교하고 샘플, 품질 기준, 계약 조건을 문서로 확정합니다.",
    items: [
      { title: "공급처 후보 비교", description: "공장 여부, 거래 이력, 수출 경험, 인증서와 연락 속도를 확인합니다.", result: "공급처 비교표" },
      { title: "샘플 주문·검수", description: "색상, 냄새, 내구성, 마감, 기능과 포장 상태를 직접 확인합니다.", result: "샘플 검수 기록" },
      { title: "품질 기준서 작성", description: "소재, 크기 오차, 로고 위치, 포장과 불량 판정 기준을 정합니다.", result: "제품 사양·품질 기준서" },
      { title: "계약·결제 조건 확정", description: "납기, 불량 허용률, 재작업, 환불, 잔금 지급 조건을 기록합니다.", result: "계약서·인보이스" },
    ],
    questions: ["샘플과 대량 생산품의 품질 차이를 어떻게 통제하나요?", "불량 발생 시 보상 조건이 문서에 있나요?", "전액 선지급 위험을 줄였나요?"],
    done: ["공급처 3곳 이상 비교", "샘플 품질 테스트", "계약·불량 대응 조건 확정"],
  },
  {
    slug: "import-customs", title: "수입·통관 준비", subtitle: "대량 발주 전에 법적 판매 가능성을 확인하는 단계", icon: Truck,
    objective: "한국 기준 HS 코드, 인증, 표시사항과 운송 조건을 확인해 통관 보류와 판매 중지 위험을 줄입니다.",
    items: [
      { title: "HS 코드·수입 요건", description: "제품 사진, 소재, 용도, 성분을 관세사에게 전달해 한국 기준으로 검토합니다.", result: "HS 코드·관세율 확인" },
      { title: "제품별 인증·허가", description: "KC, 전파, 식약처, 화장품, 의료기기 등 대상 여부를 확인합니다.", result: "인증·시험 계획" },
      { title: "원산지·한글 표시", description: "표시 위치와 방식, 제품명, 재질, 수입자 정보와 주의사항을 확정합니다.", result: "라벨 최종 시안" },
      { title: "관세사·포워더 선정", description: "서류 정확성, 사고 대응, 제품군 경험과 운송 조건을 비교합니다.", result: "통관·운송 견적" },
    ],
    questions: ["공급처 HS 코드를 한국 기준으로 재확인했나요?", "인증 완료 전에 대량 발주하지 않았나요?", "통관 비용과 국내 입고 일정이 손익표에 반영됐나요?"],
    done: ["HS 코드와 수입 가능 여부 확인", "인증·표시사항 확정", "통관·운송 파트너 선정"],
  },
  {
    slug: "sales-preparation", title: "판매 준비", subtitle: "주문을 받고 문제없이 배송·반품할 구조를 만드는 단계", icon: ShoppingBag,
    objective: "판매 채널, 상세페이지, 가격, 재고, 배송과 고객 정책을 준비해 실제 판매를 시작할 수 있게 합니다.",
    items: [
      { title: "채널 개설·신고", description: "핵심 판매 채널 1~2개를 선택하고 통신판매업 신고 대상을 확인합니다.", result: "판매 채널 계정" },
      { title: "상세페이지 제작", description: "제품 특징, 소재, 원산지, 사용법과 법정 표시사항을 정확히 안내합니다.", result: "검수 완료 상세페이지" },
      { title: "가격·프로모션 정책", description: "정상가, 행사 최저가, 도매가와 손절가를 미리 정합니다.", result: "가격 정책표" },
      { title: "재고·배송·반품", description: "SKU, 바코드, 안전재고, 출고 마감과 반품·환불 기준을 만듭니다.", result: "운영 정책서" },
    ],
    questions: ["할인과 광고비를 반영해도 이익이 남나요?", "법정 표시사항이 상세페이지에 있나요?", "반품과 불량 처리 기준이 명확한가요?"],
    done: ["판매 채널 개설", "상세페이지 검수", "재고·배송·반품 정책 확정"],
  },
  {
    slug: "post-sales-operation", title: "판매 후 운영", subtitle: "판매 데이터를 다음 발주와 위험 관리에 활용하는 단계", icon: ShieldCheck,
    objective: "고객 문의와 불량 데이터를 기록하고 사고, 리콜, 세금과 현금 흐름에 대응할 구조를 만듭니다.",
    items: [
      { title: "CS·불량 데이터", description: "주문번호, SKU, 문제 유형, 사진, 처리 결과와 발생 비용을 기록합니다.", result: "제품별 CS 리포트" },
      { title: "제품 책임·보험", description: "제조물책임보험과 사고 대응 절차, 공급처 책임 조항을 검토합니다.", result: "사고 대응 계획" },
      { title: "리콜·판매 중지", description: "제품 로트, 구매자 연락, 회수 기준과 환불 방침을 준비합니다.", result: "리콜 절차서" },
      { title: "세금·현금 흐름", description: "세금 예상액, 재발주 자금, 관세와 플랫폼 정산 예정액을 함께 관리합니다.", result: "월별 손익·현금표" },
    ],
    questions: ["반복 불량이 다음 발주 기준에 반영되나요?", "안전 문제 발생 시 즉시 판매를 멈출 수 있나요?", "세금 지급 전용 자금을 분리했나요?"],
    done: ["CS·불량 기록 체계 준비", "사고·리콜 절차 작성", "월별 현금 흐름 관리"],
  },
];

export function generateStaticParams() {
  return steps.map(({ slug }) => ({ slug }));
}

export default async function RoadmapDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = steps.findIndex((step) => step.slug === slug);
  if (index === -1) notFound();
  const step = steps[index];
  const Icon = step.icon;
  const previous = steps[index - 1];
  const next = steps[index + 1];

  return (
    <AppShell>
      <div className="detail-back"><Link href="/business-preparation"><ArrowLeft size={16} /> 전체 로드맵으로</Link><span>STEP {index + 1} / {steps.length}</span></div>
      <header className="detail-hero">
        <span className="detail-icon"><Icon size={29} /></span>
        <div><small>BUSINESS PREPARATION · STEP {index + 1}</small><h1>{step.title}</h1><strong>{step.subtitle}</strong><p>{step.objective}</p></div>
      </header>
      <section className="detail-layout">
        <div>
          <div className="detail-title"><span>WHAT TO PREPARE</span><h2>이 단계에서 준비할 것</h2></div>
          <div className="detail-items">{step.items.map((item, itemIndex) => <article key={item.title}><span>0{itemIndex + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p><small><FileCheck2 size={14} /> 결과물: {item.result}</small></div></article>)}</div>
        </div>
        <aside className="detail-aside">
          <article><Lightbulb size={20} /><h3>결정 전 확인 질문</h3>{step.questions.map((question) => <p key={question}>{question}</p>)}</article>
          <article className="done-card"><CheckCircle2 size={20} /><h3>완료 기준</h3>{step.done.map((item) => <p key={item}><CheckCircle2 size={14} /> {item}</p>)}</article>
          {step.related && <article><h3>관련 페이지</h3>{step.related.map((link) => <Link href={link.href} key={link.href}>{link.label}<ArrowRight size={14} /></Link>)}</article>}
        </aside>
      </section>
      <nav className="detail-pagination">{previous ? <Link href={`/business-preparation/${previous.slug}`}><ArrowLeft size={16} /><span><small>이전 단계</small>{previous.title}</span></Link> : <span />}{next ? <Link href={`/business-preparation/${next.slug}`}><span><small>다음 단계</small>{next.title}</span><ArrowRight size={16} /></Link> : <Link href="/business-preparation"><span><small>완료</small>전체 로드맵으로</span><ArrowRight size={16} /></Link>}</nav>
    </AppShell>
  );
}
