"use client";

import { AppShell } from "@/components/AppShell";
import {
  ArrowRight,
  BookOpenCheck,
  Box,
  Building2,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Factory,
  FileArchive,
  FileCheck2,
  Globe2,
  Landmark,
  Lightbulb,
  PackageCheck,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tags,
  Truck,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./preparation.css";

type SectionId = "roadmap" | "foundation" | "brand" | "sourcing" | "sales" | "checklist" | "official";
type PrepCard = { icon: LucideIcon; title: string; need: string; detail: string; link?: string };

const tabs: { id: SectionId; label: string }[] = [
  { id: "roadmap", label: "전체 로드맵" },
  { id: "foundation", label: "기획·사업 기반" },
  { id: "brand", label: "브랜드·권리" },
  { id: "sourcing", label: "공급·수입" },
  { id: "sales", label: "판매·운영" },
  { id: "checklist", label: "실행 체크리스트" },
  { id: "official", label: "공식 확인처" },
];

const roadmap = [
  { slug: "product-profit", icon: Calculator, title: "제품·손익 설계", text: "고객, 판매가, 채널과 실제 입고원가를 먼저 계산해요.", tone: "lime" },
  { slug: "business-foundation", icon: Building2, title: "사업 운영 기반", text: "사업자등록, 계좌, 카드와 증빙 보관 체계를 준비해요.", tone: "mint" },
  { slug: "brand-protection", icon: Tags, title: "브랜드 보호", text: "브랜드명, 상표, 도메인과 콘텐츠 권리를 확인해요.", tone: "peach" },
  { slug: "china-sourcing", icon: Factory, title: "중국 공급처 선정", text: "후보 비교, 샘플 검수, 계약과 결제 조건을 정해요.", tone: "blue" },
  { slug: "import-customs", icon: Truck, title: "수입·통관 준비", text: "HS 코드, 인증, 표시사항, 관세사와 운송을 확인해요.", tone: "yellow" },
  { slug: "sales-preparation", icon: ShoppingBag, title: "판매 준비", text: "채널, 상세페이지, 가격, 재고와 반품 정책을 만들어요.", tone: "pink" },
  { slug: "post-sales-operation", icon: ShieldCheck, title: "판매 후 운영", text: "불량 데이터, 보험, 리콜, 세금과 현금 흐름을 관리해요.", tone: "gray" },
];

const groups: Record<"foundation" | "brand" | "sourcing" | "sales", PrepCard[]> = {
  foundation: [
    { icon: Calculator, title: "판매 제품과 고객 정의", need: "제품, 고객층, 예상 판매가, 주요 판매 채널", detail: "경쟁 제품 가격과 후기, 검색량, 계절성, 파손·반품 가능성을 확인하세요." },
    { icon: WalletCards, title: "예상 손익과 사입 한도", need: "제품별 실제 입고원가와 손익표", detail: "제품대금 외 국제운송비, 관세, 부가세, 인증비, 수수료, 광고비까지 포함하세요." },
    { icon: Building2, title: "사업자등록·금융 준비", need: "사업자등록, 사업용 계좌와 카드", detail: "생활비와 사업 자금을 분리하고 모든 사업 지출 증빙을 모으세요.", link: "/business-registration" },
    { icon: FileArchive, title: "회계·증빙 관리", need: "인보이스, 패킹리스트, 송금증, 수입신고필증", detail: "제품별 관리번호와 폴더를 만들고 거래·수입 사실을 증명할 자료를 보관하세요.", link: "/my-assets" },
  ],
  brand: [
    { icon: Tags, title: "브랜드명 선행 조사", need: "키프리스, 쇼핑몰, 검색엔진, SNS 검색", detail: "이름 공개와 포장 제작 전에 동일·유사 상표 사용 여부를 확인하세요." },
    { icon: ShieldCheck, title: "상표 출원", need: "브랜드명, 로고, 지정상품 범위", detail: "현재 제품뿐 아니라 가까운 확장 품목까지 지정상품 범위를 검토하세요." },
    { icon: Scale, title: "디자인·특허·저작권", need: "제품 외관, 기술 구조, 이미지 사용권", detail: "공급처가 준 이미지도 한국에서 자유롭게 사용할 수 있는지 확인해야 해요." },
    { icon: Globe2, title: "도메인과 SNS 확보", need: "핵심 도메인, SNS 아이디, 스토어 이름", detail: "브랜드 공개 전에 구매하고 자동 갱신과 소유자 이메일을 관리하세요.", link: "/my-assets" },
  ],
  sourcing: [
    { icon: Factory, title: "공급처 후보 조사", need: "사업자 정보, 공장 여부, 거래 이력, 수출 경험", detail: "가격뿐 아니라 인증서 진위, 샘플 대응, 연락 속도와 불량 대응을 비교하세요." },
    { icon: PackageCheck, title: "샘플·품질 기준서", need: "소재, 크기, 색상, 로고, 포장, 불량 기준", detail: "샘플 검수 후 대량 생산품도 출고 전에 다시 검사하세요." },
    { icon: FileCheck2, title: "계약·결제·검수", need: "견적서, 계약서, 인보이스, 결제 조건", detail: "납기, 불량 허용률, 환불 조건과 지식재산권 책임을 문서에 적으세요." },
    { icon: Truck, title: "HS 코드와 통관", need: "사업자 통관고유부호, HS 코드, 관세사", detail: "한국 기준 HS 코드와 관세율, 수입 금지·제한 여부를 발주 전에 확인하세요." },
    { icon: ShieldCheck, title: "인증·표시사항", need: "KC·전파·식약처 요건, 원산지·한글 표시", detail: "인증 가능 여부와 비용을 확인한 뒤 대량 발주하세요." },
    { icon: Landmark, title: "운송 파트너와 보험", need: "관세사, 포워더, 배송대행지, 인코텀즈", detail: "서류 정확성과 사고 대응 경험을 비교하고 고가 제품은 적하보험을 검토하세요." },
  ],
  sales: [
    { icon: ShoppingBag, title: "판매 채널과 신고", need: "통신판매업 신고, 핵심 판매 채널 1~2개", detail: "채널별 수수료, 정산 주기, 광고 방식과 요구 서류를 비교하세요." },
    { icon: BookOpenCheck, title: "상세페이지·표시 검토", need: "제품 정보, 원산지, 주의사항, 교환 조건", detail: "근거 없는 효능 표현과 사용권이 불명확한 이미지를 피하세요." },
    { icon: Calculator, title: "가격 정책", need: "정상가, 행사 최저가, 도매가, 손절가", detail: "배송비, 광고비, 반품비, 불량률과 재고 폐기 위험까지 반영하세요." },
    { icon: Box, title: "재고·배송·반품", need: "SKU, 바코드, 재고표, 반품 정책", detail: "재주문 시점, 출고 마감시간, 불량 검수와 환불 절차를 정하세요." },
    { icon: ShieldCheck, title: "운영 위험 관리", need: "CS 기록, 제조물책임보험, 리콜 절차", detail: "불량과 문의 데이터를 제품 개선과 다음 발주 판단에 활용하세요." },
    { icon: WalletCards, title: "세금과 현금 흐름", need: "세금 일정, 재고 자금, 정산 예정액", detail: "세금 예상액을 별도 계좌에 적립하고 월별 손익과 현금을 함께 관리하세요." },
  ],
};

const checklistGroups = [
  { title: "발주 전 반드시 완료", items: ["판매 제품과 고객 정의", "경쟁 제품·가격·후기 조사", "실제 입고원가와 예상이익 계산", "사업자등록 및 사업용 계좌 준비", "브랜드명·상표·도메인 확인", "샘플 주문과 품질 테스트", "HS 코드와 수입 가능 여부 확인", "제품별 인증·표시 요건 확인", "관세사·포워더 견적 비교", "공급 계약과 불량 대응 조건 확정"] },
  { title: "대량 생산·출고 전", items: ["최종 제품 사양서 확정", "로고·포장·라벨 시안 확인", "인증서와 시험 결과 확인", "출고 전 수량·품질 검사", "인보이스와 패킹리스트 확인", "운송 조건·보험·입고 일정 확인"] },
  { title: "판매 시작 전", items: ["통신판매업 신고 대상 확인", "판매 채널과 수수료 확인", "상세페이지 법정 표시 확인", "배송·교환·반품 정책 작성", "SKU·바코드·재고표 준비", "개인정보처리방침과 이용약관 준비", "세금·매입·통관 증빙 체계 준비"] },
];

const officialLinks = [
  ["국세청 홈택스", "사업자등록, 사업용 신용카드, 세금 신고", "https://www.hometax.go.kr"],
  ["정부24", "통신판매업 신고 등 민원 안내", "https://www.gov.kr"],
  ["관세청", "수입 통관 및 통관고유부호", "https://www.customs.go.kr"],
  ["관세법령정보포털", "품목분류, 관세율, 수입 요건", "https://unipass.customs.go.kr/clip/index.do"],
  ["제품안전정보센터", "KC 등 제품 안전 정보", "https://www.safetykorea.kr"],
  ["식품안전나라", "식품 관련 수입·표시 정보", "https://www.foodsafetykorea.go.kr"],
  ["국립전파연구원", "방송통신기자재 적합성평가", "https://www.rra.go.kr"],
  ["키프리스", "상표·특허·디자인 선행 검색", "https://www.kipris.or.kr"],
  ["특허로", "상표·특허·디자인 전자출원", "https://www.patent.go.kr"],
];

export default function BusinessPreparationPage() {
  const [activeTab, setActiveTab] = useState<SectionId>("roadmap");
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bizneed-preparation-checklist");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const allTasks = checklistGroups.flatMap((group) => group.items);
  const percent = Math.round((completed.length / allTasks.length) * 100);
  const toggle = (item: string) => {
    const next = completed.includes(item) ? completed.filter((value) => value !== item) : [...completed, item];
    setCompleted(next);
    localStorage.setItem("bizneed-preparation-checklist", JSON.stringify(next));
  };

  const selectedCards = useMemo<PrepCard[]>(() => activeTab in groups ? groups[activeTab as keyof typeof groups] : [], [activeTab]);

  return (
    <AppShell>
      <header className="prep-hero">
        <div>
          <span className="prep-eyebrow"><Sparkles size={14} /> 중국 사입 기반 브랜드 사업</span>
          <h1>사업 준비물 안내</h1>
          <p>제품 선정부터 중국 사입, 통관, 판매와 운영까지<br />필요한 준비물을 단계별로 확인하세요.</p>
        </div>
        <div className="prep-score">
          <span>실행 체크리스트</span><strong>{percent}%</strong>
          <div className="bar"><span style={{ width: `${percent}%` }} /></div>
          <small>{completed.length} / {allTasks.length} 완료</small>
        </div>
      </header>

      <nav className="prep-tabs">
        {tabs.map((tab) => <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}
      </nav>

      {activeTab === "roadmap" && (
        <>
          <section className="prep-intro">
            <div><span className="overline">START HERE</span><h2>발주 전에 위험부터 확인하세요</h2><p>중국 사이트의 제품 가격만으로 원가를 판단하면 안 됩니다. 인증·통관 가능 여부와 실제 입고원가를 먼저 확인한 뒤 소량 샘플로 시작하세요.</p></div>
            <button onClick={() => setActiveTab("checklist")}>실행 체크리스트 보기 <ArrowRight size={16} /></button>
          </section>
          <div className="prep-section-title"><span className="overline">7 STEP ROADMAP</span><h2>전체 준비 흐름</h2></div>
          <section className="roadmap-grid">
            {roadmap.map((item, index) => { const Icon = item.icon; return <Link className="roadmap-card" href={`/business-preparation/${item.slug}`} key={item.title}><span className={`roadmap-icon ${item.tone}`}><Icon size={21} /></span><small>STEP {index + 1}</small><h3>{item.title}</h3><p>{item.text}</p><ChevronRight size={16} /></Link>; })}
          </section>
          <section className="first-month">
            <div><span className="overline">FIRST MONTH</span><h2>첫 달 권장 목표</h2></div>
            <ol><li>후보 제품 3개의 인증·통관 위험 조사</li><li>제품별 공급처 3곳 이상 견적·샘플 요청</li><li>브랜드명과 상표·도메인 사용 가능 여부 확인</li><li>샘플 검수 후 제품 1개의 실제 손익 계산</li><li>대량 발주 전 관세사 최종 확인</li></ol>
          </section>
        </>
      )}

      {selectedCards.length > 0 && (
        <>
          <div className="prep-section-title"><span className="overline">PREPARATION ITEMS</span><h2>{tabs.find((tab) => tab.id === activeTab)?.label}</h2><p>각 카드에서 필요한 준비물과 확인할 내용을 빠르게 살펴보세요.</p></div>
          <section className="prep-card-grid">
            {selectedCards.map((item) => { const Icon = item.icon; return <article key={item.title}><span className="prep-card-icon"><Icon size={20} /></span><h3>{item.title}</h3><div><strong>필요한 것</strong><p>{item.need}</p></div><div><strong>확인 포인트</strong><p>{item.detail}</p></div>{item.link && <Link href={item.link}>관련 페이지 열기 <ArrowRight size={14} /></Link>}</article>; })}
          </section>
        </>
      )}

      {activeTab === "checklist" && (
        <>
          <div className="prep-section-title"><span className="overline">ACTION CHECKLIST</span><h2>실행 순서 체크리스트</h2><p>완료한 항목은 자동으로 저장됩니다.</p></div>
          <section className="checklist-columns">
            {checklistGroups.map((group, groupIndex) => <article key={group.title}><div className="checklist-title"><span>0{groupIndex + 1}</span><h3>{group.title}</h3></div>{group.items.map((item) => <button className={completed.includes(item) ? "done" : ""} onClick={() => toggle(item)} key={item}><span>{completed.includes(item) && <Check size={14} />}</span>{item}</button>)}</article>)}
          </section>
          <section className="folder-guide"><div><FileArchive size={23} /><span><strong>추천 문서 보관 구조</strong><small>내 사업 문서 페이지에 같은 구조로 기록해보세요.</small></span><Link href="/my-assets">내 사업 문서 열기 <ArrowRight size={14} /></Link></div><p>01_사업자·세무 · 02_상표·디자인·도메인 · 03_공급처·계약 · 04_제품별 사양서 · 05_인증·시험성적서 · 06_발주·인보이스·송금 · 07_운송·통관 · 08_입고·검수·재고 · 09_상세페이지·콘텐츠 · 10_CS·반품·불량</p></section>
        </>
      )}

      {activeTab === "official" && (
        <>
          <div className="prep-section-title"><span className="overline">OFFICIAL SOURCES</span><h2>공식 확인처</h2><p>발주 전 최신 요건을 공식 기관과 전문가에게 최종 확인하세요.</p></div>
          <section className="official-grid">{officialLinks.map(([title, description, url]) => <a href={url} target="_blank" rel="noreferrer" key={title}><span><Globe2 size={18} /></span><div><h3>{title}</h3><p>{description}</p></div><ExternalLink size={15} /></a>)}</section>
          <div className="prep-warning"><Lightbulb size={18} /><p><strong>중요 안내</strong>세금, 통관, 인증, 표시 의무는 제품과 판매 방식에 따라 달라집니다. 실제 발주 전 관세사·세무사와 관련 기관에 최종 확인하세요.</p></div>
        </>
      )}
    </AppShell>
  );
}
