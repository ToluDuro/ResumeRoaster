'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface AnalysisResult {
  score: number;
  roast: string;
  improvements: string[];
  matchAnalysis: string;
}

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription, resume }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Resume Roaster 🔥</h1>
      <p className={styles.description}>
        Get your resume roasted by our mean AI critic
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="jobDescription">Job Description:</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            placeholder="Paste the job description here..."
            rows={6}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="resume">Resume:</label>
          <textarea
            id="resume"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            required
            placeholder="Paste your resume here..."
            rows={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? 'Roasting...' : 'Roast My Resume'}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {result && (
        <div className={styles.result}>
          <div className={styles.scoreContainer}>
            <h2>Roast Score: {result.score}/1000</h2>
            <div className={styles.scoreBar}>
              <div
                className={styles.scoreProgress}
                style={{ width: `${(result.score / 1000) * 100}%` }}
              />
            </div>
          </div>

          <div className={styles.analysisSection}>
            <h3>Match Analysis</h3>
            <p>{result.matchAnalysis}</p>
          </div>

          <div className={styles.roastSection}>
            <h3>The Roast</h3>
            <p>{result.roast}</p>
          </div>

          <div className={styles.improvementsSection}>
            <h3>Needed Improvements</h3>
            <ul>
              {result.improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
