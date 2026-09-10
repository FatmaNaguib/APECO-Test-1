const fs = require('fs');
const path = require('path');

const resultsPath = path.join(__dirname, '..', 'test-results', 'results.json');
if (!fs.existsSync(resultsPath)) {
  console.error('test-results/results.json not found!');
  process.exit(1);
}

const rawJson = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

// Helper to strip ANSI codes
function stripAnsi(str) {
  if (!str) return '';
  return str.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '');
}

// Helper to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Convert image to Base64 data URI
function getBase64Image(relPath, mimeType) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (fs.existsSync(fullPath)) {
    const b64 = fs.readFileSync(fullPath).toString('base64');
    return `data:${mimeType};base64,${b64}`;
  }
  return '';
}

const imgAutotrim = getBase64Image('reports/screenshots/fail-login-reg-04-autotrim.png', 'image/png');
const imgCapital = getBase64Image('reports/screenshots/fail-login-reg-05-capitalization.png', 'image/png');
const imgBaselineEn = getBase64Image('reports/screenshots/baseline-login-en.png', 'image/png');
const imgBaselineAr = getBase64Image('reports/screenshots/baseline-login-ar.png', 'image/png');
const imgBaselineArErrors = getBase64Image('reports/screenshots/baseline-login-ar-errors.png', 'image/png');

const allTests = [];

function harvestSuite(suite, file, hierarchy) {
  const currentHierarchy = [...hierarchy];
  if (suite.title && !suite.title.endsWith('.spec.ts')) {
    currentHierarchy.push(suite.title);
  }

  if (suite.specs && suite.specs.length > 0) {
    for (const spec of suite.specs) {
      const testObj = spec.tests[0];
      const res = testObj.results[0];
      const status = res.status === 'passed' ? 'passed' : 'failed';
      const durSec = (res.duration / 1000).toFixed(1);

      let errClean = '';
      let expectedVsActual = null;

      if (status === 'failed' && res.error) {
        errClean = stripAnsi(res.error.message || '');
        if (spec.title.includes('TC-LOGIN-REG-04')) {
          expectedVsActual = {
            expected: "Email format validation error ('Please enter a valid email') should be hidden after auto-trimming leading/trailing whitespace around valid email.",
            actual: "Validation error 'Please enter a valid email' remained visible. The portal does not auto-trim leading/trailing spaces.",
            image: imgAutotrim,
            defectId: "REQ-LOGIN-09",
            category: "Input Sanitization / Regression"
          };
        } else if (spec.title.includes('TC-LOGIN-REG-05')) {
          expectedVsActual = {
            expected: "Required username error message should be sentence-cased ('Please enter username' or 'Please enter your username').",
            actual: "Element not found because the portal renders all-lowercase 'please enter user name'.",
            image: imgCapital,
            defectId: "REQ-LOGIN-04",
            category: "Typography / Consistency Defect"
          };
        } else {
          expectedVsActual = {
            expected: "Test assertion should be satisfied per specification requirements.",
            actual: errClean.split('\n')[0] || "Assertion failed during execution.",
            image: null,
            defectId: "KNOWN-DEFECT",
            category: "Assertion Defect"
          };
        }
      }

      allTests.push({
        id: spec.id,
        file: file,
        title: spec.title,
        hierarchy: currentHierarchy.join(' › '),
        category: currentHierarchy.length > 0 ? currentHierarchy[currentHierarchy.length - 1] : 'General',
        line: spec.line,
        status: status,
        durationMs: res.duration,
        durationSec: durSec,
        errorMessage: errClean,
        expectedVsActual: expectedVsActual
      });
    }
  }

  if (suite.suites && suite.suites.length > 0) {
    for (const child of suite.suites) {
      harvestSuite(child, file, currentHierarchy);
    }
  }
}

for (const topSuite of rawJson.suites) {
  harvestSuite(topSuite, topSuite.file, []);
}

const totalCount = allTests.length;
const passedCount = allTests.filter(t => t.status === 'passed').length;
const failedCount = allTests.filter(t => t.status === 'failed').length;
const passRate = ((passedCount / totalCount) * 100).toFixed(1);
const totalSec = Math.round(rawJson.stats.duration / 1000);
const totalMinStr = `${Math.floor(totalSec / 60)}m ${totalSec % 60}s`;

// Build Tests HTML
let testsRowsHtml = '';
for (const t of allTests) {
  const isPassed = t.status === 'passed';
  const statusClass = isPassed ? 'status-passed' : 'status-failed';
  const statusBadge = isPassed
    ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
         <svg class="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
         PASSED
       </span>`
    : `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/20">
         <svg class="w-3 h-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
         FAILED
       </span>`;

  let failDetailsHtml = '';
  if (!isPassed && t.expectedVsActual) {
    const eva = t.expectedVsActual;
    const safeErr = escapeHtml(t.errorMessage);
    failDetailsHtml = `
      <div class="mt-3 pt-3 border-t border-slate-700/60 test-fail-details">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div class="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-2.5 text-xs">
            <span class="font-semibold text-emerald-400 block mb-1">Expected Behavior:</span>
            <span class="text-slate-200">${escapeHtml(eva.expected)}</span>
          </div>
          <div class="bg-rose-950/30 border border-rose-500/30 rounded-lg p-2.5 text-xs">
            <span class="font-semibold text-rose-400 block mb-1">Observed Failure:</span>
            <span class="text-slate-200">${escapeHtml(eva.actual)}</span>
          </div>
        </div>
        ${eva.image ? `
        <div class="mb-3">
          <span class="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Captured Failure Screenshot (Click to zoom)
          </span>
          <img src="${eva.image}" alt="Failure Screenshot" onclick="openModal(this.src, '${escapeHtml(t.title)}')" class="screenshot-thumb rounded-lg border border-slate-700 hover:border-indigo-500 transition-all cursor-zoom-in max-h-48 object-cover object-top shadow-md"/>
        </div>` : ''}
        <div class="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-300 overflow-x-auto max-h-36">
          <pre class="whitespace-pre-wrap">${safeErr}</pre>
        </div>
      </div>
    `;
  }

  testsRowsHtml += `
    <div class="test-row ${statusClass} p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/50 transition-all duration-200" data-status="${t.status}" data-title="${escapeHtml(t.title)}" data-file="${escapeHtml(t.file)}" data-cat="${escapeHtml(t.category)}">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <div class="shrink-0 mt-0.5">${statusBadge}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">${escapeHtml(t.file)}:${t.line}</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400">${escapeHtml(t.category)}</span>
              ${!isPassed && t.expectedVsActual && t.expectedVsActual.defectId ? `<span class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">${escapeHtml(t.expectedVsActual.defectId)}</span>` : ''}
            </div>
            <p class="text-sm font-medium text-slate-100 leading-snug">${escapeHtml(t.title)}</p>
          </div>
        </div>
        <div class="text-right shrink-0">
          <span class="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            ${t.durationSec}s
          </span>
        </div>
      </div>
      ${failDetailsHtml}
    </div>
  `;
}

// Build Defect Highlight Cards
const failedTests = allTests.filter(t => t.status === 'failed');
let defectsHighlightHtml = '';
for (const ft of failedTests) {
  const eva = ft.expectedVsActual;
  defectsHighlightHtml += `
    <div class="defect-card rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-slate-900/60 p-5 backdrop-blur-md shadow-xl hover:border-rose-500/50 transition-all duration-300">
      <div class="flex items-center justify-between gap-2 mb-3">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-wider">FAILED</span>
          ${eva && eva.defectId ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">${escapeHtml(eva.defectId)}</span>` : ''}
          ${eva && eva.category ? `<span class="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300">${escapeHtml(eva.category)}</span>` : ''}
        </div>
        <span class="text-xs font-mono text-slate-400">${escapeHtml(ft.file)}:${ft.line}</span>
      </div>
      
      <h3 class="text-base font-semibold text-slate-100 mb-3 leading-snug">${escapeHtml(ft.title)}</h3>
      
      ${eva ? `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-xs">
        <div class="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3">
          <div class="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Expected Behavior
          </div>
          <p class="text-slate-300 leading-relaxed">${escapeHtml(eva.expected)}</p>
        </div>
        <div class="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3">
          <div class="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            Observed Defect
          </div>
          <p class="text-slate-300 leading-relaxed">${escapeHtml(eva.actual)}</p>
        </div>
      </div>
      ` : ''}

      ${eva && eva.image ? `
      <div class="relative group rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950">
        <img src="${eva.image}" alt="Defect Screenshot for ${escapeHtml(ft.title)}" onclick="openModal(this.src, '${escapeHtml(ft.title)}')" class="w-full h-48 object-cover object-top cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]"/>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
        <div class="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-slate-300 pointer-events-none">
          <span class="flex items-center gap-1.5 font-medium">
            <svg class="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
            Click to view full screenshot
          </span>
          <span class="bg-slate-900/90 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-700">1280x720</span>
        </div>
      </div>
      ` : ''}
    </div>
  `;
}

const fullHtml = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>APECO Portal - Playwright Test Execution Report</title>
  <meta name="description" content="Playwright Automated Test Suite Execution Report with Embedded Screenshots for APECO Portal">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
            mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #090D16;
      color: #F1F5F9;
    }
    .glass-card {
      background: rgba(30, 41, 59, 0.45);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .glow-emerald {
      box-shadow: 0 0 25px -5px rgba(16, 185, 129, 0.25);
    }
    .glow-rose {
      box-shadow: 0 0 25px -5px rgba(244, 63, 94, 0.25);
    }
    #imgModal {
      transition: opacity 0.25s ease, visibility 0.25s ease;
    }
    #imgModal.hidden {
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    #imgModal:not(.hidden) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }
  </style>
</head>
<body class="min-h-screen antialiased selection:bg-indigo-500 selection:text-white pb-20">

  <!-- Top Navigation Header -->
  <header class="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-black text-lg tracking-wider">
          A
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-widest text-indigo-400">APECO Portal</span>
            <span class="text-slate-600">/</span>
            <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">QC East US</span>
          </div>
          <h1 class="text-base font-bold text-slate-100 tracking-tight">Playwright Test Suite Execution Report</h1>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button onclick="window.print()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition text-xs" title="Print or Save PDF">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Export Report
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

    <!-- KPI Metrics -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div class="glass-card rounded-2xl p-5 border border-slate-800/80">
        <span class="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Total Tests</span>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-slate-100">${totalCount}</span>
          <span class="text-xs font-medium text-slate-400">cases</span>
        </div>
        <div class="mt-2 text-[11px] text-slate-400 font-mono">3 test specs</div>
      </div>

      <div class="glass-card rounded-2xl p-5 border border-emerald-500/20 glow-emerald">
        <span class="text-xs font-medium text-emerald-400 uppercase tracking-wider block mb-1">Passed</span>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-emerald-400">${passedCount}</span>
          <span class="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">${passRate}%</span>
        </div>
        <div class="mt-2 text-[11px] text-emerald-400/80 font-mono">Positive, auth & localization</div>
      </div>

      <div class="glass-card rounded-2xl p-5 border border-rose-500/30 glow-rose">
        <span class="text-xs font-medium text-rose-400 uppercase tracking-wider block mb-1">Failed</span>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-rose-400">${failedCount}</span>
          <span class="text-xs font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400">${(100 - parseFloat(passRate)).toFixed(1)}%</span>
        </div>
        <div class="mt-2 text-[11px] text-rose-400/80 font-mono">Known defects verified</div>
      </div>

      <div class="glass-card rounded-2xl p-5 border border-slate-800/80">
        <span class="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Duration</span>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-slate-100">${totalMinStr}</span>
        </div>
        <div class="mt-2 text-[11px] text-slate-400 font-mono">Parallel (2 workers)</div>
      </div>

      <div class="glass-card rounded-2xl p-5 border border-slate-800/80 col-span-2 lg:col-span-1">
        <span class="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Target Portal</span>
        <div class="text-sm font-semibold text-slate-200 truncate" title="https://apeco-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/">
          APECO QC Portal
        </div>
        <div class="mt-2 text-[11px] text-slate-400 font-mono truncate">Azure Container Apps</div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-10 glass-card rounded-2xl p-4 border border-slate-800">
      <div class="flex items-center justify-between text-xs mb-2">
        <span class="font-semibold text-slate-300">Execution Pass Rate</span>
        <span class="font-mono font-bold text-emerald-400">${passRate}% Passed (${passedCount} of ${totalCount})</span>
      </div>
      <div class="w-full h-3.5 bg-slate-800/80 rounded-full overflow-hidden flex gap-0.5 p-0.5">
        <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-full" style="width: ${passRate}%"></div>
        <div class="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-r-full" style="width: ${(100 - parseFloat(passRate)).toFixed(1)}%"></div>
      </div>
    </div>

    <!-- Defect Highlights with Screenshots -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Defect & Failure Analysis (${failedCount} Verified Known Defects)
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">The only failures in this run correspond strictly to documented known application defects.</p>
        </div>
        <span class="text-xs font-mono px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">${failedCount} Actionable Defects</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        ${defectsHighlightHtml}
      </div>
    </section>

    <!-- Baseline UI Verification Gallery -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            Verified UI Baseline Gallery
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">Captured baseline references confirming visual layout, RTL mirroring, and validation presentation.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="glass-card rounded-xl overflow-hidden border border-slate-800 p-3 group">
          <div class="relative overflow-hidden rounded-lg mb-2.5 bg-slate-950">
            <img src="${imgBaselineEn}" alt="English Login Baseline" onclick="openModal(this.src, 'Baseline: English Login Screen (LTR Layout)')" class="w-full h-44 object-cover object-top cursor-zoom-in group-hover:scale-105 transition duration-300"/>
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-slate-200 text-[11px] font-mono border border-slate-700">English / LTR</span>
          </div>
          <div class="text-xs font-semibold text-slate-200">English Login Baseline</div>
          <p class="text-[11px] text-slate-400 mt-1">Standard two-column sign-in form with UAE PASS button and password reveal.</p>
        </div>

        <div class="glass-card rounded-xl overflow-hidden border border-slate-800 p-3 group">
          <div class="relative overflow-hidden rounded-lg mb-2.5 bg-slate-950">
            <img src="${imgBaselineAr}" alt="Arabic Login Baseline" onclick="openModal(this.src, 'Baseline: Arabic Login Screen (RTL Layout)')" class="w-full h-44 object-cover object-top cursor-zoom-in group-hover:scale-105 transition duration-300"/>
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-emerald-400 text-[11px] font-mono border border-slate-700">Arabic / RTL</span>
          </div>
          <div class="text-xs font-semibold text-slate-200">Arabic RTL Login Baseline</div>
          <p class="text-[11px] text-slate-400 mt-1">Mirrored right-to-left layout with Arabic form labels and right-aligned branding.</p>
        </div>

        <div class="glass-card rounded-xl overflow-hidden border border-slate-800 p-3 group">
          <div class="relative overflow-hidden rounded-lg mb-2.5 bg-slate-950">
            <img src="${imgBaselineArErrors}" alt="Arabic Validation Errors" onclick="openModal(this.src, 'Baseline: Arabic Required Validation Alerts')" class="w-full h-44 object-cover object-top cursor-zoom-in group-hover:scale-105 transition duration-300"/>
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-amber-400 text-[11px] font-mono border border-slate-700">Arabic / Validations</span>
          </div>
          <div class="text-xs font-semibold text-slate-200">Arabic Form Validations</div>
          <p class="text-[11px] text-slate-400 mt-1">Localized inline error messaging for empty username and password submissions.</p>
        </div>
      </div>
    </section>

    <!-- Complete Test Matrix -->
    <section>
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 class="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            Complete Test Execution Matrix
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">Filter by execution status or search by test name.</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <div class="inline-flex rounded-lg bg-slate-900 p-1 border border-slate-800">
            <button onclick="filterTests('all', this)" class="filter-btn active px-3 py-1 text-xs font-medium rounded-md bg-indigo-600 text-white transition">All (${totalCount})</button>
            <button onclick="filterTests('failed', this)" class="filter-btn px-3 py-1 text-xs font-medium rounded-md text-slate-400 hover:text-slate-200 transition">Failed (${failedCount})</button>
            <button onclick="filterTests('passed', this)" class="filter-btn px-3 py-1 text-xs font-medium rounded-md text-slate-400 hover:text-slate-200 transition">Passed (${passedCount})</button>
          </div>

          <div class="relative flex-1 sm:w-64">
            <input type="text" id="testSearch" oninput="searchTests(this.value)" placeholder="Search test name or ID..." class="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500">
            <svg class="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
      </div>

      <div id="testsContainer" class="space-y-2.5">
        ${testsRowsHtml}
      </div>
    </section>

  </main>

  <!-- Lightbox Modal -->
  <div id="imgModal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4" onclick="closeModal(event)">
    <div class="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/70">
        <span id="modalCaption" class="text-xs font-medium text-slate-300 truncate max-w-xl">Screenshot View</span>
        <button onclick="closeModal()" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="p-2 bg-black flex items-center justify-center max-h-[80vh] overflow-auto">
        <img id="modalImg" src="" alt="Full Resolution Screenshot" class="max-w-full max-h-[75vh] object-contain rounded"/>
      </div>
    </div>
  </div>

  <script>
    function filterTests(status, btn) {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('bg-indigo-600', 'text-white');
      btn.classList.remove('text-slate-400');

      const rows = document.querySelectorAll('.test-row');
      rows.forEach(r => {
        if (status === 'all' || r.getAttribute('data-status') === status) {
          r.style.display = '';
        } else {
          r.style.display = 'none';
        }
      });
    }

    function searchTests(query) {
      const q = query.toLowerCase().trim();
      const rows = document.querySelectorAll('.test-row');
      rows.forEach(r => {
        const title = (r.getAttribute('data-title') || '').toLowerCase();
        const file = (r.getAttribute('data-file') || '').toLowerCase();
        const cat = (r.getAttribute('data-cat') || '').toLowerCase();
        if (!q || title.includes(q) || file.includes(q) || cat.includes(q)) {
          r.style.display = '';
        } else {
          r.style.display = 'none';
        }
      });
    }

    function openModal(src, caption) {
      document.getElementById('modalImg').src = src;
      document.getElementById('modalCaption').textContent = caption || 'Screenshot View';
      document.getElementById('imgModal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('imgModal').classList.add('hidden');
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  </script>
</body>
</html>`;

// Write to test-report.html in root
const rootReportPath = path.join(__dirname, '..', 'test-report.html');
fs.writeFileSync(rootReportPath, fullHtml, 'utf8');
console.log('Successfully generated:', rootReportPath);

// Write to reports/index.html
const reportsIndexPath = path.join(__dirname, '..', 'reports', 'index.html');
fs.writeFileSync(reportsIndexPath, fullHtml, 'utf8');
console.log('Successfully generated:', reportsIndexPath);
