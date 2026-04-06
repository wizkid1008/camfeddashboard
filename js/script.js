// ─── HIERARCHY DATA ────────────────────────────────────────────
// Each statistic: { label, kpi?, pct?, kpiSum?, kpiRatio? }
// kpi      = dot-path into D (e.g. "kpi11.annual.total")
// pct      = true → format as percentage
// kpiSum   = array of dot-paths whose values are summed
// kpiRatio = { n: numeratorPath, d: denominatorPath } → displayed as %
const hierarchyData = [
  {
    level: "LEVEL 1: Girl's Education",
    subLevel: "Education Reach",
    statistics: [
      { label: "# Girls supported in Schol with Education Bursaries",           kpi: "kpi11.annual.total" },
      { label: "# Girls Supported in School by CAMA & Community Champions",     kpi: "kpi12.annual.total" },
      { label: "# Total Girls Supported",                                        kpi: "kpi13.annual.girls" },
      { label: "# Total Boys Supported",                                         kpi: "kpi13.annual.boys" }
    ]
  },
  {
    level: "LEVEL 1: Girl's Education",
    subLevel: "Education Outcomes",
    statistics: [
      { label: "Dropout Rate for Girls with Education Bursaries due to EMP",    kpi: "kpi15.pct", pct: true },
      { label: "Girls with Education Bursaries that Progress to Next Grade" },
      { label: "Exam Passrates for Girls with Busaries" },
      { label: "School Completion Rates for girls with busaries" }
    ]
  },
  {
    level: "LEVEL 1: Girl's Education",
    subLevel: "Learner Guide Programme",
    statistics: [
      { label: "Active Learner Guides",                                                                          kpi: "kpi19.total" },
      { label: "Girls Reporting Increased Agency" },
      { label: "Learner Guides Reporting Increased Agency" },
      { label: "Average number of children my better world annually" },
      { label: "Active Learner Guides by Training",                                                              kpi: "kpi19.camfed" },
      { label: "Children Receieving Social and Learning Support Including My Better World Sessions",             kpi: "kpi13.annual.total" }
    ]
  },
  {
    level: "LEVEL 2: Livelihoods & Leadership",
    subLevel: "Leadership and Tertiary",
    statistics: [
      { label: "Active Transition Guides",                                kpi: "kpi22.transition" },
      { label: "Numbers of CAMA Members",                                 kpi: "kpi21.cum" },
      { label: "Young Women Supported by Transition Guide",               kpi: "kpi213.num" },
      { label: "Young Women Supported by CAMFED Tertiary Education" },
      { label: "CAMA Members in Leadership Roles" }
    ]
  },
  {
    level: "LEVEL 2: Livelihoods & Leadership",
    subLevel: "Livelihoods Reach",
    statistics: [
      { label: "Active Enerperis Guides (Business & Agriculture Guides)", kpiSum: ["kpi22.business", "kpi22.agriculture"] },
      { label: "Business Supported by Enterprise Guides",                 kpi: "kpi27.biz" },
      { label: "Business Grants Distributed" },
      { label: "CAMFED KIVA and RIF Loans Distributed" }
    ]
  },
  {
    level: "LEVEL 2: Livelihoods & Leadership",
    subLevel: "Jobs & Income",
    statistics: [
      { label: "Women Progresing Towards a secure livelihood" },
      { label: "Females Entrepreeurs with increased incomes after participating in CAMFED's ENteprise Programs", kpi: "kpi210.pct", pct: true },
      { label: "Jobs Created through Enterprise Programme including Self Employment",                            kpi: "kpi29.annual" },
      { label: "New Business" },
      { label: "Business Survival Rate",                                                                         kpi: "kpi212.yr1", pct: true }
    ]
  },
  {
    level: "LEVEL 2: Livelihoods & Leadership",
    subLevel: "Agriculture & Food",
    statistics: [
      { label: "Percentage of Femal Entrepenuers Reporting and Increased Household Consumption fo Food Since Participating in CAMFED's Enteprise Program" },
      { label: "Percentage of FEmals Agripernuers Reporting Increased Yields Since Participating" },
      { label: "Average Number of Climate-Smart Techniques Used by Those Receiieng Support from an Agriculture Guide" }
    ]
  },
  {
    level: "LEVEL 2: Livelihoods & Leadership",
    subLevel: "Life Choices",
    statistics: [
      { label: "Average of Young Women Married by Age 18 Across All Countries" },
      { label: "Average of Young Women Giving Birth by Age 18" },
      { label: "Percentrage of Young Women in CAMA who Were Married by 18" },
      { label: "Percentage of Young Women CAMA Who have Given Birth by 18" }
    ]
  },
  {
    level: "LEVEL 3: Education Systems",
    subLevel: "Education Systems 1",
    statistics: [
      { label: "% of Resources for Learner Guide Programme Contributed by the Government", kpiRatio: { n: "kpi19.govt", d: "kpi19.total" } },
      { label: "National Level Dropout Rate for Girls due to Early Mariage of Pregnancy",  kpi: "kpi15.pct", pct: true },
      { label: "Community Champion Teacher Mentors" },
      { label: "Number of Districts with Learns Guides",                                   kpi: "kpi34.districts" },
      { label: "Number of Schools with Learner Guides",                                    kpi: "kpi31.total_all" }
    ]
  },
  {
    level: "LEVEL 3: Education Systems",
    subLevel: "Education Systems 2",
    statistics: [
      { label: "Number of Memerando fo Understanding between Government and CAMFED" },
      { label: "Children Benefiting from Improved Learning Environment",                    kpi: "kpi35.total" },
      { label: "Number of Active Community Champions for Girl's Education" },
      { label: "National Level Dropout Rate for Girls due to Early Mariage of Pregnancy",  kpi: "kpi15.pct", pct: true },
      { label: "Number of Memoranda of Understanding between Government Departmetns and CAMFED" }
    ]
  }
];

// Maps hierarchyData level strings to existing panel IDs (level1/level2/level3)
const levelToPanelId = {
  "LEVEL 1: Girl's Education": 'level1',
  "LEVEL 2: Livelihoods & Leadership": 'level2',
  "LEVEL 3: Education Systems": 'level3'
};

// ─── COLOUR PALETTE ────────────────────────────────────────────
const C = ['Ghana','Malawi','Tanzania','Zambia','Zimbabwe'];
const CC = {
  Ghana:   '#c8882a',
  Malawi:  '#5e2580',
  Tanzania:'#2e7d32',
  Zambia:  '#7b3fa0',
  Zimbabwe:'#c0392b',
  All:     '#8b3fb0'
};
// For bar charts always use these
const BARS = ['#c8882a','#5e2580','#2e7d32','#7b3fa0','#c0392b'];

// ─── DATA ──────────────────────────────────────────────────────
const D = {
  kpi11: {
    annual:{primary:{Ghana:0,Malawi:9108,Tanzania:0,Zambia:7116,Zimbabwe:0,Total:16224},secondary:{Ghana:43734,Malawi:11301,Tanzania:20758,Zambia:39075,Zimbabwe:18581,Total:133449},total:{Ghana:43734,Malawi:20409,Tanzania:20758,Zambia:46191,Zimbabwe:18581,Total:149673}},
    newly:{total:{Ghana:34004,Malawi:4986,Tanzania:15506,Zambia:28266,Zimbabwe:12966,Total:95728}},
    cum2030:{total:{Ghana:79092,Malawi:101245,Tanzania:70463,Zambia:177015,Zimbabwe:75559,Total:503374}},
    cumAll:{total:{Ghana:223973,Malawi:185440,Tanzania:156201,Zambia:364187,Zimbabwe:292942,Total:1222743}}
  },
  kpi12:{annual:{total:{Ghana:169749,Malawi:162679,Tanzania:132626,Zambia:112340,Zimbabwe:310635,Total:888029}}},
  kpi13:{annual:{girls:{Ghana:141111,Malawi:526109,Tanzania:163417,Zambia:72505,Zimbabwe:143711,Total:1046853},boys:{Ghana:120061,Malawi:444884,Tanzania:141167,Zambia:56398,Zimbabwe:116510,Total:879020},total:{Ghana:261172,Malawi:970993,Tanzania:304584,Zambia:128903,Zimbabwe:260221,Total:1925873}}},
  kpi15:{pct:{Ghana:0.34,Malawi:3.93,Tanzania:0.59,Zambia:0.65,Zimbabwe:1.60}},
  kpi19:{camfed:{Ghana:2317,Malawi:3068,Tanzania:3522,Zambia:3224,Zimbabwe:4405,Total:16536},govt:{Ghana:178,Malawi:2605,Tanzania:744,Zambia:0,Zimbabwe:1090,Total:4617},total:{Ghana:2495,Malawi:5673,Tanzania:4266,Zambia:3224,Zimbabwe:5495,Total:21153}},
  kpi21:{new:{Ghana:8340,Malawi:2685,Tanzania:9549,Zambia:6818,Zimbabwe:6396,Total:33788},cum:{Ghana:77264,Malawi:37358,Tanzania:66651,Zambia:36224,Zimbabwe:95250,Total:312747}},
  kpi22:{transition:{Ghana:365,Malawi:230,Tanzania:1722,Zambia:521,Zimbabwe:2221,Total:5059},agriculture:{Ghana:239,Malawi:138,Tanzania:386,Zambia:461,Zimbabwe:924,Total:2148},business:{Ghana:339,Malawi:372,Tanzania:2317,Zambia:411,Zimbabwe:1673,Total:5112}},
  kpi26:{annual:{Ghana:2411,Malawi:1732,Tanzania:2722,Zambia:2475,Zimbabwe:3004,Total:12344}},
  kpi27:{ag:{Ghana:1200,Malawi:2056,Tanzania:3777,Zambia:4814,Zimbabwe:8799,Total:20646},biz:{Ghana:2411,Malawi:7886,Tanzania:24696,Zambia:4409,Zimbabwe:13989,Total:53391}},
  kpi29:{annual:{Ghana:6736,Malawi:3644,Tanzania:10125,Zambia:5837,Zimbabwe:8216,Total:34558}},
  kpi210:{pct:{Ghana:86,Malawi:69,Tanzania:72,Zambia:81,Zimbabwe:74}},
  kpi211:{profit:{Ghana:87,Malawi:84,Tanzania:84,Zambia:81,Zimbabwe:73}},
  kpi212:{yr1:{Ghana:95,Malawi:88,Tanzania:91,Zambia:91,Zimbabwe:90}},
  kpi213:{num:{Ghana:14920,Malawi:23917,Tanzania:21195,Zambia:14127,Zimbabwe:41462,Total:115621}},
  kpi31:{primary:{Ghana:0,Malawi:1397,Tanzania:0,Zambia:353,Zimbabwe:0,Total:1750},secondary:{Ghana:671,Malawi:25,Tanzania:466,Zambia:402,Zimbabwe:1602,Total:3166},total_all:{Ghana:846,Malawi:3538,Tanzania:757,Zambia:794,Zimbabwe:1602,Total:7537}},
  kpi34:{districts:{Ghana:44,Malawi:17,Tanzania:35,Zambia:61,Zimbabwe:42,Total:199}},
  kpi35:{primary:{Ghana:0,Malawi:3082975,Tanzania:0,Zambia:239094,Zimbabwe:0,Total:3322069},secondary:{Ghana:325297,Malawi:7783,Tanzania:643671,Zambia:271494,Zimbabwe:520178,Total:1768423},total:{Ghana:325297,Malawi:3090758,Tanzania:643671,Zambia:510588,Zimbabwe:520178,Total:5090492}},
  p1:{girls:{Ghana:226228,Malawi:185997,Tanzania:156466,Zambia:166358,Zimbabwe:431058,Total:1166107},boys:{Ghana:99123,Malawi:84080,Tanzania:68027,Zambia:67115,Zimbabwe:181221,Total:499566},total:{Ghana:325351,Malawi:270077,Tanzania:224493,Zambia:233473,Zimbabwe:612279,Total:1665673}},
  p9:{form1:{Ghana:0,Malawi:7.8,Tanzania:5.3,Zambia:0.73,Zimbabwe:0.4},form2:{Ghana:0,Malawi:23.8,Tanzania:13.1,Zambia:2.11,Zimbabwe:0},form3:{Ghana:0,Malawi:6.8,Tanzania:8.0,Zambia:0.59,Zimbabwe:3.2},form4:{Ghana:0.7,Malawi:4.2,Tanzania:1.2,Zambia:1.05,Zimbabwe:2.0}},
  districts:{Ghana:['Accra Metro','Awutu Senya','Birim Central','Ejura Sekyedumase','Kpando'],Malawi:['Balaka','Blantyre','Chiradzulu','Chikwawa','Dedza'],Tanzania:['Bagamoyo','Chalinze','Chamwino','Chato','Gairo'],Zambia:['Chililabombwe','Chingola','Chipata','Kabwe','Kafue'],Zimbabwe:['Binga','Buhera','Bulawayo','Chiredzi','Chinhoyi']}
};

// ─── STATE ─────────────────────────────────────────────────────
let sel = { country: 'All', dateStart: 2020, dateEnd: 2030, level: '', subLevel: '' };
const charts = {};

// ─── HELPERS ───────────────────────────────────────────────────
function fmt(n) {
  if (n==null) return '—';
  if (typeof n==='string') return n;
  return Math.round(n).toLocaleString();
}

function fmtK(v) {
  return v>=1000000?(v/1000000).toFixed(1)+'M':v>=1000?(v/1000).toFixed(0)+'k':v;
}

function cv(obj) {
  return sel.country==='All'?(obj.Total??null):(obj[sel.country]??null);
}

function destroyChart(id) {
  if(charts[id]){
    charts[id].destroy();
    delete charts[id];
  }
}

const gridC = 'rgba(74,26,107,0.12)';
const tickC = '#4a3560';

function chartOpts(stacked, horizontal, pct) {
  const axis = horizontal ? {
    x: {
      grid:{color:gridC},
      ticks:{color:tickC,font:{size:10,family:"'Lato'"},callback:v=>fmtK(v)+(pct?'%':'')}
    },
    y: {
      grid:{display:false},
      ticks:{color:tickC,font:{size:10,family:"'Lato'"}}
    }
  } : {
    x: {
      stacked,
      grid:{color:gridC},
      ticks:{color:tickC,font:{size:10,family:"'Lato'"}}
    },
    y: {
      stacked,
      grid:{color:gridC},
      ticks:{color:tickC,font:{size:10,family:"'Lato'"},callback:v=>fmtK(v)+(pct?'%':'')}
    }
  };
  return {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
      legend:{display:false},
      tooltip:{callbacks:{label:ctx=>' '+fmt(ctx.raw)+(pct?'%':'')}}
    },
    scales: axis
  };
}

function bar(id, labels, datasets, opts={}) {
  destroyChart(id);
  const ctx = document.getElementById(id);
  if(!ctx) return;
  const horiz = !!opts.horizontal;
  charts[id] = new Chart(ctx,{
    type:'bar',
    data:{
      labels,
      datasets:datasets.map(d=>({...d, borderRadius:4, borderSkipped:false}))
    },
    options:{
      ...chartOpts(!!opts.stacked, horiz, !!opts.pct),
      indexAxis: horiz?'y':'x',
      plugins:{
        legend:{
          display:!!opts.legend,
          labels:{color:tickC,font:{size:10},usePointStyle:true,pointStyle:'rect'}
        },
        tooltip:{callbacks:{label:ctx=>' '+fmt(ctx.raw)+(opts.pct?'%':'')}}
      }
    }
  });
}

function donut(id, labels, data, colors) {
  destroyChart(id);
  const ctx = document.getElementById(id);
  if(!ctx) return;
  charts[id] = new Chart(ctx,{
    type:'doughnut',
    data:{
      labels,
      datasets:[{data,backgroundColor:colors,borderColor:'#f5f0e3',borderWidth:3}]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{
        legend:{
          position:'right',
          labels:{color:tickC,font:{size:10},usePointStyle:true,pointStyle:'circle',padding:10}
        },
        tooltip:{callbacks:{label:ctx=>' '+ctx.label+': '+fmt(ctx.raw)}}
      },
      cutout:'58%'
    }
  });
}

function progList(id, items, max, colorFn) {
  const el = document.getElementById(id);
  if(!el) return;
  const m = max || Math.max(...items.map(i=>i.val), 1);
  el.innerHTML = items.map(it=>`
    <div class="prog-item">
      <div class="prog-row">
        <span class="prog-label">${it.label}</span>
        <span class="prog-val">${it.display||fmt(it.val)}</span>
      </div>
      <div class="prog-bg">
        <div class="prog-fill" style="width:${(it.val/m*100).toFixed(1)}%;background:${colorFn?colorFn(it.label):'#5e2580'}"></div>
      </div>
    </div>`).join('');
}

// ─── POPULATE COUNTRY DROPDOWN ────────────────────────────────
function buildCountryDropdown() {
  const select = document.getElementById('country-select');
  if (!select) return;

  // Get countries from data (automatically includes any new ones)
  const countries = ['All', ...C];

  // Clear existing options first
  select.innerHTML = '';

  // Add each country as an option
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country === 'All' ? 'All Countries' : country;
    select.appendChild(option);
  });

  // Set default selection
  select.value = 'All';
}

// ─── POPULATE LEVEL DROPDOWN ──────────────────────────────────
function buildLevelDropdown() {
  const select = document.getElementById('level-select');
  // Derive unique levels in order from hierarchyData
  const seen = new Set();
  hierarchyData.forEach(item => {
    if (!seen.has(item.level)) {
      seen.add(item.level);
      const opt = document.createElement('option');
      opt.value = levelToPanelId[item.level]; // "level1" / "level2" / "level3"
      opt.textContent = item.level;
      select.appendChild(opt);
    }
  });
}

// ─── POPULATE SUBLEVEL DROPDOWN ───────────────────────────────
// Called when a Level is selected; filters sublevels from hierarchyData
function buildSubLevelDropdown(panelId) {
  const select = document.getElementById('sublevel-select');
  select.innerHTML = '<option value="" disabled selected>Select Sub Level</option>';
  hierarchyData
    .filter(item => levelToPanelId[item.level] === panelId)
    .forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.subLevel;
      opt.textContent = item.subLevel;
      select.appendChild(opt);
    });
  select.disabled = false;
  select.value = '';
}

// ─── RESOLVE KPI VALUE ────────────────────────────────────────
// Resolves a statistic object's data reference against the current country.
// Handles: single kpi path, kpiSum (array of paths added together),
// and kpiRatio (numerator/denominator shown as a percentage).
function resolveKpiValue(stat) {
  // Walk a dot-notation path into D and return the country value
  function getPath(path) {
    const parts = path.split('.');
    let v = D;
    for (const p of parts) { if (v == null) return null; v = v[p]; }
    if (v == null || typeof v !== 'object') return null;
    if (sel.country === 'All') {
      if (v.Total != null) return v.Total;
      // No Total field — average across all countries (e.g. kpi15.pct)
      const vals = C.map(c => v[c]).filter(n => n != null);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    }
    return v[sel.country] ?? null;
  }

  if (stat.kpiSum) {
    const nums = stat.kpiSum.map(getPath).filter(n => n != null);
    return nums.length ? fmt(nums.reduce((a, b) => a + b, 0)) : null;
  }
  if (stat.kpiRatio) {
    const n = getPath(stat.kpiRatio.n), d = getPath(stat.kpiRatio.d);
    return (n != null && d) ? (n / d * 100).toFixed(1) + '%' : null;
  }
  if (!stat.kpi) return null;
  const n = getPath(stat.kpi);
  return n != null ? (stat.pct ? n.toFixed(2) + '%' : fmt(n)) : null;
}

// ─── RENDER SUBLEVEL STATISTICS ───────────────────────────────
// Auto-populates all stats for the selected Level + SubLevel combination
function renderSubLevelStats(panelId, subLevelValue) {
  const section = document.getElementById('sublevel-stats-section');
  if (!subLevelValue) { section.style.display = 'none'; return; }

  const entry = hierarchyData.find(
    item => levelToPanelId[item.level] === panelId && item.subLevel === subLevelValue
  );
  if (!entry) { section.style.display = 'none'; return; }

  // Deduplicate by label and remove blanks
  const stats = [...new Map(entry.statistics.map(s => [s.label, s])).values()]
    .filter(s => s.label && s.label.trim());

  document.getElementById('sublevel-stats-title').textContent =
    `${entry.level} — ${entry.subLevel}`;
  document.getElementById('sublevel-stats-list').innerHTML =
    stats.map(s => {
      const val = resolveKpiValue(s);
      return `<li class="sublevel-stat-item">
        <span class="sublevel-stat-label">${s.label}</span>
        <span class="sublevel-stat-value${val ? '' : ' sublevel-stat-na'}">${val ?? '—'}</span>
      </li>`;
    }).join('');
  section.style.display = 'block';
}

// ─── UPDATE STATS ──────────────────────────────────────────────
// Helper: set element text only if element exists
function setTxt(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function updateStats() {
  const c = sel.country;

  // L1 stats
  setTxt('s-bursary', fmt(cv(D.kpi11.annual.total)));
  setTxt('s-cama-school', fmt(cv(D.kpi12.annual.total)));
  setTxt('s-sls', fmt(cv(D.kpi13.annual.total)));
  setTxt('s-lg', fmt(cv(D.kpi19.total)));
  setTxt('s-alltime', fmt(cv(D.kpi11.cumAll.total)));

  // Headline
  const cLabel = c==='All'?'All Countries':c;
  setTxt('l1-headline', `${cLabel} — Level 1: Girls' Education, Bursary Support & Learner Guides`);

  // L2 stats
  setTxt('s2-cama', fmt(cv(D.kpi21.cum)));
  setTxt('s2-jobs', fmt(cv(D.kpi29.annual)));
  setTxt('s2-ent', fmt(cv(D.kpi26.annual)));

  // L3 stats
  setTxt('s3-schools', fmt(cv(D.kpi31.total_all)));
  setTxt('s3-districts', fmt(cv(D.kpi34.districts)));
  setTxt('s3-children', fmt(cv(D.kpi35.total)));
}

// ─── BUILD LEVEL 1 ─────────────────────────────────────────────
function buildL1() {
  const c = sel.country;

  // Bursary chart
  if (c==='All') {
    bar('l1-bursary-chart', C, [{data:C.map(n=>D.kpi11.annual.total[n]||0), backgroundColor:BARS}]);
  } else {
    const periods = ['Annual','Newly Supp.','Cum. 20–30','Cum. All-time'];
    const vals = [
      D.kpi11.annual.total[c]||0,
      D.kpi11.newly.total[c]||0,
      D.kpi11.cum2030.total[c]||0,
      D.kpi11.cumAll.total[c]||0
    ];
    bar('l1-bursary-chart', periods, [{data:vals, backgroundColor:['#c8882a','#5e2580','#2e7d32','#7b3fa0']}]);
  }

  // LG chart
  if (c==='All') {
    bar('l1-lg-chart', C, [
      {label:'CAMFED', data:C.map(n=>D.kpi19.camfed[n]||0), backgroundColor:'#5e2580'},
      {label:'Govt', data:C.map(n=>D.kpi19.govt[n]||0), backgroundColor:'#c8882a'}
    ], {stacked:true, legend:true});
  } else {
    bar('l1-lg-chart', ['CAMFED Trained','Govt Trained'], [
      {data:[D.kpi19.camfed[c]||0, D.kpi19.govt[c]||0], backgroundColor:['#5e2580','#c8882a']}
    ]);
  }

  // Primary vs secondary
  bar('l1-levels-chart', C, [
    {label:'Primary', data:C.map(n=>D.kpi11.annual.primary[n]||0), backgroundColor:'#5e2580'},
    {label:'Secondary', data:C.map(n=>D.kpi11.annual.secondary[n]||0), backgroundColor:'#c8882a'}
  ], {stacked:false, legend:true});

  // Periods bar
  const allPeriods = ['Annual','Newly Supp.','Cum. 20–30','Cum. All-time'];
  const allVals = c==='All'
    ? allPeriods.map((_,i) => [D.kpi11.annual.total,D.kpi11.newly.total,D.kpi11.cum2030.total,D.kpi11.cumAll.total][i].Total||0)
    : allPeriods.map((_,i) => [D.kpi11.annual.total,D.kpi11.newly.total,D.kpi11.cum2030.total,D.kpi11.cumAll.total][i][c]||0);
  bar('l1-periods-chart', allPeriods, [{data:allVals, backgroundColor:['#5e2580','#7b3fa0','#c8882a','#4a1a6b']}]);

  // Dropout
  const items = (c==='All'?C:[c]).map(n=>({label:n, val:D.kpi15.pct[n], display:D.kpi15.pct[n].toFixed(2)+'%'}));
  progList('l1-dropout', items, 5, l=>CC[l]||'#5e2580');

  // SLS
  if (c==='All') {
    bar('l1-sls-chart', C, [
      {label:'Girls', data:C.map(n=>D.kpi13.annual.girls[n]||0), backgroundColor:'#c8882a'},
      {label:'Boys', data:C.map(n=>D.kpi13.annual.boys[n]||0), backgroundColor:'#5e2580'}
    ], {stacked:true, legend:true});
  } else {
    bar('l1-sls-chart', ['Girls','Boys'], [
      {data:[D.kpi13.annual.girls[c]||0, D.kpi13.annual.boys[c]||0], backgroundColor:['#c8882a','#5e2580']}
    ]);
  }

  // P9 dropout by form
  const formItems = ['Form 1','Form 2','Form 3','Form 4'].map((f,i)=>{
    const keys=['form1','form2','form3','form4'];
    const val = c==='All' ? C.reduce((s,n)=>s+(D.p9[keys[i]][n]||0),0)/C.length : (D.p9[keys[i]][c]||0);
    return {label:f, val:parseFloat(val.toFixed(2)), display:val.toFixed(2)+'%'};
  });
  progList('l1-dropout-form', formItems, 25, ()=>'#7b3fa0');
}

// ─── BUILD LEVEL 2 ─────────────────────────────────────────────
function buildL2() {
  const c = sel.country;
  bar('l2-cama-chart', C, [{data:C.map(n=>D.kpi21.cum[n]||0), backgroundColor:BARS}]);
  bar('l2-guides-chart', C, [
    {label:'Transition', data:C.map(n=>D.kpi22.transition[n]||0), backgroundColor:'#4a1a6b'},
    {label:'Agriculture', data:C.map(n=>D.kpi22.agriculture[n]||0), backgroundColor:'#5e2580'},
    {label:'Business', data:C.map(n=>D.kpi22.business[n]||0), backgroundColor:'#c8882a'}
  ], {legend:true});
  bar('l2-biz-chart', C, [
    {label:'Ag. Guides', data:C.map(n=>D.kpi27.ag[n]||0), backgroundColor:'#5e2580'},
    {label:'Biz. Guides', data:C.map(n=>D.kpi27.biz[n]||0), backgroundColor:'#c8882a'}
  ], {legend:true});
  bar('l2-jobs-chart', c==='All'?C:['Jobs Created'], [
    {data:c==='All'?C.map(n=>D.kpi29.annual[n]||0):[D.kpi29.annual[c]||0], backgroundColor:c==='All'?BARS:'#c8882a'}
  ]);
  const inc = (c==='All'?C:[c]).map(n=>({label:n, val:D.kpi210.pct[n], display:D.kpi210.pct[n]+'%'}));
  progList('l2-income', inc, 100, l=>CC[l]||'#5e2580');
  const pro = (c==='All'?C:[c]).map(n=>({label:n, val:D.kpi211.profit[n], display:D.kpi211.profit[n]+'%'}));
  progList('l2-profit', pro, 100, l=>CC[l]||'#5e2580');
  const sur = (c==='All'?C:[c]).map(n=>({label:n, val:D.kpi212.yr1[n], display:D.kpi212.yr1[n]+'%'}));
  progList('l2-survival', sur, 100, l=>CC[l]||'#5e2580');
}

// ─── BUILD LEVEL 3 ─────────────────────────────────────────────
function buildL3() {
  bar('l3-schools-chart', C, [
    {label:'Primary', data:C.map(n=>D.kpi31.primary[n]||0), backgroundColor:'#5e2580'},
    {label:'Secondary', data:C.map(n=>D.kpi31.secondary[n]||0), backgroundColor:'#c8882a'}
  ], {stacked:true, legend:true});

  bar('l3-children-chart', C, [
    {label:'Primary', data:C.map(n=>D.kpi35.primary[n]||0), backgroundColor:'#5e2580'},
    {label:'Secondary', data:C.map(n=>D.kpi35.secondary[n]||0), backgroundColor:'#c8882a'}
  ], {stacked:true, legend:true});

  bar('l3-districts-chart', C, [{data:C.map(n=>D.kpi34.districts[n]||0), backgroundColor:BARS}]);
  bar('l3-p1-chart', C, [
    {label:'Girls', data:C.map(n=>D.p1.girls[n]||0), backgroundColor:'#c8882a'},
    {label:'Boys', data:C.map(n=>D.p1.boys[n]||0), backgroundColor:'#5e2580'}
  ], {stacked:true, legend:true});
}

// ─── REBUILD ACTIVE TAB ────────────────────────────────────────
function rebuildActive() {
  updateStats();
  const level = document.getElementById('level-select').value;
  if (level === 'level1') buildL1();
  else if (level === 'level2') buildL2();
  else if (level === 'level3') buildL3();
  // Re-render sublevel stats so values reflect the current country selection
  if (sel.subLevel) renderSubLevelStats(sel.level, sel.subLevel);
}

// ─── LEVEL DROPDOWN ────────────────────────────────────────────
document.getElementById('level-select').addEventListener('change', e=>{
  const value = e.target.value;
  if (!value) return;

  sel.level = value;
  sel.subLevel = '';

  // Switch visible panel
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-' + value)?.classList.add('active');

  // Reset and populate sublevel dropdown for the selected level
  buildSubLevelDropdown(value);

  // Clear any previously rendered statistics
  document.getElementById('sublevel-stats-section').style.display = 'none';

  // Build charts for the selected level
  if (value === 'level1') buildL1();
  else if (value === 'level2') buildL2();
  else if (value === 'level3') buildL3();
});

// ─── SUBLEVEL DROPDOWN ─────────────────────────────────────────
document.getElementById('sublevel-select').addEventListener('change', e=>{
  sel.subLevel = e.target.value;
  // Auto-populate all statistics for this Level + SubLevel
  renderSubLevelStats(sel.level, sel.subLevel);
});

// Country filter - dropdown
document.getElementById('country-select').addEventListener('change', e=>{
  sel.country = e.target.value;
  rebuildActive();
});

// Date range sliders
function updateDateDisplay() {
  const start = parseInt(document.getElementById('date-range-start').value);
  const end = parseInt(document.getElementById('date-range-end').value);
  document.getElementById('date-display').textContent = `${start} — ${end}`;
  sel.dateStart = start;
  sel.dateEnd = end;
  rebuildActive();
}

document.getElementById('date-range-start').addEventListener('input', e=>{
  const start = parseInt(e.target.value);
  const end = parseInt(document.getElementById('date-range-end').value);
  if (start > end) {
    e.target.value = end;
  } else {
    updateDateDisplay();
  }
});

document.getElementById('date-range-end').addEventListener('input', e=>{
  const end = parseInt(e.target.value);
  const start = parseInt(document.getElementById('date-range-start').value);
  if (end < start) {
    e.target.value = start;
  } else {
    updateDateDisplay();
  }
});

// ─── INIT ──────────────────────────────────────────────────────
buildCountryDropdown();
buildLevelDropdown();

// No default level pre-selected; panels hidden until user picks a Level
updateDateDisplay();
