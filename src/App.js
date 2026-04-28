import { useState, useEffect, useCallback, useRef } from "react";
import * as db from "./db";

const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&family=Mulish:wght@400;500;600;700&display=swap";
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
             radial-gradient(ellipse at 80% 20%,rgba(88,166,255,.06) 0%,transparent 50%),var(--bg)}
.lc{width:380px;background:var(--sur);border:1px solid var(--bd);border-radius:16px;padding:40px 36px;box-shadow:var(--sh)}
.lbrand{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.lbrand-icon{width:44px;height:44px;background:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:3px;flex-shrink:0}
.lbrand-name{font-family:'Syne',sans-serif;font-size:22px;font-weight:800}
.lsub{font-size:13px;color:var(--tx2);margin-bottom:32px}
.fl{font-size:12px;font-weight:700;color:var(--tx2);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;display:block}
.fi{width:100%;padding:10px 14px;background:var(--sur3);border:1px solid var(--bd);border-radius:var(--r);color:var(--tx);font-size:14px;outline:none;transition:border .15s}
.fi:focus{border-color:var(--ac)}
.fgrp{margin-bottom:16px}
.pww{position:relative}.pww .fi{padding-right:40px}
.pwt{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--tx2);font-size:16px;padding:0}
.lbtn{width:100%;margin-top:8px;padding:12px;background:var(--ac);color:#0d1117;border:none;border-radius:var(--r);font-size:14px;font-weight:800;letter-spacing:.04em;font-family:'Syne',sans-serif;transition:background .15s}
.lbtn:hover{background:var(--ac2)}.lbtn:disabled{opacity:.6}
.err-bar{background:var(--rdd);border:1px solid var(--rd);color:var(--rd);border-radius:var(--r);padding:10px 14px;font-size:13px;margin-bottom:16px}
.ok-bar{background:var(--acd);border:1px solid var(--ac);color:var(--ac);border-radius:var(--r);padding:10px 14px;font-size:13px;margin-bottom:16px}
.shell{display:flex;min-height:100vh}
.sidebar{width:var(--sb);background:var(--sur);border-right:1px solid var(--bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:50;transition:transform .25s}
.sbrand{display:flex;align-items:center;gap:9px;padding:20px 16px 16px;border-bottom:1px solid var(--bd)}
.sbrand-icon{width:32px;height:32px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:2px;flex-shrink:0}
.sbrand-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:800}
.snav{flex:1;padding:10px 8px;overflow-y:auto;display:flex;flex-direction:column;gap:1px}
.nsec{font-size:10px;font-weight:800;color:var(--tx3);letter-spacing:.1em;text-transform:uppercase;padding:12px 12px 4px}
.nb{display:flex;align-items:center;gap:10px;padding:9px 12px;border:none;background:none;border-radius:var(--r);color:var(--tx2);font-size:13.5px;font-weight:600;width:100%;text-align:left;transition:all .15s}
.nb:hover{background:var(--sur3);color:var(--tx)}.nb.on{background:var(--acd);color:var(--ac)}
.sfoot{padding:12px;border-top:1px solid var(--bd)}
.urow{display:flex;align-items:center;gap:9px;margin-bottom:8px}
.uav{width:32px;height:32px;background:var(--acd);border:1px solid rgba(0,212,170,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:13px;color:var(--ac);flex-shrink:0}
.uname{font-size:13px;font-weight:700}.urole{font-size:11px;color:var(--tx2);text-transform:capitalize}
.lobtn{width:100%;padding:8px;background:var(--sur3);border:1px solid var(--bd);border-radius:var(--r);color:var(--tx2);font-size:12px;font-weight:700;transition:all .15s}
.lobtn:hover{border-color:var(--rd);color:var(--rd);background:var(--rdd)}
.main{margin-left:var(--sb);flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{display:none;padding:14px 18px;background:var(--sur);border-bottom:1px solid var(--bd);align-items:center;gap:12px;position:sticky;top:0;z-index:40}
.hbg{background:none;border:none;color:var(--tx2);font-size:20px;line-height:1}
.ttl{font-family:'Syne',sans-serif;font-weight:700;font-size:15px}
.bkd{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:49}
.con{padding:28px 32px;max-width:1160px}
.ph{display:flex;align-items:center;gap:12px;margin-bottom:24px;flex-wrap:wrap}
.ph h2{font-family:'Syne',sans-serif;font-size:22px;font-weight:800}
.phi{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.phi.teal{background:var(--acd);border:1px solid rgba(0,212,170,.25)}
.phi.red{background:var(--rdd);border:1px solid rgba(248,81,73,.25)}
.phi.or{background:var(--ord);border:1px solid rgba(227,179,65,.25)}
.phi.bl{background:var(--bld);border:1px solid rgba(88,166,255,.25)}
.phi.pu{background:var(--pud);border:1px solid rgba(188,140,255,.25)}
.phi.gr{background:var(--grd);border:1px solid rgba(63,185,80,.25)}
.mla{margin-left:auto}
.sgrid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:24px}
.sc{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:15px 17px;display:flex;align-items:center;gap:12px}
.sico{font-size:20px}.sval{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:500;line-height:1.2}
.slbl{font-size:10px;color:var(--tx2);font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin-top:3px}
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:var(--r);font-size:13px;font-weight:700;border:none;transition:all .15s;white-space:nowrap}
.bac{background:var(--ac);color:#0d1117}.bac:hover{background:var(--ac2)}
.brd{background:var(--rdd);color:var(--rd);border:1px solid rgba(248,81,73,.3)}.brd:hover{background:var(--rd);color:#fff}
.bgh{background:var(--sur3);color:var(--tx2);border:1px solid var(--bd)}.bgh:hover{border-color:var(--bd2);color:var(--tx)}
.btn:disabled{opacity:.5;cursor:not-allowed}
.ib{background:none;border:none;color:var(--tx2);padding:5px;border-radius:6px;font-size:15px;display:inline-flex;transition:all .15s}
.ib:hover{background:var(--sur3);color:var(--tx)}.ib.dl:hover{background:var(--rdd);color:var(--rd)}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:22px}
.fg{display:flex;flex-direction:column;gap:7px}.fg.s2{grid-column:span 2}
.fg label{font-size:12px;font-weight:700;color:var(--tx2);letter-spacing:.05em;text-transform:uppercase}
.fg input,.fg select,.fg textarea{padding:10px 13px;background:var(--sur3);border:1px solid var(--bd);border-radius:var(--r);color:var(--tx);font-size:14px;outline:none;transition:border .15s;resize:vertical}
.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--ac)}
.fg select option{background:var(--sur3)}.fg input:disabled,.fg select:disabled{opacity:.45;cursor:not-allowed}
.iselr{display:flex}.iselr select{flex:1;border-radius:var(--r) 0 0 var(--r) !important}
.iselt{padding:0 12px;background:var(--sur2);border:1px solid var(--bd);border-left:none;border-radius:0 var(--r) var(--r) 0;display:flex;align-items:center;font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--tx2);white-space:nowrap}
.pills{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}
.pill{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid}
.p-teal{background:var(--acd);color:var(--ac);border-color:rgba(0,212,170,.25)}
.p-blue{background:var(--bld);color:var(--bl);border-color:rgba(88,166,255,.25)}
.p-or{background:var(--ord);color:var(--or);border-color:rgba(227,179,65,.25)}
.p-mu{background:var(--sur2);color:var(--tx2);border-color:var(--bd)}
.p-loc{background:var(--pud);color:var(--pu);border-color:rgba(188,140,255,.25)}
.tw{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);overflow:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
thead th{background:var(--sur2);padding:11px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--tx2);letter-spacing:.06em;text-transform:uppercase;border-bottom:1px solid var(--bd);white-space:nowrap}
tbody tr{border-bottom:1px solid var(--bd);transition:background .1s}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:var(--sur2)}
tbody td{padding:11px 14px;vertical-align:middle}
.erow td{text-align:center;color:var(--tx3);padding:48px !important}
.bdg{display:inline-block;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;font-family:'JetBrains Mono',monospace}
.b-in{background:var(--acd);color:var(--ac);border:1px solid rgba(0,212,170,.2)}
.b-out{background:var(--rdd);color:var(--rd);border:1px solid rgba(248,81,73,.2)}
.b-adm{background:var(--bld);color:var(--bl);border:1px solid rgba(88,166,255,.2)}
.b-per{background:var(--ord);color:var(--or);border:1px solid rgba(227,179,65,.2)}
.b-on{background:var(--grd);color:var(--gr)}.b-off{background:var(--sur3);color:var(--tx3)}
.b-frz{background:var(--bld);color:var(--bl)}.b-chl{background:var(--acd);color:var(--ac)}
.b-dry{background:var(--ord);color:var(--or)}.b-loc{background:var(--pud);color:var(--pu)}
.fbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.fbar select,.fbar input{padding:8px 12px;background:var(--sur3);border:1px solid var(--bd);border-radius:var(--r);color:var(--tx);font-size:13px;outline:none}
.chip-bar{display:flex;gap:6px;flex-wrap:wrap}
.chip{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;border:1px solid var(--bd);background:var(--sur3);color:var(--tx2);cursor:pointer;transition:all .15s}
.chip:hover{border-color:var(--bd2);color:var(--tx)}
.chip.act{background:var(--acd);border-color:var(--ac);color:var(--ac)}
.chip.act-bl{background:var(--bld);border-color:var(--bl);color:var(--bl)}
.chip.act-or{background:var(--ord);border-color:var(--or);color:var(--or)}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
.mdl{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);width:100%;max-width:520px;box-shadow:var(--sh);max-height:90vh;display:flex;flex-direction:column}
.mdl.wide{max-width:680px}
.mhd{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--bd);flex-shrink:0}
.mhd span{font-family:'Syne',sans-serif;font-weight:700;font-size:16px}
.mhd button{background:none;border:none;color:var(--tx2);font-size:18px;padding:2px 6px;border-radius:6px}
.mhd button:hover{background:var(--sur3)}
.mbd{padding:22px;overflow-y:auto}.mft{display:flex;justify-content:flex-end;gap:10px;margin-top:20px}
.spin-wrap{display:flex;align-items:center;justify-content:center;padding:60px;color:var(--tx3);gap:12px;font-size:13px}
@keyframes spin{to{transform:rotate(360deg)}}
.spin-ico{width:22px;height:22px;border:2px solid var(--bd);border-top-color:var(--ac);border-radius:50%;animation:spin .7s linear infinite}
.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
.kpi{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:18px 20px;position:relative;overflow:hidden}
.kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.kpi.k-ac::before{background:var(--ac)}.kpi.k-bl::before{background:var(--bl)}
.kpi.k-or::before{background:var(--or)}.kpi.k-pu::before{background:var(--pu)}
.kpi-label{font-size:11px;font-weight:700;color:var(--tx2);letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
.kpi-val{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:500}
.kpi-sub{font-size:12px;margin-top:6px}
.kpi-up{color:var(--ac)}.kpi-dn{color:var(--rd)}.kpi-na{color:var(--tx3)}
.chart-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:20px 24px;margin-bottom:16px}
.chart-card-hd{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;gap:12px;flex-wrap:wrap}
.chart-card-title{font-family:'Syne',sans-serif;font-weight:700;font-size:14px}
.chart-card-sub{font-size:12px;color:var(--tx2);margin-top:3px}
.chart-legend{display:flex;gap:14px;flex-wrap:wrap}
.leg-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--tx2)}
.leg-dot{width:10px;height:10px;border-radius:2px;flex-shrink:0}
.chart-wrap{width:100%;overflow-x:auto}
.perf-bar-bg{background:var(--sur3);border-radius:3px;height:6px;position:relative;overflow:hidden}
.perf-bar-fill{position:absolute;left:0;top:0;height:100%;border-radius:3px;transition:width .4s}
.bar-tooltip{position:fixed;background:var(--sur);border:1px solid var(--bd2);border-radius:var(--r);padding:10px 14px;font-size:12px;pointer-events:none;z-index:300;min-width:160px;box-shadow:var(--sh)}
.tt-month{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;margin-bottom:6px}
.tt-row{display:flex;justify-content:space-between;gap:16px;padding:2px 0}
.tt-dot{width:8px;height:8px;border-radius:2px;display:inline-block;margin-right:5px;flex-shrink:0}
.inv-wrap{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);overflow:hidden}
.inv-hd{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--bd);gap:12px;flex-wrap:wrap}
.inv-title{font-family:'Syne',sans-serif;font-weight:700;font-size:15px}
.inv-count{font-size:12px;color:var(--tx2);background:var(--sur3);border:1px solid var(--bd);border-radius:20px;padding:2px 10px;font-family:'JetBrains Mono',monospace}
.inv-filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:12px 20px;border-bottom:1px solid var(--bd);background:var(--sur2)}
.loc-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;padding:14px 20px;border-bottom:1px solid var(--bd)}
.loc-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:14px 16px;cursor:pointer;transition:border-color .15s}
.loc-card:hover,.loc-card.sel{border-color:var(--pu)}.loc-card.sel{background:var(--pud)}
.loc-card-name{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;margin-bottom:6px}
.loc-stat{font-size:11px;color:var(--tx2)}.loc-stat strong{color:var(--tx);font-family:'JetBrains Mono',monospace}
.row-frz td:first-child{border-left:3px solid var(--bl)}
.row-chl td:first-child{border-left:3px solid var(--ac)}
.row-dry td:first-child{border-left:3px solid var(--or)}
.ctr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}
.ctr-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);overflow:hidden;transition:border-color .15s}
.ctr-card.act-ctr{border-color:var(--or);border-width:1.5px}
.ctr-hd{padding:16px 18px;border-bottom:1px solid var(--bd);display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
.ctr-client{font-family:'Syne',sans-serif;font-weight:700;font-size:14px}
.ctr-ref{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx2);margin-top:2px}
.ctr-body{padding:14px 18px}
.ctr-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:13px;border-bottom:1px solid var(--bd)}
.ctr-row:last-child{border:none}.ctr-label{color:var(--tx2);font-size:12px}
.ctr-val{font-family:'JetBrains Mono',monospace;font-weight:500}
.ctr-foot{padding:10px 18px;background:var(--sur2);border-top:1px solid var(--bd);display:flex;gap:8px;justify-content:flex-end}
.b-ctr-act{background:var(--ord);color:var(--or);border:1px solid rgba(227,179,65,.25)}
.b-ctr-fut{background:var(--bld);color:var(--bl);border:1px solid rgba(88,166,255,.25)}
.b-ctr-exp{background:var(--sur3);color:var(--tx3)}
.info-box{background:var(--sur2);border:1px solid var(--bd);border-radius:var(--r);padding:12px 16px;font-size:13px;color:var(--tx2);line-height:1.6;margin-bottom:16px}
.sp-alert-bar{display:flex;align-items:center;gap:10px;background:var(--rdd);border:1px solid rgba(248,81,73,.25);border-radius:var(--rl);padding:12px 18px;margin-bottom:20px;font-size:13px;color:var(--rd);flex-wrap:wrap}
.sp-tabs{display:flex;gap:2px;background:var(--sur2);border:1px solid var(--bd);border-radius:9px;padding:3px;margin-bottom:22px;flex-wrap:wrap;width:fit-content}
.sp-tab{padding:8px 16px;border:none;background:none;border-radius:7px;font-size:13px;font-weight:700;color:var(--tx2);cursor:pointer;transition:all .15s;white-space:nowrap}
.sp-tab.on{background:var(--sur3);color:var(--tx);box-shadow:0 1px 4px rgba(0,0,0,.3)}
.sp-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.sp-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);overflow:hidden;transition:border-color .15s}
.sp-card.alert{border-color:rgba(248,81,73,.4)!important}.sp-card.warn{border-color:rgba(227,179,65,.4)!important}
.sp-card-hd{padding:14px 16px;display:flex;align-items:flex-start;justify-content:space-between;gap:8px;border-bottom:1px solid var(--bd)}
.sp-card-name{font-weight:700;font-size:13.5px}
.sp-card-pn{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx2);margin-top:2px}
.sp-card-body{padding:12px 16px;display:flex;flex-direction:column;gap:8px}
.sp-stock-row{display:flex;align-items:center;justify-content:space-between}
.sp-stock-num{font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:600}
.sp-stock-num.ok{color:var(--ac)}.sp-stock-num.warn{color:var(--or)}.sp-stock-num.low{color:var(--rd)}
.sp-stock-bar{height:4px;background:var(--sur3);border-radius:2px;margin:2px 0 6px;overflow:hidden}
.sp-stock-bar-fill{height:100%;border-radius:2px;transition:width .3s}
.sp-meta{font-size:11px;color:var(--tx2);display:flex;gap:12px;flex-wrap:wrap}
.sp-card-foot{padding:10px 16px;border-top:1px solid var(--bd);display:flex;gap:6px;justify-content:flex-end}
.pr-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:16px 18px;margin-bottom:10px;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start}
.pr-card.urgent{border-color:rgba(248,81,73,.35)}
.b-pr-open{background:var(--ord);color:var(--or)}.b-pr-ordered{background:var(--bld);color:var(--bl)}.b-pr-received{background:var(--grd);color:var(--gr)}
.mach-card{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:14px 16px}
.mach-card-name{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;margin-bottom:4px}
.tbar{display:flex;gap:2px;background:var(--sur2);border:1px solid var(--bd);border-radius:9px;padding:3px;width:fit-content;margin-bottom:22px}
.tab{padding:8px 20px;border:none;background:none;border-radius:7px;font-size:13px;font-weight:700;color:var(--tx2);transition:all .15s}
.tab.on{background:var(--sur3);color:var(--tx);box-shadow:0 1px 4px rgba(0,0,0,.3)}
.sbox{background:var(--sur);border:1px solid var(--bd);border-radius:var(--rl);padding:24px}
.hint{font-size:13px;color:var(--tx2);margin-bottom:18px;line-height:1.6}
@media(max-width:1000px){.sgrid{grid-template-columns:repeat(3,1fr)}.kpi-row{grid-template-columns:1fr 1fr}}
@media(max-width:700px){
  .sidebar{transform:translateX(-100%)}.sidebar.open{transform:none;box-shadow:4px 0 32px rgba(0,0,0,.5)}
  .bkd{display:block}.main{margin-left:0}.topbar{display:flex}
  .con{padding:18px 14px}.fgrid{grid-template-columns:1fr}.fg.s2{grid-column:span 1}
  .sgrid{grid-template-columns:1fr 1fr;gap:10px}.kpi-row{grid-template-columns:1fr 1fr}
  .ctr-grid{grid-template-columns:1fr}.sp-cards{grid-template-columns:1fr}
}
@media(max-width:420px){.sgrid{grid-template-columns:1fr}.kpi-row{grid-template-columns:1fr}}
`;
document.head.appendChild(_st);

// ── CONSTANTS ─────────────────────────────────────────────────────
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CY=new Date().getFullYear(), PY=CY-1;
const sico  =t=>t==='frozen'?'🧊':t==='chilled'?'🌡️':'📦';
const sbadge=t=>t==='frozen'?'b-frz':t==='chilled'?'b-chl':'b-dry';
const spill =t=>t==='frozen'?'p-blue':t==='chilled'?'p-teal':'p-or';
const fmtM  =n=>`₱${Number(n||0).toLocaleString('en-PH',{minimumFractionDigits:2})}`;
const fmtMK =n=>n>=1e6?`₱${(n/1e6).toFixed(2)}M`:n>=1000?`₱${(n/1000).toFixed(1)}K`:fmtM(n);
const fmtKg =n=>`${Number(n||0).toLocaleString('en-PH',{minimumFractionDigits:2})} kg`;
const fmtD  =s=>{try{return new Date(s+'T00:00:00').toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'});}catch{return s;}};
const uid   =()=>Math.random().toString(36).slice(2,10).toUpperCase();
const today =()=>new Date().toISOString().slice(0,10);
const FKC_LOGO='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBkPSJNIDE1LDEwMCBBIDg1LDg1IDAgMSwxIDE4NSwxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHRleHQgeD0iMTAwIiB5PSIxMDUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iOTAwIiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJibGFjayI+RktDPC90ZXh0PjxwYXRoIGlkPSJib3R0b21BcmMiIGQ9Ik0gMjIsMTE1IEEgODUsODUgMCAwLDAgMTc4LDExNSIgZmlsbD0ibm9uZSIvPjx0ZXh0IGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNzAwIiBmb250LXNpemU9IjE4IiBmaWxsPSJibGFjayIgbGV0dGVyLXNwYWNpbmc9IjQiPjx0ZXh0UGF0aCBocmVmPSIjYm90dG9tQXJjIiBzdGFydE9mZnNldD0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MT0dJU1RJQ1M8L3RleHRQYXRoPjwvdGV4dD48L3N2Zz4=';

// ── SHARED ────────────────────────────────────────────────────────
const Spinner=()=><div className="spin-wrap"><div className="spin-ico"/><span>Loading…</span></div>;

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
  if(!txs.length) return <div className="tw"><table><tbody><tr className="erow"><td colSpan={8}>No transactions found.</td></tr></tbody></table></div>;
  return(
    <div className="tw"><table>
      <thead><tr><th>Date</th><th>Client</th><th>Item</th><th>Location</th><th>Type</th><th>Weight</th><th>Ref #</th><th>By</th></tr></thead>
      <tbody>{txs.map(t=>(
        <tr key={t.id}>
          <td style={{fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{fmtD(t.date)}</td>
          <td>{clientMap[t.client_id]||'—'}</td>
          <td style={{fontWeight:600}}>{t.item_name}</td>
          <td><span className="bdg b-loc">{locationMap[t.location_id]||'—'}</span></td>
          <td><span className={`bdg ${t.type==='IN'?'b-in':'b-out'}`}>{t.type==='IN'?'▼ IN':'▲ OUT'}</span></td>
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
  const gV=d=>metric==='total'?d.total:metric==='storage'?d.storage:metric==='handling'?(d.handlingIn+d.handlingOut):d.kgIn;
  const allV=[...cyData.map(gV),...pyData.map(gV)].filter(v=>v>0);
  const maxV=allV.length?Math.max(...allV)*1.12:1;
  const bW=Math.floor(cW/12),bw=Math.floor((bW-4)*0.44);
  return(
    <div className="chart-wrap" style={{position:'relative'}}>
      {tip&&<div className="bar-tooltip" style={{left:tip.x+12,top:tip.y-10,transform:'translateY(-100%)'}}>
        <div className="tt-month">{tip.month}</div>
        {tip.cy!==null&&<div className="tt-row"><span><span className="tt-dot" style={{background:'#00d4aa'}}/>{CY}</span><strong style={{fontFamily:'JetBrains Mono'}}>{fmtMK(tip.cy)}</strong></div>}
        <div className="tt-row"><span><span className="tt-dot" style={{background:'#58a6ff',opacity:.7}}/>{PY}</span><strong style={{fontFamily:'JetBrains Mono'}}>{fmtMK(tip.py)}</strong></div>
        {tip.cy!==null&&tip.py>0&&<div className="tt-row" style={{marginTop:4,borderTop:'1px solid var(--bd)',paddingTop:4}}>
          <span style={{color:'var(--tx2)'}}>YoY</span>
          <strong style={{color:tip.cy>=tip.py?'var(--ac)':'var(--rd)'}}>{tip.cy>=tip.py?'+':''}{(((tip.cy-tip.py)/tip.py)*100).toFixed(1)}%</strong>
        </div>}
      </div>}
      <svg width={W} height={H}>
        {[0,.25,.5,.75,1].map(f=>{const y=pT+cH*(1-f);return(<g key={f}><line x1={pL} x2={W-pR} y1={y} y2={y} stroke="var(--bd)" strokeWidth={1} strokeDasharray={f===0?'':'3 4'}/><text x={pL-6} y={y+3.5} style={{fontFamily:'JetBrains Mono',fontSize:9,fill:'var(--tx3)',textAnchor:'end'}}>{fmtMK(maxV*f)}</text></g>);})}
        {MONTHS.map((mon,i)=>{
          const pyV=gV(pyData[i]),cyV=i<=curMonth?gV(cyData[i]):null;
          const x=pL+i*bW,pyH=Math.max((pyV/maxV)*cH,pyV>0?2:0),cyH=cyV!=null?Math.max((cyV/maxV)*cH,cyV>0?2:0):0;
          const isCur=i===curMonth;
          return(<g key={i} style={{cursor:'pointer'}}
            onMouseEnter={e=>setTip({x:e.clientX,y:e.clientY,month:`${mon} ${CY}`,cy:cyV,py:pyV})}
            onMouseMove={e=>setTip(t=>t?{...t,x:e.clientX,y:e.clientY}:null)}
            onMouseLeave={()=>setTip(null)}>
            {pyV>0&&<rect x={x+2} y={pT+cH-pyH} width={bw} height={pyH} fill="#58a6ff" opacity={.55} rx={3}/>}
            {cyV!=null&&cyV>0&&<rect x={x+2+bw+2} y={pT+cH-cyH} width={bw} height={cyH} fill={isCur?'#00b894':'#00d4aa'} opacity={isCur?1:.9} rx={3}/>}
            {cyV!=null&&cyH>22&&<text x={x+2+bw+2+bw/2} y={pT+cH-cyH+12} style={{fontFamily:'JetBrains Mono',fontSize:9,fill:'var(--tx)',textAnchor:'middle',opacity:.85}}>{fmtMK(cyV)}</text>}
            <text x={x+bW/2} y={H-8} style={{fontFamily:'JetBrains Mono',fontSize:10,fill:isCur?'var(--ac)':'var(--tx3)',textAnchor:'middle',fontWeight:isCur?700:400}}>{mon}</text>
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
  useEffect(()=>{setLoading(true);Promise.all([db.getMonthlyRevenue(CY,cf),db.getMonthlyRevenue(PY,cf)]).then(([c,p])=>{setCy(c);setPy(p);setLoading(false);});},[cf]);
  const ytdCY=cy.slice(0,curMonth+1).reduce((s,d)=>s+d.total,0);
  const ytdPY=py.slice(0,curMonth+1).reduce((s,d)=>s+d.total,0);
  const ytdD=ytdPY>0?((ytdCY-ytdPY)/ytdPY)*100:0;
  const cur=cy[curMonth],pre=cy[Math.max(0,curMonth-1)];
  const mom=pre.total>0?((cur.total-pre.total)/pre.total)*100:0;
  const best=cy.reduce((b,d,i)=>d.total>b.val?{val:d.total,idx:i}:b,{val:0,idx:0});
  const fullPY=py.reduce((s,d)=>s+d.total,0);
  const maxCY=Math.max(...cy.map(d=>d.total),1);
  const metOpts=[{k:'total',l:'Total Revenue'},{k:'storage',l:'Storage Fee'},{k:'handling',l:'Handling Fee'},{k:'kgIn',l:'kg Received'}];
  return(<>
    <div className="kpi-row">
      {[[`YTD Revenue ${CY}`,fmtMK(ytdCY),ytdD,ytdD>=0,`vs ${PY} YTD`,'k-ac'],['This Month',fmtMK(cur.total),mom,mom>=0,'vs last month','k-bl'],[`Best Month ${CY}`,fmtMK(best.val),null,null,MONTHS[best.idx]+' '+CY,'k-or'],[`Full Year ${PY}`,fmtMK(fullPY),null,null,'Closed year baseline','k-pu']].map(([label,val,sub,isUp,subTxt,col])=>(
        <div key={label} className={`kpi ${col}`}>
          <div className="kpi-label">{label}</div><div className="kpi-val">{val}</div>
          <div className="kpi-sub">{sub!==null?<span className={isUp?'kpi-up':'kpi-dn'}>{isUp?'▲':'▼'} {Math.abs(sub).toFixed(1)}% {subTxt}</span>:<span className="kpi-na">{subTxt}</span>}</div>
        </div>
      ))}
    </div>
    <div className="chart-card">
      <div className="chart-card-hd">
        <div><div className="chart-card-title">Monthly Revenue — {CY} vs {PY}</div><div className="chart-card-sub">Hover bars for details · Current month highlighted</div></div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
          <select value={cf} onChange={e=>setCf(e.target.value)} style={{padding:'6px 10px',background:'var(--sur3)',border:'1px solid var(--bd)',borderRadius:'var(--r)',color:'var(--tx)',fontSize:12,outline:'none'}}><option value="">All Clients</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select value={metric} onChange={e=>setMetric(e.target.value)} style={{padding:'6px 10px',background:'var(--sur3)',border:'1px solid var(--bd)',borderRadius:'var(--r)',color:'var(--tx)',fontSize:12,outline:'none'}}>{metOpts.map(o=><option key={o.k} value={o.k}>{o.l}</option>)}</select>
          <div className="chart-legend"><div className="leg-item"><div className="leg-dot" style={{background:'#00d4aa'}}/>{CY}</div><div className="leg-item"><div className="leg-dot" style={{background:'#58a6ff',opacity:.65}}/>{PY}</div></div>
        </div>
      </div>
      {loading?<Spinner/>:<BarChart cyData={cy} pyData={py} metric={metric} curMonth={curMonth}/>}
    </div>
    <div className="chart-card">
      <div className="chart-card-hd"><div><div className="chart-card-title">Month-by-Month Performance</div><div className="chart-card-sub">Total revenue · {CY} vs {PY}</div></div></div>
      <div style={{overflow:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead><tr>{['Month','Bar','Revenue '+CY,'Revenue '+PY,'YoY','kg In','kg Out'].map(h=><th key={h} style={{background:'var(--sur2)',padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:700,color:'var(--tx2)',letterSpacing:'.06em',textTransform:'uppercase',borderBottom:'1px solid var(--bd)',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
        <tbody>{MONTHS.map((m,i)=>{
          const cyi=cy[i].total,pyi=py[i].total,chg=pyi>0?((cyi-pyi)/pyi)*100:null,isFut=i>curMonth,isCur=i===curMonth;
          return(<tr key={i} style={{borderBottom:'1px solid var(--bd)',background:isCur?'rgba(0,212,170,.04)':isFut?'rgba(255,255,255,.01)':''}}>
            <td style={{padding:'10px 14px',fontWeight:isCur?700:400,color:isCur?'var(--ac)':isFut?'var(--tx3)':'var(--tx)'}}>{m}{isCur&&<span style={{fontSize:10,background:'var(--acd)',color:'var(--ac)',borderRadius:4,padding:'1px 5px',marginLeft:4}}>NOW</span>}</td>
            <td style={{padding:'10px 14px',minWidth:120}}>{!isFut&&<div className="perf-bar-bg"><div className="perf-bar-fill" style={{width:`${Math.round((cyi/maxCY)*100)}%`,background:isCur?'var(--ac)':'rgba(0,212,170,.5)'}}/></div>}</td>
            <td style={{padding:'10px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:isFut?'var(--tx3)':'var(--tx)'}}>{isFut?'—':fmtM(cyi)}</td>
            <td style={{padding:'10px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{fmtM(pyi)}</td>
            <td style={{padding:'10px 14px'}}>{isFut?<span style={{color:'var(--tx3)'}}>—</span>:chg===null?<span style={{color:'var(--tx3)'}}>N/A</span>:<span style={{color:chg>=0?'var(--ac)':'var(--rd)',fontFamily:'JetBrains Mono',fontSize:12,fontWeight:700}}>{chg>=0?'+':''}{chg.toFixed(1)}%</span>}</td>
            <td style={{padding:'10px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{isFut?'—':fmtKg(cy[i].kgIn)}</td>
            <td style={{padding:'10px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{isFut?'—':fmtKg(cy[i].kgOut)}</td>
          </tr>);
        })}</tbody>
        <tfoot><tr style={{background:'var(--sur2)',borderTop:'2px solid var(--bd)'}}>
          <td style={{padding:'11px 14px',fontWeight:700,fontSize:12}}>YTD TOTAL</td><td/>
          <td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontSize:13,fontWeight:700,color:'var(--ac)'}}>{fmtM(ytdCY)}</td>
          <td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontSize:13,fontWeight:700,color:'var(--bl)'}}>{fmtM(ytdPY)}</td>
          <td style={{padding:'11px 14px'}}><span style={{color:ytdD>=0?'var(--ac)':'var(--rd)',fontFamily:'JetBrains Mono',fontSize:12,fontWeight:700}}>{ytdD>=0?'+':''}{ytdD.toFixed(1)}%</span></td>
          <td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{fmtKg(cy.slice(0,curMonth+1).reduce((s,d)=>s+d.kgIn,0))}</td>
          <td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{fmtKg(cy.slice(0,curMonth+1).reduce((s,d)=>s+d.kgOut,0))}</td>
        </tr></tfoot>
      </table></div>
    </div>
  </>);
}

// ── INVENTORY PANEL ───────────────────────────────────────────────
function InventoryPanel({inventory,clients,locations}){
  const [stF,setStF]=useState('all');const [clF,setClF]=useState('');const [loF,setLoF]=useState('');
  const filtered=inventory.filter(r=>{if(stF!=='all'&&r.storage_type!==stF)return false;if(clF&&r.client_id!==clF)return false;if(loF&&r.location_id!==loF)return false;return true;});
  const total=filtered.reduce((s,r)=>s+r.kg,0);
  const locSum=locations.map(loc=>{const rows=inventory.filter(r=>{if(stF!=='all'&&r.storage_type!==stF)return false;if(clF&&r.client_id!==clF)return false;return r.location_id===loc.id;});return{...loc,kg:rows.reduce((s,r)=>s+r.kg,0),count:rows.length};}).filter(l=>l.kg>0);
  const chips=[{k:'all',l:'All Types'},{k:'frozen',l:'🧊 Frozen'},{k:'chilled',l:'🌡️ Chilled'},{k:'dry',l:'📦 Dry'}];
  return(
    <div className="inv-wrap">
      <div className="inv-hd">
        <div style={{display:'flex',alignItems:'center',gap:10}}><span style={{fontSize:18}}>📦</span><span className="inv-title">Live Inventory</span><span className="inv-count">{filtered.length} lines · {fmtKg(total)}</span></div>
        <button className="btn bgh" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>{setStF('all');setClF('');setLoF('');}}>Clear Filters</button>
      </div>
      {locSum.length>0&&<div className="loc-cards">{locSum.map(loc=>(
        <div key={loc.id} className={`loc-card ${loF===loc.id?'sel':''}`} onClick={()=>setLoF(f=>f===loc.id?'':loc.id)}>
          <div className="loc-card-name">🏗 {loc.name}</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}><span className="loc-stat"><strong>{fmtKg(loc.kg)}</strong> stored</span><span className="loc-stat"><strong>{loc.count}</strong> line{loc.count!==1?'s':''}</span></div>
          {loF===loc.id&&<div style={{marginTop:6,fontSize:11,color:'var(--pu)',fontWeight:700}}>● Filtered</div>}
        </div>
      ))}</div>}
      <div className="inv-filters">
        <div className="chip-bar">{chips.map(c=><button key={c.k} className={`chip ${stF===c.k?c.k==='frozen'?'act-bl':c.k==='dry'?'act-or':'act':''}`} onClick={()=>setStF(c.k)}>{c.l}</button>)}</div>
        <div style={{width:1,height:24,background:'var(--bd)',margin:'0 4px'}}/>
        <select value={clF} onChange={e=>setClF(e.target.value)} style={{padding:'6px 10px',background:'var(--sur3)',border:'1px solid var(--bd)',borderRadius:'var(--r)',color:'var(--tx)',fontSize:13,outline:'none'}}><option value="">All Clients</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select value={loF} onChange={e=>setLoF(e.target.value)} style={{padding:'6px 10px',background:'var(--sur3)',border:'1px solid var(--bd)',borderRadius:'var(--r)',color:'var(--tx)',fontSize:13,outline:'none'}}><option value="">All Locations</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select>
      </div>
      <div style={{overflow:'auto'}}>
        {filtered.length===0?<div style={{textAlign:'center',color:'var(--tx3)',padding:'48px',fontSize:13}}>No items match filters.</div>:
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr>{['Item','Client','Location','Type','On Hand'].map((h,i)=><th key={h} style={{background:'var(--sur2)',padding:'10px 14px',textAlign:i===4?'right':'left',fontSize:11,fontWeight:700,color:'var(--tx2)',letterSpacing:'.06em',textTransform:'uppercase',borderBottom:'1px solid var(--bd)',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((r,i)=>(
            <tr key={i} className={`row-${r.storage_type==='frozen'?'frz':r.storage_type==='chilled'?'chl':'dry'}`} style={{borderBottom:'1px solid var(--bd)'}} onMouseEnter={e=>e.currentTarget.style.background='var(--sur2)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
              <td style={{padding:'11px 14px'}}><div style={{fontWeight:700}}>{r.item_name}</div>{r.item_code&&<div style={{fontFamily:'JetBrains Mono',fontSize:11,color:'var(--tx2)'}}>{r.item_code}</div>}</td>
              <td style={{padding:'11px 14px',color:'var(--tx2)'}}>{r.client_name}</td>
              <td style={{padding:'11px 14px'}}><span className="bdg b-loc">{r.location_name}</span></td>
              <td style={{padding:'11px 14px'}}><span className={`bdg ${sbadge(r.storage_type)}`}>{sico(r.storage_type)} {r.storage_type}</span></td>
              <td style={{padding:'11px 14px',textAlign:'right',fontFamily:'JetBrains Mono',fontSize:13,fontWeight:600,color:'var(--ac)'}}>{fmtKg(r.kg)}</td>
            </tr>
          ))}</tbody>
          <tfoot><tr style={{background:'var(--sur2)',borderTop:'2px solid var(--bd)'}}>
            <td colSpan={4} style={{padding:'11px 14px',fontWeight:700,fontSize:12,color:'var(--tx2)'}}>TOTAL ({filtered.length} lines)</td>
            <td style={{padding:'11px 14px',textAlign:'right',fontFamily:'JetBrains Mono',fontSize:14,fontWeight:700,color:'var(--ac)'}}>{fmtKg(total)}</td>
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
  const cards=[{l:'Total On Hand',v:fmtKg(data.totalStock),i:'❄️'},{l:'Frozen',v:fmtKg(data.frozen),i:'🧊'},{l:'Chilled',v:fmtKg(data.chilled),i:'🌡️'},{l:'Dry',v:fmtKg(data.dry),i:'📦'},{l:'Dry Contracts',v:data.activeContracts.length,i:'📋'}];
  return(
    <div className="con">
      <div className="ph"><div className="phi teal">📊</div><h2>Dashboard</h2><button className="btn bgh mla" onClick={load}>↻ Refresh</button></div>
      <div className="sgrid">{cards.map(c=><div key={c.l} className="sc"><div className="sico">{c.i}</div><div><div className="sval">{c.v}</div><div className="slbl">{c.l}</div></div></div>)}</div>
      {data.lowParts?.length>0&&<div className="sp-alert-bar" style={{marginBottom:20}}>⚠️ <strong>{data.lowParts.length}</strong> spare part{data.lowParts.length!==1?'s':''} at or below minimum stock level</div>}
      <div style={{marginBottom:8}}><div style={{fontFamily:'Syne',fontWeight:700,fontSize:13,color:'var(--tx2)',marginBottom:16,letterSpacing:'.05em',textTransform:'uppercase'}}>📈 Revenue Analytics</div><Analytics clients={clients}/></div>
      <div style={{marginTop:8}}><div style={{fontFamily:'Syne',fontWeight:700,fontSize:13,color:'var(--tx2)',marginBottom:12,letterSpacing:'.05em',textTransform:'uppercase'}}>📦 Live Inventory</div><InventoryPanel inventory={data.inventory} clients={clients} locations={locations}/></div>
      <div style={{marginTop:24}}><div style={{fontFamily:'Syne',fontWeight:700,fontSize:13,color:'var(--tx2)',marginBottom:12,letterSpacing:'.05em',textTransform:'uppercase'}}>TODAY'S TRANSACTIONS ({data.todayTxs.length})</div><TxTable txs={data.todayTxs} clientMap={clientMap} locationMap={locationMap}/></div>
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
    if(!form.itemId)   return setErr('Please select an item.');
    if(!form.locationId) return setErr('Please select a storage location.');
    if(!form.kg||isNaN(parseFloat(form.kg))||parseFloat(form.kg)<=0) return setErr('Please enter a valid weight.');
    setErr('');setSaving(true);
    try{
      const tx=await db.saveTransaction({id:'TX'+uid(),type,client_id:form.clientId,item_id:form.itemId,item_name:selItem.name,location_id:form.locationId,kg:parseFloat(form.kg),ref_no:form.refNo,date:form.date,notes:form.notes,encoded_by:user.name,created_at:new Date().toISOString()});
      setSaved({...tx,clientName:clients.find(c=>c.id===tx.client_id)?.name,locationName:selLoc?.name});
      setForm(blank);setItems([]);setTimeout(()=>setSaved(null),5000);onSaved();
    }catch(e){setErr('Save failed: '+e.message);}
    setSaving(false);
  };
  return(
    <div className="con">
      <div className="ph"><div className={`phi ${isIn?'teal':'red'}`}>{isIn?'📥':'📤'}</div><h2>{isIn?'Stock In — Receive Items':'Stock Out — Release Items'}</h2></div>
      {saved&&<div className="ok-bar">✓ {isIn?'Stock-in':'Stock-out'} recorded! · <strong>{saved.item_name}</strong> — {fmtKg(saved.kg)} — {saved.clientName}{saved.ref_no?` · Ref: ${saved.ref_no}`:''}</div>}
      {err&&<div className="err-bar">{err}</div>}
      <div className="fgrid">
        <div className="fg"><label>① Client *</label><select value={form.clientId} onChange={e=>s('clientId',e.target.value)}><option value="">— Select client —</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div className="fg"><label>Date *</label><input type="date" value={form.date} onChange={e=>s('date',e.target.value)}/></div>
        <div className="fg s2"><label>② Item *</label>
          {!form.clientId?<select disabled><option>— Select a client first —</option></select>
            :items.length===0?<div className="err-bar" style={{margin:0,fontSize:12}}>⚠️ No items set up for this client. Go to Item Database first.</div>
            :<><div className="iselr"><select value={form.itemId} onChange={e=>s('itemId',e.target.value)}><option value="">— Select item —</option>{items.map(i=><option key={i.id} value={i.id}>{i.name}{i.code?` · ${i.code}`:''}</option>)}</select>{selItem&&<div className="iselt">{sico(selItem.storage_type)} {selItem.storage_type}</div>}</div>
            {selItem&&<div className="pills">{selItem.code&&<span className="pill p-mu">SKU: {selItem.code}</span>}<span className={`pill ${spill(selItem.storage_type)}`}>{sico(selItem.storage_type)} {selItem.storage_type}</span>{selItem.notes&&<span className="pill p-mu">📝 {selItem.notes}</span>}</div>}</>}
        </div>
        <div className="fg"><label>③ Storage Location *</label>
          <select value={form.locationId} onChange={e=>s('locationId',e.target.value)} disabled={!form.itemId}><option value="">— Select location —</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select>
          {selLoc?.description&&<div className="pills"><span className="pill p-loc">🏗 {selLoc.description}</span></div>}
        </div>
        <div className="fg"><label>④ Weight (kg) *</label><input type="number" step="0.01" min="0.01" value={form.kg} onChange={e=>s('kg',e.target.value)} placeholder="0.00" disabled={!form.locationId}/></div>
        <div className="fg"><label>Reference No.</label><input value={form.refNo} onChange={e=>s('refNo',e.target.value)} placeholder="DR / PO / SO number"/></div>
        <div className="fg s2"><label>Notes</label><textarea value={form.notes} onChange={e=>s('notes',e.target.value)} placeholder="Optional remarks…" rows={2}/></div>
      </div>
      <button className={`btn ${isIn?'bac':'brd'}`} onClick={submit} disabled={saving}>{isIn?'📥':'📤'} {saving?'Saving…':isIn?'Record Stock In':'Record Stock Out'}</button>
    </div>
  );
}

// ── TRANSACTION LOG ───────────────────────────────────────────────
function TransactionLog({clients,locations,refresh}){
  const [filter,setFilter]=useState({client_id:'',type:'',location_id:'',from:'',to:''});
  const [txs,setTxs]=useState([]);const [loading,setLoading]=useState(true);
  const clientMap=Object.fromEntries(clients.map(c=>[c.id,c.name]));
  const locationMap=Object.fromEntries(locations.map(l=>[l.id,l.name]));
  const load=useCallback(async()=>{setLoading(true);setTxs(await db.getTransactions(filter));setLoading(false);},[filter]);
  useEffect(()=>{load();},[load,refresh]);
  const setF=(k,v)=>setFilter(f=>({...f,[k]:v}));
  return(
    <div className="con">
      <div className="ph"><div className="phi bl">📋</div><h2>Transaction Log</h2><button className="btn bgh mla" onClick={load}>↻ Refresh</button></div>
      <div className="fbar" style={{marginBottom:16}}>
        <select value={filter.client_id} onChange={e=>setF('client_id',e.target.value)}><option value="">All Clients</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select value={filter.type} onChange={e=>setF('type',e.target.value)}><option value="">All Types</option><option value="IN">Stock In</option><option value="OUT">Stock Out</option></select>
        <select value={filter.location_id} onChange={e=>setF('location_id',e.target.value)}><option value="">All Locations</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select>
        <input type="date" value={filter.from} onChange={e=>setF('from',e.target.value)}/>
        <input type="date" value={filter.to} onChange={e=>setF('to',e.target.value)}/>
        <button className="btn bgh" onClick={()=>setFilter({client_id:'',type:'',location_id:'',from:'',to:''})}>Clear</button>
      </div>
      {loading?<Spinner/>:<TxTable txs={txs} clientMap={clientMap} locationMap={locationMap}/>}
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
  const reload=useCallback(async()=>{setLoading(true);setAllItems(await db.getItems());setLoading(false);},[]);
  useEffect(()=>{reload();},[reload]);
  const openNew=(cid='')=>{setForm({name:'',code:'',client_id:cid,storage_type:'frozen',notes:''});setModal('new');};
  const openEdit=item=>{setForm({...item});setModal('edit');};
  const save=async()=>{
    if(!form.name?.trim()) return alert('Item name required.');
    if(!form.client_id) return alert('Please select a client.');
    const dup=allItems.find(i=>i.client_id===form.client_id&&i.name.toLowerCase()===form.name.trim().toLowerCase()&&i.id!==form.id);
    if(dup) return alert(`"${form.name}" already exists for this client.`);
    setSaving(true);await db.saveItem({...form,name:form.name.trim(),id:form.id||'ITM'+uid()});await reload();setSaving(false);setModal(null);
  };
  const del=async item=>{if(!window.confirm(`Delete "${item.name}"?`)) return;await db.deleteItem(item.id);await reload();};
  const showClients=fc?clients.filter(c=>c.id===fc):clients;
  return(
    <div className="con">
      <div className="ph"><div className="phi gr">📦</div><h2>Item Database</h2><button className="btn bac mla" onClick={()=>openNew()}>+ Add Item</button></div>
      {modal&&(<Modal title={modal==='new'?'New Item':'Edit Item'} onClose={()=>setModal(null)}>
        <div className="fgrid">
          <div className="fg s2"><label>Client *</label><select value={form.client_id||''} onChange={e=>s('client_id',e.target.value)}><option value="">— Select client —</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="fg s2"><label>Item Name *</label><input value={form.name||''} onChange={e=>s('name',e.target.value)} placeholder="e.g. Frozen Chicken Breast"/></div>
          <div className="fg"><label>Code / SKU</label><input value={form.code||''} onChange={e=>s('code',e.target.value)} placeholder="FCB-001" style={{fontFamily:'JetBrains Mono'}}/></div>
          <div className="fg"><label>Storage Type</label><select value={form.storage_type||'frozen'} onChange={e=>s('storage_type',e.target.value)}>{STYPES.map(t=><option key={t} value={t}>{sico(t)} {t.charAt(0).toUpperCase()+t.slice(1)}</option>)}</select></div>
          <div className="fg s2"><label>Notes</label><textarea value={form.notes||''} onChange={e=>s('notes',e.target.value)} rows={2} placeholder="e.g. Packed in 10kg bags"/></div>
        </div>
        <div className="mft"><button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button><button className="btn bac" onClick={save} disabled={saving}>{saving?'Saving…':'Save Item'}</button></div>
      </Modal>)}
      <div className="fbar" style={{marginBottom:24}}>
        <select value={fc} onChange={e=>setFc(e.target.value)}><option value="">All Clients</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <span style={{fontSize:13,color:'var(--tx2)',alignSelf:'center',fontFamily:'JetBrains Mono'}}>{allItems.filter(i=>!fc||i.client_id===fc).length} items</span>
      </div>
      {loading?<Spinner/>:showClients.map(client=>{
        const ci=allItems.filter(i=>i.client_id===client.id);
        return(<div key={client.id} style={{marginBottom:32}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,paddingBottom:12,borderBottom:'1px solid var(--bd)'}}>
            <div><div style={{fontFamily:'Syne',fontWeight:700,fontSize:15}}>🏢 {client.name}</div><div style={{fontSize:12,color:'var(--tx2)',marginTop:2}}>{ci.length} item{ci.length!==1?'s':''} registered</div></div>
            <button className="btn bgh" style={{fontSize:12,padding:'6px 14px'}} onClick={()=>openNew(client.id)}>+ Add Item</button>
          </div>
          {ci.length===0?<div style={{color:'var(--tx3)',fontSize:13,fontStyle:'italic'}}>No items yet.</div>:
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10}}>
            {ci.map(item=>(
              <div key={item.id} style={{background:'var(--sur)',border:'1px solid var(--bd)',borderRadius:'var(--rl)',padding:'14px 16px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8}}>
                  <div><div style={{fontWeight:700,fontSize:13.5}}>{item.name}</div>{item.code&&<div style={{fontFamily:'JetBrains Mono',fontSize:11,color:'var(--tx2)',marginTop:2}}>{item.code}</div>}</div>
                  <div style={{display:'flex',gap:3,flexShrink:0}}><button className="ib" onClick={()=>openEdit(item)}>✏️</button><button className="ib dl" onClick={()=>del(item)}>🗑</button></div>
                </div>
                <div className="pills" style={{marginTop:9}}><span className={`pill ${spill(item.storage_type)}`}>{sico(item.storage_type)} {item.storage_type}</span>{item.notes&&<span className="pill p-mu" style={{fontSize:11}}>📝 {item.notes}</span>}</div>
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
  const [modal,setModal]=useState(null);const [form,setForm]=useState({});const [saving,setSaving]=useState(false);
  const s=(k,v)=>setForm(f=>({...f,[k]:v}));
  const reload=useCallback(async()=>{
    setLoading(true);
    const [cls,allItems]=await Promise.all([db.getClients(),db.getItems()]);
    setClients(cls.map(c=>({...c,_itemCount:allItems.filter(i=>i.client_id===c.id).length})));
    setLoading(false);
  },[]);
  useEffect(()=>{reload();},[reload]);
  const openNew=()=>{setForm({name:'',contact:'',email:'',address:''});setModal('new');};
  const openEdit=c=>{setForm({...c});setModal('edit');};
  const save=async()=>{if(!form.name?.trim()) return alert('Name is required.');setSaving(true);await db.saveClient({...form,id:form.id||'CLT'+uid()});await reload();setSaving(false);setModal(null);};
  const del=async id=>{if(!window.confirm('Delete this client and all their items?')) return;await db.deleteClient(id);await reload();};
  return(
    <div className="con">
      <div className="ph"><div className="phi bl">🏢</div><h2>Clients</h2><button className="btn bac mla" onClick={openNew}>+ Add Client</button></div>
      {modal&&(<Modal title={modal==='new'?'New Client':'Edit Client'} onClose={()=>setModal(null)}>
        <div className="fgrid">
          <div className="fg s2"><label>Company / Name *</label><input value={form.name||''} onChange={e=>s('name',e.target.value)}/></div>
          <div className="fg"><label>Contact Person</label><input value={form.contact||''} onChange={e=>s('contact',e.target.value)}/></div>
          <div className="fg"><label>Email</label><input type="email" value={form.email||''} onChange={e=>s('email',e.target.value)}/></div>
          <div className="fg s2"><label>Address</label><textarea value={form.address||''} onChange={e=>s('address',e.target.value)} rows={2}/></div>
        </div>
        <div className="mft"><button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button><button className="btn bac" onClick={save} disabled={saving}>{saving?'Saving…':'Save'}</button></div>
      </Modal>)}
      {loading?<Spinner/>:<div className="tw"><table>
        <thead><tr><th>Name</th><th>Contact</th><th>Email</th><th>Address</th><th>Items</th><th></th></tr></thead>
        <tbody>{clients.length===0?<tr className="erow"><td colSpan={6}>No clients yet.</td></tr>:clients.map(c=>(
          <tr key={c.id}><td><strong>{c.name}</strong></td><td style={{color:'var(--tx2)'}}>{c.contact||'—'}</td><td style={{color:'var(--tx2)'}}>{c.email||'—'}</td><td style={{color:'var(--tx2)'}}>{c.address||'—'}</td>
          <td><span className="bdg b-on">{c._itemCount||0} item{c._itemCount!==1?'s':''}</span></td>
          <td><div style={{display:'flex',gap:4,justifyContent:'flex-end'}}><button className="ib" onClick={()=>openEdit(c)}>✏️</button><button className="ib dl" onClick={()=>del(c.id)}>🗑</button></div></td></tr>
        ))}</tbody>
      </table></div>}
    </div>
  );
}

// ── BILLING ───────────────────────────────────────────────────────
function Billing({clients}){
  const [form,setForm]=useState({clientId:'',from:'',to:''});
  const [result,setResult]=useState(null);const [loading,setLoading]=useState(false);
  const s=(k,v)=>setForm(f=>({...f,[k]:v}));
  const generate=async()=>{
    if(!form.clientId||!form.from||!form.to) return alert('Please fill in all fields.');
    if(form.from>form.to) return alert('Date From must be before Date To.');
    setLoading(true);setResult(await db.computeBilling(form.clientId,form.from,form.to));setLoading(false);
  };
  const client=clients.find(c=>c.id===result?.clientId);
  const allTxs=result?[...result.inTxsInPeriod,...result.outTxs].sort((a,b)=>a.date.localeCompare(b.date)):[];
  return(
    <div className="con">
      <div className="ph"><div className="phi pu">📄</div><h2>Billing Statement</h2></div>
      <div className="fgrid">
        <div className="fg"><label>Client *</label><select value={form.clientId} onChange={e=>s('clientId',e.target.value)}><option value="">— Select client —</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div className="fg"><label>Date From *</label><input type="date" value={form.from} onChange={e=>s('from',e.target.value)}/></div>
        <div className="fg"><label>Date To *</label><input type="date" value={form.to} onChange={e=>s('to',e.target.value)}/></div>
      </div>
      <button className="btn bac" onClick={generate} disabled={loading}>📄 {loading?'Computing…':'Generate Billing'}</button>
      {result&&(
        <div style={{background:'var(--sur)',border:'1px solid var(--bd)',borderRadius:'var(--rl)',marginTop:28,overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',padding:'20px 24px',borderBottom:'1px solid var(--bd)',gap:16}}>
            <div><div style={{fontFamily:'Syne',fontWeight:800,fontSize:17}}>Billing Statement</div><div style={{color:'var(--tx2)',fontSize:13,marginTop:3}}>{client?.name} · {fmtD(result.dateFrom)} – {fmtD(result.dateTo)}</div></div>
            <button className="btn bgh" onClick={()=>window.print()}>🖨 Print</button>
          </div>
          <div style={{padding:'14px 24px 0',fontSize:11,fontWeight:700,color:'var(--tx2)',letterSpacing:'.07em',textTransform:'uppercase'}}>Cold / Chilled Transactions</div>
          <div className="tw" style={{borderRadius:0,border:'none',borderTop:'1px solid var(--bd)',borderBottom:'1px solid var(--bd)'}}>
            <table><thead><tr><th>Date</th><th>Type</th><th>Item</th><th>Weight</th><th>Ref #</th></tr></thead>
            <tbody>{allTxs.length===0?<tr className="erow"><td colSpan={5}>No cold/chilled transactions in this period.</td></tr>:allTxs.map(t=>(
              <tr key={t.id}><td style={{fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{fmtD(t.date)}</td><td><span className={`bdg ${t.type==='IN'?'b-in':'b-out'}`}>{t.type==='IN'?'▼ IN':'▲ OUT'}</span></td><td style={{fontWeight:600}}>{t.item_name}</td><td style={{fontFamily:'JetBrains Mono',fontSize:12}}>{fmtKg(t.kg)}</td><td style={{color:'var(--tx2)'}}>{t.ref_no||'—'}</td></tr>
            ))}</tbody></table>
          </div>
          <div style={{padding:'10px 24px'}}>
            {[['Handling Fee — Stock In',`(${fmtM(result.rates.handling_in_per_kg)}/kg)`,result.hIn],['Handling Fee — Stock Out',`(${fmtM(result.rates.handling_out_per_kg)}/kg)`,result.hOut],['Storage Fee',`(${fmtM(result.rates.storage_per_kg_per_day)}/kg/day)`,result.storage],['Cold/Chilled Subtotal','',result.coldTotal,true]].map(([l,sub,v,bold])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--bd)',fontSize:bold?14:13.5,fontWeight:bold?700:400}}>
                <span>{l}{sub&&<span style={{color:'var(--tx2)',fontFamily:'JetBrains Mono',fontSize:11}}> {sub}</span>}</span>
                <span style={{fontFamily:'JetBrains Mono'}}>{fmtM(v)}</span>
              </div>
            ))}
          </div>
          {result.dryBilling?.rows?.length>0&&(
            <div style={{padding:'0 24px 16px'}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--or)',letterSpacing:'.07em',textTransform:'uppercase',marginBottom:8}}>Dry Storage — Contract Charges</div>
              <div style={{background:'rgba(227,179,65,.05)',border:'1px solid rgba(227,179,65,.2)',borderRadius:'var(--rl)',overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                  <thead><tr>{['Month','Period','Flat Fee','Slots × Rate','Total'].map(h=><th key={h} style={{background:'rgba(227,179,65,.08)',padding:'9px 14px',textAlign:'left',fontSize:10,fontWeight:700,color:'var(--or)',letterSpacing:'.06em',textTransform:'uppercase',borderBottom:'1px solid rgba(227,179,65,.15)'}}>{h}</th>)}</tr></thead>
                  <tbody>{result.dryBilling.rows.map((r,i)=>(
                    <tr key={i} style={{borderBottom:'1px solid rgba(227,179,65,.1)'}}>
                      <td style={{padding:'9px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{r.yearMonth}</td>
                      <td style={{padding:'9px 14px',fontSize:12,color:'var(--tx2)'}}>{r.period?.label}</td>
                      <td style={{padding:'9px 14px',fontFamily:'JetBrains Mono',fontSize:12}}>{fmtM(r.flat_fee)}</td>
                      <td style={{padding:'9px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{r.slots_occupied} × {fmtM(r.slot_rate)}</td>
                      <td style={{padding:'9px 14px',fontFamily:'JetBrains Mono',fontSize:13,fontWeight:700,color:'var(--or)'}}>{fmtM(r.total)}</td>
                    </tr>
                  ))}</tbody>
                  <tfoot><tr style={{background:'rgba(227,179,65,.08)',borderTop:'2px solid rgba(227,179,65,.2)'}}>
                    <td colSpan={4} style={{padding:'10px 14px',fontWeight:700,fontSize:12,color:'var(--or)'}}>Dry Storage Subtotal</td>
                    <td style={{padding:'10px 14px',fontFamily:'JetBrains Mono',fontSize:14,fontWeight:700,color:'var(--or)'}}>{fmtM(result.dryBilling.total)}</td>
                  </tr></tfoot>
                </table>
              </div>
            </div>
          )}
          <div style={{padding:'16px 24px',borderTop:'2px solid var(--bd)',display:'flex',justifyContent:'space-between',fontFamily:'Syne',fontWeight:800,fontSize:20,color:'var(--ac)'}}>
            <span>TOTAL DUE</span><span style={{fontFamily:'JetBrains Mono'}}>{fmtM(result.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CONTRACTS ────────────────────────────────────────────────────
function ContractStatusBadge({contract}){
  const td=today(),isAct=contract.start_date<=td&&contract.end_date>=td,isFut=contract.start_date>td;
  return <span className={`bdg ${isAct?'b-ctr-act':isFut?'b-ctr-fut':'b-ctr-exp'}`}>{isAct?'● Active':isFut?'◆ Upcoming':'✕ Expired'}</span>;
}

function EscalationEditor({periods,onChange}){
  const add=()=>onChange([...periods,{label:'New Period',start:'',end:'',flat_fee:periods[periods.length-1]?.flat_fee||0,slot_rate:periods[periods.length-1]?.slot_rate||0,slots_occupied:periods[periods.length-1]?.slots_occupied||0}]);
  const rm=i=>onChange(periods.filter((_,idx)=>idx!==i));
  const up=(i,k,v)=>onChange(periods.map((p,idx)=>idx===i?{...p,[k]:v}:p));
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8,fontSize:12,fontWeight:700,color:'var(--tx2)',letterSpacing:'.05em',textTransform:'uppercase'}}>
        Contract Periods / Escalation Schedule
        <button className="btn bgh" style={{fontSize:11,padding:'4px 10px'}} onClick={add}>+ Period</button>
      </div>
      {periods.map((p,i)=>(
        <div key={i} style={{background:'var(--sur2)',border:'1px solid var(--bd)',borderRadius:'var(--r)',padding:'12px 14px',marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <input value={p.label||''} onChange={e=>up(i,'label',e.target.value)} placeholder="e.g. Year 1" style={{flex:1,padding:'6px 10px',background:'var(--sur3)',border:'1px solid var(--bd)',borderRadius:'var(--r)',color:'var(--tx)',fontSize:13,outline:'none'}}/>
            <button className="ib dl" onClick={()=>rm(i)}>🗑</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
            {[['start','Start Date'],['end','End Date']].map(([k,l])=>(
              <div key={k}><div style={{fontSize:10,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:4}}>{l}</div>
              <input type="date" value={p[k]||''} onChange={e=>up(i,k,e.target.value)} style={{width:'100%',padding:'6px 10px',background:'var(--sur3)',border:'1px solid var(--bd)',borderRadius:'var(--r)',color:'var(--tx)',fontSize:13,outline:'none'}}/></div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
            {[['flat_fee','Flat Fee (₱/mo)'],['slot_rate','Slot Rate (₱/slot)'],['slots_occupied','Occupied Slots']].map(([k,l])=>(
              <div key={k}><div style={{fontSize:10,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:4}}>{l}</div>
              <input type="number" step="0.01" min="0" value={p[k]??''} onChange={e=>up(i,k,parseFloat(e.target.value)||0)} style={{width:'100%',padding:'6px 10px',background:'var(--sur3)',border:'1px solid var(--bd)',borderRadius:'var(--r)',color:'var(--tx)',fontSize:13,outline:'none',fontFamily:'JetBrains Mono'}}/></div>
            ))}
          </div>
          <div style={{marginTop:8,fontSize:12,color:'var(--tx2)'}}>Monthly total: <strong style={{color:'var(--or)',fontFamily:'JetBrains Mono'}}>{fmtM((p.flat_fee||0)+(p.slot_rate||0)*(p.slots_occupied||0))}</strong></div>
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
        <div className="info-box"><strong>{clientMap[contract.client_id]}</strong> · {locationMap[contract.location_id]||'—'}<br/>{fmtD(contract.start_date)} – {fmtD(contract.end_date)}{contract.notes&&<><br/><span style={{color:'var(--tx3)'}}>{contract.notes}</span></>}</div>
        {(contract.periods||[]).map((p,i)=>{
          const isCur=(p.start_date||p.start)<=td&&(p.end_date||p.end)>=td;
          return(<div key={i} style={{background:isCur?'rgba(227,179,65,.06)':'var(--sur2)',border:`1px solid ${isCur?'rgba(227,179,65,.3)':'var(--bd)'}`,borderRadius:'var(--r)',padding:'12px 14px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontWeight:700,fontSize:13}}>{p.label}</span>{isCur&&<span className="bdg b-ctr-act">● Current</span>}
            </div>
            <div style={{fontSize:12,color:'var(--tx2)',marginBottom:6}}>{fmtD(p.start_date||p.start)} – {fmtD(p.end_date||p.end)}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
              {[['Flat Fee',fmtM(p.flat_fee)+'/mo'],['Slot Rate',fmtM(p.slot_rate)+'/slot'],['Slots',(p.slots_occupied||0)+' slots']].map(([l,v])=>(
                <div key={l}><div style={{fontSize:10,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:2}}>{l}</div><div style={{fontFamily:'JetBrains Mono',fontSize:13,fontWeight:600}}>{v}</div></div>
              ))}
            </div>
            <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid var(--bd)',display:'flex',justifyContent:'space-between'}}>
              <span style={{fontSize:12,color:'var(--tx2)'}}>Monthly Total</span>
              <span style={{fontFamily:'JetBrains Mono',fontSize:15,fontWeight:700,color:'var(--or)'}}>{fmtM((p.flat_fee||0)+(p.slot_rate||0)*(p.slots_occupied||0))}</span>
            </div>
          </div>);
        })}
      </div>
      <div className="mft"><button className="btn bac" onClick={()=>{onClose();setTimeout(()=>onEdit(contract),50);}}>Edit Contract</button></div>
    </Modal>
  );
}

function ContractEditModal({form,setForm,clients,locations,isNew,onClose,onSave,saving}){
  const s=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(
    <div className="ov" onClick={onClose}>
      <div className="mdl wide" onClick={e=>e.stopPropagation()}>
        <div className="mhd"><span>{isNew?'New Dry Storage Contract':'Edit Contract'}</span><button onClick={onClose}>✕</button></div>
        <div className="mbd">
          <div className="fgrid">
            <div className="fg"><label>Client *</label><select value={form.client_id||''} onChange={e=>s('client_id',e.target.value)}><option value="">— Select —</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="fg"><label>Reference No.</label><input value={form.ref_no||''} onChange={e=>s('ref_no',e.target.value)} placeholder="DSC-2025-001"/></div>
            <div className="fg"><label>Location</label><select value={form.location_id||''} onChange={e=>s('location_id',e.target.value)}><option value="">— Select —</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
            <div className="fg"><label>Escalation Type</label><select value={form.escalation_type||'fixed_pct'} onChange={e=>s('escalation_type',e.target.value)}><option value="fixed_pct">Fixed % per year</option><option value="custom">Custom / Negotiated</option></select></div>
            <div className="fg"><label>Contract Start *</label><input type="date" value={form.start_date||''} onChange={e=>s('start_date',e.target.value)}/></div>
            <div className="fg"><label>Contract End *</label><input type="date" value={form.end_date||''} onChange={e=>s('end_date',e.target.value)}/></div>
            {(form.escalation_type||'fixed_pct')==='fixed_pct'&&<div className="fg"><label>Annual Escalation %</label><input type="number" step="0.1" min="0" value={form.escalation_pct||''} onChange={e=>s('escalation_pct',e.target.value)} placeholder="e.g. 5"/></div>}
            <div className="fg s2"><label>Notes</label><textarea value={form.notes||''} onChange={e=>s('notes',e.target.value)} rows={2} placeholder="Area B rows 1-10, annual 5% escalation"/></div>
          </div>
          <div className="info-box"><strong>Billing Formula:</strong> Monthly Bill = Flat Fee + (Slots Occupied × Slot Rate)<br/>Define one period per contract year with the negotiated rates for that year.</div>
          <EscalationEditor periods={form.periods||[]} onChange={p=>s('periods',p)}/>
          <div className="mft"><button className="btn bgh" onClick={onClose}>Cancel</button><button className="btn bac" onClick={onSave} disabled={saving}>{saving?'Saving…':'Save Contract'}</button></div>
        </div>
      </div>
    </div>
  );
}

function ContractCard({contract,clientMap,locationMap,curYM,td,onView,onEdit,onDelete}){
  const isActive=contract.start_date<=td&&contract.end_date>=td;
  const [curBill,setCurBill]=useState(null);
  useEffect(()=>{if(isActive) db.computeDryMonthBill(contract.client_id,curYM).then(setCurBill);},[isActive,contract.client_id,curYM]);
  return(
    <div className={`ctr-card ${isActive?'act-ctr':''}`}>
      <div className="ctr-hd">
        <div><div className="ctr-client">{clientMap[contract.client_id]||'—'}</div><div className="ctr-ref">{contract.ref_no}</div></div>
        <ContractStatusBadge contract={contract}/>
      </div>
      <div className="ctr-body">
        {[['Location',locationMap[contract.location_id]||'—'],['Period',`${fmtD(contract.start_date)} – ${fmtD(contract.end_date)}`],['Escalation',contract.escalation_type==='fixed_pct'?`Fixed ${contract.escalation_pct}% / yr`:'Custom / Negotiated'],['Periods',(contract.periods?.length||0)]].map(([l,v])=>(
          <div key={l} className="ctr-row"><span className="ctr-label">{l}</span><span className="ctr-val" style={{fontSize:12}}>{v}</span></div>
        ))}
        {curBill&&<div style={{marginTop:12,background:'var(--sur3)',borderRadius:'var(--r)',padding:'10px 12px'}}>
          <div style={{fontSize:10,fontWeight:700,color:'var(--tx3)',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:6}}>This Month — {curYM}</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontSize:12,color:'var(--tx2)'}}>{fmtM(curBill.flat_fee)} flat + {curBill.slots_occupied} slots × {fmtM(curBill.slot_rate)}</div>
            <div style={{fontFamily:'JetBrains Mono',fontSize:16,fontWeight:700,color:'var(--or)'}}>{fmtM(curBill.total)}</div>
          </div>
          <div style={{fontSize:11,color:'var(--tx3)',marginTop:3}}>{curBill.period?.label}</div>
        </div>}
      </div>
      <div className="ctr-foot">
        <button className="btn bgh" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>onView(contract)}>View</button>
        <button className="btn bgh" style={{fontSize:12,padding:'6px 12px'}} onClick={()=>onEdit(contract)}>Edit</button>
        <button className="ib dl" onClick={()=>onDelete(contract)}>🗑</button>
      </div>
    </div>
  );
}

function Contracts({clients,locations}){
  const [contracts,setContracts]=useState([]);const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(null);const [fc,setFc]=useState('');const [fs,setFs]=useState('active');
  const blank={client_id:'',ref_no:'',location_id:'',start_date:'',end_date:'',escalation_type:'fixed_pct',escalation_pct:5,notes:'',periods:[]};
  const [form,setForm]=useState(blank);const [saving,setSaving]=useState(false);
  const clientMap=Object.fromEntries(clients.map(c=>[c.id,c.name]));
  const locationMap=Object.fromEntries(locations.map(l=>[l.id,l.name]));
  const td=today(),curYM=today().slice(0,7);
  const reload=useCallback(async()=>{setLoading(true);setContracts(await db.getContracts());setLoading(false);},[]);
  useEffect(()=>{reload();},[reload]);
  const openNew=()=>{setForm(blank);setModal('new');};
  const openEdit=c=>{setForm({...c,periods:(c.periods||[]).map(p=>({...p,start:p.start_date||p.start,end:p.end_date||p.end}))});setModal('edit');};
  const openView=c=>{setForm({...c});setModal('view');};
  const save=async()=>{
    if(!form.client_id) return alert('Please select a client.');
    if(!form.start_date||!form.end_date) return alert('Start and end dates required.');
    if(form.start_date>form.end_date) return alert('Start date must be before end date.');
    if(!form.periods?.length) return alert('Please add at least one contract period.');
    setSaving(true);
    try{await db.saveContract({...form,escalation_pct:parseFloat(form.escalation_pct)||0,id:form.id||'CTR'+uid()});await reload();setModal(null);}
    catch(e){alert('Save failed: '+e.message);}
    setSaving(false);
  };
  const del=async c=>{if(!window.confirm(`Delete contract ${c.ref_no}?`)) return;await db.deleteContract(c.id);await reload();};
  const displayed=contracts.filter(c=>{
    if(fc&&c.client_id!==fc) return false;
    if(fs==='active'&&!(c.start_date<=td&&c.end_date>=td)) return false;
    if(fs==='expired'&&c.end_date>=td) return false;
    if(fs==='future'&&c.start_date<=td) return false;
    return true;
  });
  const [activeSummary,setActiveSummary]=useState([]);
  useEffect(()=>{
    const active=contracts.filter(c=>c.start_date<=td&&c.end_date>=td);
    Promise.all(active.map(async c=>{const b=await db.computeDryMonthBill(c.client_id,curYM);return{c,b};})).then(r=>setActiveSummary(r.filter(x=>x.b)));
  },[contracts]);
  const totalMonthly=activeSummary.reduce((s,x)=>s+(x.b?.total||0),0);
  return(
    <div className="con">
      <div className="ph"><div className="phi or">📋</div><h2>Dry Storage Contracts</h2><button className="btn bac mla" onClick={openNew}>+ New Contract</button></div>
      {modal==='view'&&<ContractViewModal contract={form} clientMap={clientMap} locationMap={locationMap} onClose={()=>setModal(null)} onEdit={openEdit}/>}
      {(modal==='new'||modal==='edit')&&<ContractEditModal form={form} setForm={setForm} clients={clients} locations={locations} isNew={modal==='new'} onClose={()=>setModal(null)} onSave={save} saving={saving}/>}
      {activeSummary.length>0&&(
        <div style={{background:'var(--sur)',border:'1px solid var(--bd)',borderRadius:'var(--rl)',padding:'16px 20px',marginBottom:24,display:'flex',alignItems:'center',gap:24,flexWrap:'wrap'}}>
          <div><div style={{fontSize:11,fontWeight:700,color:'var(--tx3)',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:4}}>Total Dry Storage — {curYM}</div><div style={{fontFamily:'JetBrains Mono',fontSize:22,fontWeight:600,color:'var(--or)'}}>{fmtM(totalMonthly)}</div></div>
          <div style={{width:1,height:40,background:'var(--bd)',flexShrink:0}}/>
          {activeSummary.map(({c,b})=>(
            <div key={c.id}><div style={{fontSize:11,color:'var(--tx2)',marginBottom:3}}>{clientMap[c.client_id]}</div><div style={{fontFamily:'JetBrains Mono',fontSize:15,fontWeight:600}}>{fmtM(b.total)}<span style={{fontSize:11,color:'var(--tx3)',marginLeft:6}}>/mo</span></div></div>
          ))}
        </div>
      )}
      <div className="fbar" style={{marginBottom:20}}>
        <select value={fs} onChange={e=>setFs(e.target.value)}><option value="all">All</option><option value="active">Active</option><option value="future">Upcoming</option><option value="expired">Expired</option></select>
        <select value={fc} onChange={e=>setFc(e.target.value)}><option value="">All Clients</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <span style={{fontSize:13,color:'var(--tx2)',alignSelf:'center',fontFamily:'JetBrains Mono'}}>{displayed.length} contract{displayed.length!==1?'s':''}</span>
      </div>
      {loading?<Spinner/>:displayed.length===0?<div style={{textAlign:'center',color:'var(--tx3)',padding:'48px',fontSize:13}}>No contracts found.</div>:
        <div className="ctr-grid">{displayed.map(c=><ContractCard key={c.id} contract={c} clientMap={clientMap} locationMap={locationMap} curYM={curYM} td={td} onView={openView} onEdit={openEdit} onDelete={del}/>)}</div>}
    </div>
  );
}

// ── SPARE PARTS ──────────────────────────────────────────────────
function StockBar({current,min}){
  const pct=min>0?Math.min(100,Math.round((current/min)*100)):100;
  const color=current===0?'var(--rd)':current<=min?'var(--or)':'var(--ac)';
  return <div className="sp-stock-bar"><div className="sp-stock-bar-fill" style={{width:pct+'%',background:color}}/></div>;
}

function PartCard({part,machines,onEdit,onIssue,onReceive}){
  const cls=part.current_stock===0?'alert':part.current_stock<=part.min_stock?'warn':'';
  const nc=part.current_stock===0?'low':part.current_stock<=part.min_stock?'warn':'ok';
  const linked=(machines||[]).filter(m=>(part.machine_ids||[]).includes(m.id));
  return(
    <div className={`sp-card ${cls}`}>
      <div className="sp-card-hd">
        <div><div className="sp-card-name">{part.name}</div><div className="sp-card-pn">{part.part_no}</div></div>
        <span className={`bdg ${cls==='alert'?'b-out':cls==='warn'?'b-per':'b-on'}`}>{cls==='alert'?'🔴 OUT':cls==='warn'?'⚠ LOW':'✓ OK'}</span>
      </div>
      <div className="sp-card-body">
        <div className="sp-stock-row">
          <div><div className={`sp-stock-num ${nc}`}>{part.current_stock} <span style={{fontSize:13,fontWeight:400,color:'var(--tx2)'}}>{part.unit}</span></div><div style={{fontSize:11,color:'var(--tx3)'}}>Min: {part.min_stock} {part.unit}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontFamily:'JetBrains Mono',fontSize:13}}>{fmtM(part.unit_cost)}<span style={{fontSize:10,color:'var(--tx2)'}}>/{part.unit}</span></div><div style={{fontSize:11,color:'var(--tx3)'}}>Value: {fmtM(part.current_stock*part.unit_cost)}</div></div>
        </div>
        <StockBar current={part.current_stock} min={part.min_stock}/>
        <div className="sp-meta">{part.category&&<span>📦 {part.category}</span>}{part.location&&<span>📍 {part.location}</span>}{part.supplier&&<span>🏭 {part.supplier}</span>}</div>
        {linked.length>0&&<div style={{display:'flex',gap:5,flexWrap:'wrap'}}>{linked.map(m=><span key={m.id} className="pill p-mu" style={{fontSize:10}}>⚙️ {m.name}</span>)}</div>}
      </div>
      <div className="sp-card-foot">
        <button className="btn bgh" style={{fontSize:11,padding:'5px 10px'}} onClick={()=>onReceive(part)}>📥 Receive</button>
        <button className="btn bgh" style={{fontSize:11,padding:'5px 10px'}} onClick={()=>onIssue(part)}>📤 Issue</button>
        <button className="ib" onClick={()=>onEdit(part)}>✏️</button>
      </div>
    </div>
  );
}

function SpMovementModal({part,type,user,machines,onClose,onSaved}){
  const isIssue=type==='issue',isAdjust=type==='adjust';
  const [qty,setQty]=useState('');const [machineId,setMachineId]=useState('');
  const [notes,setNotes]=useState('');const [refNo,setRefNo]=useState('');const [saving,setSaving]=useState(false);
  const submit=async()=>{
    const q=parseFloat(qty);
    if(!q||q<=0) return alert('Enter a valid quantity.');
    if(isIssue&&!machineId) return alert('Please select the machine.');
    if(isIssue&&q>part.current_stock) return alert(`Only ${part.current_stock} ${part.unit} in stock.`);
    setSaving(true);
    await db.saveMovement({type,part_id:part.id,part_name:part.name,machine_id:machineId||null,machine_name:(machines||[]).find(m=>m.id===machineId)?.name||'',qty:q,ref_no:refNo,notes,encoded_by:user.name});
    onSaved();onClose();
  };
  const label=isIssue?'Issue Out':type==='receive'?'Receive Stock':isAdjust?'Adjust Stock':'Return';
  return(
    <Modal title={`${label} — ${part.name}`} onClose={onClose}>
      <div style={{background:'var(--sur2)',borderRadius:'var(--r)',padding:'10px 14px',marginBottom:16,fontSize:13}}>
        Current Stock: <strong style={{fontFamily:'JetBrains Mono',color:part.current_stock===0?'var(--rd)':part.current_stock<=part.min_stock?'var(--or)':'var(--ac)'}}>{part.current_stock} {part.unit}</strong>
        {isAdjust&&<span style={{color:'var(--tx2)',marginLeft:8}}>— enter the new total stock level</span>}
      </div>
      <div className="fgrid">
        <div className="fg s2"><label>{isAdjust?'New Stock Level':'Quantity'} ({part.unit}) *</label><input type="number" step="0.01" min="0" value={qty} onChange={e=>setQty(e.target.value)} placeholder="0" autoFocus/></div>
        {isIssue&&<div className="fg s2"><label>Machine / Equipment *</label><select value={machineId} onChange={e=>setMachineId(e.target.value)}><option value="">— Select machine —</option>{(machines||[]).map(m=><option key={m.id} value={m.id}>{m.name} ({m.asset_tag})</option>)}</select></div>}
        <div className="fg"><label>Reference No.</label><input value={refNo} onChange={e=>setRefNo(e.target.value)} placeholder="PO / DR / JO number"/></div>
        <div className="fg"><label>Notes</label><input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional remarks"/></div>
      </div>
      <div className="mft"><button className="btn bgh" onClick={onClose}>Cancel</button><button className={`btn ${isIssue?'brd':'bac'}`} onClick={submit} disabled={saving}>{saving?'Saving…':label}</button></div>
    </Modal>
  );
}

function SpPartModal({part,machines,onClose,onSaved}){
  const blank={name:'',part_no:'',unit:'pcs',category:'',min_stock:1,current_stock:0,supplier:'',unit_cost:0,machine_ids:[],location:'',notes:''};
  const [form,setForm]=useState(part?{...part,machine_ids:[...(part.machine_ids||[])]}:blank);
  const [saving,setSaving]=useState(false);
  const s=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleM=id=>setForm(f=>({...f,machine_ids:f.machine_ids.includes(id)?f.machine_ids.filter(x=>x!==id):[...f.machine_ids,id]}));
  const CATS=['Belts','Filters','Motors','Bearings','Refrigerants','Lubricants','Electrical','Controls','Mechanical','Safety','Consumables','Other'];
  const save=async()=>{
    if(!form.name?.trim()||!form.part_no?.trim()) return alert('Name and part number required.');
    setSaving(true);
    await db.savePart({...form,id:form.id||'PRT'+uid(),min_stock:parseFloat(form.min_stock)||0,current_stock:parseFloat(form.current_stock)||0,unit_cost:parseFloat(form.unit_cost)||0});
    onSaved();onClose();
  };
  return(
    <div className="ov" onClick={onClose}>
      <div className="mdl wide" onClick={e=>e.stopPropagation()}>
        <div className="mhd"><span>{part?'Edit Part':'New Part'}</span><button onClick={onClose}>✕</button></div>
        <div className="mbd">
          <div className="fgrid">
            <div className="fg s2"><label>Part Name *</label><input value={form.name} onChange={e=>s('name',e.target.value)} placeholder="e.g. Compressor Belt V-Type"/></div>
            <div className="fg"><label>Part Number *</label><input value={form.part_no} onChange={e=>s('part_no',e.target.value)} placeholder="BLT-VT-12" style={{fontFamily:'JetBrains Mono'}}/></div>
            <div className="fg"><label>Category</label><select value={form.category} onChange={e=>s('category',e.target.value)}><option value="">— Select —</option>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div className="fg"><label>Unit</label><input value={form.unit} onChange={e=>s('unit',e.target.value)} placeholder="pcs / kg / L / set"/></div>
            <div className="fg"><label>Min Stock Level</label><input type="number" step="0.01" min="0" value={form.min_stock} onChange={e=>s('min_stock',e.target.value)}/></div>
            {!part&&<div className="fg"><label>Opening Stock</label><input type="number" step="0.01" min="0" value={form.current_stock} onChange={e=>s('current_stock',e.target.value)}/></div>}
            <div className="fg"><label>Unit Cost (₱)</label><input type="number" step="0.01" min="0" value={form.unit_cost} onChange={e=>s('unit_cost',e.target.value)}/></div>
            <div className="fg"><label>Supplier</label><input value={form.supplier} onChange={e=>s('supplier',e.target.value)} placeholder="Supplier name"/></div>
            <div className="fg s2"><label>Storage Location</label><input value={form.location} onChange={e=>s('location',e.target.value)} placeholder="e.g. Parts Room A, Cabinet 3"/></div>
            <div className="fg s2"><label>Notes</label><textarea value={form.notes} onChange={e=>s('notes',e.target.value)} rows={2}/></div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:12,fontWeight:700,color:'var(--tx2)',letterSpacing:'.05em',textTransform:'uppercase',display:'block',marginBottom:8}}>Linked Machines</label>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{(machines||[]).map(m=><button key={m.id} onClick={()=>toggleM(m.id)} className={`chip ${form.machine_ids.includes(m.id)?'act':''}`}>⚙️ {m.name}</button>)}</div>
          </div>
          <div className="mft"><button className="btn bgh" onClick={onClose}>Cancel</button><button className="btn bac" onClick={save} disabled={saving}>{saving?'Saving…':'Save Part'}</button></div>
        </div>
      </div>
    </div>
  );
}

function SpMachineModal({machine,onClose,onSaved}){
  const blank={name:'',type:'',location:'',asset_tag:'',status:'active',notes:''};
  const [form,setForm]=useState(machine||blank);const [saving,setSaving]=useState(false);
  const s=(k,v)=>setForm(f=>({...f,[k]:v}));
  const TYPES=['Refrigeration','Compressor','Material Handling','Conveyor','Processing','Electrical','HVAC','Vehicle','Other'];
  const save=async()=>{if(!form.name?.trim()) return alert('Machine name is required.');setSaving(true);await db.saveMachine({...form,id:form.id||'MCH'+uid()});onSaved();onClose();};
  return(
    <Modal title={machine?'Edit Machine':'New Machine'} onClose={onClose}>
      <div className="fgrid">
        <div className="fg s2"><label>Machine Name *</label><input value={form.name} onChange={e=>s('name',e.target.value)} placeholder="e.g. Blast Freezer Unit 1"/></div>
        <div className="fg"><label>Type</label><select value={form.type} onChange={e=>s('type',e.target.value)}><option value="">— Select —</option>{TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        <div className="fg"><label>Asset Tag</label><input value={form.asset_tag} onChange={e=>s('asset_tag',e.target.value)} placeholder="BF-001" style={{fontFamily:'JetBrains Mono'}}/></div>
        <div className="fg"><label>Location</label><input value={form.location} onChange={e=>s('location',e.target.value)} placeholder="Cold Storage 1"/></div>
        <div className="fg"><label>Status</label><select value={form.status} onChange={e=>s('status',e.target.value)}><option value="active">Active</option><option value="maintenance">Under Maintenance</option><option value="inactive">Inactive</option></select></div>
        <div className="fg s2"><label>Notes</label><textarea value={form.notes} onChange={e=>s('notes',e.target.value)} rows={2}/></div>
      </div>
      <div className="mft"><button className="btn bgh" onClick={onClose}>Cancel</button><button className="btn bac" onClick={save} disabled={saving}>{saving?'Saving…':'Save Machine'}</button></div>
    </Modal>
  );
}

function SpareParts({user}){
  const [tab,setTab]=useState('inventory');
  const [parts,setParts]=useState([]);const [machines,setMachines]=useState([]);
  const [movements,setMovements]=useState([]);const [prs,setPRs]=useState([]);
  const [dash,setDash]=useState({low:[],warn:[],ok:[],openPRs:[],totalValue:0});
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(null);const [search,setSearch]=useState('');const [catFilter,setCatFilter]=useState('');
  const reload=useCallback(async()=>{
    setLoading(true);
    const [p,m,mv,pr,d]=await Promise.all([db.getParts(),db.getMachines(),db.getMovements(),db.getPurchaseRequests(),db.getSpDashboard()]);
    setParts(p);setMachines(m);setMovements(mv);setPRs(pr);setDash(d);setLoading(false);
  },[]);
  useEffect(()=>{reload();},[reload]);
  const fp=parts.filter(p=>{const q=search.toLowerCase();if(q&&!p.name.toLowerCase().includes(q)&&!p.part_no.toLowerCase().includes(q))return false;if(catFilter&&p.category!==catFilter)return false;return true;});
  const cats=[...new Set(parts.map(p=>p.category).filter(Boolean))].sort();
  const prC={urgent:'var(--rd)',high:'var(--or)',normal:'var(--bl)'};
  const receivePR=async pr=>{
    await db.saveMovement({type:'receive',part_id:pr.part_id,part_name:pr.part_name,qty:pr.qty,ref_no:'PR-'+pr.id.slice(-4),notes:'From PO '+pr.id,encoded_by:user.name,machine_id:null,machine_name:''});
    await db.savePR({...pr,status:'received'});await reload();
  };
  return(
    <div className="con">
      {modal?.type==='part'&&<SpPartModal part={modal.data} machines={machines} onClose={()=>setModal(null)} onSaved={reload}/>}
      {modal?.type==='machine'&&<SpMachineModal machine={modal.data} onClose={()=>setModal(null)} onSaved={reload}/>}
      {(modal?.type==='issue'||modal?.type==='receive'||modal?.type==='adjust'||modal?.type==='return')&&
        <SpMovementModal part={modal.data} type={modal.type} user={user} machines={machines} onClose={()=>setModal(null)} onSaved={reload}/>}
      <div className="ph"><div className="phi gr">🔧</div><h2>Spare Parts</h2></div>
      {(dash.low.length>0||dash.warn.length>0)&&(
        <div className="sp-alert-bar">⚠️
          {dash.low.length>0&&<span><strong>{dash.low.length}</strong> part{dash.low.length!==1?'s':''} OUT OF STOCK</span>}
          {dash.warn.length>0&&<span><strong>{dash.warn.length}</strong> part{dash.warn.length!==1?'s':''} BELOW MINIMUM</span>}
          {dash.openPRs.length>0&&<span>· <strong>{dash.openPRs.length}</strong> open purchase request{dash.openPRs.length!==1?'s':''}</span>}
          <span style={{marginLeft:'auto',color:'var(--rd)',fontSize:12}}>Inventory value: {fmtM(dash.totalValue)}</span>
        </div>
      )}
      <div className="sp-tabs">{[['inventory','📦 Inventory'],['movements','📋 Movements'],['purchase','🛒 Purchase Requests'],['machines','⚙️ Machines']].map(([k,l])=><button key={k} className={`sp-tab ${tab===k?'on':''}`} onClick={()=>setTab(k)}>{l}</button>)}</div>
      {loading&&<Spinner/>}
      {!loading&&tab==='inventory'&&<>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:18}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search parts…" style={{padding:'8px 12px',background:'var(--sur3)',border:'1px solid var(--bd)',borderRadius:'var(--r)',color:'var(--tx)',fontSize:13,outline:'none',width:220}}/>
          <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{padding:'8px 12px',background:'var(--sur3)',border:'1px solid var(--bd)',borderRadius:'var(--r)',color:'var(--tx)',fontSize:13,outline:'none'}}><option value="">All Categories</option>{cats.map(c=><option key={c} value={c}>{c}</option>)}</select>
          <button className="btn bac mla" onClick={()=>setModal({type:'part',data:null})}>+ Add Part</button>
        </div>
        <div className="sp-cards">{fp.map(p=><PartCard key={p.id} part={p} machines={machines} onEdit={pt=>setModal({type:'part',data:pt})} onIssue={pt=>setModal({type:'issue',data:pt})} onReceive={pt=>setModal({type:'receive',data:pt})}/>)}{fp.length===0&&<div style={{color:'var(--tx3)',fontSize:13,padding:'24px 0'}}>No parts found.</div>}</div>
      </>}
      {!loading&&tab==='movements'&&<>
        <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:16,flexWrap:'wrap'}}>
          <span style={{fontSize:13,color:'var(--tx2)',fontFamily:'JetBrains Mono'}}>{movements.length} total movements</span>
          {parts.length>0&&<div style={{display:'flex',gap:6,marginLeft:'auto'}}>{[['receive','📥 Receive'],['issue','📤 Issue'],['adjust','🔄 Adjust']].map(([t,l])=><button key={t} className="btn bgh" style={{fontSize:12,padding:'7px 12px'}} onClick={()=>setModal({type:t,data:parts[0]})}>{l}</button>)}</div>}
        </div>
        <div className="tw"><table>
          <thead><tr><th>Date</th><th>Part</th><th>Type</th><th>Machine</th><th>Qty</th><th>Ref #</th><th>By</th></tr></thead>
          <tbody>
            {movements.length===0&&<tr className="erow"><td colSpan={7}>No movements recorded yet.</td></tr>}
            {movements.map(m=>(
              <tr key={m.id}>
                <td style={{fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{fmtD((m.date||'').slice(0,10))}</td>
                <td style={{fontWeight:600}}>{m.part_name}</td>
                <td><span className={`bdg ${m.type==='receive'||m.type==='return'?'b-in':m.type==='issue'?'b-out':'b-per'}`}>{m.type==='receive'?'▼ RECEIVE':m.type==='issue'?'▲ ISSUE':m.type==='return'?'↩ RETURN':'⇄ ADJUST'}</span></td>
                <td style={{color:'var(--tx2)',fontSize:12}}>{m.machine_name||'—'}</td>
                <td style={{fontFamily:'JetBrains Mono',fontSize:13,fontWeight:600,color:m.type==='issue'?'var(--rd)':'var(--ac)'}}>{m.type==='issue'?'-':'+' }{m.qty}</td>
                <td style={{color:'var(--tx2)'}}>{m.ref_no||'—'}</td>
                <td style={{color:'var(--tx2)',fontSize:12}}>{m.encoded_by}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </>}
      {!loading&&tab==='purchase'&&<>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
          <select onChange={async e=>{const p=parts.find(x=>x.id===e.target.value);if(!p)return;const qty=parseFloat(window.prompt(`Quantity to order (${p.unit})?`)||'0');if(!qty||qty<=0)return;await db.savePR({id:'PR'+uid(),part_id:p.id,part_name:p.name,qty,supplier:p.supplier,unit_cost:p.unit_cost,status:'open',priority:'normal',requested_by:user.name,requested_at:new Date().toISOString(),notes:'',received_qty:0});await reload();e.target.value='';}}
            style={{padding:'8px 12px',background:'var(--sur3)',border:'1px solid var(--bd)',borderRadius:'var(--r)',color:'var(--tx)',fontSize:13,outline:'none'}}><option value="">+ New Request — Select Part</option>{parts.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
        </div>
        {prs.length===0&&<div style={{color:'var(--tx3)',fontSize:13,padding:'24px 0'}}>No purchase requests yet.</div>}
        {prs.map(pr=>(
          <div key={pr.id} className={`pr-card ${pr.priority==='urgent'?'urgent':''}`}>
            <div>
              <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{pr.part_name}</div>
              <div style={{display:'flex',gap:12,flexWrap:'wrap',fontSize:12,color:'var(--tx2)',marginBottom:8}}>
                <span>Qty: <strong style={{fontFamily:'JetBrains Mono',color:'var(--tx)'}}>{pr.qty}</strong></span>
                <span>Unit: <strong style={{fontFamily:'JetBrains Mono',color:'var(--tx)'}}>{fmtM(pr.unit_cost)}</strong></span>
                <span>Total: <strong style={{fontFamily:'JetBrains Mono',color:'var(--or)'}}>{fmtM(pr.qty*pr.unit_cost)}</strong></span>
                {pr.supplier&&<span>Supplier: {pr.supplier}</span>}
              </div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                <span className={`bdg ${pr.status==='open'?'b-pr-open':pr.status==='ordered'?'b-pr-ordered':'b-pr-received'}`}>{pr.status==='open'?'● Open':pr.status==='ordered'?'◆ Ordered':'✓ Received'}</span>
                <span className="bdg" style={{background:pr.priority==='urgent'?'var(--rdd)':pr.priority==='high'?'var(--ord)':'var(--sur3)',color:prC[pr.priority]||'var(--tx2)'}}>{pr.priority?.toUpperCase()}</span>
                <span style={{fontSize:11,color:'var(--tx3)'}}>By {pr.requested_by} · {fmtD((pr.requested_at||'').slice(0,10))}</span>
              </div>
              {pr.notes&&<div style={{fontSize:12,color:'var(--tx2)',marginTop:6}}>📝 {pr.notes}</div>}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
              {pr.status==='open'&&<button className="btn bgh" style={{fontSize:11,padding:'5px 10px'}} onClick={async()=>{await db.savePR({...pr,status:'ordered'});await reload();}}>Mark Ordered</button>}
              {pr.status==='ordered'&&<button className="btn bac" style={{fontSize:11,padding:'5px 10px'}} onClick={()=>receivePR(pr)}>✓ Received</button>}
              <button className="ib dl" onClick={async()=>{if(window.confirm('Delete?')){await db.deletePR(pr.id);await reload();}}}>🗑</button>
            </div>
          </div>
        ))}
      </>}
      {!loading&&tab==='machines'&&<>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}><button className="btn bac" onClick={()=>setModal({type:'machine',data:null})}>+ Add Machine</button></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
          {machines.map(m=>{
            const linked=parts.filter(p=>(p.machine_ids||[]).includes(m.id));
            const low=linked.filter(p=>p.current_stock<=p.min_stock);
            return(
              <div key={m.id} className="mach-card" style={{border:`1px solid ${low.length>0?'rgba(227,179,65,.3)':'var(--bd)'}`}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:8}}>
                  <div><div className="mach-card-name">{m.name}</div><div style={{fontSize:11,color:'var(--tx2)',fontFamily:'JetBrains Mono'}}>{m.asset_tag}</div></div>
                  <span className={`bdg ${m.status==='active'?'b-on':m.status==='maintenance'?'b-per':'b-off'}`}>{m.status==='active'?'Active':m.status==='maintenance'?'Maintenance':'Inactive'}</span>
                </div>
                <div style={{fontSize:12,color:'var(--tx2)',marginBottom:8}}>{m.type&&<span>🏷 {m.type} </span>}{m.location&&<span>📍 {m.location}</span>}</div>
                {linked.length>0&&<div><div style={{fontSize:10,fontWeight:700,color:'var(--tx3)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:5}}>Linked Parts ({linked.length})</div>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>{linked.map(p=><span key={p.id} className={`pill ${p.current_stock<=p.min_stock?'p-or':'p-teal'}`} style={{fontSize:10}}>{p.current_stock<=p.min_stock?'⚠ ':''}{p.name}</span>)}</div>
                </div>}
                {m.notes&&<div style={{marginTop:8,fontSize:11,color:'var(--tx3)'}}>📝 {m.notes}</div>}
                <div style={{marginTop:10,display:'flex',gap:6,justifyContent:'flex-end'}}>
                  <button className="ib" onClick={()=>setModal({type:'machine',data:m})}>✏️</button>
                  <button className="ib dl" onClick={async()=>{if(window.confirm(`Delete "${m.name}"?`)){await db.deleteMachine(m.id);await reload();}}}>🗑</button>
                </div>
              </div>
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
  const [rates,setR]=useState(null);const [users,setUsers]=useState([]);const [locs,setLocs]=useState([]);
  const [modal,setModal]=useState(null);const [uForm,setUF]=useState({});const [lForm,setLF]=useState({});
  const [saving,setSaving]=useState(false);const [rateSaved,setRS]=useState(false);
  const su=(k,v)=>setUF(f=>({...f,[k]:v}));const sl=(k,v)=>setLF(f=>({...f,[k]:v}));
  const reloadAll=useCallback(async()=>{const [r,u,l]=await Promise.all([db.getRates(),db.getUsers(),db.getLocations()]);setR(r);setUsers(u);setLocs(l);},[]);
  useEffect(()=>{reloadAll();},[reloadAll]);
  const saveRates=async()=>{setSaving(true);await db.saveRates(rates);setSaving(false);setRS(true);setTimeout(()=>setRS(false),2500);};
  const saveU=async()=>{
    if(!uForm.name?.trim()||!uForm.username?.trim()) return alert('Name and username required.');
    if(modal==='nu'&&!uForm.password) return alert('Password required for new user.');
    if(users.find(u=>u.username===uForm.username&&u.id!==uForm.id)) return alert('Username already taken.');
    setSaving(true);const t={...uForm,id:uForm.id||'USR'+uid()};if(!uForm.password&&modal==='eu') delete t.password;
    await db.saveUser(t);await reloadAll();setSaving(false);setModal(null);
  };
  const delU=async u=>{if(u.id===currentUser.id) return alert('Cannot delete your own account.');if(!window.confirm(`Delete "${u.name}"?`)) return;await db.deleteUser(u.id);await reloadAll();};
  const saveL=async()=>{
    if(!lForm.name?.trim()) return alert('Location name required.');
    if(locs.find(l=>l.name.toLowerCase()===lForm.name.trim().toLowerCase()&&l.id!==lForm.id)) return alert('Name already exists.');
    setSaving(true);await db.saveLocation({...lForm,name:lForm.name.trim(),id:lForm.id||'LOC'+uid()});await reloadAll();setSaving(false);setModal(null);
  };
  const delL=async l=>{if(!window.confirm(`Delete "${l.name}"?`)) return;await db.deleteLocation(l.id);await reloadAll();};
  return(
    <div className="con">
      <div className="ph"><div className="phi or">⚙️</div><h2>Settings</h2></div>
      <div className="tbar">
        <button className={`tab ${tab==='rates'?'on':''}`} onClick={()=>setTab('rates')}>Rates</button>
        <button className={`tab ${tab==='locations'?'on':''}`} onClick={()=>setTab('locations')}>Locations</button>
        <button className={`tab ${tab==='users'?'on':''}`} onClick={()=>setTab('users')}>Users</button>
      </div>
      {tab==='rates'&&(rates?<div className="sbox">
        <p className="hint">These rates apply globally to all cold/chilled billing computations.</p>
        {rateSaved&&<div className="ok-bar">✓ Rates saved!</div>}
        <div className="fgrid">
          {[['storage_per_kg_per_day','Storage Fee (₱/kg/day)'],['handling_in_per_kg','Handling Fee — Stock In (₱/kg)'],['handling_out_per_kg','Handling Fee — Stock Out (₱/kg)']].map(([k,l])=>(
            <div key={k} className="fg"><label>{l}</label><input type="number" step="0.01" min="0" value={rates[k]??''} onChange={e=>setR(r=>({...r,[k]:parseFloat(e.target.value)||0}))}/></div>
          ))}
        </div>
        <button className="btn bac" onClick={saveRates} disabled={saving}>{saving?'Saving…':'💾 Save Rates'}</button>
      </div>:<Spinner/>)}
      {tab==='locations'&&<div className="sbox">
        {(modal==='nl'||modal==='el')&&<Modal title={modal==='nl'?'New Location':'Edit Location'} onClose={()=>setModal(null)}>
          <div className="fgrid">
            <div className="fg s2"><label>Location Name *</label><input value={lForm.name||''} onChange={e=>sl('name',e.target.value)} placeholder="e.g. Cold Storage 1"/></div>
            <div className="fg s2"><label>Description</label><input value={lForm.description||''} onChange={e=>sl('description',e.target.value)} placeholder="e.g. Main frozen area, Rack A–D"/></div>
          </div>
          <div className="mft"><button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button><button className="btn bac" onClick={saveL} disabled={saving}>{saving?'Saving…':'Save'}</button></div>
        </Modal>}
        <p className="hint">Storage locations appear in Stock In/Out forms and on the inventory panel.</p>
        <div style={{marginBottom:16}}><button className="btn bac" onClick={()=>{setLF({name:'',description:''});setModal('nl');}}>+ Add Location</button></div>
        <div className="tw"><table><thead><tr><th>Name</th><th>Description</th><th></th></tr></thead>
          <tbody>{locs.length===0?<tr className="erow"><td colSpan={3}>No locations yet.</td></tr>:locs.map(l=>(
            <tr key={l.id}><td><span className="bdg b-loc">🏗 {l.name}</span></td><td style={{color:'var(--tx2)'}}>{l.description||'—'}</td>
            <td><div style={{display:'flex',gap:4,justifyContent:'flex-end'}}><button className="ib" onClick={()=>{setLF({...l});setModal('el');}}>✏️</button><button className="ib dl" onClick={()=>delL(l)}>🗑</button></div></td></tr>
          ))}</tbody>
        </table></div>
      </div>}
      {tab==='users'&&<div className="sbox">
        {(modal==='nu'||modal==='eu')&&<Modal title={modal==='nu'?'New User':'Edit User'} onClose={()=>setModal(null)}>
          <div className="fgrid">
            <div className="fg"><label>Full Name *</label><input value={uForm.name||''} onChange={e=>su('name',e.target.value)}/></div>
            <div className="fg"><label>Username *</label><input value={uForm.username||''} onChange={e=>su('username',e.target.value)}/></div>
            <div className="fg"><label>Password {modal==='eu'?'(blank=keep)':'*'}</label><input type="password" value={uForm.password||''} onChange={e=>su('password',e.target.value)}/></div>
            <div className="fg"><label>Role</label><select value={uForm.role||'personnel'} onChange={e=>su('role',e.target.value)}><option value="admin">Admin</option><option value="personnel">Personnel</option></select></div>
            <div className="fg"><label>Status</label><select value={String(uForm.active??true)} onChange={e=>su('active',e.target.value==='true')}><option value="true">Active</option><option value="false">Inactive</option></select></div>
          </div>
          <div className="mft"><button className="btn bgh" onClick={()=>setModal(null)}>Cancel</button><button className="btn bac" onClick={saveU} disabled={saving}>{saving?'Saving…':'Save'}</button></div>
        </Modal>}
        <div style={{marginBottom:16}}><button className="btn bac" onClick={()=>{setUF({name:'',username:'',password:'',role:'personnel',active:true});setModal('nu');}}>+ Add User</button></div>
        <div className="tw"><table><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>{users.map(u=>(
            <tr key={u.id}><td><strong>{u.name}</strong></td><td style={{fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tx2)'}}>{u.username}</td>
            <td><span className={`bdg ${u.role==='admin'?'b-adm':'b-per'}`}>{u.role}</span></td>
            <td><span className={`bdg ${u.active?'b-on':'b-off'}`}>{u.active?'Active':'Inactive'}</span></td>
            <td><div style={{display:'flex',gap:4,justifyContent:'flex-end'}}><button className="ib" onClick={()=>{setUF({...u,password:''});setModal('eu');}}>✏️</button><button className="ib dl" onClick={()=>delU(u)}>🗑</button></div></td></tr>
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
  const doLogin=async()=>{setLL(true);setLe('');const u=await db.login(lu,lp);setLL(false);if(u){setUser(u);setPage('dashboard');await reload();}else setLe('Invalid username or password.');};
  const doLogout=()=>{setUser(null);setLu('');setLp('');setLe('');};

  const ALL_NAV=[
    {section:'Operations'},
    {id:'dashboard',   label:'Dashboard',    icon:'📊',roles:['admin','personnel']},
    {id:'stock-in',    label:'Stock In',      icon:'📥',roles:['admin','personnel']},
    {id:'stock-out',   label:'Stock Out',     icon:'📤',roles:['admin','personnel']},
    {id:'transactions',label:'Transactions',  icon:'📋',roles:['admin','personnel']},
    {section:'Management'},
    {id:'contracts',   label:'Dry Contracts', icon:'📋',roles:['admin']},
    {id:'items',       label:'Item Database', icon:'📦',roles:['admin']},
    {id:'clients',     label:'Clients',       icon:'🏢',roles:['admin']},
    {id:'billing',     label:'Billing',       icon:'📄',roles:['admin']},
    {section:'Maintenance'},
    {id:'spareparts',  label:'Spare Parts',   icon:'🔧',roles:['admin','personnel']},
    {section:'System'},
    {id:'settings',    label:'Settings',      icon:'⚙️',roles:['admin']},
  ];
  const nav=user?ALL_NAV.filter(n=>n.section||(n.roles&&n.roles.includes(user.role))):[];
  const goTo=id=>{setPage(id);setSide(false);if(['clients','items','settings','contracts'].includes(id)) reload();};

  if(!user) return(
    <div className="lw">
      <div className="lc">
        <div className="lbrand">
          <div className="lbrand-icon"><img src={FKC_LOGO} alt="FKC" style={{width:38,height:38,objectFit:'contain'}}/></div>
          <span className="lbrand-name">FKC Logistics</span>
        </div>
        <p className="lsub">Cold Storage Management System</p>
        {le&&<div className="err-bar">{le}</div>}
        <div className="fgrp"><label className="fl">Username</label><input className="fi" value={lu} onChange={e=>{setLu(e.target.value);setLe('');}} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="Enter username" autoComplete="username"/></div>
        <div className="fgrp"><label className="fl">Password</label>
          <div className="pww"><input className="fi" type={sp?'text':'password'} value={lp} onChange={e=>{setLp(e.target.value);setLe('');}} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="Enter password" autoComplete="current-password"/>
          <button className="pwt" onClick={()=>setSp(p=>!p)}>{sp?'🙈':'👁'}</button></div>
        </div>
        <button className="lbtn" onClick={doLogin} disabled={ll}>{ll?'Signing in…':'Sign In →'}</button>
      </div>
    </div>
  );

  const renderPage=()=>{
    switch(page){
      case 'dashboard':    return <Dashboard    clients={clients} locations={locations} refresh={rk}/>;
      case 'stock-in':     return <StockForm    type="IN"  user={user} clients={clients} locations={locations} onSaved={onSaved}/>;
      case 'stock-out':    return <StockForm    type="OUT" user={user} clients={clients} locations={locations} onSaved={onSaved}/>;
      case 'transactions': return <TransactionLog clients={clients} locations={locations} refresh={rk}/>;
      case 'contracts':    return <Contracts    clients={clients} locations={locations}/>;
      case 'items':        return <ItemDatabase clients={clients}/>;
      case 'clients':      return <Clients/>;
      case 'billing':      return <Billing      clients={clients}/>;
      case 'spareparts':   return <SpareParts   user={user}/>;
      case 'settings':     return <AppSettings  currentUser={user}/>;
      default:             return <Dashboard    clients={clients} locations={locations} refresh={rk}/>;
    }
  };

  return(
    <div className="shell">
      {sideOpen&&<div className="bkd" onClick={()=>setSide(false)}/>}
      <aside className={`sidebar ${sideOpen?'open':''}`}>
        <div className="sbrand">
          <div className="sbrand-icon"><img src={FKC_LOGO} alt="FKC" style={{width:28,height:28,objectFit:'contain'}}/></div>
          <span className="sbrand-name">FKC Logistics</span>
        </div>
        <nav className="snav">{nav.map((n,i)=>n.section?<div key={i} className="nsec">{n.section}</div>:<button key={n.id} className={`nb ${page===n.id?'on':''}`} onClick={()=>goTo(n.id)}><span style={{fontSize:15}}>{n.icon}</span>{n.label}</button>)}</nav>
        <div className="sfoot">
          <div className="urow"><div className="uav">{user.name[0]}</div><div><div className="uname">{user.name}</div><div className="urole">{user.role}</div></div></div>
          <button className="lobtn" onClick={doLogout}>Sign Out</button>
        </div>
      </aside>
      <main className="main">
        <div className="topbar"><button className="hbg" onClick={()=>setSide(s=>!s)}>☰</button><span className="ttl">{nav.find(n=>n.id===page)?.label}</span></div>
        {renderPage()}
      </main>
    </div>
  );
}
