import { useState, useEffect, useCallback } from 'react';
import DataTable from '../components/DataTable';
import EntityModal from '../components/EntityModal';
import { fetchAll, createEntity, updateEntity, deleteEntity } from '../api/client';
import { SERVICES } from '../config/services';
import './EntityPage.css';

function buildXLS(headers, rows) {
  const table = [headers, ...rows].map(r =>
    r.map(c => {
      const s = String(c ?? '').replace(/"/g, '""');
      return `"${s}"`;
    }).join('\t')
  ).join('\n');
  return '﻿' + table;
}

export default function EntityPage({ svc, toast, refreshKey, triggerNew, triggerExport }) {
  const [data, setData]   = useState(null);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setData(null);
    const result = await fetchAll(svc.url);
    setData(result);
  }, [svc.url]);

  useEffect(() => { load(); }, [load, refreshKey]);

  useEffect(() => {
    if (triggerNew > 0) setModal({ item: null });
  }, [triggerNew]);

  useEffect(() => {
    if (triggerExport === 0 || !data) return;
    const cols = svc.columns;
    const headers = cols.map(c => svc.labels[c] || c);
    const rows = data.map(item => cols.map(c => item[c] ?? ''));
    const blob = new Blob([buildXLS(headers, rows)], { type: 'text/tab-separated-values' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${svc.title.toLowerCase()}_export.xls`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`Excel de ${svc.title} descargado`, 'success');
  }, [triggerExport]);

  async function handleSave(payload) {
    try {
      if (modal.item) {
        await updateEntity(svc.url, modal.item.id, payload);
        toast(`${svc.singular} actualizado`, 'success');
      } else {
        await createEntity(svc.url, payload);
        toast(`${svc.singular} creado`, 'success');
      }
      setModal(null);
      load();
    } catch (err) {
      const msg = err?.response?.data?.error
        || err?.response?.data?.message
        || 'Error al guardar';
      toast(msg, 'error');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`¿Eliminar ${svc.singular.toLowerCase()} #${id}?`)) return;
    try {
      await deleteEntity(svc.url, id);
      toast(`${svc.singular} eliminado`, 'success');
      load();
    } catch {
      toast('Error al eliminar', 'error');
    }
  }

  const filtered = data
    ? data.filter(item =>
        Object.values(item).some(v =>
          String(v ?? '').toLowerCase().includes(search.toLowerCase())
        )
      )
    : null;

  return (
    <div className="entity-page">
      <div className="entity-toolbar">
        <input
          className="search-input"
          placeholder={`Buscar ${svc.title.toLowerCase()}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="entity-count">
          {data ? `${filtered?.length ?? 0} / ${data.length}` : '...'}
        </span>
      </div>

      <DataTable
        svc={svc}
        data={filtered}
        onEdit={item => setModal({ item })}
        onDelete={handleDelete}
      />

      {modal !== null && (
        <EntityModal
          svc={svc}
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
