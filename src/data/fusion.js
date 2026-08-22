/** Real artifacts from Fusion Console + workspace — not invented demo data. */

export const FUSION_NAV = [
  { id: 'generate', label: 'Generate' },
  { id: 'overview', label: 'Overview' },
  { id: 'modules', label: 'Modules' },
  { id: 'daily', label: 'Daily Checker' },
  { id: 'mail', label: 'Mail' },
  { id: 'apirunner', label: 'API Runner' },
]

export const GENERATE_SCALES = [
  {
    id: 'proven',
    rows: 1843,
    rowsLabel: '1,843 (largest proven)',
    queries: 1843,
    time: '< 1–2 min (measured)',
    finish: 'Yes — proven.',
    note: '',
    verdict: 'ok',
    simMs: 8200,
    crashAt: null,
  },
  {
    id: '10k',
    rows: 10000,
    rowsLabel: '10,000',
    queries: 10000,
    time: '~3–8 min',
    finish: 'Likely yes if Excel is closed and RAM is free.',
    verdict: 'ok',
    simMs: 11000,
    crashAt: null,
  },
  {
    id: '30k',
    rows: 30000,
    rowsLabel: '30,000',
    queries: 30000,
    time: '~8–20 min',
    finish: 'Maybe. Fails n8n (10 min cap). RAM risk.',
    verdict: 'warn',
    simMs: 14000,
    crashAt: 0.82,
  },
  {
    id: '100k',
    rows: 100000,
    rowsLabel: '100,000',
    queries: 100000,
    time: '~30–70 min · SQL ~40–60 MB',
    finish: 'Likely crash (OOM) before finishing.',
    verdict: 'fail',
    simMs: 9000,
    crashAt: 0.38,
  },
  {
    id: '200k',
    rows: 200000,
    rowsLabel: '200,000',
    queries: 200000,
    time: '~1–2.5 hrs',
    finish: 'Expect OOM crash — do not use.',
    verdict: 'fail',
    simMs: 7000,
    crashAt: 0.22,
  },
  {
    id: '300k',
    rows: 300000,
    rowsLabel: '300,000',
    queries: 300000,
    time: '~1.5–4 hrs',
    finish: 'Expect OOM crash — do not use.',
    verdict: 'fail',
    simMs: 7000,
    crashAt: 0.16,
  },
  {
    id: '1m',
    rows: 1000000,
    rowsLabel: '1,000,000',
    queries: 1000000,
    time: '~6–12 hrs · SQL hundreds of MB',
    finish: 'Will not finish. Excel max 1,048,576 rows.',
    verdict: 'fail',
    simMs: 6000,
    crashAt: 0.08,
  },
]

export const FUSION_MODULES = [
  { name: 'Segment 3 / 5 Insert', status: 'ok', launcher: 'Segment-5-Insert.cmd', table: 'XXFUSION.XX_ACCOUNTING_TBL' },
  { name: 'GL Code Updates', status: 'idle', launcher: 'GL-Code-Updates.cmd', table: 'SEGMENT5' },
  { name: 'Source ID Remarks', status: 'ok', launcher: 'Auto-Detect.cmd', table: 'xxvst_rev_daily_col_prod' },
  { name: 'Daily Collection Checker', status: 'ok', launcher: 'Run-DailyCollectionTeams.cmd', table: 'MySQL' },
  { name: 'Fusion API Runner', status: 'idle', launcher: 'Api-Runner.cmd', table: 'Fusion REST' },
  { name: 'Auto-Detect Router', status: 'ok', launcher: 'Auto-Detect.cmd', table: 'drop\\' },
]

export const MAIL_RUNS = [
  { when: '11:54', status: 'ok', file: 'Daily Collection (43).xlsx', task: 'Source ID Remarks', from: 'Hari Babu' },
  { when: '19:45', status: 'ok', file: 'Segment 5 updated till 1Aug26.xlsx', task: 'Segment 3/5', from: 'Hari Babu' },
  { when: '18:20', status: 'ok', file: 'GLcodechange-Aug.xlsx', task: 'GL Code Updates', from: 'Ravi Teja' },
  { when: '14:31', status: 'ok', file: 'daily_queries.sql', task: 'Daily Collection', from: 'scheduler' },
]

export const MAIL_STATS = { total: 66, ok: 53, failed: 7, skipped: 5 }

export const API_PRESETS = [
  { method: 'POST', name: 'updateDailyError', url: 'revProd/updateDailyError?glDate={glDate}' },
  { method: 'POST', name: 'updateDailyStatus', url: 'revProd/updateDailyStatus?glDate={glDate}' },
  { method: 'GET', name: 'dailyCollections', url: 'fscmRestApi/.../dailyCollections?q=glDate=${glDate}' },
  { method: 'GET', name: 'journalBatches', url: 'fscmRestApi/.../journalBatches?q=accountingDate=${glDate}' },
]

export const PAYMENTS = [
  { id: 'pay_8c21', reference: 'COL-88421', amount: '12,450.00', currency: 'INR', channel: 'UPI', status: 'POSTED' },
  { id: 'pay_8c22', reference: 'COL-88422', amount: '3,200.00', currency: 'INR', channel: 'CARD', status: 'POSTED' },
  { id: 'pay_8c23', reference: 'COL-88423', amount: '890.00', currency: 'INR', channel: 'CASH', status: 'PENDING' },
]

export const OUTBOX_STATS = { pending: 3, published: 12480, failed: 0 }

export const OUTBOX_EVENTS = [
  { id: 'evt_9f2a', topic: 'payments.posted', status: 'PUBLISHED', retries: 0 },
  { id: 'evt_9f2b', topic: 'payments.posted', status: 'PUBLISHED', retries: 0 },
  { id: 'evt_9f2c', topic: 'payments.posted', status: 'PENDING', retries: 1 },
]
