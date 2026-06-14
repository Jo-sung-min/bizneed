"use client";

import { AppShell } from "@/components/AppShell";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Camera,
  Check,
  ExternalLink,
  FileText,
  Image,
  LayoutTemplate,
  Lightbulb,
  Megaphone,
  MessageSquareText,
  PackageCheck,
  Plus,
  Search,
  ShoppingBasket,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import "./product-selling.css";

type ProductMemo = {
  id: string;
  product: string;
  customer: string;
  problem: string;
  benefit: string;
  evidence: string;
  shots: string;
  structure: string;
  legal: string;
  editorUrl: string;
  memo: string;
};

const sections = [
  { icon: Target, title: "고객과 문제", text: "누가 어떤 상황에서 불편을 느끼고 이 제품을 찾는지 한 문장으로 정리하세요.", prompt: "예: 좁은 주방에서 조리도구 정리가 어려운 1인 가구" },
  { icon: Sparkles, title: "핵심 판매 포인트", text: "제품 특징이 아니라 고객이 얻게 되는 변화와 이점을 우선 작성하세요.", prompt: "예: 설치 없이 30초 만에 정리 공간 확보" },
  { icon: BadgeCheck, title: "신뢰 근거", text: "소재, 시험 결과, 실제 수치, 후기와 비교 자료처럼 주장할 수 있는 근거를 모으세요.", prompt: "예: 최대 하중 시험, 실제 사용 전후 비교" },
  { icon: Camera, title: "필요한 촬영컷", text: "대표 이미지, 사용 장면, 크기, 구성품, 디테일, 포장과 주의사항 촬영을 계획하세요.", prompt: "예: 손에 든 크기 비교, 설치 순서 3컷" },
  { icon: LayoutTemplate, title: "페이지 구성 순서", text: "첫 화면부터 구매 결정과 FAQ까지 읽는 순서를 설계하세요.", prompt: "문제 제시 → 핵심 이점 → 근거 → 사용법 → 정보" },
  { icon: BookOpenCheck, title: "필수 표시·정책", text: "제품명, 소재, 원산지, 인증, 사용 주의, 배송·교환·반품 정보를 준비하세요.", prompt: "제품별 법정 표시사항을 최종 확인" },
];

const flow = ["타깃 고객과 문제 정의", "핵심 이점 1~3개 선정", "근거 자료와 경쟁 차이 정리", "촬영·이미지 목록 작성", "상세페이지 스토리 구성", "디자인 제작과 모바일 검수", "법정 표시·과장 표현 최종 검수"];
const checklist = ["첫 화면에서 제품과 핵심 이점이 바로 보인다", "특징보다 고객이 얻는 결과를 설명한다", "수치와 효능 표현에 확인 가능한 근거가 있다", "실제 크기·구성품·사용법을 보여준다", "원산지·소재·인증·주의사항을 표시한다", "배송·교환·반품 조건을 안내한다", "모바일 화면에서 글자가 읽기 쉽다", "타사 이미지와 문구를 무단 사용하지 않았다"];

export default function ProductSellingPage() {
  const [memos, setMemos] = useState<ProductMemo[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedMemos = localStorage.getItem("bizneed-product-selling-memos");
    const savedChecks = localStorage.getItem("bizneed-product-selling-checks");
    if (savedMemos) setMemos(JSON.parse(savedMemos));
    if (savedChecks) setCompleted(JSON.parse(savedChecks));
  }, []);
  const saveMemos = (next: ProductMemo[]) => { setMemos(next); localStorage.setItem("bizneed-product-selling-memos", JSON.stringify(next)); };
  const toggle = (item: string) => {
    const next = completed.includes(item) ? completed.filter((value) => value !== item) : [...completed, item];
    setCompleted(next); localStorage.setItem("bizneed-product-selling-checks", JSON.stringify(next));
  };
  const addMemo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const editorUrl = String(data.get("editorUrl") ?? "");
    saveMemos([...memos, {
      id: crypto.randomUUID(), product: String(data.get("product") ?? ""), customer: String(data.get("customer") ?? ""),
      problem: String(data.get("problem") ?? ""), benefit: String(data.get("benefit") ?? ""), evidence: String(data.get("evidence") ?? ""),
      shots: String(data.get("shots") ?? ""), structure: String(data.get("structure") ?? ""), legal: String(data.get("legal") ?? ""),
      editorUrl: editorUrl && !editorUrl.startsWith("http") ? `https://${editorUrl}` : editorUrl, memo: String(data.get("memo") ?? ""),
    }]);
    setShowModal(false);
  };

  return (
    <AppShell>
      <header className="selling-hero"><div><span className="overline">PRODUCT SELLING</span><h1>제품 셀링·상세페이지</h1><p>제품의 장점을 나열하기 전에 고객이 구매를 결정할 수 있도록<br />메시지, 근거, 이미지와 페이지 흐름을 먼저 설계하세요.</p></div><button className="button button-dark" onClick={() => setShowModal(true)}><Plus size={17} /> 제품 메모 추가</button></header>

      <section className="selling-tools">
        <article><span className="tool-logo jeditor"><Sparkles size={24} /></span><div><small>AI·에디터 활용</small><h2>제디터</h2><p>제품 정보와 핵심 장점, 원하는 구성 순서를 먼저 정리한 뒤 상세페이지 초안 제작에 활용하세요. 생성 결과의 사실관계와 표현은 직접 검수해야 합니다.</p><ol><li>제품명·고객·핵심 장점을 입력</li><li>사용할 이미지와 페이지 흐름 설정</li><li>생성된 문구와 디자인 수정</li><li>법정 표시와 과장 표현 최종 확인</li></ol></div><a href="https://www.google.com/search?q=%EC%A0%9C%EB%94%94%ED%84%B0+%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80" target="_blank" rel="noreferrer">제디터 검색 <Search size={15} /></a></article>
        <article><span className="tool-logo miri"><LayoutTemplate size={24} /></span><div><small>템플릿 기반 디자인</small><h2>미리캔버스</h2><p>상세페이지 템플릿을 선택하고 사진·문구·색상을 브랜드에 맞게 바꿔 제작하세요. 미리캔버스 공식 사이트에서 상세페이지 템플릿을 제공합니다.</p><ol><li>템플릿에서 상세페이지 검색</li><li>제품 이미지와 브랜드 색상 적용</li><li>섹션 순서와 문구 수정</li><li>긴 이미지로 다운로드 후 모바일 검수</li></ol></div><a href="https://www.miricanvas.com" target="_blank" rel="noreferrer">미리캔버스 열기 <ExternalLink size={15} /></a></article>
      </section>
      <div className="selling-tool-note"><Lightbulb size={18} /><p><strong>제작 도구 사용 원칙</strong>AI 또는 템플릿이 만든 문구를 그대로 사용하지 말고, 제품의 실제 사양·인증·효능 근거와 일치하는지 확인하세요. 타사 이미지와 후기의 무단 사용도 피해야 합니다.</p></div>

      <div className="selling-section-title"><span className="overline">CONTENT NOTES</span><h2>상세페이지 제작 전에 정리할 메모</h2></div>
      <section className="selling-section-grid">{sections.map((section) => { const Icon = section.icon; return <article key={section.title}><span><Icon size={21} /></span><h3>{section.title}</h3><p>{section.text}</p><small>{section.prompt}</small></article>; })}</section>

      <div className="selling-section-title"><span className="overline">PAGE FLOW</span><h2>구매 결정까지의 페이지 흐름</h2></div>
      <section className="selling-flow">{flow.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < flow.length - 1 && <ArrowRight size={16} />}</div>)}</section>

      <section className="selling-layout">
        <div><div className="selling-section-title"><span className="overline">MY PRODUCT MEMOS</span><h2>내 제품 상세페이지 메모</h2></div><div className="selling-memos">{memos.length === 0 && <button className="selling-empty" onClick={() => setShowModal(true)}><Plus size={25} /><strong>첫 제품 메모 추가</strong><p>상세페이지를 만들기 전에 필요한 정보를 기록하세요.</p></button>}{memos.map((memo) => <article key={memo.id}><div className="memo-card-title"><span><ShoppingBasket size={17} /> 제품 메모</span><button onClick={() => saveMemos(memos.filter((item) => item.id !== memo.id))}><Trash2 size={15} /></button></div><h3>{memo.product}</h3><p className="memo-customer"><Target size={15} /> {memo.customer || "고객 미입력"}</p><div className="memo-values"><p><strong>고객 문제</strong>{memo.problem || "-"}</p><p><strong>핵심 이점</strong>{memo.benefit || "-"}</p><p><strong>신뢰 근거</strong>{memo.evidence || "-"}</p><p><strong>촬영컷</strong>{memo.shots || "-"}</p><p><strong>구성 순서</strong>{memo.structure || "-"}</p><p><strong>표시사항</strong>{memo.legal || "-"}</p></div>{memo.memo && <p className="memo-extra">{memo.memo}</p>}{memo.editorUrl && <a href={memo.editorUrl} target="_blank" rel="noreferrer">작업 페이지 열기 <ExternalLink size={14} /></a>}</article>)}</div></div>
        <aside><div className="selling-section-title"><span className="overline">FINAL CHECK</span><h2>등록 전 최종 검수</h2></div><div className="selling-checklist">{checklist.map((item) => <button className={completed.includes(item) ? "done" : ""} onClick={() => toggle(item)} key={item}><span>{completed.includes(item) && <Check size={15} />}</span>{item}</button>)}</div></aside>
      </section>
      {showModal && <MemoModal onClose={() => setShowModal(false)} onSubmit={addMemo} />}
    </AppShell>
  );
}

function MemoModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const fields = [["customer","타깃 고객","예: 1인 가구, 초보 판매자"],["problem","고객의 문제","어떤 불편 때문에 제품을 찾나요?"],["benefit","핵심 이점","고객이 얻게 되는 변화"],["evidence","신뢰 근거","수치, 시험, 소재, 후기 계획"],["shots","필요한 촬영컷","대표컷, 사용컷, 크기 비교 등"],["structure","페이지 구성 순서","문제 → 이점 → 근거 → 사용법"],["legal","필수 표시사항","원산지, 소재, 인증, 주의사항"]];
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="selling-modal" onMouseDown={(event) => event.stopPropagation()}><div className="selling-modal-title"><div><span className="overline">ADD PRODUCT NOTE</span><h2>제품 상세페이지 메모</h2></div><button onClick={onClose}><X size={20} /></button></div><form onSubmit={onSubmit}><label>제품명<input name="product" required placeholder="제품명을 입력하세요." /></label>{fields.map(([name,label,placeholder]) => <label key={name}>{label}<textarea name={name} rows={2} placeholder={placeholder} /></label>)}<label>제디터·미리캔버스 작업 URL<input name="editorUrl" placeholder="작업 중인 페이지 주소" /></label><label>추가 메모<textarea name="memo" rows={3} /></label><div className="modal-actions"><button type="button" className="button button-ghost" onClick={onClose}>취소</button><button className="button button-dark">저장하기</button></div></form></div></div>;
}
