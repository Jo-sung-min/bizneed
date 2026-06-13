"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  FolderArchive,
  Map,
  PackageOpen,
  Home,
  Landmark,
  Menu,
  Settings,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import { useState } from "react";

const groups = [
  {
    label: "시작하기",
    items: [
      { label: "홈", href: "/", icon: Home },
      { label: "사업자등록", href: "/business-registration", icon: Building2 },
      { label: "사업 준비물 안내", href: "/business-preparation", icon: Map },
      { label: "사업용 계좌", href: "#", icon: CreditCard, soon: true },
      { label: "통신판매업 신고", href: "#", icon: Store, soon: true },
      { label: "내 사업 문서", href: "/my-assets", icon: FolderArchive },
    ],
  },
  {
    label: "운영 관리",
    items: [
      { label: "세금 일정", href: "/tax-calendar", icon: CalendarDays },
      { label: "포장·배송 운영", href: "/fulfillment", icon: PackageOpen },
      { label: "지원사업", href: "#", icon: CircleDollarSign, soon: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="메뉴 열기">
        <Menu size={20} />
      </button>
      {open && <button className="sidebar-backdrop" onClick={() => setOpen(false)} aria-label="메뉴 닫기" />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <Link href="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark"><Landmark size={19} /></span>
            <span>bizneed</span>
          </Link>
          <button className="sidebar-close" onClick={() => setOpen(false)} aria-label="메뉴 닫기">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-intro">
          <span className="eyebrow-dark"><Sparkles size={13} /> 사업 시작 가이드</span>
          <strong>좋은 시작을 위한<br />필요한 것들</strong>
          <p>복잡한 사업 준비를 하나씩 끝내보세요.</p>
        </div>

        <nav className="nav-groups">
          {groups.map((group) => (
            <div className="nav-group" key={group.label}>
              <span className="nav-label">{group.label}</span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    className={`nav-item ${active ? "active" : ""} ${item.soon ? "disabled" : ""}`}
                    href={item.href}
                    key={item.label}
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.soon ? <small>준비중</small> : active && <ChevronRight size={15} />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Link href="#" className="nav-item disabled"><Settings size={18} /> 설정</Link>
          <div className="profile-mini">
            <span className="avatar">김</span>
            <div><strong>김비즈님</strong><small><BadgeCheck size={12} /> 예비 사업자</small></div>
            <Bell size={17} />
          </div>
        </div>
      </aside>
    </>
  );
}
