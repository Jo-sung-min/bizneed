"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileText,
  Info,
  Lightbulb,
  MapPin,
  Monitor,
  Paperclip,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useProgress } from "@/components/ProgressContext";

const steps = [
  {
    number: "01",
    title: "사업 형태와 업종 정하기",
    description: "개인사업자와 법인사업자의 차이를 이해하고, 실제 영업 내용에 맞는 업종을 선택해요.",
    duration: "약 20분",
    tasks: [
      { id: "type", label: "개인사업자 또는 법인사업자 선택하기" },
      { id: "industry", label: "주업종과 업종코드 확인하기" },
      { id: "name", label: "사용할 상호 정하기" },
    ],
    tip: "처음 소규모로 시작한다면 설립과 관리가 간단한 개인사업자를 주로 선택해요.",
  },
  {
    number: "02",
    title: "사업장과 필수 서류 준비",
    description: "신청 과정에서 바로 제출할 수 있도록 필요한 서류를 미리 준비해요.",
    duration: "약 30분",
    tasks: [
      { id: "lease", label: "사업장 주소와 임대차계약서 확인하기" },
      { id: "id-card", label: "대표자 신분증 준비하기" },
      { id: "permit", label: "인허가 업종 여부 확인하기" },
    ],
    tip: "업종에 따라 허가증·신고필증 등이 필요합니다. 관할 기관에서 먼저 확인하세요.",
  },
  {
    number: "03",
    title: "사업자등록 신청하기",
    description: "홈택스에서 온라인으로 신청하거나 관할 세무서를 직접 방문해 신청해요.",
    duration: "약 15분",
    tasks: [
      { id: "login", label: "홈택스 로그인 또는 세무서 방문 준비" },
      { id: "form", label: "사업자등록 신청서 작성하기" },
      { id: "submit", label: "준비 서류 첨부 후 제출하기" },
    ],
    tip: "온라인 신청은 공동·금융인증서나 간편인증이 필요할 수 있어요.",
  },
  {
    number: "04",
    title: "등록증 확인과 다음 준비",
    description: "발급된 사업자등록증의 정보를 확인하고 운영에 필요한 후속 업무를 시작해요.",
    duration: "약 10분",
    tasks: [
      { id: "certificate", label: "사업자등록증 정보 확인하기" },
      { id: "account", label: "사업용 계좌와 카드 준비하기" },
      { id: "tax", label: "세금 신고 일정 확인하기" },
    ],
    tip: "상호, 대표자, 업종, 사업장 주소가 신청한 내용과 같은지 꼭 확인하세요.",
  },
];

function RegistrationGuideContent() {
  const { completed, toggleTask, percent } = useProgress();
  const [openStep, setOpenStep] = useState(0);

  return (
    <>
      <header className="guide-topbar">
        <Link href="/" className="back-link"><ArrowLeft size={17} /> 홈으로</Link>
        <div className="guide-progress-mini">
          <span>사업자등록 진행률</span>
          <div className="bar"><span style={{ width: `${percent}%` }} /></div>
          <strong>{percent}%</strong>
        </div>
      </header>

      <section className="guide-hero">
        <div>
          <span className="eyebrow"><Sparkles size={14} /> BUSINESS REGISTRATION</span>
          <h1>사업자등록,<br />이 순서면 어렵지 않아요.</h1>
          <p>개인사업자 등록에 필요한 준비부터 신청 후 확인까지<br />놓치기 쉬운 내용을 네 단계로 정리했어요.</p>
          <div className="guide-meta">
            <span><Clock3 size={16} /> 준비 약 1시간</span>
            <span><FileText size={16} /> 총 12개 할 일</span>
          </div>
        </div>
        <div className="document-visual">
          <span className="doc-pin"><Paperclip size={20} /></span>
          <div className="doc-sheet back" />
          <div className="doc-sheet">
            <span className="doc-badge"><CheckCircle2 size={20} /></span>
            <small>사업자등록증</small>
            <strong>BIZ<br />READY</strong>
            <div className="doc-lines"><i /><i /><i /></div>
          </div>
          <span className="floating-note"><Lightbulb size={16} /> 차근차근 하면 돼요</span>
        </div>
      </section>

      <section className="route-card">
        <div className="route-heading"><span className="overline">AT A GLANCE</span><h2>전체 과정 미리보기</h2></div>
        <div className="route-steps">
          {steps.map((step, index) => (
            <button key={step.number} onClick={() => setOpenStep(index)} className={openStep === index ? "active" : ""}>
              <span>{step.number}</span><strong>{step.title}</strong>{index < steps.length - 1 && <ArrowRight size={17} />}
            </button>
          ))}
        </div>
      </section>

      <div className="guide-layout">
        <section className="step-list">
          <div className="section-heading">
            <div><span className="overline">STEP BY STEP</span><h2>하나씩 준비해보세요</h2></div>
            <span className="save-state"><Check size={14} /> 자동 저장됨</span>
          </div>

          {steps.map((step, index) => {
            const stepDone = step.tasks.filter((task) => completed.includes(task.id)).length;
            const isOpen = openStep === index;
            return (
              <article className={`step-card ${isOpen ? "step-open" : ""}`} key={step.number}>
                <button className="step-summary" onClick={() => setOpenStep(isOpen ? -1 : index)}>
                  <span className="step-index">{stepDone === step.tasks.length ? <Check size={20} /> : step.number}</span>
                  <div><span>{step.duration}</span><h3>{step.title}</h3><p>{step.description}</p></div>
                  <span className="step-count">{stepDone}/{step.tasks.length}</span>
                  <ChevronDown className="chevron" size={20} />
                </button>
                {isOpen && (
                  <div className="step-detail">
                    <div className="task-checklist">
                      {step.tasks.map((task) => {
                        const checked = completed.includes(task.id);
                        return (
                          <button className={checked ? "checked" : ""} key={task.id} onClick={() => toggleTask(task.id)}>
                            <span>{checked && <Check size={15} />}</span>{task.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="step-tip"><Lightbulb size={17} /><p><strong>알아두세요</strong>{step.tip}</p></div>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <aside className="guide-aside">
          <div className="aside-card">
            <span className="aside-icon"><Monitor size={20} /></span>
            <h3>어디서 신청하나요?</h3>
            <p>온라인은 국세청 홈택스, 오프라인은 사업장 관할 세무서에서 신청할 수 있어요.</p>
            <a href="https://www.hometax.go.kr" target="_blank" rel="noreferrer">홈택스 바로가기 <ExternalLink size={14} /></a>
            <span className="location-link"><MapPin size={14} /> 관할 세무서 확인하기</span>
          </div>
          <div className="aside-card peach">
            <span className="aside-icon"><AlertCircle size={20} /></span>
            <h3>신청 전 확인</h3>
            <p>업종 및 사업 형태에 따라 필요한 서류와 절차가 달라질 수 있어요.</p>
          </div>
          <div className="aside-note"><Info size={16} /><p>이 가이드는 일반적인 개인사업자 등록 절차를 안내하며 세무·법률 자문을 대신하지 않습니다.</p></div>
        </aside>
      </div>
    </>
  );
}

export default function RegistrationGuide() {
  return <AppShell><RegistrationGuideContent /></AppShell>;
}
