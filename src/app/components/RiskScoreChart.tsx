import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { API_ENDPOINTS, apiUrl } from '../api/config';

type RiskBand = 'High' | 'Medium' | 'Low';

interface RiskSummary {
  score: number;
  band: RiskBand;
  bands: Record<RiskBand, number>;
}

interface RiskScoreChartProps {
  onBandClick?: (band: RiskBand) => void;
}

const BAND_COLORS: Record<RiskBand, string> = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
};

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
}

function normalizeBand(value: unknown): RiskBand {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'high' || normalized === 'critical') return 'High';
  if (normalized === 'medium') return 'Medium';
  return 'Low';
}

function readBandCount(source: Record<string, unknown>, band: RiskBand): number {
  const lower = band.toLowerCase();
  return toNumber(
    source[band] ??
      source[lower] ??
      source[`${lower}_risk`] ??
      source[`${lower}_count`] ??
      source[`${lower}Risk`],
  );
}

function extractBandCounts(payload: unknown): Record<RiskBand, number> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { High: 0, Medium: 0, Low: 0 };
  }

  const data = payload as Record<string, unknown>;
  const source =
    data.bands && typeof data.bands === 'object' && !Array.isArray(data.bands)
      ? (data.bands as Record<string, unknown>)
      : data.distribution && typeof data.distribution === 'object' && !Array.isArray(data.distribution)
        ? (data.distribution as Record<string, unknown>)
        : data.risk_bands && typeof data.risk_bands === 'object' && !Array.isArray(data.risk_bands)
          ? (data.risk_bands as Record<string, unknown>)
          : data;

  return {
    High: readBandCount(source, 'High'),
    Medium: readBandCount(source, 'Medium'),
    Low: readBandCount(source, 'Low'),
  };
}

function extractRiskSummary(orgPayload: unknown, summaryPayload: unknown): RiskSummary {
  const org =
    orgPayload && typeof orgPayload === 'object' && !Array.isArray(orgPayload)
      ? (orgPayload as Record<string, unknown>)
      : {};
  const summary =
    summaryPayload && typeof summaryPayload === 'object' && !Array.isArray(summaryPayload)
      ? (summaryPayload as Record<string, unknown>)
      : {};
  const nestedRisk =
    org.risk && typeof org.risk === 'object' && !Array.isArray(org.risk)
      ? (org.risk as Record<string, unknown>)
      : {};

  const score = toNumber(
    org.risk_score ??
      org.riskScore ??
      org.score ??
      org.org_score ??
      nestedRisk.score ??
      summary.risk_score ??
      summary.score,
  );
  const band = normalizeBand(
    org.risk_band ?? org.riskBand ?? org.band ?? nestedRisk.band ?? summary.risk_band ?? summary.band,
  );
  const bands = extractBandCounts(summaryPayload);

  return { score, band, bands };
}

export function RiskScoreChart({ onBandClick }: RiskScoreChartProps) {
  const [riskSummary, setRiskSummary] = useState<RiskSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRiskSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [orgResponse, summaryResponse] = await Promise.all([
        fetch(apiUrl(API_ENDPOINTS.risk.org)),
        fetch(apiUrl(API_ENDPOINTS.risk.summary)),
      ]);

      if (!orgResponse.ok) throw new Error(`Risk org API error: ${orgResponse.status}`);
      if (!summaryResponse.ok) throw new Error(`Risk summary API error: ${summaryResponse.status}`);

      const [orgPayload, summaryPayload] = await Promise.all([
        orgResponse.json(),
        summaryResponse.json(),
      ]);

      setRiskSummary(extractRiskSummary(orgPayload, summaryPayload));
    } catch (err) {
      setRiskSummary(null);
      setError(err instanceof Error ? err.message : 'Failed to load risk score');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRiskSummary();
  }, [loadRiskSummary]);

  const chartData = useMemo(() => {
    const bands = riskSummary?.bands ?? { High: 0, Medium: 0, Low: 0 };
    const data = (Object.keys(bands) as RiskBand[])
      .map((band) => ({ name: band, value: bands[band] }))
      .filter((item) => item.value > 0);

    return data.length > 0 ? data : [{ name: riskSummary?.band ?? 'Low', value: riskSummary?.score ?? 1 }];
  }, [riskSummary]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="mb-1">Risk Score & Band Distribution</h3>
          <p className="text-sm text-gray-600">
            Organization score: {riskSummary ? `${riskSummary.score} (${riskSummary.band})` : 'Loading...'}
          </p>
        </div>
        {error && (
          <button
            type="button"
            onClick={loadRiskSummary}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        )}
      </div>

      {loading && <div className="py-24 text-center text-sm text-gray-500">Loading risk score...</div>}

      {!loading && error && (
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && riskSummary && (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} Risk: ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                onClick={(data) => onBandClick?.(data.name as RiskBand)}
                style={{ cursor: onBandClick ? 'pointer' : 'default' }}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={BAND_COLORS[entry.name as RiskBand] ?? '#6b7280'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">Click on segments to view risk score and risk band details</p>
          </div>
        </>
      )}
    </div>
  );
}
