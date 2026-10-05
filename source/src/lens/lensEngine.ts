// @ts-nocheck
/* Pakistan nutrient lenses (D-246). Ported 1:1 from the audited demo (2 Oct 2026); units per acre and maunds
   per acre, converted once in get(). Do not change a number or a sentence here without the independent audit. */
export function mountLens(root, D, d3, specs, opts = {}) {
const css = n => getComputedStyle(root).getPropertyValue(n).trim();
const SLOTS = ['--c1','--c2','--c3','--c4','--c5','--c6','--c7'];
const PAK = 'Pakistan';
const fmt = (v, d) => v == null || isNaN(v) ? 'no data' : (v>0 && v<0.1 && (d??2)<=1) ? 'less than 0.1' : (d === 0 ? Math.round(v).toLocaleString('en-US') : (+v).toLocaleString('en-US',{maximumFractionDigits: d ?? (Math.abs(v) < 10 ? 2 : 1), minimumFractionDigits: 0}));
const short = n => ({'Southern Asia (FAO)':'South Asia','United States':'USA','United Kingdom':'UK'}[n] || n);

// Unit conversion, applied once here. Source data (FAO via OWID) is per hectare.
// 1 acre = 0.40468564224 hectare (exact, international acre). 1 maund = 40 kg.
// Fertilizer: kg/ha x 0.40468564224 = kg/acre. Yield: t/ha x 1000 x 0.40468564224 / 40 = maunds/acre.
const HA_PER_ACRE = 0.40468564224, KG_PER_MAUND = 40;
const FACTOR = { N:HA_PER_ACRE, P:HA_PER_ACRE, K:HA_PER_ACRE, NPK:HA_PER_ACRE,
  cereal:1000*HA_PER_ACRE/KG_PER_MAUND, wheat:1000*HA_PER_ACRE/KG_PER_MAUND, rice:1000*HA_PER_ACRE/KG_PER_MAUND, maize:1000*HA_PER_ACRE/KG_PER_MAUND, cane:1000*HA_PER_ACRE/KG_PER_MAUND };
function raw(metric, c, y){ const s = D[metric] && D[metric][c]; if(!s) return null; const i = y - s[0] + 1; return (i >= 1 && i < s.length) ? s[i] : null; }
function get(metric, c, y){ const v = raw(metric, c, y); return v == null ? null : v * (FACTOR[metric] ?? 1); }
function ratio(a, b, k){ return (c,y) => { const x = get(a,c,y), z = get(b,c,y); return (x==null||z==null||z===0) ? null : x/z*k; }; }
const ALL = Object.keys(D.NPK).sort((a,b)=> (a==='World'?-2:a.startsWith('Southern')?-1:0) - (b==='World'?-2:b.startsWith('Southern')?-1:0) || a.localeCompare(b));

// country selection, colour follows the country, never its position
let selected = (opts.countries||['India','Bangladesh','China','World']).slice();
const colorOf = {}; let nextSlot = 0;
selected.forEach(c => colorOf[c] = SLOTS[nextSlot++ % SLOTS.length]);
const col = c => c === PAK ? css('--pak') : css(colorOf[c] || '--c7');


// --- statistics helpers (Pearson r, two-sided p from t with n-2 df) ---
function pearson(x,y){ const n=x.length, mx=d3.mean(x), my=d3.mean(y); let sxy=0,sxx=0,syy=0; for(let i=0;i<n;i++){const a=x[i]-mx,b=y[i]-my; sxy+=a*b; sxx+=a*a; syy+=b*b;} return sxy/Math.sqrt(sxx*syy); }
function betacf(a,b,x){ let qab=a+b,qap=a+1,qam=a-1,c=1,dd=1-qab*x/qap; if(Math.abs(dd)<1e-30)dd=1e-30; dd=1/dd; let h=dd; for(let m=1;m<=200;m++){ let m2=2*m, aa=m*(b-m)*x/((qam+m2)*(a+m2)); dd=1+aa*dd; if(Math.abs(dd)<1e-30)dd=1e-30; c=1+aa/c; if(Math.abs(c)<1e-30)c=1e-30; dd=1/dd; h*=dd*c; aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2)); dd=1+aa*dd; if(Math.abs(dd)<1e-30)dd=1e-30; c=1+aa/c; if(Math.abs(c)<1e-30)c=1e-30; dd=1/dd; const del=dd*c; h*=del; if(Math.abs(del-1)<3e-12)break; } return h; }
function lgamma(z){ const g=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5]; let x=z,y=z,t=x+5.5; t-=(x+0.5)*Math.log(t); let ser=1.000000000190015; for(const c of g) ser+=c/++y; return -t+Math.log(2.5066282746310005*ser/x); }
function ibeta(a,b,x){ if(x<=0) return 0; if(x>=1) return 1; const bt=Math.exp(lgamma(a+b)-lgamma(a)-lgamma(b)+a*Math.log(x)+b*Math.log(1-x)); return x<(a+1)/(a+b+2) ? bt*betacf(a,b,x)/a : 1-bt*betacf(b,a,1-x)/b; }
function pOfR(r,n){ const df=n-2, t=r*Math.sqrt(df/(1-r*r)); return ibeta(df/2,0.5,df/(df+t*t)); }
const fmtP = p => p<0.001 ? 'below 0.001' : fmt(p,3);
function yoyPoints(a,b){ const out=[]; for(let y=a;y<=b;y++){ const n1=get('N',PAK,y), n0=get('N',PAK,y-1), c1=get('cereal',PAK,y), c0=get('cereal',PAK,y-1); if([n1,n0,c1,c0].every(v=>v!=null)) out.push({y,dx:n1-n0,dy:c1-c0}); } return out; }
function yoyStats(a,b){ const pts=yoyPoints(a,b), r=pearson(pts.map(d=>d.dx),pts.map(d=>d.dy)); return {r,p:pOfR(r,pts.length),n:pts.length}; }
function pctBelow(metric,y){ const pv=get(metric,PAK,y); if(pv==null) return null; const vals=D.big.filter(c=>c!==PAK).map(c=>get(metric,c,y)).filter(v=>v!=null); if(!vals.length) return null; return Math.round(100*vals.filter(v=>v<pv).length/vals.length); }
function standStats(y){ return {N:pctBelow('N',y),P:pctBelow('P',y),K:pctBelow('K',y),C:pctBelow('cereal',y)}; }
function ranks(a){ const idx=a.map((v,i)=>[v,i]).sort((x,y)=>x[0]-y[0]); const r=new Array(a.length); for(let i=0;i<idx.length;){ let j=i; while(j+1<idx.length&&idx[j+1][0]===idx[i][0]) j++; for(let k=i;k<=j;k++) r[idx[k][1]]=(i+j)/2+1; i=j+1; } return r; }
function pscatR(y){ const pts=D.big.map(c=>[get('P',c,y),get('cereal',c,y)]).filter(d=>d[0]!=null&&d[1]!=null&&d[0]>0); return {r:pts.length>2?pearson(ranks(pts.map(d=>d[0])),ranks(pts.map(d=>d[1]))):NaN, n:pts.length}; }
const strength = r => { const a=Math.abs(+r.toFixed(2)); return a<0.3?'weakly':a<0.6?'moderately':'clearly'; };

let LENSES = [
 { id:'perha', tab:'Fertilizer per acre', src:'FAO', topic:'FERTILIZER PER ACRE', kind:'country',
   opts:[['K','Potash'],['N','Nitrogen'],['P','Phosphate'],['NPK','All 3 together']], opt:'K',
   val(o){ return (c,y)=>get(o,c,y); }, unit:'kg per acre of cropland', years:[1961,2023], dec:1,
   name(o){ return {K:'potash (K2O)',N:'nitrogen (N)',P:'phosphate (P2O5)',NPK:'fertilizer nutrient (N, P2O5 and K2O together)'}[o]; },
   answer(o,y,v){ const p=v(PAK,y), w=v('World',y); if(p==null) return `No Pakistan data for ${this.name(o)} in ${y}.`; let s=`In ${y}, Pakistan used <b>${fmt(p)} kg</b> of ${this.name(o)} per acre of cropland. The world average was ${fmt(w)} kg.`;
     if(p&&w){ const rr=p<w?w/p:p/w; s += rr<1.05 ? ` That is about the same as the world average.` : p<w ? ` The world used ${rr>=10?Math.round(rr).toLocaleString('en-US'):rr.toFixed(1)} times as much as Pakistan.` : ` Pakistan used ${rr>=10?Math.round(rr).toLocaleString('en-US'):rr.toFixed(1)} times the world average.`; } return s; },
   read:'Each line is a country. Hover over the chart to see every country in that year. Switch to "In 1 year" to see where Pakistan ranks among all countries and territories with data.',
   source:'FAO, Land, Inputs and Sustainability: Fertilizers by Nutrient, via Our World in Data (CC BY 4.0). Cropland = arable land plus permanent crops. Converted from per hectare to per acre (1 acre = 0.4047 hectare).'},
 { id:'balance', tab:'Potash against nitrogen', src:'FAO', topic:'POTASH AGAINST NITROGEN', kind:'country',
   opts:[['KN','Potash per 100 kg nitrogen'],['PN','Phosphate per 100 kg nitrogen']], opt:'KN',
   val(o){ return o==='KN' ? ratio('K','N',100) : ratio('P','N',100); }, unit:'kg per 100 kg of nitrogen', years:[1961,2023], dec:1,
   answer(o,y,v){ const p=v(PAK,y), w=v('World',y), n=o==='KN'?'potash':'phosphate'; if(p==null) return `No Pakistan ${n} data for ${y}.`;
     return `In ${y}, Pakistan used <b>${fmt(p,1)} kg of ${n}</b> for every 100 kg of nitrogen. The world used ${fmt(w,1)} kg.`; },
   read:'This shows the balance of what goes on the field: how much potash (or phosphate) is applied alongside each 100 kg of nitrogen. A line near zero means almost all the nitrogen goes on without potash.',
   source:'Calculated from FAO nutrient use per area of cropland (potash or phosphate divided by nitrogen, times 100; the result is the same per acre or per hectare), via Our World in Data (CC BY 4.0).'},
 { id:'return', tab:'Grain per kg of fertilizer', src:'FAO', topic:'GRAIN PER KG OF FERTILIZER', kind:'country',
   opts:null, val(){ return (c,y)=>{ const g=get('cereal',c,y), f=get('NPK',c,y); return (g==null||!f)?null:g*KG_PER_MAUND/f; }; },
   unit:'kg of cereal grain per kg of fertilizer nutrient', years:[1961,2023], dec:0, log:true,
   answer(o,y,v){ const p=v(PAK,y), w=v('World',y); return `In ${y}, Pakistan got about <b>${fmt(p,0)} kg of cereal grain</b> for each kg of fertilizer nutrient it used. The world got ${fmt(w,0)} kg.`; },
   read:'A rough measure of what fertilizer gives back: cereal yield per acre (in kg) divided by fertilizer nutrient used per acre of all cropland. The answer is the same whether worked per acre or per hectare. It is an indicator, not a crop trial. Countries using very little fertilizer show very high values, so the scale is stretched: 10 to 100 takes the same space as 100 to 1,000.',
   source:'Calculated from FAO cereal yield and FAO fertilizer nutrient use per area of cropland, via Our World in Data (CC BY 4.0).'},
 { id:'yields', tab:'Crop yields', src:'FAO', topic:'CROP YIELDS', kind:'country',
   opts:[['wheat','Wheat'],['rice','Rice'],['maize','Maize'],['cane','Sugarcane']], opt:'wheat',
   val(o){ return (c,y)=>get(o,c,y); }, unit:'maunds per acre', years:[1961,2024], dec:1,
   answer(o,y,v){ const crop={wheat:'wheat',rice:'rice',maize:'maize',cane:'sugarcane'}[o]; const p=v(PAK,y);
     const others=selected.map(c=>[c,v(c,y)]).filter(d=>d[1]!=null).sort((a,b)=>b[1]-a[1]);
     let s=`In ${y}, Pakistan's ${crop} yield was <b>${fmt(p,o==='cane'?0:1)} maunds per acre</b>.`;
     if(others.length&&p){ const [b,bv]=others[0]; s+= bv>p ? ` ${short(b)} got ${fmt(bv,o==='cane'?0:1)} maunds, which is ${fmt((bv/p-1)*100,0)}% more.` : ` That is the highest of the countries chosen.`; } return s; },
   read:'Each line is a country. Higher yields elsewhere also come from seed, water and farming practice, so a gap is not caused by fertilizer alone.',
   source:'FAO crop yields, via Our World in Data (CC BY 4.0). Converted from tonnes per hectare to maunds per acre (1 acre = 0.4047 hectare; 1 maund = 40 kg).'},
 { id:'scatter', tab:'Fertilizer and yield', src:'FAO', topic:'FERTILIZER AND YIELD', kind:'scatter', years:[1961,2023],
   answer(o,y){ const px=get('NPK',PAK,y), py=get('cereal',PAK,y); if(px==null||py==null) return `No Pakistan data for ${y}.`;
     const better=ALL.filter(c=>c!==PAK&&!/\(|World/.test(c)).filter(c=>{const x=get('NPK',c,y), g=get('cereal',c,y); return x!=null&&g!=null&&x<px&&g>py;});
     return `In ${y}, Pakistan used <b>${fmt(px,0)} kg of fertilizer nutrient</b> per acre and harvested ${fmt(py,1)} maunds of cereal per acre. <b>${better.length} countries</b> harvested more cereal per acre while using less fertilizer.`; },
   read:'Each dot is a country in the chosen year. Further right = more fertilizer per acre; higher up = more cereal per acre. Dots above and to the left of Pakistan get more grain with less fertilizer. Hover over a dot to see the country. The fertilizer scale is stretched: 1 to 10 takes the same space as 10 to 100.',
   source:'FAO cereal yield and FAO fertilizer nutrient use (N, P2O5, K2O) per area of cropland, via Our World in Data (CC BY 4.0), converted to per acre (1 acre = 0.4047 hectare; 1 maund = 40 kg).'},

 { id:'nitrogen', tab:'Nitrogen and yield', src:'FAO', topic:'NITROGEN AND YIELD', kind:'country',
   opts:[['nue','Nitrogen in the harvest'],['pfp','Grain per kg of nitrogen'],['yoy','Year to year, Pakistan']], opt:'nue',
   sub:{ nue:{kind:'country', years:[1961,2014], unit:'% of nitrogen added that leaves in the harvest', dec:1,
              read:'Of all nitrogen added to cropland (fertilizer, manure, fixation by legumes, rain and dust), the share removed in the harvested crop. The rest stays in crop residue or the soil, or is lost to air and water. Modelled series, ends 2014, and has no world figure. These charts show association, not the effect of fertilizer: seed, irrigation, varieties and weather changed over the same years. The yield response to N or P can only be measured in field trials.',
              source:'Lassaletta, Billen, Grizzetti, Anglade and Garnier (2014), Environmental Research Letters 9:105011, via Our World in Data (CC BY 4.0). A share, so it is the same per acre or per hectare.'},
         pfp:{kind:'country', years:[1961,2023], unit:'kg of cereal grain per kg of nitrogen', dec:0, log:true,
              read:'Cereal yield per acre (in kg) divided by nitrogen used per acre of all cropland. An index, not a crop trial: nitrogen is spread over all cropland (cotton, sugarcane, fodder, fallow), while yield is per acre of cereal harvested. These charts show association, not the effect of fertilizer: seed, irrigation, varieties and weather changed over the same years. The yield response to N or P can only be measured in field trials.',
              source:'Calculated from FAO cereal yield and FAO nitrogen use per area of cropland, via Our World in Data (CC BY 4.0). The ratio is the same per acre or per hectare.'},
         yoy:{kind:'yoy', years:[1962,2023], unit:'', dec:2,
              read:'Each dot is 1 year: how much nitrogen per acre changed from the year before (across), against how much cereal yield per acre changed (up). Dots rising to the right mean more nitrogen went with more yield that year. Weather and floods move yield a lot from year to year. These charts show association, not the effect of fertilizer: seed, irrigation, varieties and weather changed over the same years. The yield response to N or P can only be measured in field trials.',
              source:'Calculated from FAO nitrogen use per area of cropland and FAO cereal yield, via Our World in Data (CC BY 4.0), converted to per acre (1 acre = 0.4047 hectare; 1 maund = 40 kg). r = correlation; p = chance of a link at least this strong if there were no real link.'} },
   val(o){ return o==='nue' ? (c,y)=>get('nue',c,y) : (c,y)=>{ const g=get('cereal',c,y), n=get('N',c,y); return (g==null||!n)?null:g*KG_PER_MAUND/n; }; },
   answer(o,y,v){
     if(o==='yoy'){ const a=yoyStats(1962,1990), b=yoyStats(1991,2023);
       return `From 1962 to 1990, in years when nitrogen use rose more, cereal yield also tended to rise more (<b>r = ${fmt(a.r,2)}</b>, p = ${fmtP(a.p)}). From 1991 to 2023 the link is weak (<b>r = ${fmt(b.r,2)}</b>, p = ${fmtP(b.p)})${b.p>=0.05?', not statistically clear':''}.`; }
     const p=v(PAK,y), i=v('India',y);
     if(o==='nue'){ if(p==null) return `No Pakistan data for ${y}.`; return `In ${y}, <b>${fmt(p,1)}%</b> of the nitrogen added to Pakistan's cropland came out in the harvested crop. India: ${fmt(i,1)}%. So about ${fmt(100-p,0)} of every 100 kg added was not removed in the harvest.`; }
     return `In ${y}, Pakistan's cereal yield per acre was about <b>${fmt(p,0)} times</b> the nitrogen used per acre of cropland. India: ${fmt(i,0)} times.`; } },
 { id:'phosphate', tab:'Phosphate and yield', src:'FAO', topic:'PHOSPHATE AND YIELD', kind:'country',
   opts:[['np','Nitrogen per 1 kg phosphate'],['stand','Where Pakistan stands'],['pscat','Phosphate and cereal yield']], opt:'np',
   sub:{ np:{kind:'country', years:[1970,2023], unit:'kg of nitrogen for every 1 kg of phosphate (P2O5)', dec:1, ref:[2,'Recommended 2 to 1'],
              read:'How much nitrogen goes on for every 1 kg of phosphate. The dashed line is the 2 to 1 ratio NFDC uses as the recommended balance. A higher line means phosphate is short compared with nitrogen. These charts show association, not the effect of fertilizer: seed, irrigation, varieties and weather changed over the same years. The yield response to N or P can only be measured in field trials.',
              source:'Calculated from FAO nitrogen and phosphate use per area of cropland, via Our World in Data (CC BY 4.0); the ratio is the same per acre or per hectare. Recommended 2 to 1: NFDC Fertilizer Review 2024-25.'},
         stand:{kind:'stand', years:[1961,2023], unit:'', dec:0,
              read:'Each bar shows the share of farming countries that used less (or harvested less) than Pakistan in the chosen year. Farming countries = countries with at least 1 million hectares (about 2.5 million acres) of cropland in the latest year, counting those with data in the chosen year (about 111 in 2023, about 90 in 1990). These charts show association, not the effect of fertilizer: seed, irrigation, varieties and weather changed over the same years. The yield response to N or P can only be measured in field trials.',
              source:'FAO nutrient use per area of cropland and FAO cereal yield, via Our World in Data (CC BY 4.0), converted to per acre. Cropland area: FAO via Our World in Data.'},
         pscat:{kind:'scatter', sx:'P', bigOnly:true, sxLabel:'Phosphate (P2O5), kg per acre of cropland', years:[1961,2023], unit:'', dec:1,
              read:'Each dot is a country. Further right = more phosphate per acre; higher up = more cereal per acre. Countries that use more phosphate tend to harvest more, but rich countries also have better seed, water and decades of phosphorus built up in the soil. Pakistan already uses more phosphate than most. These charts show association, not the effect of fertilizer: seed, irrigation, varieties and weather changed over the same years. The yield response to N or P can only be measured in field trials.',
              source:'FAO phosphate use per area of cropland and FAO cereal yield, via Our World in Data (CC BY 4.0), converted to per acre (1 acre = 0.4047 hectare; 1 maund = 40 kg). Only farming countries (at least 1 million hectares of cropland) with phosphate use above 0 are shown and counted; rank correlation (Spearman) is used because a few countries have very high values.'} },
   val(o){ return (c,y)=>{ const n=get('N',c,y), ph=get('P',c,y); return (n==null||!ph)?null:n/ph; }; },
   answer(o,y,v){
     if(o==='stand'){ const s=standStats(y); const q=v=>v==null?'no data':v+'%';
       if(s.P==null&&s.N==null) return `No Pakistan data for ${y}.`;
       return `In ${y}, Pakistan used more phosphate per acre than <b>${q(s.P)}</b> of farming countries and more nitrogen than ${q(s.N)}${s.K==null?' (potash: no data for that year)':`, but more potash than only <b>${s.K}%</b>`}. Its cereal yield per acre was higher than in ${q(s.C)} of them.`; }
     if(o==='pscat'){ const r=pscatR(y); const p=get('P',PAK,y), g=get('cereal',PAK,y); if(p==null||g==null) return `No Pakistan data for ${y}.`;
       return `In ${y}, Pakistan used <b>${fmt(p,1)} kg of phosphate per acre</b> and harvested ${fmt(g,1)} maunds of cereal per acre. Across ${r.n} farming countries, more phosphate per acre went ${strength(r.r)} with more cereal per acre (rank correlation ${r.r.toFixed(2)}).`; }
     const p=v(PAK,y), i=v('India',y); if(p==null) return `No Pakistan data for ${y}.`;
     return `In ${y}, Pakistan used <b>${p.toFixed(1)} kg of nitrogen for every 1 kg of phosphate</b>. India used ${i==null?'no data':i.toFixed(1)}. The recommended balance is 2 to 1.`; } },
 { id:'punjab', tab:'Punjab potash balance', src:'Model', topic:'PUNJAB POTASH BALANCE', kind:'punjab', years:[1972,2024],
   answer(o,y){ const r=D.punjab.find(d=>d[0]===y); if(!r) return ''; const [,rem,fert,man,wat,def]=r;
     let s=`In ${y-1}-${String(y).slice(2)}, Punjab's 5 main crops took about <b>${fmt(rem,0)} thousand t of potash</b> out of the soil. Fertilizer put back ${fmt(fert,1)} thousand t.`;
     s+= def>0 ? ` After manure and irrigation water (about ${fmt(man+wat,0)} thousand t, an estimate), the soil was short <b>${fmt(def,0)} thousand t</b>.` : ` Manure and irrigation water (about ${fmt(man+wat,0)} thousand t, an estimate) still covered what the crops took.`;
     return s; },
   read:'Red line: potash carried out of the field in wheat, rice, sugarcane, maize and cotton, with the straw and stalks that leave the field. Green line: potash put back as fertilizer. Grey line: everything put back, fertilizer plus manure and irrigation water (the manure and water part is 1 estimate held for all years). The shaded gap is the yearly shortfall.',
   source:'Tahir Abbas, Punjab potash balance model (2026), from Punjab Development Statistics, Punjab Agriculture Statistics and NFDC fertilizer offtake. Thousand tonnes of K2O. Model estimates.'},
 { id:'outlook', tab:'Punjab soil potash outlook', src:'Model', topic:'PUNJAB SOIL POTASH OUTLOOK', kind:'outlook', years:[2018,2050],
   answer(o,y){ const r=D.fan.find(d=>d[0]===y); if(!r) return ''; const [,w,,a,,b]=r;
     const bn=v=>v<50?'Critical':v<100?'Weak':v<150?'Average':v<200?'Moderate':'Healthy';
     const fb=v=>[50,100,150,200].some(c=>Math.abs(v-c)<0.5)?fmt(v,1):fmt(v,0); // 1 decimal next to a band cut-off, so the shown number never contradicts its band
     return `In ${y}, if nothing changes: average case <b>${fb(a)} ppm (${bn(a)})</b>, worst case ${fb(w)} ppm (${bn(w)}), best case ${fb(b)} ppm (${bn(b)}). The average case drops from Average to Weak around 2036; worst case 2027; best case 2044.`; },
   read:'Punjab soil potash (ppm, available K) projected from the 2016-18 soil tests of 770,160 samples. The coloured bands are VAN\'s own soil-test scale, the one printed on a VAN soil report: Critical below 50 ppm, Weak 50 to 100, Average 100 to 150, Moderate 150 to 200, Healthy above 200. 100 ppm is where soil moves from Average to Weak. Best and worst case: a 1 in 10 chance the result is better or worse.',
   source:'Tahir Abbas, Soil Poverty Series No. 1, Punjab\'s Potash (2026). Start 130 ppm, weighted by cultivated area. Rate of loss set to SFRI monitoring sites, 2003-09. Projections, not measurements.'}
];

LENSES = specs.map(sp=>{ const L=LENSES.find(l=>l.id===sp.id); if(!L) return null;
  if(sp.opts && L.opts){ L.opts=L.opts.filter(o=>sp.opts.includes(o[0])); L.opt=L.opts[0][0]; }
  if(sp.opt) L.opt=sp.opt; if(sp.year) L.defYear=sp.year; if(sp.tab) L.tab=sp.tab; if(sp.topic) L.topic=sp.topic; return L; }).filter(Boolean);
const state = { lens: 0, opt: {}, view: {}, year: {}, table:false };
LENSES.forEach(L => { state.opt[L.id] = L.opt; state.view[L.id] = 'time'; if(L.sub) Object.assign(L, L.sub[L.opt]); state.year[L.id] = L.defYear ?? (L.id==='outlook' ? 2026 : L.years[1]); });

const $ = id => root.querySelector(`[data-l="${id}"]`);
const tabs = $('tabs');
LENSES.forEach((L,i) => { const b=document.createElement('button'); b.className='lz-tab'; b.type='button'; b.setAttribute('role','tab'); b.dataset.tab=L.id;
  b.innerHTML = `${L.tab}<span class="lz-src">${L.src}</span>`; b.onclick=()=>{ state.lens=i; render(); }; tabs.appendChild(b); });
if(LENSES.length<2) tabs.hidden=true;

function seg(opts, cur, on){ const s=document.createElement('div'); s.className='lz-seg';
  opts.forEach(([k,l])=>{ const b=document.createElement('button'); b.type='button'; b.textContent=l; b.setAttribute('aria-pressed', k===cur); b.onclick=()=>on(k); s.appendChild(b); }); return s; }

function buildControls(L){
  const c=$('controls'); c.innerHTML='';
  if(L.opts && L.opts.length>1) c.appendChild(seg(L.opts, state.opt[L.id], k=>{ state.opt[L.id]=k; if(L.sub) state.year[L.id]=Infinity; render(); }));
  if(L.kind==='country') c.appendChild(seg([['time','Over time'],['year','In 1 year']], state.view[L.id], k=>{ state.view[L.id]=k; render(); }));
  if(L.kind==='country' || L.kind==='scatter'){
    const chips=document.createElement('div'); chips.className='lz-chips';
    const pk=document.createElement('span'); pk.className='lz-chip'; pk.innerHTML=`<i style="background:${col(PAK)}"></i>Pakistan`; chips.appendChild(pk);
    selected.forEach(cn=>{ const s=document.createElement('span'); s.className='lz-chip';
      s.innerHTML=`<i style="background:${col(cn)}"></i>${short(cn)}`; const x=document.createElement('button'); x.type='button'; x.setAttribute('aria-label','Remove '+cn); x.textContent='×';
      x.onclick=()=>{ selected=selected.filter(d=>d!==cn); render(); }; s.appendChild(x); chips.appendChild(s); });
    if(selected.length < 7){ const sel=document.createElement('select'); sel.setAttribute('aria-label','Add a country');
      sel.innerHTML='<option value="">+ Add a country</option>'+ALL.filter(n=>n!==PAK&&!selected.includes(n)).map(n=>`<option>${n}</option>`).join('');
      sel.onchange=()=>{ const v=sel.value; if(!v) return; if(!colorOf[v]){ const used=new Set(selected.map(s=>colorOf[s])); let slot=SLOTS.find(s=>!used.has(s))||SLOTS[nextSlot++%SLOTS.length]; colorOf[v]=slot; } else { const used=new Set(selected.map(s=>colorOf[s])); if(used.has(colorOf[v])) colorOf[v]=SLOTS.find(s=>!used.has(s))||colorOf[v]; }
        selected.push(v); render(); }; chips.appendChild(sel); }
    c.appendChild(chips);
  }
  if(L.kind==='yoy') return;
  const yr=document.createElement('label'); yr.className='lz-year';
  yr.innerHTML=`Year <input type="range" data-yr="${L.id}" min="${L.years[0]}" max="${L.years[1]}" step="1" value="${state.year[L.id]}"><output>${state.year[L.id]}</output>`;
  const inp=yr.querySelector('input'); inp.oninput=()=>{ state.year[L.id]=+inp.value; yr.querySelector('output').textContent=inp.value; update(); };
  c.appendChild(yr);
}

let chart = null; // {svg, x, ...}
function applySub(L){ if(!L.sub) return; Object.assign(L, {log:false, ref:null, sx:null, sxLabel:null, bigOnly:false}, L.sub[state.opt[L.id]]); const [a,b]=L.years; state.year[L.id]=Math.max(a,Math.min(b,state.year[L.id])); }
function render(){
  const L = LENSES[state.lens]; applySub(L);
  root.querySelectorAll('.lz-tab').forEach((b,i)=>b.setAttribute('aria-selected', i===state.lens));
  $('topic').textContent = L.topic;
  $('read').textContent = L.read;
  $('source').textContent = 'Source: ' + L.source;
  buildControls(L); draw(); update();
}

function dims(){ const w = Math.max(300, $('chartbox').clientWidth); const narrow=w<560; return {w, h: narrow? 300 : 400, m:{t:16,r: narrow?78:120,b:34,l:narrow?40:52}}; }

function draw(){
  const L = LENSES[state.lens]; const box=$('chartbox'); box.querySelectorAll('svg').forEach(s=>s.remove());
  const {w,h,m}=dims(); const svg=d3.select(box).insert('svg','[data-l="tip"]').attr('viewBox',`0 0 ${w} ${h}`).attr('role','img').attr('aria-label',L.topic+' chart');
  chart={svg,w,h,m};
  if(L.kind==='country') state.view[L.id]==='time' ? drawTime(L) : drawBars(L);
  else if(L.kind==='scatter') drawScatter(L);
  else if(L.kind==='yoy') drawYoy(L);
  else if(L.kind==='stand') drawStand(L);
  else if(L.kind==='punjab') drawPunjab(L);
  else drawOutlook(L);
}

function axes(x,y,{xfmt,yfmt,ylabel}={}){
  const {svg,w,h,m}=chart;
  svg.append('g').attr('class','lz-grid').attr('transform',`translate(${m.l},0)`).call(d3.axisLeft(y).ticks(6, yfmt).tickSize(-(w-m.l-m.r)).tickFormat(''));
  svg.append('g').attr('class','lz-axis').attr('transform',`translate(0,${h-m.b})`).call(d3.axisBottom(x).ticks(w<560?5:9, xfmt).tickSizeOuter(0));
  svg.append('g').attr('class','lz-axis').attr('transform',`translate(${m.l},0)`).call(d3.axisLeft(y).ticks(6, yfmt).tickSize(0)).call(g=>g.select('.domain').remove());
  if(ylabel) svg.append('text').attr('x',m.l).attr('y',10).attr('font-size',11.5).attr('fill',css('--muted')).text(ylabel);
}

function labelEnds(items){ // items: {y, text, color, bold}; spread vertically to avoid overlap
  const {svg,w,m,h}=chart; items.sort((a,b)=>a.y-b.y); const gap=14;
  for(let i=1;i<items.length;i++) if(items[i].y-items[i-1].y<gap) items[i].y=items[i-1].y+gap;
  const over=items.length? items[items.length-1].y-(h-m.b): 0; if(over>0) items.forEach(d=>d.y-=over);
  for(let i=items.length-2;i>=0;i--) if(items[i+1].y-items[i].y<gap) items[i].y=items[i+1].y-gap;
  items.forEach(d=>{ const t=svg.append('text').attr('x',w-m.r+8).attr('y',d.y).attr('dy','.35em').attr('font-size',12).attr('font-weight',d.bold?700:500).attr('fill',d.color).text(d.text);
    // site port: on a phone the right margin is narrow, so a long end label is shrunk to fit inside the chart (layout only).
    const room=m.r-10, len=t.node().getComputedTextLength?.()||0; if(len>room) t.attr('font-size',Math.max(9,12*room/len)); fitText(t, room, d.text); });
}
// site port: a label still too long at 9px is cut with an ellipsis; the full name is in the hover and the table (layout only).
function fitText(t, room, full){ const n=t.node(); if(!n.getComputedTextLength || n.getComputedTextLength()<=room) return; let s=full; while(s.length>3 && n.getComputedTextLength()>room){ s=s.slice(0,-1); t.text(s.trimEnd()+'…'); } t.append('title').text(full);
}

function drawTime(L){
  const {svg,w,h,m}=chart; const v=L.val(state.opt[L.id]); const [y0,y1]=L.years;
  const countries=[PAK,...selected]; const years=d3.range(y0,y1+1);
  const series=countries.map(c=>({c, pts:years.map(y=>[y,v(c,y)]).filter(d=>d[1]!=null && (!L.log || d[1]>0))}));
  const allv=series.flatMap(s=>s.pts.map(p=>p[1]));
  const x=d3.scaleLinear([y0,y1],[m.l,w-m.r]);
  const y= L.log ? d3.scaleLog([Math.max(1,d3.min(allv)||1), d3.max(allv)||10],[h-m.b,m.t]).nice() : d3.scaleLinear([0,d3.max(allv)||1],[h-m.b,m.t]).nice();
  axes(x,y,{xfmt:'d',yfmt: L.log ? ',' : ',~f', ylabel:L.unit});
  if(L.ref){ const [rv,rl]=L.ref; svg.append('line').attr('x1',m.l).attr('x2',w-m.r).attr('y1',y(rv)).attr('y2',y(rv)).attr('stroke',css('--ink2')).attr('stroke-dasharray','6 4'); svg.append('text').attr('x',m.l+(w-m.l-m.r)*0.35).attr('y',y(rv)+16).attr('font-size',11.5).attr('font-weight',600).attr('fill',css('--ink2')).text(rl); }
  const line=d3.line().defined(d=>d[1]!=null).x(d=>x(d[0])).y(d=>y(d[1]));
  series.slice().reverse().forEach(s=>{ svg.append('path').attr('d',line(s.pts)).attr('fill','none').attr('stroke',col(s.c)).attr('stroke-width',s.c===PAK?3.2:1.8).attr('stroke-linejoin','round').attr('stroke-dasharray', s.c==='World'?'5 3':null); });
  labelEnds(series.filter(s=>s.pts.length).map(s=>{ const l=s.pts[s.pts.length-1]; return {y:y(l[1]), text:`${short(s.c)} ${fmt(l[1],L.dec)}`, color:col(s.c), bold:s.c===PAK}; }));
  chart.marker=svg.append('line').attr('y1',m.t).attr('y2',h-m.b).attr('stroke',css('--ink2')).attr('stroke-dasharray','2 3');
  chart.dots=svg.append('g');
  chart.update=()=>{ const yr=state.year[L.id]; chart.marker.attr('x1',x(yr)).attr('x2',x(yr));
    chart.dots.selectAll('*').remove(); series.forEach(s=>{ const p=s.pts.find(d=>d[0]===yr); if(p) chart.dots.append('circle').attr('cx',x(yr)).attr('cy',y(p[1])).attr('r',s.c===PAK?5:3.5).attr('fill',col(s.c)).attr('stroke',css('--panel')).attr('stroke-width',2); }); };
  hover(x, yr=>series.map(s=>[s.c, (s.pts.find(d=>d[0]===yr)||[])[1]]), L, y0, y1);
}

function drawBars(L){
  const {svg,w,h,m}=chart; const v=L.val(state.opt[L.id]);
  chart.update=()=>{ svg.selectAll('*').remove(); const yr=state.year[L.id];
    const rows=[PAK,...selected].map(c=>({c,v:v(c,yr)})).filter(d=>d.v!=null).sort((a,b)=>b.v-a.v);
    const bh=Math.min(34,(h-m.t-m.b)/Math.max(rows.length,1)); const lab= w<560? 86:120;
    const x=d3.scaleLinear([0,d3.max(rows,d=>d.v)||1],[lab,w-70]).nice();
    rows.forEach((d,i)=>{ const yy=m.t+i*bh; const nm=svg.append('text').attr('x',lab-8).attr('y',yy+bh/2).attr('dy','.35em').attr('text-anchor','end').attr('font-size',12.5).attr('font-weight',d.c===PAK?700:500).attr('fill',d.c===PAK?css('--pak'):css('--ink2')).text(short(d.c)); fitText(nm, lab-12, short(d.c));
      svg.append('rect').attr('x',lab).attr('y',yy+bh*.18).attr('height',bh*.64).attr('width',Math.max(1,x(d.v)-lab)).attr('rx',3).attr('fill',col(d.c));
      svg.append('text').attr('x',x(d.v)+6).attr('y',yy+bh/2).attr('dy','.35em').attr('font-size',12).attr('font-family',css('--mono')).attr('fill',css('--ink')).text(fmt(d.v,L.dec)); });
    // rank among all countries
    const all=ALL.filter(c=>!/\(|World/.test(c)).map(c=>[c,v(c,yr)]).filter(d=>d[1]!=null).sort((a,b)=>b[1]-a[1]);
    const r=all.findIndex(d=>d[0]===PAK)+1; const yy=m.t+rows.length*bh+22;
    // site port: the list holds territories too (Hong Kong, Puerto Rico...), so it says so; on a phone the line wraps instead of running off the edge.
    if(r){ const t=svg.append('text').attr('x',w<560?m.l:lab).attr('y',Math.min(yy,h-24)).attr('font-size',13).attr('fill',css('--ink')); const words=`Pakistan ranks ${r} of ${all.length} countries and territories in ${yr} (1 = highest).`.split(' '); let line=[], ts=t.append('tspan').attr('x',w<560?m.l:lab); words.forEach(wd=>{ line.push(wd); ts.text(line.join(' ')); if(ts.node().getComputedTextLength?.()>w-(w<560?m.l:lab)-8 && line.length>1){ line.pop(); ts.text(line.join(' ')); line=[wd]; ts=t.append('tspan').attr('x',w<560?m.l:lab).attr('dy','1.25em').text(wd); } }); }
  };
}

function drawScatter(L){
  const {svg,w,h,m}=chart; m.r=24;
  const x=d3.scaleLog(L.bigOnly?[0.1,100]:[0.3,400],[m.l,w-m.r]).clamp(true); const ymax=Math.ceil((d3.max(L.bigOnly?D.big:ALL,c=>D.cereal[c]?d3.max(D.cereal[c].slice(1).filter(v=>v!=null)):0)||10)*FACTOR.cereal); const y=d3.scaleLinear([0,Math.min(ymax,140)],[h-m.b,m.t]).nice();
  svg.append('g').attr('class','lz-grid').attr('transform',`translate(${m.l},0)`).call(d3.axisLeft(y).ticks(5).tickSize(-(w-m.l-m.r)).tickFormat(''));
  svg.append('g').attr('class','lz-axis').attr('transform',`translate(0,${h-m.b})`).call(d3.axisBottom(x).tickValues(L.bigOnly?[0.1,0.3,1,3,10,30,100]:[0.3,1,3,10,30,100,300]).tickFormat(d3.format(',')));
  svg.append('g').attr('class','lz-axis').attr('transform',`translate(${m.l},0)`).call(d3.axisLeft(y).ticks(5).tickSize(0)).call(g=>g.select('.domain').remove());
  svg.append('text').attr('x',m.l).attr('y',10).attr('font-size',11.5).attr('fill',css('--muted')).text('Cereal yield, maunds per acre');
  svg.append('text').attr('x',w-m.r).attr('y',h-4).attr('text-anchor','end').attr('font-size',11.5).attr('fill',css('--muted')).text(L.sxLabel||'Fertilizer nutrient, kg per acre of cropland');
  const g=svg.append('g'); const tip=$('tip');
  chart.update=()=>{ g.selectAll('*').remove(); const yr=state.year[L.id];
    const SX=L.sx||'NPK'; const pts=(L.bigOnly?D.big:ALL.filter(c=>!/\(/.test(c))).map(c=>({c,x:get(SX,c,yr),y:get('cereal',c,yr)})).filter(d=>d.x!=null&&d.y!=null&&d.x>0);
    const hi=new Set([PAK,...selected]); const labs=[];
    const px=get(SX,PAK,yr), py=get('cereal',PAK,yr);
    if(px&&py){ g.append('rect').attr('x',m.l).attr('y',m.t).attr('width',Math.max(0,x(px)-m.l)).attr('height',Math.max(0,y(py)-m.t)).attr('fill',css('--band'));
      g.append('text').attr('x',m.l+6).attr('y',m.t+14).attr('font-size',11.5).attr('fill',css('--pak')).text(L.sx==='P'?'More grain, less phosphate than Pakistan':'More grain, less fertilizer than Pakistan'); }
    pts.sort((a,b)=>hi.has(a.c)-hi.has(b.c)).forEach(d=>{ const H=hi.has(d.c);
      const c=g.append('circle').attr('cx',x(d.x)).attr('cy',y(Math.min(d.y,y.domain()[1]))).attr('r',d.c===PAK?7:H?5.5:3.6).attr('fill',H?col(d.c):css('--dot')).attr('stroke',css('--panel')).attr('stroke-width',H?2:1);
      const t=g.append('circle').attr('cx',x(d.x)).attr('cy',y(Math.min(d.y,y.domain()[1]))).attr('r',9).attr('fill','transparent').style('cursor','pointer');
      t.on('pointerenter',e=>{ tip.hidden=false; tip.innerHTML=`<div class="h">${yr}</div><div style="font-weight:600;margin-bottom:2px">${d.c}</div><div class="r"><span>${L.sx==='P'?'Phosphate':'Fertilizer'}</span><span>${fmt(d.x,L.sx==='P'?1:0)} kg/acre</span></div><div class="r"><span>Cereal yield</span><span>${fmt(d.y,1)} maunds/acre</span></div>`; place(e); }).on('pointermove',place).on('pointerleave',()=>tip.hidden=true);
      if(H) labs.push({c:d.c,x:x(d.x)+9,y:y(Math.min(d.y,y.domain()[1]))});
    });
    labs.forEach(l=>{ if(l.c===PAK){ l.anchor='end'; l.x-=18; l.y-=10; } }); labs.sort((a,b)=>a.y-b.y); for(let i=1;i<labs.length;i++){ const p=labs[i-1],q=labs[i]; if(Math.abs(q.x-p.x)<90 && q.y-p.y<14) q.y=p.y+14; }
    labs.forEach(l=>g.append('text').attr('x',l.x).attr('text-anchor',l.anchor||'start').attr('y',l.y).attr('dy','.35em').attr('font-size',12).attr('font-weight',l.c===PAK?700:500).attr('fill',col(l.c)).text(short(l.c)).style('pointer-events','none'));
  };
}


function drawYoy(L){
  const {svg,w,h,m}=chart; m.r=24; const pts=yoyPoints(1962,2023);
  const ex=d3.max(pts,d=>Math.abs(d.dx))*1.1, ey=d3.max(pts,d=>Math.abs(d.dy))*1.1;
  const x=d3.scaleLinear([-ex,ex],[m.l,w-m.r]), y=d3.scaleLinear([-ey,ey],[h-m.b,m.t]);
  axes(x,y,{xfmt:',~f',yfmt:',~f',ylabel:'Change in cereal yield, maunds per acre'});
  svg.append('line').attr('x1',x(0)).attr('x2',x(0)).attr('y1',m.t).attr('y2',h-m.b).attr('stroke',css('--line'));
  svg.append('line').attr('x1',m.l).attr('x2',w-m.r).attr('y1',y(0)).attr('y2',y(0)).attr('stroke',css('--line'));
  svg.append('text').attr('x',w-m.r).attr('y',h-4).attr('text-anchor','end').attr('font-size',11.5).attr('fill',css('--muted')).text('Change in nitrogen from the year before, kg per acre');
  const groups=[[1962,1990,css('--c2'),'1962-1990'],[1991,2023,css('--pak'),'1991-2023']];
  const tip=$('tip');
  groups.forEach(([a,b,c,lab],gi)=>{ const g=pts.filter(d=>d.y>=a&&d.y<=b); const st=yoyStats(a,b);
    const lr=d3.least ? null : null; const mx=d3.mean(g,d=>d.dx), my=d3.mean(g,d=>d.dy); let sxy=0,sxx=0; g.forEach(d=>{sxy+=(d.dx-mx)*(d.dy-my); sxx+=(d.dx-mx)**2;}); const sl=sxy/sxx;
    const x0=d3.min(g,d=>d.dx), x1=d3.max(g,d=>d.dx);
    svg.append('line').attr('x1',x(x0)).attr('x2',x(x1)).attr('y1',y(my+sl*(x0-mx))).attr('y2',y(my+sl*(x1-mx))).attr('stroke',c).attr('stroke-width',2).attr('stroke-dasharray',gi?null:'5 3');
    g.forEach(d=>{ svg.append('circle').attr('cx',x(d.dx)).attr('cy',y(d.dy)).attr('r',4.5).attr('fill',c).attr('fill-opacity',.85).attr('stroke',css('--panel')).attr('stroke-width',1.5);
      svg.append('circle').attr('cx',x(d.dx)).attr('cy',y(d.dy)).attr('r',9).attr('fill','transparent').style('cursor','pointer')
       .on('pointerenter',e=>{ tip.hidden=false; tip.innerHTML=`<div class="h">${d.y}</div><div class="r"><span>Nitrogen change</span><span>${fmt(d.dx,2)} kg/acre</span></div><div class="r"><span>Yield change</span><span>${fmt(d.dy,2)} maunds/acre</span></div>`; place(e); }).on('pointermove',place).on('pointerleave',()=>tip.hidden=true); });
    svg.append('text').attr('x',w-m.r-8).attr('text-anchor','end').attr('y',h-m.b-30+gi*18).attr('font-size',12).attr('font-weight',600).attr('fill',c).text(`${lab}: r = ${fmt(st.r,2)}, p = ${fmtP(st.p)}`);
  });
  chart.update=()=>{};
}
function drawStand(L){
  const {svg,w,h,m}=chart; const rows=[['P','Phosphate per acre'],['N','Nitrogen per acre'],['K','Potash per acre'],['cereal','Cereal yield per acre']];
  const lab = w<560? 120:170; const x=d3.scaleLinear([0,100],[lab,w-40]);
  chart.update=()=>{ svg.selectAll('*').remove(); const yr=state.year[L.id]; const bh=(h-m.t-m.b)/rows.length;
    [0,25,50,75,100].forEach(t=>{ svg.append('line').attr('x1',x(t)).attr('x2',x(t)).attr('y1',m.t).attr('y2',h-m.b).attr('stroke',css(t===50?'--muted':'--grid')).attr('stroke-dasharray',t===50?'4 3':null); svg.append('text').attr('x',x(t)).attr('y',h-m.b+16).attr('text-anchor','middle').attr('font-size',11).attr('font-family',css('--mono')).attr('fill',css('--muted')).text(t+'%'); });
    svg.append('text').attr('x',x(50)).attr('y',m.t-2).attr('text-anchor','middle').attr('font-size',11).attr('fill',css('--muted')).text('middle country');
    rows.forEach(([k,t],i)=>{ const v=pctBelow(k,yr), yy=m.t+i*bh, val=get(k,PAK,yr), unit=k==='cereal'?'maunds':'kg';
      svg.append('text').attr('x',lab-10).attr('y',yy+bh*.42).attr('text-anchor','end').attr('font-size',13).attr('font-weight',600).attr('fill',css('--ink')).text(t);
      svg.append('text').attr('x',lab-10).attr('y',yy+bh*.42+16).attr('text-anchor','end').attr('font-size',11.5).attr('fill',css('--muted')).text(val==null?'no data':`Pakistan ${fmt(val,1)} ${unit}`);
      if(v!=null){ svg.append('rect').attr('x',lab).attr('y',yy+bh*.22).attr('height',bh*.5).attr('width',x(v)-lab).attr('rx',3).attr('fill',k==='K'?css('--poor'):k==='cereal'?css('--c2'):css('--pak'));
        svg.append('text').attr('x',x(v)+6).attr('y',yy+bh*.47).attr('dy','.35em').attr('font-size',13).attr('font-weight',700).attr('font-family',css('--mono')).attr('fill',css('--ink')).text(v+'%'); } });
  };
}

function drawPunjab(L){
  const {svg,w,h,m}=chart; const P=D.punjab;
  const x=d3.scaleLinear([1972,2024],[m.l,w-m.r]); const y=d3.scaleLinear([0,d3.max(P,d=>d[1])],[h-m.b,m.t]).nice();
  axes(x,y,{xfmt:'d',ylabel:'Thousand tonnes of potash (K2O) a year'});
  const ret=d=>d[2]+d[3]+d[4];
  svg.append('path').datum(P).attr('fill',css('--zonePoor')).attr('d',d3.area().x(d=>x(d[0])).y0(d=>y(Math.min(ret(d),d[1]))).y1(d=>y(d[1])));
  const ln=(f,c,wd,da)=>svg.append('path').datum(P).attr('fill','none').attr('stroke',c).attr('stroke-width',wd).attr('stroke-dasharray',da||null).attr('d',d3.line().x(d=>x(d[0])).y(f));
  ln(d=>y(ret(d)),css('--c7'),1.8,'5 3'); ln(d=>y(d[2]),css('--pak'),2.6); ln(d=>y(d[1]),css('--poor'),2.6);
  const last=P[P.length-1];
  labelEnds([{y:y(last[1]),text:'Taken out by crops',color:css('--poor'),bold:true},{y:y(ret(last)),text:'All put back',color:css('--c7')},{y:y(last[2]),text:'Fertilizer',color:css('--pak'),bold:true}]);
  chart.marker=svg.append('line').attr('y1',m.t).attr('y2',h-m.b).attr('stroke',css('--ink2')).attr('stroke-dasharray','2 3');
  chart.update=()=>{ const yr=state.year[L.id]; chart.marker.attr('x1',x(yr)).attr('x2',x(yr)); };
  hover(x, yr=>{ const r=P.find(d=>d[0]===yr); return r? [['Taken out by crops',r[1],css('--poor')],['Fertilizer',r[2],css('--pak')],['All put back',r[2]+r[3]+r[4],css('--c7')],['Shortfall',r[5],css('--ink')]]:[]; }, L, 1972, 2024, true);
}

function drawOutlook(L){
  const {svg,w,h,m}=chart; const F=D.fan;
  const x=d3.scaleLinear([2018,2050],[m.l,w-m.r]); const y=d3.scaleLinear([0,140],[h-m.b,m.t]);
  // VAN's 5-band soil-test scale for potash (ppm): Critical <50, Weak 50-100, Average 100-150, Moderate 150-200, Healthy >200
  [[0,50,'--bCrit'],[50,100,'--bWeak'],[100,140,'--bAvg']].forEach(([a,b,c])=>svg.append('rect').attr('x',m.l).attr('width',w-m.l-m.r).attr('y',y(b)).attr('height',y(a)-y(b)).attr('fill',css(c)));
  axes(x,y,{xfmt:'d',ylabel:'Punjab soil potash, ppm'});
  [[133,'AVERAGE 100-150','--bAvgT',1],[75,'WEAK 50-100','--bWeakT',0],[25,'CRITICAL below 50','--bCritT',0]].forEach(([v,t,c,r])=>svg.append('text').attr('x',r?w-m.r-6:m.l+6).attr('text-anchor',r?'end':'start').attr('y',y(v)).attr('dy','.35em').attr('font-size',11).attr('font-weight',600).attr('fill',css(c)).text(t));
  svg.append('path').datum(F).attr('fill',css('--band')).attr('d',d3.area().x(d=>x(d[0])).y0(d=>y(d[1])).y1(d=>y(d[5])));
  svg.append('line').attr('x1',m.l).attr('x2',w-m.r).attr('y1',y(100)).attr('y2',y(100)).attr('stroke',css('--poor')).attr('stroke-dasharray','5 4');
  const ln=(i,c,wd)=>svg.append('path').datum(F).attr('fill','none').attr('stroke',c).attr('stroke-width',wd).attr('d',d3.line().x(d=>x(d[0])).y(d=>y(d[i])));
  ln(5,css('--c2'),1.8); ln(1,css('--poor'),1.8); ln(3,css('--pak'),3.2);
  [[2027,css('--poor')],[2036,css('--pak')],[2044,css('--c2')]].forEach(([yr,c])=>{ svg.append('circle').attr('cx',x(yr)).attr('cy',y(100)).attr('r',5.5).attr('fill',css('--panel')).attr('stroke',c).attr('stroke-width',2.2);
    svg.append('text').attr('x',x(yr)).attr('y',y(100)-10).attr('text-anchor','middle').attr('font-size',12).attr('font-weight',700).attr('fill',c).text(yr); });
  const l=F[F.length-1];
  labelEnds([{y:y(l[5]),text:`Best case ${fmt(l[5],0)}`,color:css('--c2')},{y:y(l[3]),text:`Average case ${fmt(l[3],0)}`,color:css('--pak'),bold:true},{y:y(l[1]),text:`Worst case ${fmt(l[1],0)}`,color:css('--poor')}]);
  chart.marker=svg.append('line').attr('y1',m.t).attr('y2',h-m.b).attr('stroke',css('--ink2')).attr('stroke-dasharray','2 3');
  chart.update=()=>{ const yr=state.year[L.id]; chart.marker.attr('x1',x(yr)).attr('x2',x(yr)); };
  hover(x, yr=>{ const r=F.find(d=>d[0]===yr); return r? [['Best case',r[5],css('--c2')],['Average case',r[3],css('--pak')],['Worst case',r[1],css('--poor')]]:[]; }, L, 2018, 2050, true);
}

function place(e){ const tip=$('tip'), box=$('chartbox').getBoundingClientRect(); let lx=e.clientX-box.left+14, ly=e.clientY-box.top+14;
  if(lx+tip.offsetWidth>box.width) lx=e.clientX-box.left-tip.offsetWidth-14; if(ly+tip.offsetHeight>box.height) ly=box.height-tip.offsetHeight; tip.style.left=Math.max(0,lx)+'px'; tip.style.top=Math.max(0,ly)+'px'; }

function hover(x, rowsAt, L, y0, y1, labelled){
  const {svg,h,m,w}=chart; const tip=$('tip'); const cross=svg.append('line').attr('y1',m.t).attr('y2',h-m.b).attr('stroke',css('--muted')).attr('opacity',0);
  svg.append('rect').attr('x',m.l).attr('y',m.t).attr('width',w-m.l-m.r).attr('height',h-m.t-m.b).attr('fill','transparent')
   .on('pointermove',e=>{ const [mx]=d3.pointer(e); const yr=Math.max(y0,Math.min(y1,Math.round(x.invert(mx)))); cross.attr('x1',x(yr)).attr('x2',x(yr)).attr('opacity',.6);
      const rows=rowsAt(yr).filter(r=>r[1]!=null);
      const lab = labelled ? rows.map(([n,v,c])=>`<div class="r"><span><i style="background:${c}"></i>${n}</span><span>${fmt(v,0)}</span></div>`).join('')
        : rows.sort((a,b)=>b[1]-a[1]).map(([c,v])=>`<div class="r"><span><i style="background:${col(c)}"></i>${short(c)}</span><span>${fmt(v,L.dec)}</span></div>`).join('');
      const yrTxt = L.kind==='punjab' ? `${yr-1}-${String(yr).slice(2)}` : yr;
      tip.innerHTML=`<div class="h">${yrTxt}</div>${lab||'<div>No data</div>'}`; tip.hidden=false; place(e); })
   .on('pointerleave',()=>{ tip.hidden=true; cross.attr('opacity',0); })
   .on('click',e=>{ const [mx]=d3.pointer(e); const yr=Math.max(y0,Math.min(y1,Math.round(x.invert(mx)))); const L2=LENSES[state.lens]; state.year[L2.id]=yr; const inp=root.querySelector(`[data-yr="${L2.id}"]`); if(inp){inp.value=yr; inp.nextElementSibling.textContent=yr;} update(); });
}

function update(){
  const L=LENSES[state.lens]; const y=state.year[L.id];
  const v = L.val ? L.val(state.opt[L.id]) : null;
  $('answer').innerHTML = L.answer.call(L, state.opt[L.id], y, v);
  if(chart && chart.update) chart.update();
  if(state.table) buildTable(L);
}

function buildTable(L){
  const tb=$('tablebox'); let html='';
  if(L.kind==='country' || L.kind==='scatter'){
    const v = L.kind==='scatter' ? null : L.val(state.opt[L.id]);
    const cs=[PAK,...selected];
    if(L.kind==='scatter'){ const yr=state.year[L.id];
      html=`<table><thead><tr><th>Country, ${yr}</th><th>${L.sx==='P'?'Phosphate':'Fertilizer'}, kg/acre</th><th>Cereal yield, maunds/acre</th></tr></thead><tbody>`+cs.map(c=>`<tr class="${c===PAK?'lz-pak':''}"><td>${c}</td><td>${fmt(get(L.sx||'NPK',c,yr),L.sx==='P'?1:0)}</td><td>${fmt(get('cereal',c,yr),1)}</td></tr>`).join('')+'</tbody></table>';
    } else { const ys=d3.range(L.years[0],L.years[1]+1).filter(y=>y%10===0||y===L.years[1]||y===state.year[L.id]); const uniq=[...new Set(ys)].sort();
      html=`<table><thead><tr><th>${L.unit}</th>${uniq.map(y=>`<th>${y}</th>`).join('')}</tr></thead><tbody>`+cs.map(c=>`<tr class="${c===PAK?'lz-pak':''}"><td>${c}</td>${uniq.map(y=>`<td>${fmt(v(c,y),L.dec)}</td>`).join('')}</tr>`).join('')+'</tbody></table>'; }
  } else if(L.kind==='yoy'){
    html='<table><thead><tr><th>Year</th><th>Nitrogen change, kg/acre</th><th>Cereal yield change, maunds/acre</th></tr></thead><tbody>'+yoyPoints(1962,2023).map(d=>`<tr><td>${d.y}</td><td>${fmt(d.dx,2)}</td><td>${fmt(d.dy,2)}</td></tr>`).join('')+'</tbody></table>';
  } else if(L.kind==='stand'){ const yr=state.year[L.id];
    html=`<table><thead><tr><th>${yr}</th><th>Pakistan</th><th>Median farming country</th><th>Share of farming countries below Pakistan</th></tr></thead><tbody>`+[['P','Phosphate, kg/acre'],['N','Nitrogen, kg/acre'],['K','Potash, kg/acre'],['cereal','Cereal yield, maunds/acre']].map(([k,t])=>{ const vals=D.big.map(c=>get(k,c,yr)).filter(v=>v!=null); return `<tr><td>${t}</td><td>${fmt(get(k,PAK,yr),1)}</td><td>${fmt(d3.median(vals),1)}</td><td>${pctBelow(k,yr)??'-'}%</td></tr>`; }).join('')+'</tbody></table>';
  } else if(L.kind==='punjab'){
    html='<table><thead><tr><th>Year</th><th>Taken out by crops</th><th>Fertilizer</th><th>Manure + water</th><th>Shortfall</th></tr></thead><tbody>'+D.punjab.filter(d=>d[0]%5===0||d[0]===2024).map(d=>`<tr><td>${d[0]-1}-${String(d[0]).slice(2)}</td><td>${fmt(d[1],0)}</td><td>${fmt(d[2],1)}</td><td>${fmt(d[3]+d[4],0)}</td><td>${fmt(d[5],0)}</td></tr>`).join('')+'</tbody></table>';
  } else {
    html='<table><thead><tr><th>Year</th><th>Worst case</th><th>Average case</th><th>Best case</th></tr></thead><tbody>'+D.fan.filter(d=>d[0]%2===0||d[0]===2027||d[0]===2036||d[0]===2044).map(d=>`<tr><td>${d[0]}</td><td>${fmt(d[1],0)}</td><td>${fmt(d[3],0)}</td><td>${fmt(d[5],0)}</td></tr>`).join('')+'</tbody></table>';
  }
  tb.innerHTML=html;
}
$('tbtn').onclick=()=>{ state.table=!state.table; $('tablebox').hidden=!state.table; $('tbtn').textContent=state.table?'Hide the numbers':'Show the numbers'; update(); };

let rt; const ro=new ResizeObserver(()=>{ clearTimeout(rt); rt=setTimeout(()=>{ draw(); update(); },120); }); ro.observe($('chartbox'));
render();
return ()=>{ ro.disconnect(); clearTimeout(rt); };
}
