"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SpyCatCreateInput } from "../types";
import { getCatBreeds, type CatBreed } from "../lib/catapi";

type Props = {
  onSubmit: (payload: SpyCatCreateInput) => Promise<void> | void;
  errors?: Record<string, string[]>;
};

export default function SpyCatForm({ onSubmit, errors = {} }: Props) {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState<number | "">("");
  const [breed, setBreed] = useState("");
  const [salary, setSalary] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [breeds, setBreeds] = useState<CatBreed[]>([]);
  const [breedLoadError, setBreedLoadError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    getCatBreeds()
      .then((bs) => {
        if (!mounted) return;
        setBreeds(bs);
      })
      .catch((e) => {
        if (!mounted) return;
        setBreedLoadError(e?.message || "Failed to load breeds");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Minimal client validation per requirement bounds
    if (experience === "" || experience < 0 || experience > 15) {
      alert("Experience must be an integer between 0 and 15.");
      return;
    }
    if (salary === "" || salary < 0) {
      alert("Salary must be a non-negative number.");
      return;
    }
    // Ensure selected breed matches one from the loaded list (when available)
    if (breeds.length > 0) {
      const match = breeds.some((b) => b.name === breed.trim());
      if (!match) {
        alert("Please select a valid breed from the list.");
        return;
      }
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        experience: Number(experience),
        breed: breed.trim(),
        salary: Number(salary),
      });
      // Reset on success
      setName("");
      setExperience("");
      setBreed("");
      setSalary("");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (field: string) => errors?.[field]?.join(", ");

  const filteredBreeds = useMemo(() => {
    const q = breed.trim().toLowerCase();
    if (!q) return breeds; // show full list, scrollable
    return breeds.filter((b) => b.name.toLowerCase().includes(q));
  }, [breed, breeds]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Whisker Bond"
          required
          style={{ width: '100%', padding: '8px 10px' }}
        />
        {fieldError('name') && <small style={{ color: '#a00' }}>{fieldError('name')}</small>}
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Years of Experience (0–15)</label>
        <input
          type="number"
          value={experience}
          onChange={(e) => setExperience(e.target.value === '' ? '' : Number(e.target.value))}
          min={0}
          max={15}
          required
          style={{ width: '100%', padding: '8px 10px' }}
        />
        {fieldError('experience') && <small style={{ color: '#a00' }}>{fieldError('experience')}</small>}
      </div>
      <div ref={containerRef} style={{ position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Breed</label>
        <input
          value={breed}
          onChange={(e) => { setBreed(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={breeds.length ? "Type to search…" : "Loading breeds…"}
          required
          style={{ width: '100%', padding: '8px 10px' }}
        />
        {breedLoadError && (
          <small style={{ color: '#a00', display: 'block', marginTop: 4 }}>
            {breedLoadError}. You can still type a breed.
          </small>
        )}
        {fieldError('breed') && <small style={{ color: '#a00', display: 'block' }}>{fieldError('breed')}</small>}
        {showSuggestions && filteredBreeds.length > 0 && (
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #ddd',
              borderTop: 'none',
              maxHeight: 220,
              overflowY: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            {filteredBreeds.map((b) => (
              <div
                key={b.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setBreed(b.name); setShowSuggestions(false); }}
                style={{ padding: '8px 10px', cursor: 'pointer' }}
              >
                {b.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Salary</label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value === '' ? '' : Number(e.target.value))}
          min={0}
          required
          style={{ width: '100%', padding: '8px 10px' }}
        />
        {fieldError('salary') && <small style={{ color: '#a00' }}>{fieldError('salary')}</small>}
      </div>
      <div>
        <button type="submit" disabled={submitting} style={{ padding: '8px 12px' }}>
          {submitting ? 'Adding…' : 'Add Spy Cat'}
        </button>
      </div>
    </form>
  );
}
