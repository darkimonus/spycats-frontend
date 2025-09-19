"use client";

import { useEffect, useMemo, useState } from 'react';
import { createSpyCat, deleteSpyCat, getSpyCats, updateSpyCatSalary } from "../lib/api";
import type { SpyCat, SpyCatCreateInput } from "../types";
import ErrorAlert from "../components/ErrorAlert";
import SpyCatForm from "../components/SpyCatForm";
import SpyCatList from "../components/SpyCatList";

export default function Page() {
  const [cats, setCats] = useState<SpyCat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSpyCats();
      setCats(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load Spy Cats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const onCreate = async (payload: SpyCatCreateInput) => {
    setFormErrors({});
    try {
      await createSpyCat(payload);
      await refresh();
    } catch (err: any) {
      if (err?.status === 400 && err?.data && typeof err.data === 'object') {
        setFormErrors(err.data as Record<string, string[]>);
      } else {
        setError(err?.message ?? 'Failed to create spy cat.');
      }
    }
  };

  const onUpdateSalary = async (id: number, salary: number) => {
    setError(null);
    try {
      await updateSpyCatSalary(id, salary);
      await refresh();
    } catch (err: any) {
      if (err?.status === 400 && err?.data && typeof err.data === 'object') {
        // Map field errors to a global error message for display
        const msg = Object.entries(err.data as Record<string, string[]>)
          .map(([k, v]) => `${k}: ${v.join(', ')}`)
          .join('; ');
        setError(msg || 'Validation error while updating salary.');
      } else {
        setError(err?.message ?? 'Failed to update salary.');
      }
    }
  };

  const onDelete = async (id: number) => {
    setError(null);
    try {
      await deleteSpyCat(id);
      await refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to delete spy cat.');
    }
  };

  const totalSalary = useMemo(() => cats.reduce((sum, c) => sum + (c.salary ?? 0), 0), [cats]);

  return (
    <div>
      {error && <ErrorAlert message={error} />}

      <section>
        <h2 style={{ marginBottom: 8 }}>Add New Spy Cat</h2>
        <SpyCatForm onSubmit={onCreate} errors={formErrors} />
      </section>

      <section style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h2 style={{ marginBottom: 8 }}>All Spy Cats</h2>
          <span style={{ color: '#666' }}>{cats.length} total</span>
          <span style={{ marginLeft: 'auto', color: '#444' }}>Total Salary: {totalSalary.toLocaleString()}</span>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <SpyCatList cats={cats} onUpdateSalary={onUpdateSalary} onDelete={onDelete} />
        )}
      </section>
    </div>
  );
}

