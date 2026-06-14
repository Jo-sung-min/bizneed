"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileText,
  Info,
  Lightbulb,
  MapPin,
  Mail,
  Monitor,
  Paperclip,
  Search,
  Sparkles,
  Store,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useProgress } from "@/components/ProgressContext";

const steps = [
  {
    number: "01",
    title: "사업 형태와 업종 정하기",
    description: "온라인 판매에 맞는 사업 형태와 업종을 정하고 통신판매업 신고 필요 여부를 확인해요.",
    duration: "약 20분",
    tasks: [
      { id: "type", label: "개인사업자 또는 법인사업자 선택하기" },
      { id: "industry", label: "전자상거래·해외 사입에 맞는 업종코드 확인하기" },
      { id: "name", label: "사용할 상호 정하기" },
    ],
    tip: "온라인 판매와 해외 사입 계획이 드러나도록 업태·종목을 정하고 관할 세무서에 업종코드를 확인하세요.",
  },
  {
    number: "02",
    title: "강남권 비상주 사무실 계약",
    description: "집 주소 대신 사업자등록이 가능한 공유오피스 주소를 계약하고 증빙 서류를 준비해요.",
    duration: "약 30분",
    tasks: [
      { id: "lease", label: "사업자등록 가능한 강남권 비상주 주소 계약하기" },
      { id: "id-card", label: "대표자 신분증 준비하기" },
      { id: "permit", label: "임대차계약서·전대동의서 등 제출 서류 확인하기" },
    ],
    tip: "주소 자체를 소유하는 것이 아니라 일정 기간 사용할 권리를 계약합니다. 계약 전 해당 주소에서 전자상거래 업종의 사업자등록이 가능한지 확인하세요.",
  },
  {
    number: "03",
    title: "온라인으로 사업자등록 신청",
    description: "홈택스에서 전자상거래 업종과 계약한 공유오피스 주소를 입력해 신청해요.",
    duration: "약 15분",
    tasks: [
      { id: "login", label: "홈택스 로그인 또는 세무서 방문 준비" },
      { id: "form", label: "공유오피스 주소와 온라인 판매 업종 입력하기" },
      { id: "submit", label: "준비 서류 첨부 후 제출하기" },
    ],
    tip: "온라인 신청은 공동·금융인증서나 간편인증이 필요할 수 있어요.",
  },
  {
    number: "04",
    title: "온라인 판매 후속 준비",
    description: "등록증의 주소와 업종을 확인하고 통신판매업 신고, 계좌와 반품지를 준비해요.",
    duration: "약 10분",
    tasks: [
      { id: "certificate", label: "사업자등록증 정보 확인하기" },
      { id: "account", label: "사업용 계좌와 카드 준비하기" },
      { id: "tax", label: "통신판매업 신고·반품지·세금 일정 확인하기" },
    ],
    tip: "사업자등록 주소, 통신판매업 신고 주소, 쇼핑몰 사업자 정보와 우편물 수령 방식을 일관되게 관리하세요.",
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
          <p>온라인 판매 사업자등록과 강남권 비상주 공유오피스 주소 계약부터<br />통신판매업 신고 전 준비까지 네 단계로 정리했어요.</p>
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

      <section className="virtual-office-section">
        <div className="virtual-office-heading">
          <div><span className="overline">GANGNAM VIRTUAL OFFICE</span><h2>강남권 주소만 사용하고 싶다면</h2><p>비상주 공유오피스와 계약해 사업자등록용 주소와 계약서류를 제공받는 방식이 적합합니다.</p></div>
          <Link href="/my-assets">계약 정보 기록하기 <ArrowRight size={16} /></Link>
        </div>
        <div className="address-warning"><AlertCircle size={20} /><p><strong>주소를 구매하는 것은 아닙니다.</strong>사업장 주소를 사용할 수 있는 임대차·전대차 등의 계약을 맺는 방식입니다. 주소만 제공하면서 적법한 계약서류나 우편물 관리가 불가능한 곳은 피하세요.</p></div>
        <div className="virtual-price-grid">
          <article><span><Building2 size={21} /></span><small>비교 시작 범위</small><h3>월 약 2만~8만원</h3><p>보통 6개월·12개월 선납 계약 기준으로 비교를 시작할 수 있습니다. 강남역·테헤란로 등 상세 위치와 서비스에 따라 달라집니다.</p></article>
          <article><span><WalletCards size={21} /></span><small>단기·월 결제 비교 범위</small><h3>월 약 5만~15만원</h3><p>짧은 계약이나 월 납부는 단가가 높을 수 있습니다. 부가세, 보증금, 등록비 포함 여부를 확인하세요.</p></article>
          <article><span><Mail size={21} /></span><small>추가 비용 가능 항목</small><h3>우편 전달·회의실·실사 대응</h3><p>우편물 스캔·전달, 택배 보관, 회의실, 현장 실사 지원은 별도 비용일 수 있습니다.</p></article>
        </div>
        <p className="price-note">가격은 업체와 계약 기간에 따라 수시로 달라지는 비교용 범위입니다. 계약 전 최종 견적과 부가세 포함 여부를 확인하세요.</p>
        <div className="virtual-application">
          <div><span>01</span><Search size={20} /><h3>업체 3곳 이상 비교</h3><p>강남구 내 세부 주소, 월 비용, 계약 기간과 우편 서비스를 비교하세요.</p></div>
          <div><span>02</span><BadgeCheck size={20} /><h3>등록 가능 여부 확인</h3><p>전자상거래·해외 사입 업종 등록 가능 여부와 동일 주소 등록 사업자 수를 문의하세요.</p></div>
          <div><span>03</span><FileText size={20} /><h3>서류 확인 후 계약</h3><p>임대차계약서 또는 전대차계약서, 전대동의서, 건물 관련 서류 제공 범위를 확인하세요.</p></div>
          <div><span>04</span><Monitor size={20} /><h3>홈택스 온라인 신청</h3><p>계약 주소와 업종을 입력하고 요청받은 계약서류를 첨부하세요.</p></div>
        </div>
        <div className="virtual-check-grid">
          <article><h3>계약 전 반드시 질문할 것</h3><p>전자상거래 업종 사업자등록이 가능한가요?</p><p>세무서 현장 확인 요청 시 대응 가능한가요?</p><p>우편물 도착 알림과 전달 방식은 무엇인가요?</p><p>계약 종료 시 주소 이전 절차와 비용은 얼마인가요?</p><p>통신판매업 신고 주소로 사용할 수 있나요?</p></article>
          <article className="online-followup"><h3><Store size={18} /> 온라인 판매 후속 준비</h3><p>사업자등록 후 통신판매업 신고 대상 여부를 정부24에서 확인하세요.</p><p>고객에게 공개할 반품지는 공유오피스가 택배를 받는지 확인하거나 3PL 반품지를 별도로 사용하세요.</p><p>쇼핑몰 사업자 정보와 사업자등록증 주소가 일치하도록 관리하세요.</p><a href="https://www.gov.kr" target="_blank" rel="noreferrer">정부24 확인 <ExternalLink size={14} /></a></article>
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
