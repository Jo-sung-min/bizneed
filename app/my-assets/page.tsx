"use client";

import { AppShell } from "@/components/AppShell";
import "./assets.css";
import {
  Box,
  ExternalLink,
  FileText,
  FolderArchive,
  Globe2,
  GripVertical,
  Link2,
  MapPin,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { DragEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

type AssetType = "document" | "item" | "domain";

type Asset = {
  id: string;
  type: AssetType;
  title: string;
  location: string;
  memo: string;
  domainName?: string;
  providerUrl?: string;
  linkedUrl?: string;
  createdAt: string;
};

const tabs: { id: "all" | AssetType; label: string; icon: typeof Box }[] = [
  { id: "all", label: "전체", icon: FolderArchive },
  { id: "document", label: "서류", icon: FileText },
  { id: "item", label: "물품", icon: Package },
  { id: "domain", label: "도메인", icon: Globe2 },
];

const typeNames: Record<AssetType, string> = {
  document: "서류",
  item: "물품",
  domain: "도메인",
};

const normalizeUrl = (url: string) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

export default function MyAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | AssetType>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<AssetType>("document");
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const didDrag = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("bizneed-assets");
    if (saved) setAssets(JSON.parse(saved));
  }, []);

  const saveAssets = (next: Asset[]) => {
    setAssets(next);
    localStorage.setItem("bizneed-assets", JSON.stringify(next));
  };

  const handleDragStart = (event: DragEvent<HTMLElement>, assetId: string) => {
    didDrag.current = true;
    setDraggedId(assetId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", assetId);
  };

  const handleDrop = (event: DragEvent<HTMLElement>, targetId: string) => {
    event.preventDefault();
    const sourceId = draggedId ?? event.dataTransfer.getData("text/plain");

    if (!sourceId || sourceId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const next = [...assets];
    const sourceIndex = next.findIndex((asset) => asset.id === sourceId);
    const targetIndex = next.findIndex((asset) => asset.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) {
      handleDragEnd();
      return;
    }

    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    saveAssets(next);
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
    window.setTimeout(() => {
      didDrag.current = false;
    }, 0);
  };

  const handleDelete = (assetId: string) => {
    if (!window.confirm("삭제 하시겠습니까?")) return;
    saveAssets(assets.filter((asset) => asset.id !== assetId));
  };

  const openCreateModal = () => {
    setEditingAsset(null);
    setType("document");
    setModalOpen(true);
  };

  const openEditModal = (asset: Asset) => {
    setEditingAsset(asset);
    setType(asset.type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAsset(null);
  };

  const filtered = useMemo(() => assets.filter((asset) => {
    const matchesTab = activeTab === "all" || asset.type === activeTab;
    const keyword = `${asset.title} ${asset.location} ${asset.memo} ${asset.domainName ?? ""}`.toLowerCase();
    return matchesTab && keyword.includes(search.toLowerCase());
  }), [activeTab, assets, search]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Asset = {
      id: editingAsset?.id ?? crypto.randomUUID(),
      type,
      title: String(form.get("title") ?? ""),
      location: String(form.get("location") ?? ""),
      memo: String(form.get("memo") ?? ""),
      domainName: String(form.get("domainName") ?? ""),
      providerUrl: normalizeUrl(String(form.get("providerUrl") ?? "")),
      linkedUrl: normalizeUrl(String(form.get("linkedUrl") ?? "")),
      createdAt: editingAsset?.createdAt ?? new Date().toISOString(),
    };
    saveAssets(editingAsset
      ? assets.map((asset) => asset.id === editingAsset.id ? next : asset)
      : [next, ...assets]);
    closeModal();
    event.currentTarget.reset();
  };

  return (
    <AppShell>
      <header className="vault-header">
        <div>
          <span className="overline">MY BUSINESS VAULT</span>
          <h1>내 사업 문서</h1>
          <p>사업 관련 서류 위치, 물품, 도메인과 중요한 링크를 한곳에 기록하세요.</p>
        </div>
        <button className="button button-dark" onClick={openCreateModal}>
          <Plus size={17} /> 새 항목 등록
        </button>
      </header>

      <section className="vault-summary">
        <div><span className="vault-summary-icon"><FolderArchive size={23} /></span><p>등록한 항목</p><strong>{assets.length}</strong></div>
        <div><span className="vault-summary-icon green"><FileText size={23} /></span><p>사업 서류</p><strong>{assets.filter((item) => item.type === "document").length}</strong></div>
        <div><span className="vault-summary-icon yellow"><Package size={23} /></span><p>등록 물품</p><strong>{assets.filter((item) => item.type === "item").length}</strong></div>
        <div><span className="vault-summary-icon blue"><Globe2 size={23} /></span><p>보유 도메인</p><strong>{assets.filter((item) => item.type === "domain").length}</strong></div>
      </section>

      <section className="vault-toolbar">
        <div className="vault-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return <button className={activeTab === tab.id ? "active" : ""} key={tab.id} onClick={() => setActiveTab(tab.id)}><Icon size={15} />{tab.label}</button>;
          })}
        </div>
        <div className="vault-toolbar-right">
          {assets.length > 1 && <span className="reorder-hint"><GripVertical size={14} /> 카드를 드래그하면 순서가 자동 저장됩니다</span>}
          <label className="vault-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="제목, 위치, 도메인 검색" /></label>
        </div>
      </section>

      <section className="asset-grid">
        <button className="asset-add-card" onClick={openCreateModal}>
          <span><Plus size={27} /></span>
          <strong>새 항목 등록</strong>
          <p>서류, 물품, 도메인 정보를 추가하세요.</p>
        </button>
        {filtered.map((asset) => {
          const Icon = asset.type === "document" ? FileText : asset.type === "item" ? Package : Globe2;
          return (
            <article
              className={`asset-card asset-${asset.type}${draggedId === asset.id ? " dragging" : ""}${dragOverId === asset.id ? " drag-over" : ""}`}
              draggable
              key={asset.id}
              onDragStart={(event) => handleDragStart(event, asset.id)}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                if (draggedId !== asset.id) setDragOverId(asset.id);
              }}
              onDragLeave={() => setDragOverId((current) => current === asset.id ? null : current)}
              onDrop={(event) => handleDrop(event, asset.id)}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (!didDrag.current) openEditModal(asset);
              }}
              title="클릭하여 수정"
            >
              <div className="asset-card-top">
                <span className="asset-type"><Icon size={16} /> {typeNames[asset.type]}</span>
                <div className="asset-card-actions">
                  <span className="drag-handle" title="드래그하여 순서 변경" aria-hidden="true"><GripVertical size={17} /></span>
                  <button onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(asset.id);
                  }} aria-label="항목 삭제"><Trash2 size={15} /></button>
                </div>
              </div>
              <h2>{asset.title}</h2>
              {asset.type === "domain" && asset.domainName && <strong className="domain-name">{asset.domainName}</strong>}
              {asset.location && <p className="asset-location"><MapPin size={14} /> <span>{asset.location}</span></p>}
              {asset.memo && <p className="asset-memo">{asset.memo}</p>}
              {asset.type === "domain" && (
                <div className="asset-links">
                  {asset.providerUrl && <a href={asset.providerUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}><ExternalLink size={14} /> 가비아 관리</a>}
                  {asset.linkedUrl && <a href={asset.linkedUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}><Link2 size={14} /> 연결 주소 열기</a>}
                </div>
              )}
              <small>{new Date(asset.createdAt).toLocaleDateString("ko-KR")} 등록</small>
            </article>
          );
        })}
      </section>

      {assets.length > 0 && filtered.length === 0 && <div className="vault-empty">검색 조건에 맞는 항목이 없습니다.</div>}

      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={closeModal}>
          <div className="asset-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-heading"><div><span className="overline">{editingAsset ? "EDIT ITEM" : "ADD NEW ITEM"}</span><h2>{editingAsset ? "항목 수정" : "새 항목 등록"}</h2></div><button onClick={closeModal}><X size={20} /></button></div>
            <form key={editingAsset?.id ?? "new"} onSubmit={handleSubmit}>
              <label>항목 종류</label>
              <div className="type-selector">
                {tabs.slice(1).map((tab) => {
                  const Icon = tab.icon;
                  return <button type="button" className={type === tab.id ? "active" : ""} onClick={() => setType(tab.id as AssetType)} key={tab.id}><Icon size={17} />{tab.label}</button>;
                })}
              </div>
              <label htmlFor="asset-title">제목</label>
              <input id="asset-title" name="title" required defaultValue={editingAsset?.title ?? ""} placeholder={type === "document" ? "예: 사업자등록증" : type === "item" ? "예: 카드 단말기" : "예: 회사 대표 도메인"} />
              {type === "domain" ? (
                <>
                  <label htmlFor="domain-name">구매한 도메인 이름</label>
                  <input id="domain-name" name="domainName" required defaultValue={editingAsset?.domainName ?? ""} placeholder="예: bizneed.co.kr" />
                  <label htmlFor="provider-url">가비아 관리 주소</label>
                  <input id="provider-url" name="providerUrl" defaultValue={editingAsset?.providerUrl ?? ""} placeholder="예: my.gabia.com" />
                  <label htmlFor="linked-url">연결할 주소</label>
                  <input id="linked-url" name="linkedUrl" defaultValue={editingAsset?.linkedUrl ?? ""} placeholder="예: https://내-서비스-주소.com" />
                </>
              ) : (
                <>
                  <label htmlFor="asset-location">보관 위치</label>
                  <input id="asset-location" name="location" required defaultValue={editingAsset?.location ?? ""} placeholder="예: 사무실 책상 두 번째 서랍 / Google Drive" />
                </>
              )}
              <label htmlFor="asset-memo">메모</label>
              <textarea id="asset-memo" name="memo" rows={3} defaultValue={editingAsset?.memo ?? ""} placeholder="만료일, 사용 목적 등 기억할 내용을 적어주세요." />
              <div className="modal-actions"><button type="button" className="button button-ghost" onClick={closeModal}>취소</button><button className="button button-dark" type="submit">{editingAsset ? "수정 저장" : "저장하기"}</button></div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
