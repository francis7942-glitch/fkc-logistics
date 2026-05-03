import { useState, useEffect, useCallback, useRef } from "react";
import * as db from "./db";
const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+M
document.head.appendChild(_fl);
const _st = document.createElement("style");
_st.textContent = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
--bg:#0d1117;--sur:#161b22;--sur2:#1c2331;--sur3:#21262d;
--bd:#30363d;--bd2:#3d444d;--tx:#e6edf3;--tx2:#8b949e;--tx3:#484f58;
--ac:#00d4aa;--ac2:#00b894;--acd:rgba(0,212,170,.12);
--rd:#f85149;--rdd:rgba(248,81,73,.12);
--or:#e3b341;--ord:rgba(227,179,65,.12);
--bl:#58a6ff;--bld:rgba(88,166,255,.12);
--pu:#bc8cff;--pud:rgba(188,140,255,.12);
--gr:#3fb950;--grd:rgba(63,185,80,.12);
--r:8px;--rl:12px;--sb:224px;--sh:0 4px 24px rgba(0,0,0,.4);
}
body{font-family:'Mulish',sans-serif;background:var(--bg);color:var(--tx)}
input,select,textarea,button{font-family:inherit}
button{cursor:pointer}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:var(--sur)}
::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:3px}
.lw{min-height:100vh;display:flex;align-items:center;justify-content:center;
background:radial-gradient(ellipse at 20% 50%,rgba(0,212,170,.08) 0%,transparent 60%),
radial-gradient(ellipse at 80% 20%,rgba(88,166,255,.06) 0%,transparent 50%),var(
.lc{width:380px;background:var(--sur);border:1px solid var(--bd);border-radius:16px;padding:4
.lbrand{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.lbrand-icon{width:44px;height:44px;background:#fff;border-radius:12px;display:flex;align-ite
.lbrand-name{font-family:'Syne',sans-serif;font-size:22px;font-weight:800}
.lsub{font-size:13px;color:var(--tx2);margin-bottom:32px}
.fl{font-size:12px;font-weight:700;color:var(--tx2);letter-spacing:.06em;text-transform:upper
.fi{width:100%;padding:10px 14px;background:var(--sur3);border:1px solid var(--bd);border-rad
.fi:focus{border-color:var(--ac)}
.fgrp{margin-bottom:16px}
.pww{position:relative}.pww .fi{padding-right:40px}
.pwt{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:n
.lbtn{width:100%;margin-top:8px;padding:12px;background:var(--ac);color:#0d1117;border:none;b
.lbtn:hover{background:var(--ac2)}.lbtn:disabled{opacity:.6}
.err-bar{background:var(--rdd);border:1px solid var(--rd);color:var(--rd);border-radius:var(-
.ok-bar{background:var(--acd);border:1px solid var(--ac);color:var(--ac);border-radius:var(--
.shell{display:flex;min-height:100vh}
.sidebar{width:var(--sb);background:var(--sur);border-right:1px solid var(--bd);display:flex;
.sbrand{display:flex;align-items:center;gap:9px;padding:20px 16px 16px;border-bottom:1px soli
.sbrand-icon{width:32px;height:32px;background:#fff;border-radius:8px;display:flex;align-item
.sbrand-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:800}
.snav{flex:1;padding:10px 8px;overflow-y:auto;display:flex;flex-direction:column;gap:1px}
.nsec{font-size:10px;font-weight:800;color:var(--tx3);letter-spacing:.1em;text-transform:uppe
.nb{display:flex;align-items:center;gap:10px;padding:9px 12px;border:none;background:none;bor
.nb:hover{background:var(--sur3);color:var(--tx)}.nb.on{background:var(--acd);color:var(--ac)
.sfoot{padding:12px;border-top:1px solid var(--bd)}
.urow{display:flex;align-items:center;gap:9px;margin-bottom:8px}
.uav{width:32px;height:32px;background:var(--acd);border:1px solid rgba(0,212,170,.3);border-
.uname{font-size:13px;font-weight:700}.urole{font-size:11px;color:var(--tx2);text-transform:c
.lobtn{width:100%;padding:8px;background:var(--sur3);border:1px solid var(--bd);border-radius
.lobtn:hover{border-color:var(--rd);color:var(--rd);background:var(--rdd)}
.main{margin-left:var(--sb);flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{display:none;padding:14px 18px;background:var(--sur);border-bottom:1px solid var(--bd
.hbg{background:none;border:none;color:var(--tx2);font-size:20px;line-height:1}
.ttl{font-family:'Syne',sans-serif;font-weight:700;font-size:15px}
.bkd{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:49}
.con{padding:28px 32px;max-width:1160px}
.ph{display:flex;align-items:center;gap:12px;margin-bottom:24px;flex-wrap:wrap}
.ph h2{font-family:'Syne',sans-serif;font-size:22px;font-weight:800}
.phi{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content
.phi.teal{background:var(--acd);border:1px solid rgba(0,212,170,.25)}
.phi.red{background:var(--rdd);border:1px solid rgba(248,81,73,.25)}
.phi.or{background:var(--ord);border:1px solid rgba(227,179,65,.25)}
.phi.bl{background:var(--bld);border:1px solid rgba(88,166,255,.25)}
.phi.pu{background:var(--pud);border:1px solid rgba(188,140,255,.25)}
.phi.gr{background:var(--grd);border:1px solid rgba(63,185,80,.25)}
.mla{margin-left:auto}
.sgrid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:24px}
.sc{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:15px 17p
.sico{font-size:20px}.sval{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:
.slbl{font-size:10px;color:var(--tx2);font-weight:700;letter-spacing:.05em;text-transform:upp
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:var(--r);f
.bac{background:var(--ac);color:#0d1117}.bac:hover{background:var(--ac2)}
.brd{background:var(--rdd);color:var(--rd);border:1px solid rgba(248,81,73,.3)}.brd:hover{bac
.bgh{background:var(--sur3);color:var(--tx2);border:1px solid var(--bd)}.bgh:hover{border-col
.btn:disabled{opacity:.5;cursor:not-allowed}
.ib{background:none;border:none;color:var(--tx2);padding:5px;border-radius:6px;font-size:15px
.ib:hover{background:var(--sur3);color:var(--tx)}.ib.dl:hover{background:var(--rdd);color:var
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:22px}
.fg{display:flex;flex-direction:column;gap:7px}.fg.s2{grid-column:span 2}
.fg label{font-size:12px;font-weight:700;color:var(--tx2);letter-spacing:.05em;text-transform
.fg input,.fg select,.fg textarea{padding:10px 13px;background:var(--sur3);border:1px solid v
.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--ac)}
.fg select option{background:var(--sur3)}.fg input:disabled,.fg select:disabled{opacity:.45;c
.iselr{display:flex}.iselr select{flex:1;border-radius:var(--r) 0 0 var(--r) !important}
.iselt{padding:0 12px;background:var(--sur2);border:1px solid var(--bd);border-left:none;bord
.pills{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}
.pill{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid}
.p-teal{background:var(--acd);color:var(--ac);border-color:rgba(0,212,170,.25)}
.p-blue{background:var(--bld);color:var(--bl);border-color:rgba(88,166,255,.25)}
.p-or{background:var(--ord);color:var(--or);border-color:rgba(227,179,65,.25)}
.p-mu{background:var(--sur2);color:var(--tx2);border-color:var(--bd)}
.p-loc{background:var(--pud);color:var(--pu);border-color:rgba(188,140,255,.25)}
.tw{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);overflow:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
thead th{background:var(--sur2);padding:11px 14px;text-align:left;font-size:11px;font-weight:
tbody tr{border-bottom:1px solid var(--bd);transition:background .1s}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:var(--sur2)}
tbody td{padding:11px 14px;vertical-align:middle}
.erow td{text-align:center;color:var(--tx3);padding:48px !important}
.bdg{display:inline-block;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;f
.b-in{background:var(--acd);color:var(--ac);border:1px solid rgba(0,212,170,.2)}
.b-out{background:var(--rdd);color:var(--rd);border:1px solid rgba(248,81,73,.2)}
.b-adm{background:var(--bld);color:var(--bl);border:1px solid rgba(88,166,255,.2)}
.b-per{background:var(--ord);color:var(--or);border:1px solid rgba(227,179,65,.2)}
.b-on{background:var(--grd);color:var(--gr)}.b-off{background:var(--sur3);color:var(--tx3)}
.b-frz{background:var(--bld);color:var(--bl)}.b-chl{background:var(--acd);color:var(--ac)}
.b-dry{background:var(--ord);color:var(--or)}.b-loc{background:var(--pud);color:var(--pu)}
.fbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.fbar select,.fbar input{padding:8px 12px;background:var(--sur3);border:1px solid var(--bd);b
.chip-bar{display:flex;gap:6px;flex-wrap:wrap}
.chip{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;border:1px solid var
.chip:hover{border-color:var(--bd2);color:var(--tx)}
.chip.act{background:var(--acd);border-color:var(--ac);color:var(--ac)}
.chip.act-bl{background:var(--bld);border-color:var(--bl);color:var(--bl)}
.chip.act-or{background:var(--ord);border-color:var(--or);color:var(--or)}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:flex;align-items:cen
.mdl{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);width:100%;max-
.mdl.wide{max-width:680px}
.mhd{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-b
.mhd span{font-family:'Syne',sans-serif;font-weight:700;font-size:16px}
.mhd button{background:none;border:none;color:var(--tx2);font-size:18px;padding:2px 6px;borde
.mhd button:hover{background:var(--sur3)}
.mbd{padding:22px;overflow-y:auto}.mft{display:flex;justify-content:flex-end;gap:10px;margin-
.spin-wrap{display:flex;align-items:center;justify-content:center;padding:60px;color:var(--tx
@keyframes spin{to{transform:rotate(360deg)}}
.spin-ico{width:22px;height:22px;border:2px solid var(--bd);border-top-color:var(--ac);border
.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
.kpi{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:18px 20
.kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.kpi.k-ac::before{background:var(--ac)}.kpi.k-bl::before{background:var(--bl)}
.kpi.k-or::before{background:var(--or)}.kpi.k-pu::before{background:var(--pu)}
.kpi-label{font-size:11px;font-weight:700;color:var(--tx2);letter-spacing:.06em;text-transfor
.kpi-val{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:500}
.kpi-sub{font-size:12px;margin-top:6px}
.kpi-up{color:var(--ac)}.kpi-dn{color:var(--rd)}.kpi-na{color:var(--tx3)}
.chart-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:
.chart-card-hd{display:flex;align-items:flex-start;justify-content:space-between;margin-botto
.chart-card-title{font-family:'Syne',sans-serif;font-weight:700;font-size:14px}
.chart-card-sub{font-size:12px;color:var(--tx2);margin-top:3px}
.chart-legend{display:flex;gap:14px;flex-wrap:wrap}
.leg-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--tx2)}
.leg-dot{width:10px;height:10px;border-radius:2px;flex-shrink:0}
.chart-wrap{width:100%;overflow-x:auto}
.perf-bar-bg{background:var(--sur3);border-radius:3px;height:6px;position:relative;overflow:h
.perf-bar-fill{position:absolute;left:0;top:0;height:100%;border-radius:3px;transition:width
.bar-tooltip{position:fixed;background:var(--sur);border:1px solid var(--bd2);border-radius:v
.tt-month{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;margin-bottom:6px}
.tt-row{display:flex;justify-content:space-between;gap:16px;padding:2px 0}
.tt-dot{width:8px;height:8px;border-radius:2px;display:inline-block;margin-right:5px;flex-shr
.inv-wrap{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);overflow:h
.inv-hd{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;borde
.inv-title{font-family:'Syne',sans-serif;font-weight:700;font-size:15px}
.inv-count{font-size:12px;color:var(--tx2);background:var(--sur3);border:1px solid var(--bd);
.inv-filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:12px 20px;border-
.loc-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;pa
.loc-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:14
.loc-card:hover,.loc-card.sel{border-color:var(--pu)}.loc-card.sel{background:var(--pud)}
.loc-card-name{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;margin-bottom:6px
.loc-stat{font-size:11px;color:var(--tx2)}.loc-stat strong{color:var(--tx);font-family:'JetBr
.row-frz td:first-child{border-left:3px solid var(--bl)}
.row-chl td:first-child{border-left:3px solid var(--ac)}
.row-dry td:first-child{border-left:3px solid var(--or)}
.ctr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}
.ctr-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);overflow:h
.ctr-card.act-ctr{border-color:var(--or);border-width:1.5px}
.ctr-hd{padding:16px 18px;border-bottom:1px solid var(--bd);display:flex;align-items:flex-sta
.ctr-client{font-family:'Syne',sans-serif;font-weight:700;font-size:14px}
.ctr-ref{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx2);margin-top:2p
.ctr-body{padding:14px 18px}
.ctr-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-siz
.ctr-row:last-child{border:none}.ctr-label{color:var(--tx2);font-size:12px}
.ctr-val{font-family:'JetBrains Mono',monospace;font-weight:500}
.ctr-foot{padding:10px 18px;background:var(--sur2);border-top:1px solid var(--bd);display:fle
.b-ctr-act{background:var(--ord);color:var(--or);border:1px solid rgba(227,179,65,.25)}
.b-ctr-fut{background:var(--bld);color:var(--bl);border:1px solid rgba(88,166,255,.25)}
.b-ctr-exp{background:var(--sur3);color:var(--tx3)}
.info-box{background:var(--sur2);border:1px solid var(--bd);border-radius:var(--r);padding:12
.sp-alert-bar{display:flex;align-items:center;gap:10px;background:var(--rdd);border:1px solid
.sp-tabs{display:flex;gap:2px;background:var(--sur2);border:1px solid var(--bd);border-radius
.sp-tab{padding:8px 16px;border:none;background:none;border-radius:7px;font-size:13px;font-we
.sp-tab.on{background:var(--sur3);color:var(--tx);box-shadow:0 1px 4px rgba(0,0,0,.3)}
.sp-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.sp-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);overflow:hi
.sp-card.alert{border-color:rgba(248,81,73,.4)!important}.sp-card.warn{border-color:rgba(227,
.sp-card-hd{padding:14px 16px;display:flex;align-items:flex-start;justify-content:space-betwe
.sp-card-name{font-weight:700;font-size:13.5px}
.sp-card-pn{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx2);margin-top
.sp-card-body{padding:12px 16px;display:flex;flex-direction:column;gap:8px}
.sp-stock-row{display:flex;align-items:center;justify-content:space-between}
.sp-stock-num{font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:600}
.sp-stock-num.ok{color:var(--ac)}.sp-stock-num.warn{color:var(--or)}.sp-stock-num.low{color:v
.sp-stock-bar{height:4px;background:var(--sur3);border-radius:2px;margin:2px 0 6px;overflow:h
.sp-stock-bar-fill{height:100%;border-radius:2px;transition:width .3s}
.sp-meta{font-size:11px;color:var(--tx2);display:flex;gap:12px;flex-wrap:wrap}
.sp-card-foot{padding:10px 16px;border-top:1px solid var(--bd);display:flex;gap:6px;justify-c
.pr-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:16p
.pr-card.urgent{border-color:rgba(248,81,73,.35)}
.b-pr-open{background:var(--ord);color:var(--or)}.b-pr-ordered{background:var(--bld);color:va
.mach-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:1
.mach-card-name{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;margin-bottom:4p
.tbar{display:flex;gap:2px;background:var(--sur2);border:1px solid var(--bd);border-radius:9p
.tab{padding:8px 20px;border:none;background:none;border-radius:7px;font-size:13px;font-weigh
.tab.on{background:var(--sur3);color:var(--tx);box-shadow:0 1px 4px rgba(0,0,0,.3)}
.sbox{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:24px}
.hint{font-size:13px;color:var(--tx2);margin-bottom:18px;line-height:1.6}
@media(max-width:1000px){.sgrid{grid-template-columns:repeat(3,1fr)}.kpi-row{grid-template-co
@media(max-width:700px){
.sidebar{transform:translateX(-100%)}.sidebar.open{transform:none;box-shadow:4px 0 32px rgb
.bkd{display:block}.main{margin-left:0}.topbar{display:flex}
.con{padding:18px 14px}.fgrid{grid-template-columns:1fr}.fg.s2{grid-column:span 1}
.sgrid{grid-template-columns:1fr 1fr;gap:10px}.kpi-row{grid-template-columns:1fr 1fr}
.ctr-grid{grid-template-columns:1fr}.sp-cards{grid-template-columns:1fr}
@media(max-width:420px){.sgrid{grid-template-columns:1fr}.kpi-row{grid-template-columns:1fr}}
}
`;
document.head.appendChild(_st);
// ── CONSTANTS ─────────────────────────────────────────────────────
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CY=new Date().getFullYear(), PY=CY-1;
const sico =t=>t==='frozen'?' ':t==='chilled'?' ':' ';
const sbadge=t=>t==='frozen'?'b-frz':t==='chilled'?'b-chl':'b-dry';
const spill =t=>t==='frozen'?'p-blue':t==='chilled'?'p-teal':'p-or';
const fmtM =n=>`₱${Number(n||0).toLocaleString('en-PH',{minimumFractionDigits:2})}`;
const fmtMK =n=>n>=1e6?`₱${(n/1e6).toFixed(2)}M`:n>=1000?`₱${(n/1000).toFixed(1)}K`:fmtM(n);
const fmtKg =n=>`${Number(n||0).toLocaleString('en-PH',{minimumFractionDigits:2})} kg`;
const fmtD =s=>{try{return new Date(s+'T00:00:00').toLocaleDateString('en-PH',{month:'short'
const uid =()=>Math.random().toString(36).slice(2,10).toUpperCase();
const today =()=>new Date().toISOString().slice(0,10);
const FKC_LOGO='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmc
// ── SHARED ────────────────────────────────────────────────────────
const Spinner=()=><div className="spin-wrap"><div className="spin-ico"/><span>Loading…</span>
function Modal({title,onClose,children,wide=false}){
return(
<div className="ov" onClick={onClose}>
<div className={`mdl${wide?' wide':''}`} onClick={e=>e.stopPropagation()}>
<div className="mhd"><span>{title}</span><button onClick={onClose}>✕</button></div>
<div className="mbd">{children}</div>
</div>
</div>
);
}
function TxTable({txs,clientMap,locationMap}){
if(!txs.length) return <div className="tw"><table><tbody><tr className="erow"><td colSpan={
return(
<div className="tw"><table>
<thead><tr><th>Date</th><th>Client</th><th>Item</th><th>Location</th><th>Type</th><th>W
<tbody>{txs.map(t=>(
<tr key={t.id}>
<td style={{fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{fmtD(t.da
<td>{clientMap[t.client_id]||'—'}</td>
<td style={{fontWeight:600}}>{t.item_name}</td>
<td><span className="bdg b-loc">{locationMap[t.location_id]||'—'}</span></td>
<td><span className={`bdg ${t.type==='IN'?'b-in':'b-out'}`}>{t.type==='IN'?'▼ IN':'
<td style={{fontFamily:'JetBrains Mono',fontSize:12}}>{fmtKg(t.kg)}</td>
<td style={{color:'var(--tx2)'}}>{t.ref_no||'—'}</td>
<td style={{color:'var(--tx2)',fontSize:12}}>{t.encoded_by}</td>
</tr>
))}</tbody>
</table></div>
);
}
// ── BAR CHART ─────────────────────────────────────────────────────
function BarChart({cyData,pyData,metric,curMonth}){
const [tip,setTip]=useState(null);
const H=220,pL=52,pR=12,pT=16,pB=40,W=Math.max(600,12*56+pL+pR),cH=H-pT-pB,cW=W-pL-pR;
const gV=d=>metric==='total'?d.total:metric==='storage'?d.storage:metric==='handling'?(d.ha
const allV=[...cyData.map(gV),...pyData.map(gV)].filter(v=>v>0);
const maxV=allV.length?Math.max(...allV)*1.12:1;
const bW=Math.floor(cW/12),bw=Math.floor((bW-4)*0.44);
return(
<div className="chart-wrap" style={{position:'relative'}}>
{tip&&<div className="bar-tooltip" style={{left:tip.x+12,top:tip.y-10,transform:'transl
<div className="tt-month">{tip.month}</div>
{tip.cy!==null&&<div className="tt-row"><span><span className="tt-dot" style={{backgr
<div className="tt-row"><span><span className="tt-dot" style={{background:'#58a6ff',o
{tip.cy!==null&&tip.py>0&&<div className="tt-row" style={{marginTop:4,borderTop:'1px
<span style={{color:'var(--tx2)'}}>YoY</span>
<strong style={{color:tip.cy>=tip.py?'var(--ac)':'var(--rd)'}}>{tip.cy>=tip.py?'+':
</div>}
</div>}
<svg width={W} height={H}>
{[0,.25,.5,.75,1].map(f=>{const y=pT+cH*(1-f);return(<g key={f}><line x1={pL} x2={W-p
{MONTHS.map((mon,i)=>{
const pyV=gV(pyData[i]),cyV=i<=curMonth?gV(cyData[i]):null;
const x=pL+i*bW,pyH=Math.max((pyV/maxV)*cH,pyV>0?2:0),cyH=cyV!=null?Math.max((cyV/m
const isCur=i===curMonth;
return(<g key={i} style={{cursor:'pointer'}}
onMouseEnter={e=>setTip({x:e.clientX,y:e.clientY,month:`${mon} ${CY}`,cy:cyV,py:p
onMouseMove={e=>setTip(t=>t?{...t,x:e.clientX,y:e.clientY}:null)}
onMouseLeave={()=>setTip(null)}>
{pyV>0&&<rect x={x+2} y={pT+cH-pyH} width={bw} height={pyH} fill="#58a6ff" opacit
{cyV!=null&&cyV>0&&<rect x={x+2+bw+2} y={pT+cH-cyH} width={bw} height={cyH} fill=
{cyV!=null&&cyH>22&&<text x={x+2+bw+2+bw/2} y={pT+cH-cyH+12} style={{fontFamily:'
<text x={x+bW/2} y={H-8} style={{fontFamily:'JetBrains Mono',fontSize:10,fill:isC
{isCur&&<circle cx={x+bW/2} cy={H-20} r={2} fill="var(--ac)"/>}
</g>);
})}
</svg>
</div>
);
}
// ── ANALYTICS ─────────────────────────────────────────────────────
function Analytics({clients}){
const curMonth=new Date().getMonth();
const [cf,setCf]=useState('');
const [metric,setMetric]=useState('total');
const empty=Array(12).fill({storage:0,handlingIn:0,handlingOut:0,total:0,kgIn:0,kgOut:0});
const [cy,setCy]=useState(empty);
const [py,setPy]=useState(empty);
const [loading,setLoading]=useState(true);
useEffect(()=>{setLoading(true);Promise.all([db.getMonthlyRevenue(CY,cf),db.getMonthlyReven
const ytdCY=cy.slice(0,curMonth+1).reduce((s,d)=>s+d.total,0);
const ytdPY=py.slice(0,curMonth+1).reduce((s,d)=>s+d.total,0);
const ytdD=ytdPY>0?((ytdCY-ytdPY)/ytdPY)*100:0;
const cur=cy[curMonth],pre=cy[Math.max(0,curMonth-1)];
const mom=pre.total>0?((cur.total-pre.total)/pre.total)*100:0;
const best=cy.reduce((b,d,i)=>d.total>b.val?{val:d.total,idx:i}:b,{val:0,idx:0});
const fullPY=py.reduce((s,d)=>s+d.total,0);
const maxCY=Math.max(...cy.map(d=>d.total),1);
const metOpts=[{k:'total',l:'Total Revenue'},{k:'storage',l:'Storage Fee'},{k:'handling',l:
return(<>
<div className="kpi-row">
{[[`YTD Revenue ${CY}`,fmtMK(ytdCY),ytdD,ytdD>=0,`vs ${PY} YTD`,'k-ac'],['This Month',f
<div key={label} className={`kpi ${col}`}>
<div className="kpi-label">{label}</div><div className="kpi-val">{val}</div>
<div className="kpi-sub">{sub!==null?<span className={isUp?'kpi-up':'kpi-dn'}>{isUp
</div>
))}
</div>
<div className="chart-card">
<div className="chart-card-hd">
<div><div className="chart-card-title">Monthly Revenue — {CY} vs {PY}</div><div class
<div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
<select value={cf} onChange={e=>setCf(e.target.value)} style={{padding:'6px 10px',b
<select value={metric} onChange={e=>setMetric(e.target.value)} style={{padding:'6px
<div className="chart-legend"><div className="leg-item"><div className="leg-dot" st
</div>
</div>
{loading?<Spinner/>:<BarChart cyData={cy} pyData={py} metric={metric} curMonth={curMont
</div>
<div className="chart-card">
<div className="chart-card-hd"><div><div className="chart-card-title">Month-by-Month Pe
<div style={{overflow:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fo
<thead><tr>{['Month','Bar','Revenue '+CY,'Revenue '+PY,'YoY','kg In','kg Out'].map(h=
<tbody>{MONTHS.map((m,i)=>{
const cyi=cy[i].total,pyi=py[i].total,chg=pyi>0?((cyi-pyi)/pyi)*100:null,isFut=i>cu
return(<tr key={i} style={{borderBottom:'1px solid var(--bd)',background:isCur?'rgb
<td style={{padding:'10px 14px',fontWeight:isCur?700:400,color:isCur?'var(--ac)':
<td style={{padding:'10px 14px',minWidth:120}}>{!isFut&&<div className="perf-bar-
<td style={{padding:'10px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:isF
<td style={{padding:'10px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'va
<td style={{padding:'10px 14px'}}>{isFut?<span style={{color:'var(--tx3)'}}>—</sp
<td style={{padding:'10px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'va
<td style={{padding:'10px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'va
</tr>);
})}</tbody>
<tfoot><tr style={{background:'var(--sur2)',borderTop:'2px solid var(--bd)'}}>
<td style={{padding:'11px 14px',fontWeight:700,fontSize:12}}>YTD TOTAL</td><td/>
<td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontSize:13,fontWeight:
<td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontSize:13,fontWeight:
<td style={{padding:'11px 14px'}}><span style={{color:ytdD>=0?'var(--ac)':'var(--rd
<td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'var(
<td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'var(
</tr></tfoot>
</table></div>
</div>
</>);
}
// ── INVENTORY PANEL ───────────────────────────────────────────────
function InventoryPanel({inventory,clients,locations}){
const [stF,setStF]=useState('all');const [clF,setClF]=useState('');const [loF,setLoF]=useSt
const filtered=inventory.filter(r=>{if(stF!=='all'&&r.storage_type!==stF)return false;if(cl
const total=filtered.reduce((s,r)=>s+r.kg,0);
const locSum=locations.map(loc=>{const rows=inventory.filter(r=>{if(stF!=='all'&&r.storage_
const chips=[{k:'all',l:'All Types'},{k:'frozen',l:' Frozen'},{k:'chilled',l:' Chilled
return(
<div className="inv-wrap">
<div className="inv-hd">
<div style={{display:'flex',alignItems:'center',gap:10}}><span style={{fontSize:18}}>
<button className="btn bgh" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>{se
</div>
{locSum.length>0&&<div className="loc-cards">{locSum.map(loc=>(
<div key={loc.id} className={`loc-card ${loF===loc.id?'sel':''}`} onClick={()=>setLoF
<div className="loc-card-name"> {loc.name}</div>
<div style={{display:'flex',gap:10,flexWrap:'wrap'}}><span className="loc-stat"><st
{loF===loc.id&&<div style={{marginTop:6,fontSize:11,color:'var(--pu)',fontWeight:70
</div>
))}</div>}
<div className="inv-filters">
<div className="chip-bar">{chips.map(c=><button key={c.k} className={`chip ${stF===c.
<div style={{width:1,height:24,background:'var(--bd)',margin:'0 4px'}}/>
<select value={clF} onChange={e=>setClF(e.target.value)} style={{padding:'6px 10px',b
<select value={loF} onChange={e=>setLoF(e.target.value)} style={{padding:'6px 10px',b
</div>
<div style={{overflow:'auto'}}>
{filtered.length===0?<div style={{textAlign:'center',color:'var(--tx3)',padding:'48px
<table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
<thead><tr>{['Item','Client','Location','Type','On Hand'].map((h,i)=><th key={h} st
<tbody>{filtered.map((r,i)=>(
<tr key={i} className={`row-${r.storage_type==='frozen'?'frz':r.storage_type==='c
<td style={{padding:'11px 14px'}}><div style={{fontWeight:700}}>{r.item_name}</
<td style={{padding:'11px 14px',color:'var(--tx2)'}}>{r.client_name}</td>
<td style={{padding:'11px 14px'}}><span className="bdg b-loc">{r.location_name}
<td style={{padding:'11px 14px'}}><span className={`bdg ${sbadge(r.storage_type
<td style={{padding:'11px 14px',textAlign:'right',fontFamily:'JetBrains Mono',f
</tr>
))}</tbody>
<tfoot><tr style={{background:'var(--sur2)',borderTop:'2px solid var(--bd)'}}>
<td colSpan={4} style={{padding:'11px 14px',fontWeight:700,fontSize:12,color:'var
<td style={{padding:'11px 14px',textAlign:'right',fontFamily:'JetBrains Mono',fon
</tr></tfoot>
</table>}
</div>
</div>
);
}
// ── DASHBOARD ─────────────────────────────────────────────────────
function Dashboard({clients,locations,refresh}){
const [data,setData]=useState(null);
const load=useCallback(async()=>{const d=await db.getDashboard();setData(d);},[]);
useEffect(()=>{load();},[load,refresh]);
if(!data) return <div className="con"><Spinner/></div>;
const clientMap=Object.fromEntries(clients.map(c=>[c.id,c.name]));
const locationMap=Object.fromEntries(locations.map(l=>[l.id,l.name]));
const cards=[{l:'Total On Hand',v:fmtKg(data.totalStock),i:' '},{l:'Frozen',v:fmtKg(data.f
return(
<div className="con">
<div className="ph"><div className="phi teal"> </div><h2>Dashboard</h2><button classNa
<div className="sgrid">{cards.map(c=><div key={c.l} className="sc"><div className="sico
{data.lowParts?.length>0&&<div className="sp-alert-bar" style={{marginBottom:20}}> <s
<div style={{marginBottom:8}}><div style={{fontFamily:'Syne',fontWeight:700,fontSize:13
<div style={{marginTop:8}}><div style={{fontFamily:'Syne',fontWeight:700,fontSize:13,co
<div style={{marginTop:24}}><div style={{fontFamily:'Syne',fontWeight:700,fontSize:13,c
</div>
);
}
// ── STOCK FORM ────────────────────────────────────────────────────
function StockForm({type,user,clients,locations,onSaved}){
const isIn=type==='IN';
const blank={clientId:'',itemId:'',locationId:'',kg:'',refNo:'',date:today(),notes:''};
const [form,setForm]=useState(blank);
const [items,setItems]=useState([]);
const [saved,setSaved]=useState(null);
const [saving,setSaving]=useState(false);
const [err,setErr]=useState('');
const s=(k,v)=>setForm(f=>({...f,[k]:v}));
const selItem=items.find(i=>i.id===form.itemId)||null;
const selLoc=locations.find(l=>l.id===form.locationId)||null;
useEffect(()=>{
if(form.clientId){db.getItems(form.clientId).then(its=>{setItems(its);s('itemId','');});}
else setItems([]);
},[form.clientId]);
const submit=async()=>{
if(!form.clientId) return setErr('Please select a client.');
if(!form.itemId) return setErr('Please select an item.');
if(!form.locationId) return setErr('Please select a storage location.');
if(!form.kg||isNaN(parseFloat(form.kg))||parseFloat(form.kg)<=0) return setErr('Please en
setErr('');setSaving(true);
try{
const tx=await db.saveTransaction({id:'TX'+uid(),type,client_id:form.clientId,item_id:f
setSaved({...tx,clientName:clients.find(c=>c.id===tx.client_id)?.name,locationName:selL
setForm(blank);setItems([]);setTimeout(()=>setSaved(null),5000);onSaved();
}catch(e){setErr('Save failed: '+e.message);}
setSaving(false);
};
return(
<div className="con">
<div className="ph"><div className={`phi ${isIn?'teal':'red'}`}>{isIn?' ':' '}</div><
{saved&&<div className="ok-bar">✓ {isIn?'Stock-in':'Stock-out'} recorded! · <strong>{sa
{err&&<div className="err-bar">{err}</div>}
<div className="fgrid">
<div className="fg"><label>① Client *</label><select value={form.clientId} onChange=
<div className="fg"><label>Date *</label><input type="date" value={form.date} onChang
<div className="fg s2"><label>② Item *</label>
{!form.clientId?<select disabled><option>— Select a client first —</option></select
:items.length===0?<div className="err-bar" style={{margin:0,fontSize:12}}> No i
:<><div className="iselr"><select value={form.itemId} onChange={e=>s('itemId',e.t
{selItem&&<div className="pills">{selItem.code&&<span className="pill p-mu">SKU:
</div>
<div className="fg"><label>③ Storage Location *</label>
<select value={form.locationId} onChange={e=>s('locationId',e.target.value)} {selLoc?.description&&<div className="pills"><span className="pill p-loc"> </div>
<div className="fg"><label>④ Weight (kg) *</label><input type="number" step="0.01" m
<div className="fg"><label>Reference No.</label><input value={form.refNo} onChange={e
<div className="fg s2"><label>Notes</label><textarea value={form.notes} onChange={e=>
</div>
<button className={`btn ${isIn?'bac':'brd'}`} onClick={submit} disabled={saving}>{isIn?
</div>
disabl
{selLo
);
}
// ── TRANSACTION LOG ───────────────────────────────────────────────
function TransactionLog({clients,locations,refresh}){
const [filter,setFilter]=useState({client_id:'',type:'',location_id:'',from:'',to:''});
const [txs,setTxs]=useState([]);const [loading,setLoading]=useState(true);
const clientMap=Object.fromEntries(clients.map(c=>[c.id,c.name]));
const locationMap=Object.fromEntries(locations.map(l=>[l.id,l.name]));
const load=useCallback(async()=>{setLoading(true);setTxs(await db.getTransactions(filter));
useEffect(()=>{load();},[load,refresh]);
const setF=(k,v)=>setFilter(f=>({...f,[k]:v}));
return(
<div className="con">
<div className="ph"><div className="phi bl"> </div><h2>Transaction Log</h2><button cla
<div className="fbar" style={{marginBottom:16}}>
<select value={filter.client_id} onChange={e=>setF('client_id',e.target.value)}><opti
<select value={filter.type} onChange={e=>setF('type',e.target.value)}><option value="
<select value={filter.location_id} onChange={e=>setF('location_id',e.target.value)}><
<input type="date" value={filter.from} onChange={e=>setF('from',e.target.value)}/>
<input type="date" value={filter.to} onChange={e=>setF('to',e.target.value)}/>
<button className="btn bgh" onClick={()=>setFilter({client_id:'',type:'',location_id:
</div>
{loading?<Spinner/>:<TxTable txs={txs} clientMap={clientMap} locationMap={locationMap}/
</div>
);
}
// ── ITEM DATABASE ─────────────────────────────────────────────────
function ItemDatabase({clients}){
const [allItems,setAllItems]=useState([]);const [loading,setLoading]=useState(true);
const [modal,setModal]=useState(null);const [form,setForm]=useState({});
const [fc,setFc]=useState('');const [saving,setSaving]=useState(false);
const s=(k,v)=>setForm(f=>({...f,[k]:v}));
const STYPES=["frozen","chilled","dry"];
const reload=useCallback(async()=>{setLoading(true);setAllItems(await db.getItems());setLoa
useEffect(()=>{reload();},[reload]);
const openNew=(cid='')=>{setForm({name:'',code:'',client_id:cid,storage_type:'frozen',notes
const openEdit=item=>{setForm({...item});setModal('edit');};
const save=async()=>{
if(!form.name?.trim()) return alert('Item name required.');
if(!form.client_id) return alert('Please select a client.');
const dup=allItems.find(i=>i.client_id===form.client_id&&i.name.toLowerCase()===form.name
if(dup) return alert(`"${form.name}" already exists for this client.`);
setSaving(true);await db.saveItem({...form,name:form.name.trim(),id:form.id||'ITM'+uid()}
};
const del=async item=>{if(!window.confirm(`Delete "${item.name}"?`)) return;await db.delete
const showClients=fc?clients.filter(c=>c.id===fc):clients;
return(
<div className="con">
<div className="ph"><div className="phi gr"> </div><h2>Item Database</h2><button class
{modal&&(<Modal title={modal==='new'?'New Item':'Edit Item'} onClose={()=>setModal(null
<div className="fgrid">
<div className="fg s2"><label>Client *</label><select value={form.client_id||''} on
<div className="fg s2"><label>Item Name *</label><input value={form.name||''} onCha
<div className="fg"><label>Code / SKU</label><input value={form.code||''} onChange=
<div className="fg"><label>Storage Type</label><select value={form.storage_type||'f
<div className="fg s2"><label>Notes</label><textarea value={form.notes||''} onChang
</div>
<div className="mft"><button className="btn bgh" onClick={()=>setModal(null)}>Cancel<
</Modal>)}
<div className="fbar" style={{marginBottom:24}}>
<select value={fc} onChange={e=>setFc(e.target.value)}><option value="">All Clients</
<span style={{fontSize:13,color:'var(--tx2)',alignSelf:'center',fontFamily:'JetBrains
</div>
{loading?<Spinner/>:showClients.map(client=>{
const ci=allItems.filter(i=>i.client_id===client.id);
return(<div key={client.id} style={{marginBottom:32}}>
<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marg
<div><div style={{fontFamily:'Syne',fontWeight:700,fontSize:15}}> {client.name}
<button className="btn bgh" style={{fontSize:12,padding:'6px 14px'}} onClick={()=
</div>
{ci.length===0?<div style={{color:'var(--tx3)',fontSize:13,fontStyle:'italic'}}>No
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr)
{ci.map(item=>(
<div key={item.id} style={{background:'var(--sur)',border:'1px solid var(--bd)'
<div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-bet
<div><div style={{fontWeight:700,fontSize:13.5}}>{item.name}</div>{item.cod
<div style={{display:'flex',gap:3,flexShrink:0}}><button className="ib" onC
</div>
<div className="pills" style={{marginTop:9}}><span className={`pill ${spill(i
</div>
))}
</div>}
</div>);
})}
</div>
);
}
// ── CLIENTS ───────────────────────────────────────────────────────
function Clients(){
const [clients,setClients]=useState([]);const [loading,setLoading]=useState(true);
const [modal,setModal]=useState(null);const [form,setForm]=useState({});const [saving,setSa
const s=(k,v)=>setForm(f=>({...f,[k]:v}));
const reload=useCallback(async()=>{
setLoading(true);
const [cls,allItems]=await Promise.all([db.getClients(),db.getItems()]);
setClients(cls.map(c=>({...c,_itemCount:allItems.filter(i=>i.client_id===c.id).length})))
setLoading(false);
},[]);
useEffect(()=>{reload();},[reload]);
const openNew=()=>{setForm({name:'',contact:'',email:'',address:''});setModal('new');};
const openEdit=c=>{setForm({...c});setModal('edit');};
const save=async()=>{if(!form.name?.trim()) return alert('Name is required.');setSaving(tru
const del=async id=>{if(!window.confirm('Delete this client and all their items?')) return;
return(
<div className="con">
<div className="ph"><div className="phi bl"> </div><h2>Clients</h2><button className="
{modal&&(<Modal title={modal==='new'?'New Client':'Edit Client'} onClose={()=>setModal(
<div className="fgrid">
<div className="fg s2"><label>Company / Name *</label><input value={form.name||''}
<div className="fg"><label>Contact Person</label><input value={form.contact||''} on
<div className="fg"><label>Email</label><input type="email" value={form.email||''}
<div className="fg s2"><label>Address</label><textarea value={form.address||''} onC
</div>
<div className="mft"><button className="btn bgh" onClick={()=>setModal(null)}>Cancel<
</Modal>)}
{loading?<Spinner/>:<div className="tw"><table>
<thead><tr><th>Name</th><th>Contact</th><th>Email</th><th>Address</th><th>Items</th><
<tbody>{clients.length===0?<tr className="erow"><td colSpan={6}>No clients yet.</td><
<tr key={c.id}><td><strong>{c.name}</strong></td><td style={{color:'var(--tx2)'}}>{
<td><span className="bdg b-on">{c._itemCount||0} item{c._itemCount!==1?'s':''}</spa
<td><div style={{display:'flex',gap:4,justifyContent:'flex-end'}}><button className
))}</tbody>
</table></div>}
</div>
);
}
// ── BILLING ───────────────────────────────────────────────────────
function Billing({clients}){
const [form,setForm]=useState({clientId:'',from:'',to:''});
const [result,setResult]=useState(null);const [loading,setLoading]=useState(false);
const [qboLoading,setQboLoading]=useState(false);
const [qboResult,setQboResult]=useState(null);
const [qboError,setQboError]=useState('');
const s=(k,v)=>setForm(f=>({...f,[k]:v}));
const pushToQBO=async()=>{
if(!result) return;
setQboLoading(true); setQboError(''); setQboResult(null);
try{
const client=clients.find(c=>c.id===result.clientId);
const res=await fetch('/.netlify/functions/qbo-create-invoice',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
clientName:client?.name||result.clientId,
dateFrom:result.dateFrom,
dateTo:result.dateTo,
hIn:result.hIn,
hOut:result.hOut,
storage:result.storage,
dryTotal:result.dryBilling?.total||0,
dryRows:result.dryBilling?.rows||[],
total:result.total,
rates:result.rates,
}),
});
const data=await res.json();
if(data.success){ setQboResult(data); }
else setQboError(data.error||'Failed to create invoice in QuickBooks.');
}catch(e){ setQboError('Connection error: '+e.message); }
setQboLoading(false);
};
const generate=async()=>{
if(!form.clientId||!form.from||!form.to) return alert('Please fill in all fields.');
if(form.from>form.to) return alert('Date From must be before Date To.');
setLoading(true);setResult(await db.computeBilling(form.clientId,form.from,form.to));setL
};
const client=clients.find(c=>c.id===result?.clientId);
const allTxs=result?[...result.inTxsInPeriod,...result.outTxs].sort((a,b)=>a.date.localeCom
return(
<div className="con">
<div className="ph"><div className="phi pu"> </div><h2>Billing Statement</h2></div>
<div className="fgrid">
<div className="fg"><label>Client *</label><select value={form.clientId} onChange={e=
<div className="fg"><label>Date From *</label><input type="date" value={form.from} on
<div className="fg"><label>Date To *</label><input type="date" value={form.to} onChan
</div>
<div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
<div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
<button className="btn bac" onClick={generate} disabled={loading}> {loading?'Comput
{result&&<button className="btn" style={{background:'#2CA01C',color:'#fff',border:'no
{qboLoading?' Sending to QBO…':' Push to QuickBooks'}
</button>}
{qboResult&&<span style={{fontSize:13,color:'var(--ac)'}}>✓ Invoice <strong>{qboResul
{qboError&&<span style={{fontSize:13,color:'var(--rd)'}}>✗ {qboError}</span>}
</div>
{result&&<button className="btn" style={{background:'#2CA01C',color:'#fff'}} onClick=
{qboLoading?' Sending…':' Push to QuickBooks'}
</button>}
{qboResult&&<span style={{fontSize:13,color:'var(--ac)'}}>✓ Invoice <strong>{qboResul
{qboError&&<span style={{fontSize:13,color:'var(--rd)'}}>✗ {qboError}</span>}
</div>
{result&&(
<div style={{background:'var(--sur)',border:'1px solid var(--bd)',borderRadius:'var(-
<div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',
<div><div style={{fontFamily:'Syne',fontWeight:800,fontSize:17}}>Billing Statemen
<button className="btn bgh" onClick={()=>window.print()}> Print</button>
</div>
<div style={{padding:'14px 24px 0',fontSize:11,fontWeight:700,color:'var(--tx2)',le
<div className="tw" style={{borderRadius:0,border:'none',borderTop:'1px solid var(-
<table><thead><tr><th>Date</th><th>Type</th><th>Item</th><th>Weight</th><th>Ref #
<tbody>{allTxs.length===0?<tr className="erow"><td colSpan={5}>No cold/chilled tr
<tr key={t.id}><td style={{fontFamily:'JetBrains Mono',fontSize:12,color:'var(-
))}</tbody></table>
</div>
<div style={{padding:'10px 24px'}}>
{[['Handling Fee — Stock In',`(${fmtM(result.rates.handling_in_per_kg)}/kg)`,resu
<div key={l} style={{display:'flex',justifyContent:'space-between',padding:'9px
<span>{l}{sub&&<span style={{color:'var(--tx2)',fontFamily:'JetBrains Mono',f
<span style={{fontFamily:'JetBrains Mono'}}>{fmtM(v)}</span>
</div>
))}
</div>
{result.dryBilling?.rows?.length>0&&(
<div style={{padding:'0 24px 16px'}}>
<div style={{fontSize:11,fontWeight:700,color:'var(--or)',letterSpacing:'.07em'
<div style={{background:'rgba(227,179,65,.05)',border:'1px solid rgba(227,179,6
<table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
<thead><tr>{['Month','Period','Flat Fee','Slots × Rate','Total'].map(h=><th
<tbody>{result.dryBilling.rows.map((r,i)=>(
<tr key={i} style={{borderBottom:'1px solid rgba(227,179,65,.1)'}}>
<td style={{padding:'9px 14px',fontFamily:'JetBrains Mono',fontSize:12,
<td style={{padding:'9px 14px',fontSize:12,color:'var(--tx2)'}}>{r.peri
<td style={{padding:'9px 14px',fontFamily:'JetBrains Mono',fontSize:12}
<td style={{padding:'9px 14px',fontFamily:'JetBrains Mono',fontSize:12,
<td style={{padding:'9px 14px',fontFamily:'JetBrains Mono',fontSize:13,
</tr>
))}</tbody>
<tfoot><tr style={{background:'rgba(227,179,65,.08)',borderTop:'2px solid r
<td colSpan={4} style={{padding:'10px 14px',fontWeight:700,fontSize:12,co
<td style={{padding:'10px 14px',fontFamily:'JetBrains Mono',fontSize:14,f
</tr></tfoot>
</table>
</div>
</div>
)}
<div style={{padding:'16px 24px',borderTop:'2px solid var(--bd)',display:'flex',jus
<span>TOTAL DUE</span><span style={{fontFamily:'JetBrains Mono'}}>{fmtM(result.to
</div>
</div>
)}
</div>
);
}
// ── CONTRACTS ────────────────────────────────────────────────────
function ContractStatusBadge({contract}){
const td=today(),isAct=contract.start_date<=td&&contract.end_date>=td,isFut=contract.start_
return <span className={`bdg ${isAct?'b-ctr-act':isFut?'b-ctr-fut':'b-ctr-exp'}`}>{isAct?'●
}
function EscalationEditor({periods,onChange}){
const add=()=>onChange([...periods,{label:'New Period',start:'',end:'',flat_fee:periods[per
const rm=i=>onChange(periods.filter((_,idx)=>idx!==i));
const up=(i,k,v)=>onChange(periods.map((p,idx)=>idx===i?{...p,[k]:v}:p));
return(
<div>
<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBo
Contract Periods / Escalation Schedule
<button className="btn bgh" style={{fontSize:11,padding:'4px 10px'}} onClick={add}>+
</div>
{periods.map((p,i)=>(
<div key={i} style={{background:'var(--sur2)',border:'1px solid var(--bd)',borderRadi
<div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
<input value={p.label||''} onChange={e=>up(i,'label',e.target.value)} placeholder
<button className="ib dl" onClick={()=>rm(i)}> </button>
</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
{[['start','Start Date'],['end','End Date']].map(([k,l])=>(
<div key={k}><div style={{fontSize:10,color:'var(--tx3)',textTransform:'upperca
<input type="date" value={p[k]||''} onChange={e=>up(i,k,e.target.value)} style=
))}
</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
{[['flat_fee','Flat Fee (₱/mo)'],['slot_rate','Slot Rate (₱/slot)'],['slots_occup
<div key={k}><div style={{fontSize:10,color:'var(--tx3)',textTransform:'upperca
<input type="number" step="0.01" min="0" value={p[k]??''} onChange={e=>up(i,k,p
))}
</div>
<div style={{marginTop:8,fontSize:12,color:'var(--tx2)'}}>Monthly total: <strong st
</div>
))}
</div>
);
}
function ContractViewModal({contract,clientMap,locationMap,onClose,onEdit}){
const td=today();
return(
<Modal title={`Contract — ${contract.ref_no}`} onClose={onClose}>
<div style={{display:'flex',flexDirection:'column',gap:10}}>
<div className="info-box"><strong>{clientMap[contract.client_id]}</strong> · {locatio
{(contract.periods||[]).map((p,i)=>{
const isCur=(p.start_date||p.start)<=td&&(p.end_date||p.end)>=td;
return(<div key={i} style={{background:isCur?'rgba(227,179,65,.06)':'var(--sur2)',b
<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',ma
<span style={{fontWeight:700,fontSize:13}}>{p.label}</span>{isCur&&<span classN
</div>
<div style={{fontSize:12,color:'var(--tx2)',marginBottom:6}}>{fmtD(p.start_date||
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
{[['Flat Fee',fmtM(p.flat_fee)+'/mo'],['Slot Rate',fmtM(p.slot_rate)+'/slot'],[
<div key={l}><div style={{fontSize:10,color:'var(--tx3)',textTransform:'upper
))}
</div>
<div style={{marginTop:8,paddingTop:8,borderTop:'1px solid var(--bd)',display:'fl
<span style={{fontSize:12,color:'var(--tx2)'}}>Monthly Total</span>
<span style={{fontFamily:'JetBrains Mono',fontSize:15,fontWeight:700,color:'var
</div>
</div>);
})}
</div>
</Modal>
<div className="mft"><button className="btn bac" onClick={()=>{onClose();setTimeout(()=
);
}
function ContractEditModal({form,setForm,clients,locations,isNew,onClose,onSave,saving}){
const s=(k,v)=>setForm(f=>({...f,[k]:v}));
return(
<div className="ov" onClick={onClose}>
<div className="mdl wide" onClick={e=>e.stopPropagation()}>
<div className="mhd"><span>{isNew?'New Dry Storage Contract':'Edit Contract'}</span><
<div className="mbd">
<div className="fgrid">
<div className="fg"><label>Client *</label><select value={form.client_id||''} onC
<div className="fg"><label>Reference No.</label><input value={form.ref_no||''} on
<div className="fg"><label>Location</label><select value={form.location_id||''} o
<div className="fg"><label>Escalation Type</label><select value={form.escalation_
<div className="fg"><label>Contract Start *</label><input type="date" value={form
<div className="fg"><label>Contract End *</label><input type="date" value={form.e
{(form.escalation_type||'fixed_pct')==='fixed_pct'&&<div className="fg"><label>An
<div className="fg s2"><label>Notes</label><textarea value={form.notes||''} onCha
</div>
<div className="info-box"><strong>Billing Formula:</strong> Monthly Bill = Flat Fee
<EscalationEditor periods={form.periods||[]} onChange={p=>s('periods',p)}/>
<div className="mft"><button className="btn bgh" onClick={onClose}>Cancel</button><
</div>
</div>
</div>
);
}
function ContractCard({contract,clientMap,locationMap,curYM,td,onView,onEdit,onDelete}){
const isActive=contract.start_date<=td&&contract.end_date>=td;
const [curBill,setCurBill]=useState(null);
useEffect(()=>{if(isActive) db.computeDryMonthBill(contract.client_id,curYM).then(setCurBil
return(
<div className={`ctr-card ${isActive?'act-ctr':''}`}>
<div className="ctr-hd">
<div><div className="ctr-client">{clientMap[contract.client_id]||'—'}</div><div class
<ContractStatusBadge contract={contract}/>
</div>
<div className="ctr-body">
{[['Location',locationMap[contract.location_id]||'—'],['Period',`${fmtD(contract.star
<div key={l} className="ctr-row"><span className="ctr-label">{l}</span><span classN
))}
{curBill&&<div style={{marginTop:12,background:'var(--sur3)',borderRadius:'var(--r)',
<div style={{fontSize:10,fontWeight:700,color:'var(--tx3)',letterSpacing:'.06em',te
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div style={{fontSize:12,color:'var(--tx2)'}}>{fmtM(curBill.flat_fee)} flat + {cu
<div style={{fontFamily:'JetBrains Mono',fontSize:16,fontWeight:700,color:'var(--
</div>
<div style={{fontSize:11,color:'var(--tx3)',marginTop:3}}>{curBill.period?.label}</
</div>}
</div>
<div className="ctr-foot">
<button className="btn bgh" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>onV
<button className="btn bgh" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>onE
<button className="ib dl" onClick={()=>onDelete(contract)}> </button>
</div>
</div>
);
}
function Contracts({clients,locations}){
const [contracts,setContracts]=useState([]);const [loading,setLoading]=useState(true);
const [modal,setModal]=useState(null);const [fc,setFc]=useState('');const [fs,setFs]=useSta
const blank={client_id:'',ref_no:'',location_id:'',start_date:'',end_date:'',escalation_typ
const [form,setForm]=useState(blank);const [saving,setSaving]=useState(false);
const clientMap=Object.fromEntries(clients.map(c=>[c.id,c.name]));
const locationMap=Object.fromEntries(locations.map(l=>[l.id,l.name]));
const td=today(),curYM=today().slice(0,7);
const reload=useCallback(async()=>{setLoading(true);setContracts(await db.getContracts());s
useEffect(()=>{reload();},[reload]);
const openNew=()=>{setForm(blank);setModal('new');};
const openEdit=c=>{setForm({...c,periods:(c.periods||[]).map(p=>({...p,start:p.start_date||
const openView=c=>{setForm({...c});setModal('view');};
const save=async()=>{
if(!form.client_id) return alert('Please select a client.');
if(!form.start_date||!form.end_date) return alert('Start and end dates required.');
if(form.start_date>form.end_date) return alert('Start date must be before end date.');
if(!form.periods?.length) return alert('Please add at least one contract period.');
setSaving(true);
try{await db.saveContract({...form,escalation_pct:parseFloat(form.escalation_pct)||0,id:f
catch(e){alert('Save failed: '+e.message);}
setSaving(false);
};
const del=async c=>{if(!window.confirm(`Delete contract ${c.ref_no}?`)) return;await const displayed=contracts.filter(c=>{
if(fc&&c.client_id!==fc) return false;
if(fs==='active'&&!(c.start_date<=td&&c.end_date>=td)) return false;
if(fs==='expired'&&c.end_date>=td) return false;
if(fs==='future'&&c.start_date<=td) return false;
return true;
db.del
});
const [activeSummary,setActiveSummary]=useState([]);
useEffect(()=>{
const active=contracts.filter(c=>c.start_date<=td&&c.end_date>=td);
Promise.all(active.map(async c=>{const b=await db.computeDryMonthBill(c.client_id,curYM);
},[contracts]);
const totalMonthly=activeSummary.reduce((s,x)=>s+(x.b?.total||0),0);
return(
<div className="con">
<div className="ph"><div className="phi or"> </div><h2>Dry Storage Contracts</h2><butt
{modal==='view'&&<ContractViewModal contract={form} clientMap={clientMap} locationMap={
{(modal==='new'||modal==='edit')&&<ContractEditModal form={form} setForm={setForm} clie
{activeSummary.length>0&&(
<div style={{background:'var(--sur)',border:'1px solid var(--bd)',borderRadius:'var(-
<div><div style={{fontSize:11,fontWeight:700,color:'var(--tx3)',letterSpacing:'.06e
<div style={{width:1,height:40,background:'var(--bd)',flexShrink:0}}/>
{activeSummary.map(({c,b})=>(
<div key={c.id}><div style={{fontSize:11,color:'var(--tx2)',marginBottom:3}}>{cli
))}
</div>
)}
<div className="fbar" style={{marginBottom:20}}>
<select value={fs} onChange={e=>setFs(e.target.value)}><option value="all">All</optio
<select value={fc} onChange={e=>setFc(e.target.value)}><option value="">All Clients</
<span style={{fontSize:13,color:'var(--tx2)',alignSelf:'center',fontFamily:'JetBrains
</div>
{loading?<Spinner/>:displayed.length===0?<div style={{textAlign:'center',color:'var(--t
<div className="ctr-grid">{displayed.map(c=><ContractCard key={c.id} contract={c} cli
</div>
);
}
// ── SPARE PARTS ──────────────────────────────────────────────────
function StockBar({current,min}){
const pct=min>0?Math.min(100,Math.round((current/min)*100)):100;
const color=current===0?'var(--rd)':current<=min?'var(--or)':'var(--ac)';
return <div className="sp-stock-bar"><div className="sp-stock-bar-fill" style={{width:pct+'
}
function PartCard({part,machines,onEdit,onIssue,onReceive}){
const cls=part.current_stock===0?'alert':part.current_stock<=part.min_stock?'warn':'';
const nc=part.current_stock===0?'low':part.current_stock<=part.min_stock?'warn':'ok';
const linked=(machines||[]).filter(m=>(part.machine_ids||[]).includes(m.id));
return(
<div className={`sp-card ${cls}`}>
<div className="sp-card-hd">
<div><div className="sp-card-name">{part.name}</div><div className="sp-card-pn">{part
<span className={`bdg ${cls==='alert'?'b-out':cls==='warn'?'b-per':'b-on'}`}>{cls==='
</div>
<div className="sp-card-body">
<div className="sp-stock-row">
<div><div className={`sp-stock-num ${nc}`}>{part.current_stock} <span style={{fontS
<div style={{textAlign:'right'}}><div style={{fontFamily:'JetBrains Mono',fontSize:
</div>
<StockBar current={part.current_stock} min={part.min_stock}/>
<div className="sp-meta">{part.category&&<span> {part.category}</span>}{part.locati
{linked.length>0&&<div style={{display:'flex',gap:5,flexWrap:'wrap'}}>{linked.map(m=>
</div>
<div className="sp-card-foot">
<button className="btn bgh" style={{fontSize:11,padding:'5px 10px'}} onClick={()=>onR
<button className="btn bgh" style={{fontSize:11,padding:'5px 10px'}} onClick={()=>onI
<button className="ib" onClick={()=>onEdit(part)}> </button>
</div>
</div>
);
}
function SpMovementModal({part,type,user,machines,onClose,onSaved}){
const isIssue=type==='issue',isAdjust=type==='adjust';
const [qty,setQty]=useState('');const [machineId,setMachineId]=useState('');
const [notes,setNotes]=useState('');const [refNo,setRefNo]=useState('');const [saving,setSa
const submit=async()=>{
const q=parseFloat(qty);
if(!q||q<=0) return alert('Enter a valid quantity.');
if(isIssue&&!machineId) return alert('Please select the machine.');
if(isIssue&&q>part.current_stock) return alert(`Only ${part.current_stock} ${part.unit} i
setSaving(true);
await db.saveMovement({type,part_id:part.id,part_name:part.name,machine_id:machineId||nul
onSaved();onClose();
};
const label=isIssue?'Issue Out':type==='receive'?'Receive Stock':isAdjust?'Adjust Stock':'R
return(
<Modal title={`${label} — ${part.name}`} onClose={onClose}>
<div style={{background:'var(--sur2)',borderRadius:'var(--r)',padding:'10px 14px',margi
Current Stock: <strong style={{fontFamily:'JetBrains Mono',color:part.current_stock==
{isAdjust&&<span style={{color:'var(--tx2)',marginLeft:8}}>— enter the new total stoc
</div>
<div className="fgrid">
<div className="fg s2"><label>{isAdjust?'New Stock Level':'Quantity'} ({part.unit}) *
{isIssue&&<div className="fg s2"><label>Machine / Equipment *</label><select value={m
<div className="fg"><label>Reference No.</label><input value={refNo} onChange={e=>set
<div className="fg"><label>Notes</label><input value={notes} onChange={e=>setNotes(e.
</div>
<div className="mft"><button className="btn bgh" onClick={onClose}>Cancel</button><butt
</Modal>
);
}
function SpPartModal({part,machines,onClose,onSaved}){
const blank={name:'',part_no:'',unit:'pcs',category:'',min_stock:1,current_stock:0,supplier
const [form,setForm]=useState(part?{...part,machine_ids:[...(part.machine_ids||[])]}:blank)
const [saving,setSaving]=useState(false);
const s=(k,v)=>setForm(f=>({...f,[k]:v}));
const toggleM=id=>setForm(f=>({...f,machine_ids:f.machine_ids.includes(id)?f.machine_ids.fi
const CATS=['Belts','Filters','Motors','Bearings','Refrigerants','Lubricants','Electrical',
const save=async()=>{
if(!form.name?.trim()||!form.part_no?.trim()) return alert('Name and part number required
setSaving(true);
await db.savePart({...form,id:form.id||'PRT'+uid(),min_stock:parseFloat(form.min_stock)||
onSaved();onClose();
};
return(
<div className="ov" onClick={onClose}>
<div className="mdl wide" onClick={e=>e.stopPropagation()}>
<div className="mhd"><span>{part?'Edit Part':'New Part'}</span><button onClick={onClo
<div className="mbd">
<div className="fgrid">
<div className="fg s2"><label>Part Name *</label><input value={form.name} onChang
<div className="fg"><label>Part Number *</label><input value={form.part_no} onCha
<div className="fg"><label>Category</label><select value={form.category} onChange
<div className="fg"><label>Unit</label><input value={form.unit} onChange={e=>s('u
<div className="fg"><label>Min Stock Level</label><input type="number" step="0.01
{!part&&<div className="fg"><label>Opening Stock</label><input type="number" step
<div className="fg"><label>Unit Cost (₱)</label><input type="number" step="0.01"
<div className="fg"><label>Supplier</label><input value={form.supplier} onChange=
<div className="fg s2"><label>Storage Location</label><input value={form.location
<div className="fg s2"><label>Notes</label><textarea value={form.notes} onChange=
</div>
<div style={{marginBottom:16}}>
<label style={{fontSize:12,fontWeight:700,color:'var(--tx2)',letterSpacing:'.05em
<div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{(machines||[]).map(m=><butto
</div>
<div className="mft"><button className="btn bgh" onClick={onClose}>Cancel</button><
</div>
</div>
</div>
);
}
function SpMachineModal({machine,onClose,onSaved}){
const blank={name:'',type:'',location:'',asset_tag:'',status:'active',notes:''};
const [form,setForm]=useState(machine||blank);const [saving,setSaving]=useState(false);
const s=(k,v)=>setForm(f=>({...f,[k]:v}));
const TYPES=['Refrigeration','Compressor','Material Handling','Conveyor','Processing','Elec
const save=async()=>{if(!form.name?.trim()) return alert('Machine name is required.');setSa
return(
<Modal title={machine?'Edit Machine':'New Machine'} onClose={onClose}>
<div className="fgrid">
<div className="fg s2"><label>Machine Name *</label><input value={form.name} onChange
<div className="fg"><label>Type</label><select value={form.type} onChange={e=>s('type
<div className="fg"><label>Asset Tag</label><input value={form.asset_tag} onChange={e
<div className="fg"><label>Location</label><input value={form.location} onChange={e=>
<div className="fg"><label>Status</label><select value={form.status} onChange={e=>s('
<div className="fg s2"><label>Notes</label><textarea value={form.notes} onChange={e=>
</div>
<div className="mft"><button className="btn bgh" onClick={onClose}>Cancel</button><butt
</Modal>
);
}
function SpareParts({user}){
const [tab,setTab]=useState('inventory');
const [parts,setParts]=useState([]);const [machines,setMachines]=useState([]);
const [movements,setMovements]=useState([]);const [prs,setPRs]=useState([]);
const [dash,setDash]=useState({low:[],warn:[],ok:[],openPRs:[],totalValue:0});
const [loading,setLoading]=useState(true);
const [modal,setModal]=useState(null);const [search,setSearch]=useState('');const [catFilte
const reload=useCallback(async()=>{
setLoading(true);
const [p,m,mv,pr,d]=await Promise.all([db.getParts(),db.getMachines(),db.getMovements(),d
setParts(p);setMachines(m);setMovements(mv);setPRs(pr);setDash(d);setLoading(false);
},[]);
useEffect(()=>{reload();},[reload]);
const fp=parts.filter(p=>{const q=search.toLowerCase();if(q&&!p.name.toLowerCase().includes
const cats=[...new Set(parts.map(p=>p.category).filter(Boolean))].sort();
const prC={urgent:'var(--rd)',high:'var(--or)',normal:'var(--bl)'};
const receivePR=async pr=>{
await db.saveMovement({type:'receive',part_id:pr.part_id,part_name:pr.part_name,qty:pr.qt
await db.savePR({...pr,status:'received'});await reload();
};
return(
<div className="con">
{modal?.type==='part'&&<SpPartModal part={modal.data} machines={machines} onClose={()=>
{modal?.type==='machine'&&<SpMachineModal machine={modal.data} onClose={()=>setModal(nu
{(modal?.type==='issue'||modal?.type==='receive'||modal?.type==='adjust'||modal?.type==
<SpMovementModal part={modal.data} type={modal.type} user={user} machines={machines}
<div className="ph"><div className="phi gr"> </div><h2>Spare Parts</h2></div>
{(dash.low.length>0||dash.warn.length>0)&&(
<div className="sp-alert-bar">
{dash.low.length>0&&<span><strong>{dash.low.length}</strong> part{dash.low.length!=
{dash.warn.length>0&&<span><strong>{dash.warn.length}</strong> part{dash.warn.lengt
{dash.openPRs.length>0&&<span>· <strong>{dash.openPRs.length}</strong> open purchas
<span style={{marginLeft:'auto',color:'var(--rd)',fontSize:12}}>Inventory value: {f
</div>
)}
<div className="sp-tabs">{[['inventory',' Inventory'],['movements',' Movements'],[
{loading&&<Spinner/>}
{!loading&&tab==='inventory'&&<>
<div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:1
<input value={search} onChange={e=>setSearch(e.target.value)} placeholder=" Searc
<select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{paddin
<button className="btn bac mla" onClick={()=>setModal({type:'part',data:null})}>+ A
</div>
<div className="sp-cards">{fp.map(p=><PartCard key={p.id} part={p} machines={machines
</>}
{!loading&&tab==='movements'&&<>
<div style={{display:'flex',gap:10,alignItems:'center',marginBottom:16,flexWrap:'wrap
<span style={{fontSize:13,color:'var(--tx2)',fontFamily:'JetBrains Mono'}}>{movemen
{parts.length>0&&<div style={{display:'flex',gap:6,marginLeft:'auto'}}>{[['receive'
</div>
<div className="tw"><table>
<thead><tr><th>Date</th><th>Part</th><th>Type</th><th>Machine</th><th>Qty</th><th>R
<tbody>
{movements.length===0&&<tr className="erow"><td colSpan={7}>No movements recorded
{movements.map(m=>(
<tr key={m.id}>
<td style={{fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{fmt
<td style={{fontWeight:600}}>{m.part_name}</td>
<td><span className={`bdg ${m.type==='receive'||m.type==='return'?'b-in':m.ty
<td style={{color:'var(--tx2)',fontSize:12}}>{m.machine_name||'—'}</td>
<td style={{fontFamily:'JetBrains Mono',fontSize:13,fontWeight:600,color:m.ty
<td style={{color:'var(--tx2)'}}>{m.ref_no||'—'}</td>
<td style={{color:'var(--tx2)',fontSize:12}}>{m.encoded_by}</td>
</tr>
))}
</tbody>
</table></div>
</>}
{!loading&&tab==='purchase'&&<>
<div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
<select onChange={async e=>{const p=parts.find(x=>x.id===e.target.value);if(!p)retu
style={{padding:'8px 12px',background:'var(--sur3)',border:'1px solid var(--bd)',
</div>
{prs.length===0&&<div style={{color:'var(--tx3)',fontSize:13,padding:'24px 0'}}>No pu
{prs.map(pr=>(
<div key={pr.id} className={`pr-card ${pr.priority==='urgent'?'urgent':''}`}>
<div>
<div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{pr.part_name}</div>
<div style={{display:'flex',gap:12,flexWrap:'wrap',fontSize:12,color:'var(--tx2
<span>Qty: <strong style={{fontFamily:'JetBrains Mono',color:'var(--tx)'}}>{p
<span>Unit: <strong style={{fontFamily:'JetBrains Mono',color:'var(--tx)'}}>{
<span>Total: <strong style={{fontFamily:'JetBrains Mono',color:'var(--or)'}}>
{pr.supplier&&<span>Supplier: {pr.supplier}</span>}
</div>
<div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
<span className={`bdg ${pr.status==='open'?'b-pr-open':pr.status==='ordered'?
<span className="bdg" style={{background:pr.priority==='urgent'?'var(--rdd)':
<span style={{fontSize:11,color:'var(--tx3)'}}>By {pr.requested_by} · {fmtD((
</div>
{pr.notes&&<div style={{fontSize:12,color:'var(--tx2)',marginTop:6}}> {pr.not
</div>
<div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
{pr.status==='open'&&<button className="btn bgh" style={{fontSize:11,padding:'5
{pr.status==='ordered'&&<button className="btn bac" style={{fontSize:11,padding
<button className="ib dl" onClick={async()=>{if(window.confirm('Delete?')){awai
</div>
</div>
))}
</>}
{!loading&&tab==='machines'&&<>
<div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}><button class
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))'
{machines.map(m=>{
const linked=parts.filter(p=>(p.machine_ids||[]).includes(m.id));
const low=linked.filter(p=>p.current_stock<=p.min_stock);
return(
<div key={m.id} className="mach-card" style={{border:`1px solid ${low.length>0?
<div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-bet
<div><div className="mach-card-name">{m.name}</div><div style={{fontSize:11
<span className={`bdg ${m.status==='active'?'b-on':m.status==='maintenance'
</div>
<div style={{fontSize:12,color:'var(--tx2)',marginBottom:8}}>{m.type&&<span>
{linked.length>0&&<div><div style={{fontSize:10,fontWeight:700,color:'var(--t
<div style={{display:'flex',gap:5,flexWrap:'wrap'}}>{linked.map(p=><span ke
</div>}
{m.notes&&<div style={{marginTop:8,fontSize:11,color:'var(--tx3)'}}> <div style={{marginTop:10,display:'flex',gap:6,justifyContent:'flex-end'}}>
<button className="ib" onClick={()=>setModal({type:'machine',data:m})}> </
<button className="ib dl" onClick={async()=>{if(window.confirm(`Delete "${m
</div>
</div>
{m.not
);
})}
</div>
</>}
</div>
);
}
// ── SETTINGS ─────────────────────────────────────────────────────
function AppSettings({currentUser}){
const [tab,setTab]=useState('rates');
const [rates,setR]=useState(null);const [users,setUsers]=useState([]);const [locs,setLocs]=
const [modal,setModal]=useState(null);const [uForm,setUF]=useState({});const [lForm,setLF]=
const [saving,setSaving]=useState(false);const [rateSaved,setRS]=useState(false);
const su=(k,v)=>setUF(f=>({...f,[k]:v}));const sl=(k,v)=>setLF(f=>({...f,[k]:v}));
const reloadAll=useCallback(async()=>{const [r,u,l]=await Promise.all([db.getRates(),db.get
useEffect(()=>{reloadAll();},[reloadAll]);
const saveRates=async()=>{setSaving(true);await db.saveRates(rates);setSaving(false);setRS(
const saveU=async()=>{
if(!uForm.name?.trim()||!uForm.username?.trim()) return alert('Name and username required
if(modal==='nu'&&!uForm.password) return alert('Password required for new user.');
if(users.find(u=>u.username===uForm.username&&u.id!==uForm.id)) return alert('Username al
setSaving(true);const t={...uForm,id:uForm.id||'USR'+uid()};if(!uForm.password&&modal==='
await db.saveUser(t);await reloadAll();setSaving(false);setModal(null);
};
const delU=async u=>{if(u.id===currentUser.id) return alert('Cannot delete your own account
const saveL=async()=>{
if(!lForm.name?.trim()) return alert('Location name required.');
if(locs.find(l=>l.name.toLowerCase()===lForm.name.trim().toLowerCase()&&l.id!==lForm.id))
setSaving(true);await db.saveLocation({...lForm,name:lForm.name.trim(),id:lForm.id||'LOC'
};
const delL=async l=>{if(!window.confirm(`Delete "${l.name}"?`)) return;await db.deleteLocat
return(
<div className="con">
<div className="ph"><div className="phi or"> </div><h2>Settings</h2></div>
<div className="tbar">
<button className={`tab ${tab==='rates'?'on':''}`} onClick={()=>setTab('rates')}>Rate
<button className={`tab ${tab==='locations'?'on':''}`} onClick={()=>setTab('locations
<button className={`tab ${tab==='users'?'on':''}`} onClick={()=>setTab('users')}>User
<button className={`tab ${tab==='qbo'?'on':''}`} onClick={()=>setTab('qbo')}>QuickBoo
</div>
{tab==='rates'&&(rates?<div className="sbox">
<p className="hint">These rates apply globally to all cold/chilled billing computatio
{rateSaved&&<div className="ok-bar">✓ Rates saved!</div>}
<div className="fgrid">
{[['storage_per_kg_per_day','Storage Fee (₱/kg/day)'],['handling_in_per_kg','Handli
<div key={k} className="fg"><label>{l}</label><input type="number" step="0.01" mi
))}
</div>
<button className="btn bac" onClick={saveRates} disabled={saving}>{saving?'Saving…':'
</div>:<Spinner/>)}
{tab==='locations'&&<div className="sbox">
{(modal==='nl'||modal==='el')&&<Modal title={modal==='nl'?'New Location':'Edit <div className="fgrid">
<div className="fg s2"><label>Location Name *</label><input value={lForm.name||''
<div className="fg s2"><label>Description</label><input value={lForm.description|
</div>
<div className="mft"><button className="btn bgh" onClick={()=>setModal(null)}>Cance
</Modal>}
<p className="hint">Storage locations appear in Stock In/Out forms and on the invento
<div style={{marginBottom:16}}><button className="btn bac" onClick={()=>{setLF({name:
<div className="tw"><table><thead><tr><th>Name</th><th>Description</th><th></th></tr>
<tbody>{locs.length===0?<tr className="erow"><td colSpan={3}>No locations yet.</td>
<tr key={l.id}><td><span className="bdg b-loc"> {l.name}</span></td><td style={
<td><div style={{display:'flex',gap:4,justifyContent:'flex-end'}}><button classNa
))}</tbody>
</table></div>
</div>}
Locati
{tab==='qbo'&&<div className="sbox">
<p className="hint">Connect FKC Logistics to QuickBooks Online to push invoices direc
<div style={{background:'var(--sur2)',border:'1px solid var(--bd)',borderRadius:'var(
<div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
<div style={{width:44,height:44,background:'#2CA01C',borderRadius:10,display:'fle
<div><div style={{fontFamily:'Syne',fontWeight:700,fontSize:15}}>QuickBooks Onlin
<a href="/.netlify/functions/qbo-auth" className="btn bac mla" style={{background
</div>
</div>
<div className="info-box">
<strong>How it works:</strong><br/>
1. Click Connect QuickBooks and authorize FKC Logistics<br/>
2. Go to Billing → generate a billing statement<br/>
3. Click "Push to QuickBooks" — the invoice is created instantly in QBO<br/>
4. FKC clients are automatically matched or created as QBO customers
</div>
</div>}
{tab==='qbo'&&<div className="sbox">
<p className="hint">Connect FKC Logistics to QuickBooks Online to push invoices direc
<div style={{background:'var(--sur2)',border:'1px solid var(--bd)',borderRadius:'var(
<div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
<div style={{width:44,height:44,background:'#2CA01C',borderRadius:10,display:'fle
<div><div style={{fontFamily:'Syne',fontWeight:700,fontSize:15}}>QuickBooks Onlin
<a href="/.netlify/functions/qbo-auth" className="btn bac mla" style={{background
</div>
</div>
<div className="info-box">
<strong>How it works:</strong><br/>
1. Tap Connect QuickBooks and authorize FKC Logistics in your QBO account<br/>
2. Go to Billing and generate a billing statement for any client<br/>
3. Tap the green Push to QuickBooks button<br/>
4. Invoice appears instantly in your QBO — line items for storage, handling, </div>
</div>}
{tab==='users'&&<div className="sbox">
{(modal==='nu'||modal==='eu')&&<Modal title={modal==='nu'?'New User':'Edit User'} onC
<div className="fgrid">
<div className="fg"><label>Full Name *</label><input value={uForm.name||''} onCha
<div className="fg"><label>Username *</label><input value={uForm.username||''} on
<div className="fg"><label>Password {modal==='eu'?'(blank=keep)':'*'}</label><inp
<div className="fg"><label>Role</label><select value={uForm.role||'personnel'} on
<div className="fg"><label>Status</label><select value={String(uForm.active??true
</div>
<div className="mft"><button className="btn bgh" onClick={()=>setModal(null)}>Cance
</Modal>}
<div style={{marginBottom:16}}><button className="btn bac" onClick={()=>{setUF({name:
<div className="tw"><table><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>
and dr
<tbody>{users.map(u=>(
<tr key={u.id}><td><strong>{u.name}</strong></td><td style={{fontFamily:'JetBrain
<td><span className={`bdg ${u.role==='admin'?'b-adm':'b-per'}`}>{u.role}</span></
<td><span className={`bdg ${u.active?'b-on':'b-off'}`}>{u.active?'Active':'Inacti
<td><div style={{display:'flex',gap:4,justifyContent:'flex-end'}}><button classNa
))}</tbody>
</table></div>
</div>}
</div>
);
}
// ── ROOT APP ──────────────────────────────────────────────────────
export default function App(){
const [user,setUser]=useState(null);const [page,setPage]=useState('dashboard');
const [sideOpen,setSide]=useState(false);
const [clients,setClients]=useState([]);const [locations,setLocs]=useState([]);
const [rk,setRk]=useState(0);
const [lu,setLu]=useState('');const [lp,setLp]=useState('');const [le,setLe]=useState('');
const [sp,setSp]=useState(false);const [ll,setLL]=useState(false);
const reload=useCallback(async()=>{
const [c,l]=await Promise.all([db.getClients(),db.getLocations()]);
setClients(c);setLocs(l);
},[]);
useEffect(()=>{reload();},[reload]);
const onSaved=useCallback(()=>{setRk(k=>k+1);reload();},[reload]);
const doLogin=async()=>{setLL(true);setLe('');const u=await db.login(lu,lp);setLL(false);if
const doLogout=()=>{setUser(null);setLu('');setLp('');setLe('');};
const ALL_NAV=[
{section:'Operations'},
{id:'dashboard', label:'Dashboard', icon:' ',roles:['admin','personnel']},
{id:'stock-in', label:'Stock In', icon:' ',roles:['admin','personnel']},
{id:'stock-out', label:'Stock Out', icon:' ',roles:['admin','personnel']},
{id:'transactions',label:'Transactions', icon:' ',roles:['admin','personnel']},
{section:'Management'},
{id:'contracts', label:'Dry Contracts', icon:' ',roles:['admin']},
{id:'items', label:'Item Database', icon:' ',roles:['admin']},
{id:'clients', label:'Clients', icon:' ',roles:['admin']},
{id:'billing', label:'Billing', icon:' ',roles:['admin']},
{section:'Maintenance'},
{id:'spareparts', label:'Spare Parts', icon:' ',roles:['admin','personnel']},
{section:'System'},
{id:'settings', label:'Settings', icon:' ',roles:['admin']},
];
const nav=user?ALL_NAV.filter(n=>n.section||(n.roles&&n.roles.includes(user.role))):[];
const goTo=id=>{setPage(id);setSide(false);if(['clients','items','settings','contracts'].in
if(!user) return(
<div className="lw">
<div className="lc">
<div className="lbrand">
<div className="lbrand-icon"><img src={FKC_LOGO} alt="FKC" style={{width:38,height:
<span className="lbrand-name">FKC Logistics</span>
</div>
<p className="lsub">Cold Storage Management System</p>
{le&&<div className="err-bar">{le}</div>}
<div className="fgrp"><label className="fl">Username</label><input className="fi" val
<div className="fgrp"><label className="fl">Password</label>
<div className="pww"><input className="fi" type={sp?'text':'password'} value={lp} o
<button className="pwt" onClick={()=>setSp(p=>!p)}>{sp?' ':' '}</button></div>
</div>
<button className="lbtn" onClick={doLogin} disabled={ll}>{ll?'Signing in…':'Sign In →
</div>
</div>
);
const renderPage=()=>{
switch(page){
case 'dashboard': return <Dashboard clients={clients} locations={locations} refre
case 'stock-in': return <StockForm type="IN" user={user} clients={clients} loca
case 'stock-out': return <StockForm type="OUT" user={user} clients={clients} loca
case 'transactions': return <TransactionLog clients={clients} locations={locations} ref
case 'contracts': return <Contracts clients={clients} locations={locations}/>;
case 'items': return <ItemDatabase clients={clients}/>;
case 'clients': return <Clients/>;
case 'billing': return <Billing clients={clients}/>;
case 'spareparts': return <SpareParts user={user}/>;
case 'settings': return <AppSettings currentUser={user}/>;
default: return <Dashboard clients={clients} locations={locations} refre
}
};
return(
<div className="shell">
{sideOpen&&<div className="bkd" onClick={()=>setSide(false)}/>}
<aside className={`sidebar ${sideOpen?'open':''}`}>
<div className="sbrand">
<div className="sbrand-icon"><img src={FKC_LOGO} alt="FKC" style={{width:28,height:
<span className="sbrand-name">FKC Logistics</span>
</div>
<nav className="snav">{nav.map((n,i)=>n.section?<div key={i} className="nsec">{n.sect
<div className="sfoot">
<div className="urow"><div className="uav">{user.name[0]}</div><div><div className=
<button className="lobtn" onClick={doLogout}>Sign Out</button>
</div>
</aside>
<main className="main">
<div className="topbar"><button className="hbg" onClick={()=>setSide(s=>!s)}>☰</butto
{renderPage()}
</main>
</div>
);
}
