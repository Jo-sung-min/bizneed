"use client";

import { AppShell } from "@/components/AppShell";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Lightbulb,
  Plus,
  RotateCcw,
  Save,
  ShieldAlert,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./tax-calendar.css";

type TaxEvent = {
  id: string;
  month: number;
  day: number;
  title: string;
  type: "vat" | "income" | "withholding" | "custom";
  target: string;
  preparation: string[];
  fallback: string[];
  system: string;
};

type CustomEvent = {
  id: string;
  date: string;
  title: string;
  memo: string;
};

const baseEvents: TaxEvent[] = [
  { id: "withholding-1", month: 1, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["급여·사업소득 지급 내역", "원천징수세액 계산 자료", "지급 대상자 정보"], fallback: ["기한 후 신고·납부를 즉시 진행", "가산세 예상액 확인", "오류가 있으면 수정신고 검토"], system: "급여 지급 즉시 지급명세와 원천세액을 기록하고 매월 5일에 자료를 마감하세요." },
  { id: "vat-1", month: 1, day: 25, title: "부가가치세 확정 신고", type: "vat", target: "일반과세 개인사업자 등", preparation: ["매출·매입 세금계산서", "카드·현금영수증 내역", "수입신고필증과 비용 증빙"], fallback: ["홈택스에서 기한 후 신고", "납부 지연 가산세 확인", "납부가 어렵다면 분납·납부기한 연장 가능 여부 문의"], system: "사업용 카드·계좌를 분리하고 매월 매출·매입 증빙을 마감하세요." },
  { id: "withholding-2", month: 2, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["전월 지급 내역", "원천징수 자료"], fallback: ["기한 후 신고·납부", "가산세 확인"], system: "매월 5일 원천세 자료를 사전 점검하세요." },
  { id: "withholding-3", month: 3, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["전월 지급 내역", "원천징수 자료"], fallback: ["기한 후 신고·납부", "가산세 확인"], system: "매월 5일 원천세 자료를 사전 점검하세요." },
  { id: "withholding-4", month: 4, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["전월 지급 내역", "원천징수 자료"], fallback: ["기한 후 신고·납부", "가산세 확인"], system: "매월 5일 원천세 자료를 사전 점검하세요." },
  { id: "vat-4", month: 4, day: 25, title: "부가가치세 예정 신고·고지 확인", type: "vat", target: "대상 일반과세자·법인사업자 등", preparation: ["예정고지서 또는 신고 대상 여부", "분기 매출·매입 자료"], fallback: ["고지·신고 대상 여부를 홈택스에서 확인", "미납 시 즉시 납부 및 가산세 확인"], system: "분기 종료 후 5일 이내 증빙을 정리하세요." },
  { id: "withholding-5", month: 5, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["전월 지급 내역", "원천징수 자료"], fallback: ["기한 후 신고·납부", "가산세 확인"], system: "매월 5일 원천세 자료를 사전 점검하세요." },
  { id: "income-5", month: 5, day: 31, title: "종합소득세 신고·납부", type: "income", target: "개인사업자 및 종합소득이 있는 개인", preparation: ["연간 매출·비용 장부", "세금계산서·카드·현금영수증", "재고·인건비·보험료 자료"], fallback: ["기한 후 신고를 최대한 빠르게 진행", "납부할 세액과 가산세 확인", "장부가 부족하면 세무 전문가와 추계신고 가능 여부 검토"], system: "매월 손익을 마감하고 세금 예상액을 별도 계좌에 적립하세요." },
  { id: "withholding-6", month: 6, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["전월 지급 내역", "원천징수 자료"], fallback: ["기한 후 신고·납부", "가산세 확인"], system: "매월 5일 원천세 자료를 사전 점검하세요." },
  { id: "withholding-7", month: 7, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["전월 지급 내역", "원천징수 자료"], fallback: ["기한 후 신고·납부", "가산세 확인"], system: "매월 5일 원천세 자료를 사전 점검하세요." },
  { id: "vat-7", month: 7, day: 25, title: "부가가치세 확정 신고", type: "vat", target: "일반과세 개인사업자 등", preparation: ["상반기 매출·매입 자료", "수입·통관 비용 증빙", "사업용 카드·계좌 내역"], fallback: ["홈택스 기한 후 신고", "누락 증빙 반영 및 수정신고 검토", "가산세·납부 지원 제도 확인"], system: "매월 부가세 예상액을 별도 계좌에 적립하세요." },
  { id: "withholding-8", month: 8, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["전월 지급 내역", "원천징수 자료"], fallback: ["기한 후 신고·납부", "가산세 확인"], system: "매월 5일 원천세 자료를 사전 점검하세요." },
  { id: "withholding-9", month: 9, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["전월 지급 내역", "원천징수 자료"], fallback: ["기한 후 신고·납부", "가산세 확인"], system: "매월 5일 원천세 자료를 사전 점검하세요." },
  { id: "withholding-10", month: 10, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["전월 지급 내역", "원천징수 자료"], fallback: ["기한 후 신고·납부", "가산세 확인"], system: "매월 5일 원천세 자료를 사전 점검하세요." },
  { id: "vat-10", month: 10, day: 25, title: "부가가치세 예정 신고·고지 확인", type: "vat", target: "대상 일반과세자·법인사업자 등", preparation: ["예정고지서 또는 신고 대상 여부", "분기 매출·매입 자료"], fallback: ["고지·신고 대상 여부 확인", "미납 시 즉시 납부 및 가산세 확인"], system: "분기 종료 후 증빙과 부가세 적립액을 점검하세요." },
  { id: "withholding-11", month: 11, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["전월 지급 내역", "원천징수 자료"], fallback: ["기한 후 신고·납부", "가산세 확인"], system: "매월 5일 원천세 자료를 사전 점검하세요." },
  { id: "income-11", month: 11, day: 30, title: "종합소득세 중간예납 확인", type: "income", target: "중간예납 고지 대상 개인사업자", preparation: ["홈택스 고지 내역", "납부 자금", "사업 실적 변동 자료"], fallback: ["고지 대상과 미납액 확인", "납부 곤란 시 지원 제도 문의"], system: "11월 납부 가능성을 고려해 세금 계좌 잔액을 관리하세요." },
  { id: "withholding-12", month: 12, day: 10, title: "원천세 신고·납부", type: "withholding", target: "직원·프리랜서에게 소득을 지급한 사업자", preparation: ["전월 지급 내역", "원천징수 자료"], fallback: ["기한 후 신고·납부", "가산세 확인"], system: "연말 지급명세와 장부를 함께 점검하세요." },
];

const typeLabel = { vat: "부가세", income: "소득세", withholding: "원천세", custom: "내 일정" };
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
const dateKey = (year: number, month: number, day: number) => `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export default function TaxCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [memos, setMemos] = useState<Record<string, string>>({});
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const savedMemos = localStorage.getItem("bizneed-tax-memos");
    const savedEvents = localStorage.getItem("bizneed-tax-events");
    if (savedMemos) setMemos(JSON.parse(savedMemos));
    if (savedEvents) setCustomEvents(JSON.parse(savedEvents));
  }, []);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const selectedKey = dateKey(year, month, selectedDay);
  const monthEvents = baseEvents.filter((event) => event.month === month);
  const selectedEvents = [
    ...monthEvents.filter((event) => event.day === selectedDay),
    ...customEvents.filter((event) => event.date === selectedKey).map((event) => ({ ...event, month, day: selectedDay, type: "custom" as const, target: "직접 등록한 일정", preparation: event.memo ? [event.memo] : [], fallback: [], system: "날짜별 메모와 함께 관리하세요." })),
  ];

  const calendarCells = useMemo(() => Array.from({ length: firstDay + daysInMonth }, (_, index) => index < firstDay ? null : index - firstDay + 1), [daysInMonth, firstDay]);
  const moveMonth = (amount: number) => {
    const next = new Date(year, month - 1 + amount, 1);
    setYear(next.getFullYear()); setMonth(next.getMonth() + 1); setSelectedDay(1);
  };
  const saveMemo = (value: string) => {
    const next = { ...memos, [selectedKey]: value };
    setMemos(next); localStorage.setItem("bizneed-tax-memos", JSON.stringify(next));
  };
  const addEvent = (title: string, memo: string) => {
    const next = [...customEvents, { id: crypto.randomUUID(), date: selectedKey, title, memo }];
    setCustomEvents(next); localStorage.setItem("bizneed-tax-events", JSON.stringify(next)); setShowAdd(false);
  };

  return (
    <AppShell>
      <header className="tax-header">
        <div><span className="overline">TAX MANAGEMENT</span><h1>세금 일정</h1><p>신고·납부 일정을 미리 확인하고 필요한 증빙과 대응 방법을 함께 관리하세요.</p></div>
        <a className="button button-dark" href="https://www.hometax.go.kr" target="_blank" rel="noreferrer">홈택스 확인 <ExternalLink size={16} /></a>
      </header>

      <div className="tax-notice"><ShieldAlert size={19} /><p><strong>일정 확인 안내</strong>아래 일정은 일반적인 개인사업자 기준의 대표 일정입니다. 과세 유형, 직원 고용 여부, 고지 방식과 공휴일에 따라 실제 기한이 달라질 수 있으므로 홈택스에서 최종 확인하세요.</p></div>

      <section className="tax-summary">
        <article><span className="tax-summary-icon vat"><WalletCards size={21} /></span><div><small>이번 달 기본 일정</small><strong>{monthEvents.length}개</strong></div></article>
        <article><span className="tax-summary-icon memo"><FileText size={21} /></span><div><small>이번 달 내 메모</small><strong>{Object.keys(memos).filter((key) => key.startsWith(`${year}-${String(month).padStart(2, "0")}`) && memos[key]).length}개</strong></div></article>
        <article><span className="tax-summary-icon custom"><CalendarCheck2 size={21} /></span><div><small>이번 달 추가 일정</small><strong>{customEvents.filter((event) => event.date.startsWith(`${year}-${String(month).padStart(2, "0")}`)).length}개</strong></div></article>
      </section>

      <section className="tax-layout">
        <div className="calendar-card">
          <div className="calendar-heading"><button onClick={() => moveMonth(-1)}><ChevronLeft size={19} /></button><h2>{year}년 {month}월</h2><button onClick={() => moveMonth(1)}><ChevronRight size={19} /></button></div>
          <div className="calendar-weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">
            {calendarCells.map((day, index) => {
              if (!day) return <span className="empty-day" key={`empty-${index}`} />;
              const events = monthEvents.filter((event) => event.day === day);
              const hasMemo = Boolean(memos[dateKey(year, month, day)]);
              const custom = customEvents.filter((event) => event.date === dateKey(year, month, day));
              return <button className={`${selectedDay === day ? "selected" : ""} ${today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === day ? "today" : ""}`} key={day} onClick={() => setSelectedDay(day)}><span>{day}</span><div>{events.slice(0, 2).map((event) => <small className={event.type} key={event.id}>{event.title}</small>)}{custom.slice(0, 1).map((event) => <small className="custom" key={event.id}>{event.title}</small>)}</div>{hasMemo && <i />}</button>;
            })}
          </div>
        </div>

        <aside className="tax-day-panel">
          <div className="day-panel-heading"><div><span>{month}월</span><strong>{selectedDay}</strong><small>{weekdays[new Date(year, month - 1, selectedDay).getDay()]}요일</small></div><button onClick={() => setShowAdd(true)}><Plus size={16} /> 일정 추가</button></div>
          <div className="day-events">
            {selectedEvents.length === 0 ? <div className="no-events"><CalendarCheck2 size={23} /><p>등록된 세금 일정이 없습니다.</p></div> : selectedEvents.map((event) => <article className={event.type} key={event.id}><span>{typeLabel[event.type]}</span><h3>{event.title}</h3><p>{event.target}</p>{event.type === "custom" && <button onClick={() => { const next = customEvents.filter((item) => item.id !== event.id); setCustomEvents(next); localStorage.setItem("bizneed-tax-events", JSON.stringify(next)); }}><X size={14} /> 삭제</button>}</article>)}
          </div>
          <label className="tax-memo"><span><FileText size={15} /> 날짜별 메모</span><textarea value={memos[selectedKey] ?? ""} onChange={(event) => saveMemo(event.target.value)} placeholder="증빙 준비 상황, 세무사 문의 내용 등을 기록하세요." /><small><Save size={13} /> 입력 내용은 자동 저장됩니다.</small></label>
        </aside>
      </section>

      <div className="tax-section-title"><span className="overline">WHAT TO DO</span><h2>선택한 날짜의 세금 업무 안내</h2></div>
      <section className="tax-guides">
        {selectedEvents.filter((event) => event.type !== "custom").length === 0 ? <div className="tax-empty-guide">캘린더에서 세금 일정이 표시된 날짜를 선택하면 준비사항과 대응 방법을 확인할 수 있습니다.</div> : selectedEvents.filter((event) => event.type !== "custom").map((event) => <article key={event.id}><div className="guide-name"><span className={event.type}>{typeLabel[event.type]}</span><h3>{event.title}</h3><p>대상: {event.target}</p></div><div><strong><CheckCircle2 size={16} /> 필요한 준비</strong>{event.preparation.map((item) => <p key={item}>{item}</p>)}</div><div className="fallback"><strong><RotateCcw size={16} /> 놓쳤을 때 대체·대응</strong>{event.fallback.map((item) => <p key={item}>{item}</p>)}</div><div className="system-tip"><Lightbulb size={16} /><p><strong>체계화 방법</strong>{event.system}</p></div></article>)}
      </section>

      <div className="tax-section-title"><span className="overline">SYSTEMIZE</span><h2>세금 업무 체계화 방법</h2></div>
      <section className="tax-system-grid">
        <article><span>01</span><Clock3 size={21} /><h3>월 1회 장부 마감</h3><p>매월 5일까지 전월 매출·매입, 급여, 수입·통관 비용을 정리하세요.</p></article>
        <article><span>02</span><WalletCards size={21} /><h3>세금 전용 계좌</h3><p>매출 입금 시 예상 부가세와 소득세를 별도 계좌로 옮겨 납부 자금을 확보하세요.</p></article>
        <article><span>03</span><FileText size={21} /><h3>증빙 폴더 통일</h3><p>연도·월·세목 기준으로 세금계산서, 카드, 송금, 통관 증빙을 보관하세요.</p></article>
        <article><span>04</span><AlertTriangle size={21} /><h3>이중 알림 설정</h3><p>신고기한 14일 전과 3일 전에 캘린더 알림을 만들고 담당자를 지정하세요.</p></article>
      </section>

      {showAdd && <AddEventModal date={`${year}년 ${month}월 ${selectedDay}일`} onClose={() => setShowAdd(false)} onSave={addEvent} />}
    </AppShell>
  );
}

function AddEventModal({ date, onClose, onSave }: { date: string; onClose: () => void; onSave: (title: string, memo: string) => void }) {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="tax-modal" onMouseDown={(event) => event.stopPropagation()}><div><span className="overline">ADD SCHEDULE</span><button onClick={onClose}><X size={19} /></button></div><h2>내 일정 추가</h2><p>{date}</p><label>일정 제목<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 세무사에게 자료 전달" /></label><label>메모<textarea value={memo} onChange={(event) => setMemo(event.target.value)} rows={4} placeholder="준비할 자료와 참고 내용을 적어주세요." /></label><div className="modal-actions"><button className="button button-ghost" onClick={onClose}>취소</button><button className="button button-dark" disabled={!title.trim()} onClick={() => onSave(title, memo)}>저장하기</button></div></div></div>;
}
