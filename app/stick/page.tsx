"use client";

import { AppShell } from "@/components/AppShell";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  FolderKanban,
  Globe2,
  Instagram,
  Lightbulb,
  Link2,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Youtube,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import "./stick.css";

type RecordType = "idea" | "inspiration";
type SourceType = "idea" | "youtube" | "instagram" | "web";
type StickRecord = {
  id: string;
  type: RecordType;
  source: SourceType;
  title: string;
  body: string;
  tags: string[];
  url?: string;
  image?: string;
  createdAt: string;
};
type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  ideas: StickRecord[];
  inspirations: StickRecord[];
};
type ModalState =
  | { type: "project" }
  | { type: "idea"; record?: StickRecord }
  | { type: "inspiration"; record?: StickRecord }
  | { type: "record"; record: StickRecord }
  | null;

const STORAGE_KEY = "stick-projects-v2";
const sourceNames: Record<SourceType, string> = { idea: "나의 아이디어", youtube: "YouTube", instagram: "Instagram", web: "웹사이트" };

const seedProjects: Project[] = [{
  id: "starter-project",
  name: "나만의 브랜드 만들기",
  description: "브랜드의 분위기, 콘텐츠와 제품 아이디어를 한곳에 모으는 프로젝트",
  createdAt: new Date().toISOString(),
  ideas: [{
    id: "starter-idea",
    type: "idea",
    source: "idea",
    title: "매일 쓰고 싶은 물건을 만든다",
    body: "보기 좋은 것보다 손이 자주 가는 제품을 브랜드의 기준으로 삼기.",
    tags: ["브랜드", "방향성"],
    createdAt: new Date().toISOString(),
  }],
  inspirations: [],
}];

const sourceFromUrl = (url: string): SourceType => {
  try {
    const host = new URL(url).hostname;
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube";
    if (host.includes("instagram.com")) return "instagram";
  } catch {
    return "web";
  }
  return "web";
};

const splitTags = (value: FormDataEntryValue | null) => String(value ?? "").split(",").map((tag) => tag.trim()).filter(Boolean);

export default function StickPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "ideas" | "inspirations">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | Exclude<SourceType, "idea">>("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setProjects(saved ? JSON.parse(saved) : seedProjects);
    } catch {
      setProjects(seedProjects);
    }
  }, []);

  const saveProjects = (next: Project[]) => {
    setProjects(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const activeProject = projects.find((project) => project.id === activeProjectId) ?? null;
  const totals = {
    ideas: projects.reduce((sum, project) => sum + project.ideas.length, 0),
    inspirations: projects.reduce((sum, project) => sum + project.inspirations.length, 0),
  };
  const filteredProjects = useMemo(() => projects.filter((project) => {
    const records = [...project.ideas, ...project.inspirations];
    return `${project.name} ${project.description} ${records.map((record) => `${record.title} ${record.body}`).join(" ")}`.toLowerCase().includes(search.toLowerCase());
  }), [projects, search]);

  const filteredIdeas = activeProject?.ideas.filter((record) => `${record.title} ${record.body} ${record.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase())) ?? [];
  const filteredInspirations = activeProject?.inspirations.filter((record) => {
    const matchesSearch = `${record.title} ${record.body} ${record.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (sourceFilter === "all" || record.source === sourceFilter);
  }) ?? [];

  const updateActiveProject = (updater: (project: Project) => Project) => {
    saveProjects(projects.map((project) => project.id === activeProjectId ? updater(project) : project));
  };

  const deleteProject = () => {
    if (!activeProject || !window.confirm(`"${activeProject.name}" 프로젝트와 모든 기록을 삭제할까요?`)) return;
    saveProjects(projects.filter((project) => project.id !== activeProject.id));
    setActiveProjectId(null);
  };

  const deleteRecord = (record: StickRecord) => {
    if (!window.confirm("이 기록을 삭제할까요?")) return;
    updateActiveProject((project) => ({
      ...project,
      ideas: project.ideas.filter((item) => item.id !== record.id),
      inspirations: project.inspirations.filter((item) => item.id !== record.id),
    }));
    setModal(null);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ format: "stick-backup", version: 1, projects }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stick-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const next = Array.isArray(parsed) ? parsed : parsed.projects;
      if (!Array.isArray(next)) throw new Error("invalid");
      if (window.confirm("현재 데이터를 선택한 백업 파일로 교체할까요?")) {
        saveProjects(next);
        setActiveProjectId(null);
      }
    } catch {
      window.alert("올바른 stick 백업 파일이 아닙니다.");
    }
    event.target.value = "";
  };

  return (
    <AppShell>
      <header className="stick-header">
        <div>
          <span className="overline">CREATIVE ARCHIVE</span>
          <h1>stick</h1>
          <p>흩어진 아이디어와 영감 자료를 프로젝트별로 모아 관리하세요.</p>
        </div>
        <div className="stick-header-actions">
          <button className="button button-ghost" onClick={() => importRef.current?.click()}><Upload size={16} /> 불러오기</button>
          <button className="button button-ghost" onClick={exportData}><Download size={16} /> 내보내기</button>
          <button className="button button-dark" onClick={() => setModal(activeProject ? { type: "idea" } : { type: "project" })}><Plus size={17} /> {activeProject ? "기록 추가" : "새 프로젝트"}</button>
          <input ref={importRef} hidden type="file" accept=".json,application/json" onChange={importData} />
        </div>
      </header>

      <section className="stick-summary">
        <article><span className="stick-summary-icon"><FolderKanban size={21} /></span><div><small>프로젝트</small><strong>{projects.length}</strong></div></article>
        <article><span className="stick-summary-icon green"><Lightbulb size={21} /></span><div><small>나의 아이디어</small><strong>{totals.ideas}</strong></div></article>
        <article><span className="stick-summary-icon peach"><Sparkles size={21} /></span><div><small>영감 자료</small><strong>{totals.inspirations}</strong></div></article>
      </section>

      {!activeProject ? (
        <>
          <section className="stick-hero">
            <div><span className="overline">MY CREATIVE ARCHIVE</span><h2>생각을 모아<br /><em>실행할 프로젝트</em>로 만드세요.</h2><p>떠오른 아이디어와 발견한 레퍼런스를 한곳에 정리하면<br />다음 행동을 결정하기 쉬워집니다.</p></div>
            <span className="stick-hero-mark"><Sparkles size={38} /></span>
          </section>
          <div className="stick-toolbar">
            <div><span className="overline">PROJECTS</span><h2>나의 프로젝트</h2></div>
            <label className="stick-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="프로젝트와 기록 검색" /></label>
          </div>
          <section className="stick-project-grid">
            <button className="stick-add-card" onClick={() => setModal({ type: "project" })}><span><Plus size={24} /></span><strong>새 프로젝트 만들기</strong><p>아이디어와 영감을 주제별로 모아보세요.</p></button>
            {filteredProjects.map((project) => (
              <button className="stick-project-card" key={project.id} onClick={() => setActiveProjectId(project.id)}>
                <span className="stick-project-icon"><FolderKanban size={21} /></span>
                <small>PROJECT</small><h3>{project.name}</h3><p>{project.description || "설명이 없는 프로젝트입니다."}</p>
                <div><span><Lightbulb size={14} /> 아이디어 {project.ideas.length}</span><span><Sparkles size={14} /> 영감 {project.inspirations.length}</span></div>
              </button>
            ))}
          </section>
          {projects.length > 0 && filteredProjects.length === 0 && <p className="stick-empty">검색 조건에 맞는 프로젝트가 없습니다.</p>}
        </>
      ) : (
        <>
          <button className="stick-back" onClick={() => { setActiveProjectId(null); setSearch(""); }}><ArrowLeft size={16} /> 모든 프로젝트</button>
          <section className="stick-detail-hero">
            <div><span className="overline">PROJECT</span><h2>{activeProject.name}</h2><p>{activeProject.description || "이 프로젝트의 아이디어와 영감을 모아보세요."}</p></div>
            <button className="stick-delete-project" onClick={deleteProject}><Trash2 size={15} /> 프로젝트 삭제</button>
          </section>
          <div className="stick-detail-toolbar">
            <div className="stick-tabs">
              {([["all", "전체"], ["ideas", "나의 아이디어"], ["inspirations", "영감 자료"]] as const).map(([id, label]) => <button key={id} className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}>{label}</button>)}
            </div>
            <label className="stick-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="기록 검색" /></label>
          </div>
          <section className="stick-actions">
            <button onClick={() => setModal({ type: "idea" })}><span className="green"><Lightbulb size={20} /></span><div><strong>아이디어 추가</strong><p>떠오른 생각과 메모를 직접 기록합니다.</p></div><Plus size={17} /></button>
            <button onClick={() => setModal({ type: "inspiration" })}><span className="peach"><Link2 size={20} /></span><div><strong>영감 자료 추가</strong><p>웹사이트, YouTube, Instagram 링크를 저장합니다.</p></div><Plus size={17} /></button>
          </section>
          {activeTab !== "ideas" && <div className="stick-source-filter"><span>출처 필터</span>{(["all", "youtube", "instagram", "web"] as const).map((source) => <button className={sourceFilter === source ? "active" : ""} onClick={() => setSourceFilter(source)} key={source}>{source === "all" ? "전체" : sourceNames[source]}</button>)}</div>}
          <section className={`stick-collection ${activeTab !== "all" ? "single" : ""}`}>
            {activeTab !== "inspirations" && <RecordPanel title="나의 아이디어" type="idea" records={filteredIdeas} onOpen={(record) => setModal({ type: "record", record })} />}
            {activeTab !== "ideas" && <RecordPanel title="영감 자료" type="inspiration" records={filteredInspirations} onOpen={(record) => setModal({ type: "record", record })} />}
          </section>
        </>
      )}

      {modal?.type === "project" && <ProjectModal onClose={() => setModal(null)} onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const project: Project = { id: crypto.randomUUID(), name: String(form.get("name")), description: String(form.get("description")), createdAt: new Date().toISOString(), ideas: [], inspirations: [] };
        saveProjects([project, ...projects]); setModal(null); setActiveProjectId(project.id);
      }} />}
      {(modal?.type === "idea" || modal?.type === "inspiration") && <RecordModal type={modal.type} record={modal.record} onClose={() => setModal(null)} onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const type = modal.type;
        const url = String(form.get("url") ?? "");
        const record: StickRecord = {
          id: modal.record?.id ?? crypto.randomUUID(), type, source: type === "idea" ? "idea" : sourceFromUrl(url),
          title: String(form.get("title")), body: String(form.get("body") ?? ""), tags: splitTags(form.get("tags")),
          url, createdAt: modal.record?.createdAt ?? new Date().toISOString(),
        };
        updateActiveProject((project) => ({
          ...project,
          ideas: type === "idea" ? (modal.record ? project.ideas.map((item) => item.id === record.id ? record : item) : [record, ...project.ideas]) : project.ideas,
          inspirations: type === "inspiration" ? (modal.record ? project.inspirations.map((item) => item.id === record.id ? record : item) : [record, ...project.inspirations]) : project.inspirations,
        }));
        setModal(null);
      }} />}
      {modal?.type === "record" && <RecordDetail record={modal.record} onClose={() => setModal(null)} onEdit={() => setModal({ type: modal.record.type, record: modal.record })} onDelete={() => deleteRecord(modal.record)} />}
    </AppShell>
  );
}

function RecordPanel({ title, type, records, onOpen }: { title: string; type: RecordType; records: StickRecord[]; onOpen: (record: StickRecord) => void }) {
  return <div className="stick-panel"><div className="stick-panel-heading"><div><span className="overline">{type === "idea" ? "MY IDEAS" : "INSPIRATIONS"}</span><h3>{title}</h3></div><strong>{records.length}</strong></div><div className="stick-record-grid">{records.map((record) => <button className="stick-record-card" key={record.id} onClick={() => onOpen(record)}><span className={`stick-record-source ${record.source}`}>{sourceNames[record.source]}</span><h4>{record.title}</h4><p>{record.body || "저장된 메모가 없습니다."}</p><div><span>{record.tags.slice(0, 2).map((tag) => `#${tag}`).join(" ")}</span><small>{new Date(record.createdAt).toLocaleDateString("ko-KR")}</small></div></button>)}</div>{records.length === 0 && <div className="stick-panel-empty"><strong>아직 기록이 없습니다.</strong><span>위의 추가 버튼으로 첫 기록을 남겨보세요.</span></div>}</div>;
}

function ProjectModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Modal title="새 프로젝트 만들기" overline="NEW PROJECT" onClose={onClose}><form onSubmit={onSubmit}><label>프로젝트 이름<input name="name" required placeholder="예: 나만의 브랜드 만들기" /></label><label>설명<textarea name="description" rows={4} placeholder="어떤 아이디어와 영감을 모을 프로젝트인가요?" /></label><ModalActions onClose={onClose} label="프로젝트 만들기" /></form></Modal>;
}

function RecordModal({ type, record, onClose, onSubmit }: { type: RecordType; record?: StickRecord; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const inspiration = type === "inspiration";
  return <Modal title={`${inspiration ? "영감 자료" : "아이디어"} ${record ? "수정" : "추가"}`} overline={inspiration ? "INSPIRATION" : "MY IDEA"} onClose={onClose}><form onSubmit={onSubmit}>{inspiration && <label>웹 주소<input name="url" type="url" required defaultValue={record?.url} placeholder="https://..." /></label>}<label>제목<input name="title" required defaultValue={record?.title} placeholder={inspiration ? "자료의 제목" : "아이디어를 한 문장으로 적어보세요."} /></label><label>{inspiration ? "메모" : "내용"}<textarea name="body" rows={5} defaultValue={record?.body} placeholder="기억하고 싶은 내용을 자유롭게 적어보세요." /></label><label>태그<input name="tags" defaultValue={record?.tags.join(", ")} placeholder="쉼표로 구분해 입력" /></label><ModalActions onClose={onClose} label={record ? "수정 저장" : "저장하기"} /></form></Modal>;
}

function RecordDetail({ record, onClose, onEdit, onDelete }: { record: StickRecord; onClose: () => void; onEdit: () => void; onDelete: () => void }) {
  return <Modal title={record.title} overline={sourceNames[record.source]} onClose={onClose}><div className="stick-record-detail"><p>{record.body || "저장된 메모가 없습니다."}</p><div>{record.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>{record.url && <a href={record.url} target="_blank" rel="noreferrer">원본 링크 열기 <ExternalLink size={14} /></a>}<div className="stick-detail-actions"><button className="button button-ghost" onClick={onDelete}><Trash2 size={15} /> 삭제</button><button className="button button-dark" onClick={onEdit}>수정하기</button></div></div></Modal>;
}

function Modal({ title, overline, onClose, children }: { title: string; overline: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="stick-modal-backdrop" role="presentation" onMouseDown={onClose}><div className="stick-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><div className="stick-modal-heading"><div><span className="overline">{overline}</span><h2>{title}</h2></div><button onClick={onClose} aria-label="모달 닫기"><X size={20} /></button></div>{children}</div></div>;
}

function ModalActions({ onClose, label }: { onClose: () => void; label: string }) {
  return <div className="modal-actions"><button type="button" className="button button-ghost" onClick={onClose}>취소</button><button type="submit" className="button button-dark">{label}</button></div>;
}
