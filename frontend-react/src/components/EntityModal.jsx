import { useState, useEffect } from 'react';
import { fetchAll } from '../api/client';
import { COMUNAS_DEFAULT } from '../config/services';
import './EntityModal.css';

export default function EntityModal({ svc, item, onClose, onSave }) {
  const isEdit = Boolean(item);
  const [form, setForm] = useState({});
  const [comunas, setComunas] = useState(COMUNAS_DEFAULT);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initial = {};
    svc.fields.forEach(f => {
      if (f.type === 'checkbox') initial[f.name] = item ? Boolean(item[f.name]) : false;
      else initial[f.name] = item ? (item[f.name] ?? '') : '';
    });
    setForm(initial);
  }, [item, svc]);

  useEffect(() => {
    const hasComunas = svc.fields.some(f => f.type === 'select-comunas');
    if (!hasComunas) return;
    fetchAll('http://localhost:8081/api/students/comunas').then(data => {
      if (data.length) setComunas(data);
    });
  }, [svc]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = {};
    svc.fields.forEach(f => {
      if (f.type === 'checkbox') { payload[f.name] = form[f.name]; return; }
      const v = String(form[f.name] ?? '').trim();
      if (f.type === 'number') payload[f.name] = v === '' ? null : (f.step === '0.01' ? parseFloat(v) : parseInt(v, 10));
      else payload[f.name] = v || null;
    });
    try {
      await onSave(payload);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? `Editar ${svc.singular}` : `Nuevo ${svc.singular}`}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {svc.fields.map(field => (
              <div className="form-group" key={field.name}>
                {field.type === 'checkbox' ? (
                  <div className="form-checkbox">
                    <input
                      type="checkbox"
                      id={`f-${field.name}`}
                      name={field.name}
                      checked={!!form[field.name]}
                      onChange={handleChange}
                    />
                    <label htmlFor={`f-${field.name}`}>{field.label}</label>
                  </div>
                ) : (
                  <>
                    <label htmlFor={`f-${field.name}`}>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea id={`f-${field.name}`} name={field.name} value={form[field.name] ?? ''} onChange={handleChange} placeholder={field.label} />
                    ) : field.type === 'select-comunas' ? (
                      <select id={`f-${field.name}`} name={field.name} value={form[field.name] ?? ''} onChange={handleChange}>
                        <option value="">Sin comuna</option>
                        {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input
                        id={`f-${field.name}`}
                        type={field.type}
                        name={field.name}
                        value={form[field.name] ?? ''}
                        onChange={handleChange}
                        placeholder={field.label}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
