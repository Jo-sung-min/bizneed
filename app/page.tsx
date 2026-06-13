"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  Lightbulb,
  MoreHorizontal,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useProgress } from "@/components/ProgressContext";

const phases = [
  { label: "방향 정하기", value: 67, color: "#c9f65c" },
  { label: "사업자등록", value: 25, color: "#77d7c4" },
  { label: "운영 준비", value: 10, color: "#ffb996" },
  { label: "성장 기반", value: 0, color: "#bfc8d6" },
];

function DashboardContent() {
  const { percent, completed, total } = useProgress();

  return (
    <>
      <header className="topbar">
        <div>
          <span className="overline">SAT, 13 JUNE</span>
          <h1>안녕하세요, 김비즈님</h1>
          <p>오늘도 사업 준비를 한 걸음 진행해볼까요?</p>
        </div>
        <Link className="button button-ghost" href="/business-registration">
          전체 계획 보기 <ArrowRight size={17} />
        </Link>
      </header>

      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> 이번 주 준비 현황</span>
          <h2>시작이 가장 어려우니까,<br /><em>순서대로</em> 준비했어요.</h2>
          <p>사업자등록부터 첫 세금 신고까지, 지금 필요한 일만 알려드릴게요.</p>
          <Link className="button button-dark" href="/business-registration">
            다음 할 일 시작하기 <ArrowRight size={17} />
          </Link>
        </div>
        <div className="overall-progress">
          <div className="progress-ring" style={{ "--progress": `${Math.max(percent, 8) * 3.6}deg` } as React.CSSProperties}>
            <div>
              <span>전체 달성률</span>
              <strong>{percent}%</strong>
              <small>{completed.length} / {total} 완료</small>
            </div>
          </div>
          <span className="progress-note"><TrendingUp size={15} /> 지난주보다 2단계 진행했어요</span>
        </div>
      </section>

      <div className="section-heading">
        <div><span className="overline">PROGRESS MAP</span><h2>준비 단계별 달성률</h2></div>
        <button className="icon-button"><MoreHorizontal size={20} /></button>
      </div>

      <section className="progress-grid">
        {phases.map((phase, index) => (
          <article className="phase-card" key={phase.label}>
            <div className="phase-top">
              <span className="phase-number">0{index + 1}</span>
              <span className="phase-value">{phase.value}%</span>
            </div>
            <h3>{phase.label}</h3>
            <div className="bar"><span style={{ width: `${phase.value}%`, background: phase.color }} /></div>
            <small>{index === 0 ? "2개 항목 남음" : index === 1 ? "지금 진행 중" : "아직 시작 전"}</small>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="next-card">
          <div className="card-title"><span><CalendarCheck2 size={19} /> 지금 하면 좋은 일</span><small>약 10분</small></div>
          <div className="next-content">
            <span className="task-icon"><FileText size={27} /></span>
            <div>
              <span className="task-tag">사업자등록 · 2단계</span>
              <h3>필요 서류 미리 준비하기</h3>
              <p>신분증과 임대차계약서 사본을 준비하면 신청이 훨씬 빨라져요.</p>
            </div>
            <Link href="/business-registration" className="circle-arrow"><ArrowRight size={20} /></Link>
          </div>
          <div className="tip-row"><Lightbulb size={16} /><span>사업장이 자택이라면 임대차계약서가 필요하지 않을 수 있어요.</span></div>
        </article>

        <article className="status-card">
          <div className="card-title"><span>카테고리별 현황</span><ChevronRight size={17} /></div>
          <div className="status-list">
            {[
              { icon: Building2, label: "사업자등록", count: `${completed.length}/12`, tone: "green" },
              { icon: CreditCard, label: "금융 준비", count: "0/4", tone: "yellow" },
              { icon: ShoppingBag, label: "판매 준비", count: "0/6", tone: "pink" },
            ].map((item) => {
              const Icon = item.icon;
              return <div className="status-row" key={item.label}><span className={`status-icon ${item.tone}`}><Icon size={18} /></span><strong>{item.label}</strong><span>{item.count}</span><ChevronRight size={16} /></div>;
            })}
          </div>
        </article>
      </section>

      <section className="activity-strip">
        <span className="activity-icon"><CheckCircle2 size={18} /></span>
        <div><strong>최근 완료</strong><p>사업 형태 결정하기를 완료했어요.</p></div>
        <span><Clock3 size={14} /> 오늘 오전</span>
      </section>
    </>
  );
}

export default function Dashboard() {
  return <AppShell><DashboardContent /></AppShell>;
}
