"use client";

import { AppShell } from "@/components/AppShell";
import {
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  ExternalLink,
  Factory,
  PackageCheck,
  PackageOpen,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  Warehouse,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import "./fulfillment.css";

type Provider = {
  id: string;
  name: string;
  url: string;
  location: string;
  minimum: string;
  storage: string;
  packing: string;
  shipping: string;
  returns: string;
  cutoff: string;
  memo: string;
};

const methods = [
  { icon: PackageOpen, title: "직접 포장·발송", fit: "초기 주문량이 적고 제품 경험을 직접 확인해야 할 때", pros: ["고객 반응과 포장 문제를 빠르게 파악", "소량 주문에 유연하게 대응", "포장 품질을 직접 통제"], cons: ["시간과 공간이 많이 필요", "주문 증가 시 처리 한계 발생", "택배 계약과 재고 관리 필요"], tone: "lime" },
  { icon: Warehouse, title: "3PL 물류대행", fit: "재고 보관부터 포장·발송·반품까지 외주화할 때", pros: ["보관·출고 인력과 공간 절감", "여러 판매 채널 주문 통합", "반품과 재고 데이터 관리 가능"], cons: ["보관·입출고·작업별 비용 발생", "최소 물량과 계약 조건 확인 필요", "포장 변경 대응이 느릴 수 있음"], tone: "blue" },
  { icon: ShoppingBag, title: "플랫폼 풀필먼트", fit: "특정 플랫폼 판매 비중이 높고 빠른 배송이 중요할 때", pros: ["빠른 배송 프로그램 활용", "플랫폼 주문 처리 자동화", "고객 배송 경험 개선"], cons: ["플랫폼 정책과 수수료 의존", "재고 분산과 회수 비용 발생", "타 채널 주문 대응 범위 확인 필요"], tone: "peach" },
];

const flow = [
  { icon: Factory, title: "입고 예약", text: "입고일, SKU, 수량과 박스 규격을 물류사에 미리 전달합니다." },
  { icon: ClipboardCheck, title: "입고 검수", text: "수량, 파손, 바코드와 유통기한을 확인하고 차이를 기록합니다." },
  { icon: Warehouse, title: "보관·재고", text: "SKU별 위치와 재고를 관리하고 안전재고·재주문점을 설정합니다." },
  { icon: PackageCheck, title: "포장 작업", text: "포장재, 완충재, 사은품, 동봉물과 라벨 기준을 정합니다." },
  { icon: Truck, title: "출고·배송", text: "주문 마감시간, 당일 출고 기준과 택배 추적 흐름을 확인합니다." },
  { icon: RotateCcw, title: "교환·반품", text: "반품지, 검수 기준, 재판매 가능 여부와 폐기 기준을 정합니다." },
];

const checklist = [
  "제품 크기·중량·파손 위험 정리",
  "월 예상 주문량과 성수기 물량 계산",
  "SKU·바코드·옵션 체계 확정",
  "입고 검수 기준과 불량 처리 방식 확정",
  "기본 포장과 추가 작업 비용 확인",
  "택배비와 도서산간 추가비 확인",
  "주문 마감시간과 당일 출고 기준 확인",
  "재고 시스템과 판매 채널 연동 확인",
  "반품 검수·재포장·폐기 비용 확인",
  "재고 분실·파손 보상 기준 확인",
  "최소 계약 기간과 해지·재고 회수 비용 확인",
  "월별 정산서와 재고 리포트 양식 확인",
];

export default function FulfillmentPage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedChecks = localStorage.getItem("bizneed-fulfillment-checks");
    const savedProviders = localStorage.getItem("bizneed-fulfillment-providers");
    if (savedChecks) setCompleted(JSON.parse(savedChecks));
    if (savedProviders) setProviders(JSON.parse(savedProviders));
  }, []);

  const toggle = (item: string) => {
    const next = completed.includes(item) ? completed.filter((value) => value !== item) : [...completed, item];
    setCompleted(next); localStorage.setItem("bizneed-fulfillment-checks", JSON.stringify(next));
  };
  const saveProviders = (next: Provider[]) => {
    setProviders(next); localStorage.setItem("bizneed-fulfillment-providers", JSON.stringify(next));
  };
  const addProvider = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const url = String(data.get("url") ?? "");
    saveProviders([...providers, {
      id: crypto.randomUUID(), name: String(data.get("name") ?? ""), url: url && !url.startsWith("http") ? `https://${url}` : url,
      location: String(data.get("location") ?? ""), minimum: String(data.get("minimum") ?? ""), storage: String(data.get("storage") ?? ""),
      packing: String(data.get("packing") ?? ""), shipping: String(data.get("shipping") ?? ""), returns: String(data.get("returns") ?? ""),
      cutoff: String(data.get("cutoff") ?? ""), memo: String(data.get("memo") ?? ""),
    }]);
    setShowModal(false);
  };

  return (
    <AppShell>
      <header className="fulfill-hero">
        <div><span className="overline">PACKING & FULFILLMENT</span><h1>포장·배송 운영</h1><p>직접 발송부터 3PL과 플랫폼 풀필먼트까지,<br />주문량과 제품 특성에 맞는 운영 방식을 선택하세요.</p></div>
        <div className="fulfill-progress"><span>계약 전 체크리스트</span><strong>{Math.round(completed.length / checklist.length * 100)}%</strong><div className="bar"><span style={{ width: `${completed.length / checklist.length * 100}%` }} /></div><small>{completed.length} / {checklist.length} 확인</small></div>
      </header>

      <div className="fulfill-section-title"><span className="overline">CHOOSE A METHOD</span><h2>어떤 방식이 적합할까요?</h2><p>처음에는 직접 발송으로 문제를 파악하고, 반복 업무가 부담될 때 3PL 전환을 검토하는 방식이 일반적입니다.</p></div>
      <section className="method-grid">
        {methods.map((method) => { const Icon = method.icon; return <article key={method.title}><span className={`method-icon ${method.tone}`}><Icon size={25} /></span><h3>{method.title}</h3><p className="method-fit">{method.fit}</p><div><strong><CheckCircle2 size={16} /> 장점</strong>{method.pros.map((item) => <p key={item}>{item}</p>)}</div><div className="method-cons"><strong><ShieldCheck size={16} /> 확인할 점</strong>{method.cons.map((item) => <p key={item}>{item}</p>)}</div></article>; })}
      </section>

      <section className="fulfill-tip"><Box size={22} /><div><strong>3PL 전환을 고려할 시점</strong><p>포장·출고 때문에 상품 기획과 판매 업무가 밀리거나, 보관 공간이 부족하고, 주문 누락·오배송이 반복될 때 견적을 비교하세요. 단순 주문 건수보다 SKU 수, 제품 크기, 추가 포장 작업과 반품률이 비용에 큰 영향을 줍니다.</p></div></section>

      <div className="fulfill-section-title"><span className="overline">OPERATION FLOW</span><h2>입고부터 반품까지 운영 흐름</h2></div>
      <section className="fulfill-flow">{flow.map((step, index) => { const Icon = step.icon; return <article key={step.title}><span>0{index + 1}</span><Icon size={21} /><h3>{step.title}</h3><p>{step.text}</p>{index < flow.length - 1 && <ChevronRight size={17} />}</article>; })}</section>

      <section className="fulfill-two-column">
        <div>
          <div className="fulfill-section-title"><span className="overline">BEFORE CONTRACT</span><h2>업체 계약 전 확인사항</h2></div>
          <div className="fulfill-checklist">{checklist.map((item) => <button className={completed.includes(item) ? "done" : ""} onClick={() => toggle(item)} key={item}><span>{completed.includes(item) && <Check size={15} />}</span>{item}</button>)}</div>
        </div>
        <aside>
          <div className="fulfill-section-title"><span className="overline">COST STRUCTURE</span><h2>3PL 비용 구조</h2></div>
          <article className="cost-card">{[
            ["보관비", "파렛트·박스·선반 또는 부피 기준"],
            ["입고비", "하차, 수량 확인, 바코드 작업"],
            ["출고비", "주문 건별 기본 작업 비용"],
            ["포장비", "박스·봉투·완충재·동봉물"],
            ["택배비", "중량·크기·지역별 배송 비용"],
            ["추가 작업", "세트 구성, 라벨, 사은품, 검수"],
            ["반품비", "회수, 검수, 재포장, 폐기 작업"],
            ["시스템비", "WMS, 쇼핑몰 연동, 월 관리비"],
          ].map(([name, text]) => <div key={name}><strong>{name}</strong><p>{text}</p></div>)}</article>
        </aside>
      </section>

      <div className="provider-heading"><div><span className="overline">PROVIDER COMPARISON</span><h2>3PL·물류 업체 비교 기록</h2><p>상담한 업체의 사이트와 견적 조건을 저장하고 비교하세요.</p></div><button className="button button-dark" onClick={() => setShowModal(true)}><Plus size={17} /> 업체 추가</button></div>
      <section className="provider-grid">
        {providers.length === 0 && <button className="provider-empty" onClick={() => setShowModal(true)}><span><Plus size={24} /></span><strong>첫 업체 등록하기</strong><p>업체 사이트와 주요 비용을 기록하세요.</p></button>}
        {providers.map((provider) => <article key={provider.id}><div className="provider-top"><span><Warehouse size={17} /> 3PL 후보</span><button onClick={() => saveProviders(providers.filter((item) => item.id !== provider.id))}><Trash2 size={15} /></button></div><h3>{provider.name}</h3><p>{provider.location || "위치 미입력"} · 마감 {provider.cutoff || "미확인"}</p><div className="provider-costs"><span>최소물량 <strong>{provider.minimum || "-"}</strong></span><span>보관비 <strong>{provider.storage || "-"}</strong></span><span>포장비 <strong>{provider.packing || "-"}</strong></span><span>배송비 <strong>{provider.shipping || "-"}</strong></span><span>반품비 <strong>{provider.returns || "-"}</strong></span></div>{provider.memo && <p className="provider-memo">{provider.memo}</p>}{provider.url && <a href={provider.url} target="_blank" rel="noreferrer">업체 사이트 열기 <ExternalLink size={14} /></a>}</article>)}
      </section>

      {showModal && <ProviderModal onClose={() => setShowModal(false)} onSubmit={addProvider} />}
    </AppShell>
  );
}

function ProviderModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="provider-modal" onMouseDown={(event) => event.stopPropagation()}><div className="provider-modal-title"><div><span className="overline">ADD PROVIDER</span><h2>물류 업체 추가</h2></div><button onClick={onClose}><X size={20} /></button></div><form onSubmit={onSubmit}><label>업체명<input name="name" required placeholder="예: OO 풀필먼트" /></label><label>업체 사이트 URL<input name="url" placeholder="https://..." /></label><div className="provider-form-grid"><label>물류센터 위치<input name="location" /></label><label>주문 마감시간<input name="cutoff" placeholder="예: 오후 2시" /></label><label>최소 물량·월비용<input name="minimum" /></label><label>보관비<input name="storage" /></label><label>포장 작업비<input name="packing" /></label><label>택배비<input name="shipping" /></label><label>반품 처리비<input name="returns" /></label></div><label>상담 메모<textarea name="memo" rows={3} /></label><div className="modal-actions"><button type="button" className="button button-ghost" onClick={onClose}>취소</button><button className="button button-dark">저장하기</button></div></form></div></div>;
}
