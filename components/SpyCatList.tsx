"use client";

import { useState } from "react";
import type { SpyCat } from "../types";

type Props = {
  cats: SpyCat[];
  onUpdateSalary: (id: number, salary: number) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
};

export default function SpyCatList({ cats, onUpdateSalary, onDelete }: Props) {
  if (!cats.length) return <p>No spy cats yet. Add your first one above.</p>;

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 1fr 180px 120px', gap: 8, padding: '8px 12px', background: '#fafafa', fontWeight: 600 }}>
        <div>ID</div>
        <div>Name</div>
        <div>Experience</div>
        <div>Breed</div>
        <div>Salary</div>
        <div>Actions</div>
      </div>
      {cats.map((cat) => (
        <Row key={cat.id} cat={cat} onUpdateSalary={onUpdateSalary} onDelete={onDelete} />
      ))}
    </div>
  );
}

function Row({ cat, onUpdateSalary, onDelete }: { cat: SpyCat; onUpdateSalary: Props['onUpdateSalary']; onDelete: Props['onDelete'] }) {
  const [editing, setEditing] = useState(false);
  const [salary, setSalary] = useState<number | "">(cat.salary);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (salary === "" || Number.isNaN(Number(salary)) || Number(salary) < 0) return;
    setSaving(true);
    try {
      await onUpdateSalary(cat.id, Number(salary));
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!confirm(`Delete spy cat "${cat.name}"?`)) return;
    await onDelete(cat.id);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 1fr 180px 120px', gap: 8, padding: '10px 12px', borderTop: '1px solid #eee', alignItems: 'center' }}>
      <div>{cat.id}</div>
      <div>{cat.name}</div>
      <div>{cat.experience}</div>
      <div>{cat.breed}</div>
      <div>
        {editing ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="number"
              value={salary}
              min={0}
              onChange={(e) => setSalary(e.target.value === '' ? '' : Number(e.target.value))}
              style={{ width: 100, padding: '6px 8px' }}
            />
            <button onClick={save} disabled={saving} style={{ padding: '6px 8px' }}>{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => { setEditing(false); setSalary(cat.salary); }} style={{ padding: '6px 8px' }}>Cancel</button>
          </div>
        ) : (
          <span>${cat.salary.toLocaleString()}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {!editing && <button onClick={() => setEditing(true)} style={{ padding: '6px 8px' }}>Edit Salary</button>}
        <button onClick={del} style={{ padding: '6px 8px', color: '#a00', borderColor: '#a00' }}>Delete</button>
      </div>
    </div>
  );
}

