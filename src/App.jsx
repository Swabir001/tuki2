import { useState, useEffect, useRef, useCallback } from "react";
import StudyBuddyChat from "./StudyBuddy.jsx";

/* ────────── CONFIG ────────── */
const PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.tuki.tukistudy";
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1582719478185-2f0b1c1a1d38?w=1400&q=80",
  feed: "https://media.istockphoto.com/id/1770690435/photo/schoolgirl-with-raised-hand-celebrating-finishing-a-task-on-computer.jpg?s=612x612&w=0&k=20&c=YJKGkyTRgiDMiEuU5Fu49--gJVEKjPUU1tjWfLTQeS0=",
  ai: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&q=80",
  labs: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&q=80",
  ebooks:
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&q=80",
  community: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80",
  teachers:
    "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=900&q=80",
};
const VIDEOS = {
  hero: "media/videos/person_scrolling.mov",
  labs: "media/videos/virtual_lab.mov",
  community: "https://static.videezy.com/system/resources/previews/000/051/305/original/DSC_1992.mp4",
  
};

/* ────────── STYLES ────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--orange:#F58A00;--ink:#0F0D0A;--grey:#7A746C;--grey-l:#C4BFB6;--grey-xl:#E9E5DE;--bg:#FFFFFF;--cream:#F9F6F1;--r:16px}
body,html{overflow-x:hidden}
.tuki{font-family:'Manrope',system-ui,sans-serif;background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased}
.tuki *::selection{background:var(--orange);color:#fff}
.serif{font-family:'Instrument Serif',Georgia,serif}
.mono{font-family:'JetBrains Mono',monospace}

/* NAV */
.tnav{position:fixed;top:0;width:100%;z-index:999;padding:0 clamp(16px,4vw,48px);height:56px;display:flex;align-items:center;justify-content:space-between;transition:all .4s;background:rgba(255,255,255,0)}
.tnav.s{background:rgba(255,255,255,.9);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.04)}
.tlogo{font-family:'Instrument Serif',serif;font-size:22px;font-weight:400;color:var(--ink);cursor:pointer;letter-spacing:-.02em}
.tlogo em{font-style:italic;color:var(--orange)}
.tnav-links{display:flex;gap:24px}
.tnav-links span{font-size:13px;font-weight:600;color:var(--grey);cursor:pointer;transition:color .2s;position:relative}
.tnav-links span:hover,.tnav-links span.on{color:var(--ink)}
.tnav-links span.on::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:2px;background:var(--orange);border-radius:2px}
@media(max-width:900px){
  .tnav{height:auto;flex-wrap:wrap;padding:10px clamp(16px,4vw,48px) 0;gap:0;background:rgba(255,255,255,.95)!important;backdrop-filter:blur(20px)}
  .tnav .tlogo{flex:1;color:var(--ink)!important}
  .tnav .tlogo em{color:var(--orange)!important}
  .tnav .tbtn-dark{order:2;background:var(--ink)!important;color:#fff!important}
  .tnav-links{order:3;width:100%;justify-content:center;gap:20px;padding:8px 0 10px;display:flex!important}
  .tnav-links span{font-size:12px;color:var(--grey)!important}
  .tnav-links span.on{color:var(--ink)!important}
  .tnav-links span.on::after{background:var(--orange)!important}
  .hbg{display:none!important}
}
.tbtn{font-size:12px;font-weight:700;padding:8px 20px;border-radius:980px;border:none;cursor:pointer;transition:all .3s;letter-spacing:.01em}
.tbtn-dark{background:var(--ink);color:#fff}.tbtn-dark:hover{background:var(--orange)}
.tbtn-orange{background:var(--orange);color:#fff;box-shadow:0 4px 16px rgba(245,138,0,.2)}.tbtn-orange:hover{box-shadow:0 8px 28px rgba(245,138,0,.35);transform:translateY(-1px)}
.tbtn-ghost{background:var(--bg);color:var(--ink);border:1.5px solid var(--grey-xl)}.tbtn-ghost:hover{border-color:var(--orange);color:var(--orange)}

/* HERO */
.thero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:100px clamp(16px,5vw,64px) 40px;position:relative;overflow:hidden}
.thero::before{content:'';position:absolute;top:-30%;left:50%;transform:translateX(-50%);width:clamp(400px,60vw,900px);height:clamp(400px,60vw,900px);background:radial-gradient(circle,rgba(245,138,0,.07) 0%,transparent 65%);pointer-events:none}
.h-eye{font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--orange);margin-bottom:20px}
.thero h1{font-family:'Instrument Serif',serif;font-size:clamp(40px,6.5vw,80px);font-weight:400;line-height:1.06;max-width:800px;margin-bottom:24px}
.thero h1 em{font-style:italic;color:var(--orange)}
.thero .hp{font-size:clamp(15px,1.15vw,18px);color:var(--grey);max-width:500px;line-height:1.7;margin-bottom:32px}
.hbtns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-bottom:40px}
.hproof{display:flex;align-items:center;gap:12px;margin-bottom:48px}
.hproof .dots{display:flex}.hproof .d{width:28px;height:28px;border-radius:50%;border:2px solid #fff;margin-left:-6px;font-size:9px;font-weight:800;color:#fff;display:flex;align-items:center;justify-content:center}
.hproof .d:first-child{margin-left:0}
.hproof p{font-size:12px;color:var(--grey)}.hproof p b{color:var(--ink)}
.himg{width:100%;max-width:1100px;border-radius:20px;overflow:hidden;box-shadow:0 32px 100px rgba(0,0,0,.1);position:relative}
.himg img{width:100%;display:block;transition:transform 8s ease}
.himg:hover img{transform:scale(1.04)}

/* MARQUEE */
.tmq{border-top:1px solid var(--grey-xl);border-bottom:1px solid var(--grey-xl);overflow:hidden;padding:13px 0}
.tmq-t{display:flex;animation:tmqs 35s linear infinite;width:max-content}
.tmq-t span{font-size:12px;font-weight:600;color:var(--grey-l);padding:0 18px;white-space:nowrap;letter-spacing:.06em;text-transform:uppercase}
@keyframes tmqs{to{transform:translateX(-50%)}}

/* SECTIONS */
.tsc{padding:clamp(64px,10vw,140px) clamp(16px,5vw,64px)}
.tsc-c{text-align:center;display:flex;flex-direction:column;align-items:center}
.tsc-label{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;color:var(--orange);text-transform:uppercase;letter-spacing:.12em;margin-bottom:10px}
.tsc h2{font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(34px,4.8vw,56px);line-height:1.08;letter-spacing:-.02em;margin-bottom:18px}
.tsc h2 em{font-style:italic;color:var(--orange)}
.tsp{font-size:15px;color:var(--grey);line-height:1.7;max-width:560px}

/* FEATURE ROW */
.feat{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center;max-width:1050px;margin:0 auto}
.feat.rev{direction:rtl}
.feat.rev>*{direction:ltr}
.fimg{border-radius:20px;overflow:hidden;position:relative;box-shadow:0 20px 70px rgba(0,0,0,.08)}
.fimg img{width:100%;height:420px;object-fit:cover;display:block}
.tslide{position:relative;width:100%;height:420px;overflow:hidden}
.tslide img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform .75s cubic-bezier(.77,0,.18,1),opacity .75s ease}
.tslide img.ts-enter{transform:translateX(100%);opacity:0}
.tslide img.ts-active{transform:translateX(0);opacity:1}
.tslide img.ts-exit{transform:translateX(-100%);opacity:0}
.badge{position:absolute;top:18px;left:18px;background:rgba(255,255,255,.92);border:1px solid rgba(0,0,0,.06);padding:6px 12px;border-radius:980px;font-size:11px;font-weight:800}
.ftxt h3{font-family:'Instrument Serif',serif;font-weight:400;font-size:38px;line-height:1.1;letter-spacing:-.02em;margin-bottom:10px}
.ftxt h3 em{font-style:italic;color:var(--orange)}
.ftxt p{color:var(--grey);line-height:1.8;margin-bottom:14px}
.ftxt ul{list-style:none}
.ftxt li{display:flex;gap:10px;font-size:13px;padding:7px 0;color:var(--ink);align-items:flex-start}
.ck{color:var(--orange);font-weight:800;line-height:1.2}

/* CINEMATIC IMAGE */
.cimg{max-width:1100px;margin:0 auto;border-radius:24px;overflow:hidden;position:relative;box-shadow:0 28px 90px rgba(0,0,0,.08)}
.cimg img{width:100%;display:block;height:520px;object-fit:cover;filter:saturate(1.05)}
.cimg .ov{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:28px;background:linear-gradient(180deg,transparent 45%,rgba(0,0,0,.62));color:#fff}
.cimg .ov h3{font-size:36px;margin-bottom:6px}
.cimg .ov p{max-width:520px;opacity:.9;line-height:1.6}

/* VIDEO */
.tvid{max-width:1000px;margin:0 auto;border-radius:24px;overflow:hidden;box-shadow:0 28px 90px rgba(0,0,0,.08)}
.tvid iframe{width:100%;aspect-ratio:16/9;border:0;display:block}

/* STATS */
.tstats{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center;max-width:760px;margin:0 auto;padding:clamp(48px,8vw,100px) 24px}
.tstats .sn{font-family:'Instrument Serif',serif;font-size:clamp(32px,4.5vw,52px);color:var(--ink)}
.tstats .sn.or{color:var(--orange)}
.tstats .sl{font-size:11px;font-weight:700;color:var(--grey);text-transform:uppercase;letter-spacing:.08em;margin-top:4px}

/* TESTIMONIALS */
.ttrow{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.ttc{background:var(--cream);border-radius:var(--r);padding:24px;border:1px solid transparent;transition:all .35s}
.ttc:hover{border-color:var(--orange)}
.ttc .stars{color:var(--orange);font-size:12px;letter-spacing:2px;margin-bottom:8px}
.ttc blockquote{font-family:'Instrument Serif',serif;font-style:italic;font-size:16px;line-height:1.6;margin-bottom:14px}
.ttc cite{font-size:11px;font-weight:700;color:var(--grey);font-style:normal}

/* PRICING */
.tprow{display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:660px;margin:0 auto}
.tpc{background:var(--bg);border:1.5px solid var(--grey-xl);border-radius:20px;padding:32px 24px;position:relative;transition:all .35s}
.tpc:hover{transform:translateY(-3px);box-shadow:0 12px 48px rgba(0,0,0,.05)}
.tpc.pop{border-color:var(--orange)}
.tpc .pop-b{position:absolute;top:-9px;left:20px;background:var(--orange);color:#fff;font-size:9px;font-weight:700;padding:3px 10px;border-radius:980px;letter-spacing:.06em}
.tpc h3{font-size:20px;font-weight:800;margin-bottom:2px}.tpc .pr{font-family:'Instrument Serif',serif;font-size:34px;margin:10px 0 2px}.tpc .pr small{font-size:14px;color:var(--grey);font-family:'Manrope',sans-serif;font-weight:400}
.tpc .prs{font-size:10px;color:var(--grey);display:block;margin-bottom:20px}
.tpc ul{list-style:none;margin-bottom:24px}.tpc ul li{font-size:12px;padding:5px 0;display:flex;gap:6px;color:var(--ink)}.tpc ul li::before{content:'✓';color:var(--orange);font-weight:700}
.tpc .pbtn{display:block;width:100%;text-align:center;padding:11px;border-radius:980px;font-weight:700;font-size:12px;cursor:pointer;border:none;transition:all .3s;text-decoration:none}


/* CTA */
.tcta{padding:clamp(80px,12vw,160px) clamp(16px,5vw,64px);text-align:center;position:relative;overflow:hidden;background:var(--cream)}
.tcta::before{content:'TukiStudy';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Instrument Serif',serif;font-size:clamp(80px,14vw,220px);color:var(--orange);opacity:.04;white-space:nowrap;pointer-events:none}
.tcta .tag{font-family:'Instrument Serif',serif;font-style:italic;font-size:18px;color:var(--orange);margin-top:24px}

/* FOOTER */
.tfoot{background:var(--cream);border-top:1px solid var(--grey-xl);padding:32px clamp(16px,5vw,64px)}
.tfoot-r{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.tfoot .fl{font-family:'Instrument Serif',serif;font-size:16px}.tfoot .fl em{font-style:italic;color:var(--orange)}
.tfoot-links{display:flex;gap:20px}.tfoot-links span{font-size:11px;color:var(--grey);cursor:pointer;transition:color .2s}.tfoot-links span:hover{color:var(--orange)}
.tfoot .copy{font-size:10px;color:var(--grey-l)}

/* HAMBURGER */
.hbg{display:none;flex-direction:column;justify-content:center;gap:5px;background:none;border:none;cursor:pointer;padding:6px;z-index:1001;width:36px;height:36px}
.hbg span{display:block;width:22px;height:2px;border-radius:2px;transition:all .3s;background:currentColor}
.hbg.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hbg.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.hbg.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.mob-menu{position:fixed;inset:0;z-index:1000;background:rgba(7,8,10,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.mob-menu .mm-link{font-family:'Instrument Serif',serif;font-size:44px;font-weight:400;color:rgba(255,255,255,.85);cursor:pointer;padding:10px 0;letter-spacing:-.02em;transition:color .2s}
.mob-menu .mm-link:hover,.mob-menu .mm-link.on{color:var(--orange)}
.mob-menu .mm-sub{margin-top:32px;display:flex;flex-direction:column;align-items:center;gap:12px}
.mob-menu .mm-app{font-size:13px;font-weight:700;color:#fff;background:var(--orange);padding:14px 32px;border-radius:980px;text-decoration:none;letter-spacing:.01em}

/* RESPONSIVE */
@media(max-width:900px){
  .feat,.feat.rev{grid-template-columns:1fr;direction:ltr}
  .feat.rev>*{direction:ltr}
  .ttrow{grid-template-columns:1fr}
  .tprow{grid-template-columns:1fr 1fr;max-width:100%}
  .tstats{grid-template-columns:repeat(2,1fr)}
  .tnav-links{display:none}
  .hbg{display:flex}
  .ttmrow{gap:16px}
  .ftxt h3{font-size:30px}
  .fimg img,.tslide{height:320px}
}
@media(max-width:600px){
  .hbtns{flex-direction:column;align-items:center}
  .tprow{grid-template-columns:1fr}
}
@media(max-width:480px){
  /* NAV */
  .tnav{height:52px}

  /* HERO (light) */
  .thero{padding:90px 20px 36px}
  .thero h1{font-size:clamp(34px,10vw,44px)}
  .thero .hp{font-size:14px}
  .hbtns{flex-direction:column;align-items:stretch;gap:10px;width:100%;max-width:280px}
  .tbtn{font-size:13px;padding:12px 20px;text-align:center}

  /* CINEMATIC HERO */
  .cineHero{padding:100px 20px 36px;align-items:flex-end;min-height:100svh}
  .cineHero .inner{grid-template-columns:1fr;gap:0}
  .cineHero h1{font-size:clamp(36px,10vw,48px);margin-bottom:12px}
  .cineHero .lede{font-size:14px;margin-bottom:18px}
  .cineCard,.cineMeta{display:none}
  .cineBtns{flex-direction:column;gap:10px;width:100%;max-width:280px}
  .cineBtns .tbtn{text-align:center}

  /* LAB SECTION */
  .labCine{height:100svh}
  .labContent{height:100%;padding:0 20px;align-items:center;justify-content:center}
  .labStack{max-width:100%}
  .labCine .bgv .vwrap.cover{display:none}
  .labCine .bgv .vwrap.contain video{object-fit:cover!important;filter:saturate(1.1) contrast(1.04) brightness(.95)}
  .labCine .bgv .matte{display:none}
  .labOverlay{background:linear-gradient(90deg,rgba(7,8,10,.85) 0%,rgba(7,8,10,.55) 45%,rgba(7,8,10,.1) 80%,rgba(7,8,10,0) 100%)}
  .labCine h2{font-size:clamp(30px,9vw,42px);text-shadow:0 2px 24px rgba(0,0,0,.9)}
  .labCine p{font-size:14px;text-shadow:0 1px 12px rgba(0,0,0,.8)}
  .labCine .pill{text-shadow:none}

  /* FEATURE ROWS */
  .tsc{padding:52px 20px}
  .ftxt h3{font-size:26px}
  .fimg img,.tslide{height:240px}
  .fimg{border-radius:14px}

  /* CINEMATIC IMAGE */
  .cimg img{height:240px}
  .cimg .ov h3{font-size:22px}
  .cimg .ov p{font-size:13px}
  .cimg{border-radius:16px}

  /* STATS */
  .tstats{padding:40px 16px;gap:16px}

  /* TESTIMONIALS */
  .ttc blockquote{font-size:14px}

  /* PRICING */
  .tprow{grid-template-columns:1fr;max-width:100%}

  /* BAND SECTION */
  .bandCine{margin:12px;border-radius:20px}
  .bandCine .inner{padding:40px 20px}
  .bandCards{grid-template-columns:1fr}

  /* SECTION HEADINGS */
  .tsc h2{font-size:clamp(28px,8vw,38px)}

  /* FOOTER */
  .tfoot-r{flex-direction:column;align-items:flex-start;gap:14px}
  .tfoot-links{flex-wrap:wrap;gap:12px}
}

/* CINEMATIC */
.cine{position:relative;overflow:hidden}
.bgv{position:absolute;inset:0;z-index:0}
.bgv video{width:100%;height:100%;object-fit:cover;transform:scale(1.06);filter:saturate(1.1) contrast(1.06)}
.bgv video.contain{object-fit:contain;transform:none;background:radial-gradient(900px 520px at 50% 35%, rgba(255,255,255,.06), rgba(7,8,10,1) 60%)}
.bgv .vwrap{position:absolute;inset:0}
.bgv .vwrap.cover video{object-fit:cover;transform:scale(1.08);filter:blur(14px) saturate(1.15) contrast(1.05) brightness(.72)}
.bgv .vwrap.contain video{object-fit:contain;transform:none;filter:saturate(1.06) contrast(1.04) brightness(.98)}
.bgv iframe{width:100%;height:100%;border:0;transform:scale(1.12);filter:saturate(1.08) contrast(1.06)}
.bgv img{width:100%;height:100%;object-fit:cover;transform:scale(1.06);filter:saturate(1.1) contrast(1.06)}
.bgv .matte{position:absolute;inset:0;background:radial-gradient(900px 520px at 50% 35%, rgba(255,255,255,.06), rgba(7,8,10,1) 60%)}
.bgv .frame{position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06), inset 0 0 90px rgba(0,0,0,.45)}
.shade{position:absolute;inset:0;z-index:1;background:
  radial-gradient(1200px 680px at 20% 20%, rgba(245,138,0,.18), transparent 55%),
  radial-gradient(900px 620px at 80% 20%, rgba(108,92,231,.16), transparent 55%),
  linear-gradient(180deg, rgba(7,8,10,.65) 0%, rgba(7,8,10,.45) 35%, rgba(7,8,10,.92) 100%)}
.grain{position:absolute;inset:-40%;z-index:2;opacity:.08;mix-blend-mode:overlay;background-image:
  repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 1px, transparent 1px 3px),
  repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 1px, transparent 1px 4px);
  transform:rotate(3deg);
  animation:grain 12s steps(10) infinite}
@keyframes grain{0%{transform:translate3d(0,0,0) rotate(3deg)}100%{transform:translate3d(-6%,4%,0) rotate(3deg)}}
.spark{position:absolute;inset:0;z-index:3;pointer-events:none}

.reveal{opacity:0;transform:translateY(16px);filter:blur(6px);transition:opacity .7s ease, transform .7s ease, filter .7s ease}
.reveal.is{opacity:1;transform:translateY(0);filter:blur(0)}

.page{animation:pageIn .5s cubic-bezier(.2,.9,.2,1) both}
@keyframes pageIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.cineHero{min-height:100vh;color:#fff;display:flex;align-items:center;padding:110px clamp(16px,5vw,64px) 64px}
.cineHero .inner{position:relative;z-index:4;max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1.15fr .85fr;gap:28px;align-items:center}
.cineHero h1{font-family:'Instrument Serif',serif;font-size:clamp(44px,6.2vw,86px);font-weight:400;line-height:1.02;letter-spacing:-.03em;margin-bottom:16px}
.cineHero h1 em{font-style:italic;color:var(--orange)}
.cineHero .lede{color:rgba(255,255,255,.78);max-width:520px;line-height:1.75;font-size:15px;margin-bottom:22px}
.pill{display:inline-flex;gap:10px;align-items:center;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);backdrop-filter:blur(14px);border-radius:999px;padding:8px 12px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.85);margin-bottom:18px}
.pill .dot{width:6px;height:6px;border-radius:50%;background:var(--orange);box-shadow:0 0 0 4px rgba(245,138,0,.14)}
.cineBtns{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
.tbtn-lite{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.16)}
.tbtn-lite:hover{background:rgba(255,255,255,.18)}
.cineCard{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);backdrop-filter:blur(16px);border-radius:24px;padding:18px;box-shadow:0 28px 90px rgba(0,0,0,.45)}
.cineCard h3{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.78);margin-bottom:10px}
.bars{display:flex;gap:8px;align-items:flex-end;height:94px}
.bar{width:10px;border-radius:10px;background:linear-gradient(180deg, rgba(245,138,0,.9), rgba(245,138,0,.2));transform-origin:bottom;animation:bar 1.8s ease-in-out infinite}
.bar:nth-child(2){animation-delay:.15s}.bar:nth-child(3){animation-delay:.3s}.bar:nth-child(4){animation-delay:.45s}.bar:nth-child(5){animation-delay:.6s}.bar:nth-child(6){animation-delay:.75s}
@keyframes bar{0%,100%{transform:scaleY(.32);opacity:.75}50%{transform:scaleY(1);opacity:1}}
.cineMeta{display:flex;gap:14px;flex-wrap:wrap;margin-top:14px}
.metaP{border:1px solid rgba(255,255,255,.12);background:rgba(7,8,10,.35);border-radius:14px;padding:10px 12px}
.metaP b{display:block;font-family:'Instrument Serif',serif;font-size:20px;letter-spacing:-.02em}
.metaP span{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.68)}

.labCine{padding:0}
.labCine{height:max(56.25vw, 84vh)}
.labOverlay{position:absolute;inset:0;z-index:3;pointer-events:none;background:
  radial-gradient(820px 580px at 12% 46%, rgba(7,8,10,.92), rgba(7,8,10,.72) 30%, rgba(7,8,10,.22) 54%, rgba(7,8,10,0) 70%),
  linear-gradient(90deg, rgba(7,8,10,.90) 0%, rgba(7,8,10,.80) 28%, rgba(7,8,10,.40) 46%, rgba(7,8,10,.10) 62%, rgba(7,8,10,0) 72%)}
.labCine .bgv .matte{background:radial-gradient(1100px 640px at 72% 50%, rgba(255,255,255,.04), rgba(7,8,10,.78) 65%, rgba(7,8,10,.88) 100%)}
.labCine .bgv .frame{box-shadow:inset 0 0 0 1px rgba(255,255,255,.04), inset 0 0 40px rgba(0,0,0,.18)}
.labContent{height:100%;max-width:1260px;margin:0 auto;position:relative;z-index:4;display:flex;align-items:center;padding:clamp(84px,10vw,120px) clamp(16px,5vw,64px)}
.labStack{max-width:560px}
.labStack .pill{align-self:flex-start}
.labCine h2{font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(40px,5vw,66px);line-height:1.02;letter-spacing:-.03em;margin-bottom:14px;color:#fff}
.labCine h2 em{font-style:italic;color:var(--orange)}
.labCine p{color:rgba(255,255,255,.78);line-height:1.8;max-width:520px}
.bandCine .inner{max-width:1100px;margin:0 auto;position:relative;z-index:4;padding:clamp(84px,10vw,120px) clamp(16px,5vw,64px);display:grid;grid-template-columns:1.05fr .95fr;gap:22px;align-items:center}
.bandCine{margin:clamp(26px,4vw,52px) auto;max-width:1100px;border-radius:28px;box-shadow:0 40px 140px rgba(0,0,0,.14)}
.bandCine h2{font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(34px,4.6vw,56px);line-height:1.04;letter-spacing:-.03em;margin-bottom:10px;color:#fff}
.bandCine h2 em{font-style:italic;color:var(--orange)}
.bandCine p{color:rgba(255,255,255,.78);line-height:1.8;max-width:520px}
.bandCards{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.bandCard{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);backdrop-filter:blur(18px);border-radius:18px;padding:14px 14px 16px;transition:transform .35s ease, border-color .35s ease}
.bandCard:hover{transform:translateY(-2px);border-color:rgba(245,138,0,.45)}
.bandCard b{display:block;color:#fff;font-size:13px;margin-bottom:4px}
.bandCard span{display:block;color:rgba(255,255,255,.68);font-size:11px;line-height:1.5}

/* nav dark-on-hero */
.tnav.d{background:transparent;border-bottom-color:transparent}
.tnav.d .tlogo{color:#fff}
.tnav.d .tnav-links span{color:rgba(255,255,255,.72)}
.tnav.d .tnav-links span:hover,.tnav.d .tnav-links span.on{color:#fff}
.tnav.d .tnav-links span.on::after{background:rgba(245,138,0,.9)}
.tnav.d .tbtn-dark{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16);color:#fff}
.tnav.d .tbtn-dark:hover{background:rgba(255,255,255,.18)}

@media (prefers-reduced-motion: reduce){
  .tmq-t{animation:none}
  .grain{animation:none}
  .reveal,.reveal.is{transition:none;transform:none;filter:none;opacity:1}
  .bar{animation:none}
}

@media(max-width:900px){
  .cineHero .inner{grid-template-columns:1fr;gap:18px}
  .labContent{padding-top:96px}
  .bandCine .inner{grid-template-columns:1fr}
  .bandCards{grid-template-columns:1fr}
  .labCine{height:92vh}
}
`;

/* ────────── COMPONENTS ────────── */

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!m) return;
    const update = () => setReduce(Boolean(m.matches));
    update();
    m.addEventListener?.("change", update);
    return () => m.removeEventListener?.("change", update);
  }, []);
  return reduce;
}

function useInViewOnce(threshold = 0.18) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView, threshold]);
  return { ref, inView };
}

const Reveal = ({ children, delay = 0, as: As = "div", className = "", style }) => {
  const { ref, inView } = useInViewOnce();
  return (
    <As
      ref={ref}
      className={`reveal${inView ? " is" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </As>
  );
};

function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.replace("/", "") || null;
    if (u.hostname.endsWith("youtube.com") || u.hostname.endsWith("youtube-nocookie.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = u.pathname.match(/^\/embed\/([^/]+)/);
      if (m) return m[1];
    }
  } catch {
    // ignore
  }
  return null;
}

const BackgroundVideo = ({
  src,
  poster,
  className = "",
  fit = "cover",
  position = "50% 50%",
  zoom = 1.06,
}) => {
  const reduce = usePrefersReducedMotion();
  const yt = src ? getYouTubeId(src) : null;
  const resolvedSrc = !yt && typeof src === "string" && src.startsWith("media/")
    ? `/${src}`
    : src;
  return (
    <div className={`bgv${className ? ` ${className}` : ""}`} aria-hidden="true">
      {reduce ? (
        <img src={poster} alt="" />
      ) : yt ? (
        <iframe
          title="Background video"
          src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&mute=1&loop=1&playlist=${yt}&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : fit === "contain-fill" ? (
        <>
          <div className="vwrap cover">
            <video
              src={resolvedSrc}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              style={{ objectPosition: position }}
            />
          </div>
          <div className="matte" />
          <div className="vwrap contain">
            <video
              src={resolvedSrc}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              style={{ objectPosition: position }}
            />
          </div>
          <div className="frame" />
        </>
      ) : (
        <video
          src={resolvedSrc}
          poster={poster}
          className={fit === "contain" ? "contain" : undefined}
          style={{
            objectPosition: position,
            transform: fit === "contain" ? undefined : `scale(${zoom})`,
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}
    </div>
  );
};

const Sparks = ({ tint = "rgba(245,138,0,.55)" }) => {
  const ref = useRef(null);
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.floor(w * DPR);
      c.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: 56 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 1.8,
      vx: -0.05 + Math.random() * 0.1,
      vy: -0.12 + Math.random() * 0.24,
      a: 0.12 + Math.random() * 0.5,
    }));

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = tint;
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10;
        if (d.y > h + 10) d.y = -10;
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduce, tint]);

  return <canvas ref={ref} className="spark" />;
};

const Nav = ({ page, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (page !== "Home") {
      setHeroVisible(false);
      return;
    }
    const hero = document.getElementById("cine-hero");
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([e]) => setHeroVisible(e.isIntersecting),
      { threshold: 0.2 },
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, [page]);
  const pages = ["Home", "Pricing", "About"];
  const dark = heroVisible && !scrolled;
  return (
    <nav className={`tnav${scrolled ? " s" : ""}${dark ? " d" : ""}`}>
      <div className="tlogo" onClick={() => setPage("Home")}>
        Tuki<em>Study</em>
      </div>
      <div className="tnav-links">
        {pages.map((p) => (
          <span
            key={p}
            className={page === p ? "on" : ""}
            onClick={() => setPage(p)}
          >
            {p}
          </span>
        ))}
      </div>
      <a
        href={PLAY_STORE}
        target="_blank"
        rel="noopener"
        className="tbtn tbtn-dark"
        style={{ textDecoration: "none" }}
      >
        Get the App
      </a>
    </nav>
  );
};

const Marquee = () => {
  const items = [
    "TukiFeeds",
    "AI Study Buddy",
    "TukiLabs",
    "TukiTalks",
    "E-Books",
    "Students Corner",
    "KCSE Prep",
    "University",
    "Earn from Content",
    "Kenyan Teachers",
  ];
  return (
    <div className="tmq">
      <div className="tmq-t">
        {[...items, ...items].map((t, i) => (
          <span key={i}>✦ {t}</span>
        ))}
      </div>
    </div>
  );
};

const TEACHER_SLIDES = [
  "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=900&q=80",
  "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&w=800",
];

const TeacherSlideshow = () => {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  useEffect(() => {
    const t = setInterval(() => {
      setCur((c) => {
        setPrev(c);
        return (c + 1) % TEACHER_SLIDES.length;
      });
    }, 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="tslide">
      {TEACHER_SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Teacher"
          loading="lazy"
          className={
            i === cur ? "ts-active" : i === prev ? "ts-exit" : "ts-enter"
          }
        />
      ))}
    </div>
  );
};

const FeatureRow = ({ img, badge, label, title, desc, checks, reverse, media }) => (
  <div className={`feat${reverse ? " rev" : ""}`}>
    <div className="fimg">
      {media ? (
        <div style={{ height: 420, display: "grid", placeItems: "stretch" }}>
          {media}
        </div>
      ) : (
        <img src={img} alt={badge} loading="lazy" />
      )}
      <div className="badge">{badge}</div>
    </div>
    <div className="ftxt">
      <div className="tsc-label">{label}</div>
      <h3 className="serif" dangerouslySetInnerHTML={{ __html: title }} />
      <p>{desc}</p>
      <ul>
        {checks.map((c, i) => (
          <li key={i}>
            <span className="ck">✦</span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Stats = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    const targets = [12, 500, 50];
    const dur = 1500;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCounts(targets.map((t) => Math.round(t * ease)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible]);
  return (
    <div className="tstats" ref={ref}>
      <div>
        <div className="sn">{counts[0]}K+</div>
        <div className="sl">Active Students</div>
      </div>
      <div>
        <div className="sn">{counts[1]}+</div>
        <div className="sl">Video Lessons</div>
      </div>
      <div>
        <div className="sn">{counts[2]}+</div>
        <div className="sl">Kenyan Teachers</div>
      </div>
      <div>
        <div className="sn or">Free</div>
        <div className="sl">To Get Started</div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const data = [
    {
      q: "I used to dread Physics. Found TukiFeeds and watched 40 videos in one night. KCSE cannot hold me.",
      n: "Amina K. — Nairobi",
    },
    {
      q: "The AI Study Buddy explained differentiation better than my teacher did in three weeks. Not even exaggerating.",
      n: "Brian Otieno — Mombasa",
    },
    {
      q: "TukiTalks on my commute changed things. I'm learning History while I wait for the bus. Literally.",
      n: "Zawadi M. — Kisumu",
    },
  ];
  return (
    <div className="ttrow">
      {data.map((t, i) => (
        <div className="ttc" key={i}>
          <div className="stars">★★★★★</div>
          <blockquote>"{t.q}"</blockquote>
          <cite>{t.n}</cite>
        </div>
      ))}
    </div>
  );
};

/* ────────── PAGES ────────── */

const HomePage = () => (
  <>
    <section className="cine cineHero" id="cine-hero">
      <BackgroundVideo src={VIDEOS.hero} poster={IMAGES.hero} />
      <div className="shade" />
      <div className="grain" />
      <Sparks />
      <div className="inner">
        <div>
          <Reveal as="div" delay={0} className="pill">
            <span className="dot" />
            Built for Kenyan Students
          </Reveal>
          <Reveal as="h1" delay={80}>
            Stop scrolling through <em>nothing.</em> Start learning{" "}
            <em>everything.</em>
          </Reveal>
          <Reveal as="p" delay={140} className="lede">
            Short videos from real Kenyan teachers. An AI study buddy that
            actually teaches. A community that shares opportunities, not memes.
            All free to start.
          </Reveal>
          <Reveal as="div" delay={200} className="cineBtns">
            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener"
              className="tbtn tbtn-orange"
              style={{
                textDecoration: "none",
                padding: "14px 32px",
                fontSize: 14,
              }}
            >
              Download Free ↓
            </a>
            <button
              className="tbtn tbtn-lite"
              style={{ padding: "13px 28px", fontSize: 14 }}
              onClick={() =>
                document
                  .getElementById("home-features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See how it works →
            </button>
          </Reveal>
          <Reveal as="div" delay={260} className="cineMeta">
            <div className="metaP">
              <b>12K+</b>
              <span>Active Students</span>
            </div>
            <div className="metaP">
              <b>4.8★</b>
              <span>Play Store</span>
            </div>
            <div className="metaP">
              <b>500+</b>
              <span>Video Lessons</span>
            </div>
          </Reveal>
        </div>
        {/* <Reveal as="div" delay={240} className="cineCard">
          <h3>Learning Pulse</h3>
          <div className="bars" aria-hidden="true">
            {[60, 88, 52, 96, 70, 84].map((h, i) => (
              <div key={i} className="bar" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div style={{ marginTop: 12, color: "rgba(255,255,255,.72)", fontSize: 12, lineHeight: 1.6 }}>
            A cinematic homepage is great — but the real magic is in consistent,
            daily study.
          </div>
        </Reveal> */}
      </div>
    </section>

    <Marquee />

    <section className="tsc tsc-c" id="home-features">
      <div className="tsc-label">Why TukiStudy</div>
      <h2>
        One app. Six reasons
        <br />
        to actually <em>study.</em>
      </h2>
      <p className="tsp">
        Everything a Kenyan student needs — KCSE revision, university notes,
        virtual labs, AI tutoring — designed for how you actually learn: on your
        phone.
      </p>
    </section>

    <section className="tsc" style={{ paddingTop: 0 }}>
      <Reveal as="div" delay={0}>
        <FeatureRow
          img={IMAGES.feed}
          badge="TukiFeeds"
          label="TukiFeeds"
          title="Your feed finally earned your <em>time.</em>"
          desc="Short educational videos from verified Kenyan teachers. Swipe like TikTok, learn like a classroom. Every video passes our review — no misinformation, no fluff. Teachers earn based on likes, views, and reshares."
          checks={[
            "KCSE & University content, verified",
            "Like, Save, Share & Follow teachers",
            "Teachers earn from posting content",
            "Subject tags & personalised feed",
          ]}
        />
      </Reveal>
      <div style={{ height: 18 }} />
      <Reveal as="div" delay={0}>
        <FeatureRow
          img={IMAGES.ai}
          badge="AI Study Buddy"
          label="AI Study Buddy"
          title="Asks you back. So you actually <em>understand.</em>"
          desc="Not just another chatbot. This AI understands Kenyan curriculum — it has a Mnemonic Maker, a Math Tutor, and a Study Assistant that plans your revision and adapts to how you learn."
          checks={[
            "Mnemonic Maker for memory aids",
            "Math Tutor AI with step-by-step solutions",
            "Study planner with adaptive recommendations",
          ]}
          media={<StudyBuddyChat />}
          reverse
        />
      </Reveal>
    </section>

    <section className="cine labCine">
      <Sparks tint="rgba(255,255,255,.35)" />
      <BackgroundVideo
        src={VIDEOS.labs}
        poster={IMAGES.labs}
        fit="contain-fill"
        position="72% 50%"
        zoom={1.02}
      />
      <div className="grain" />
      <div className="labOverlay" />
      <div className="labContent">
        <div className="labStack">
          <Reveal as="div" delay={0} className="pill">
            <span className="dot" />
            TukiLabs
          </Reveal>
          <Reveal as="h2" delay={70}>
            Your lab coat
            <br />
            is <em>optional.</em>
          </Reveal>
          <Reveal as="p" delay={130}>
            We built the virtual lab so you don't have to wait for double
            period. Titrate acids. Dissect frogs. Build live circuits. Simulate
            planetary orbits — in 3D — on your phone, any time.
          </Reveal>
          <Reveal as="div" delay={190} className="cineBtns">
            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener"
              className="tbtn tbtn-orange"
              style={{ textDecoration: "none", padding: "12px 22px" }}
            >
              Open the Lab →
            </a>
            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener"
              className="tbtn tbtn-lite"
              style={{ textDecoration: "none", padding: "12px 22px" }}
            >
              Download App
            </a>
          </Reveal>
        </div>
      </div>
    </section>

    <section className="tsc" style={{ paddingTop: 40 }}>
      <Reveal as="div" delay={0}>
        <FeatureRow
          img={IMAGES.ebooks}
          badge="E-Books + TukiTalks"
          label="E-Books & TukiTalks"
          title="Read it. Or listen on your <em>commute.</em>"
          desc="Hundreds of textbooks and KCSE revision guides — most free, some premium. Plus educational podcasts for every subject. Learn History while Nairobi moves around you."
          checks={[
            "Free & premium e-books",
            "Highlighting & note-taking tools",
            "Podcasts for every subject",
            "Download for offline access",
          ]}
          reverse
        />
      </Reveal>
    </section>

    <section className="cine bandCine">
      <BackgroundVideo src={VIDEOS.community} poster={IMAGES.community} />
      <div className="shade" />
      <div className="grain" />
      <Sparks tint="rgba(245,138,0,.35)" />
      <div className="inner">
        <div>
          <Reveal as="div" delay={0} className="pill">
            <span className="dot" />
            Students Corner
          </Reveal>
          <Reveal as="h2" delay={70}>
            Opportunities don’t need to
            <br />
            get lost in <em>group chats.</em>
          </Reveal>
          <Reveal as="p" delay={130}>
            Scholarships, hackathons, internships, bursaries, study groups — one
            searchable feed. Post, save, and share the stuff that actually moves
            your future.
          </Reveal>
          <Reveal as="div" delay={190} className="cineBtns">
            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener"
              className="tbtn tbtn-orange"
              style={{ textDecoration: "none", padding: "12px 22px" }}
            >
              Explore Corner →
            </a>
t            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener"
              className="tbtn tbtn-lite"
              style={{ textDecoration: "none", padding: "12px 22px" }}
            >
              Download App
            </a>
          </Reveal>
        </div>
        <div className="bandCards">
          {[
            { t: "Scholarships", d: "New opportunities, weekly updates, local + global." },
            { t: "Hackathons", d: "Build, pitch, and meet your future team." },
            { t: "Internships", d: "Find roles aligned with your course and skills." },
            { t: "Study Groups", d: "Join revision squads near you (or online)." },
          ].map((x, i) => (
            <Reveal key={x.t} as="div" delay={70 + i * 90}>
              <div className="bandCard">
                <b>{x.t}</b>
                <span>{x.d}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="tsc" style={{ paddingTop: 40 }}>
      <Reveal as="div" delay={0}>
        <FeatureRow
          media={<TeacherSlideshow />}
          badge="For Teachers"
          label="Teachers"
          title="Your classroom. Your schedule. Your <em>income.</em>"
          desc="Create virtual classrooms, deliver live sessions, manage student groups, and get paid directly via M-Pesa. You set the price. Students sign up and enrol. No middlemen."
          checks={[
            "Host live and recorded classes",
            "Set your own pricing",
            "Direct M-Pesa payouts",
            "KSh 5K–50K/mo average earnings",
          ]}
        />
      </Reveal>
    </section>

    <Reveal as="div" delay={0}>
      <Stats />
    </Reveal>

    <section className="tsc" style={{ background: "var(--cream)" }}>
      <Reveal as="div" delay={0} style={{ textAlign: "center", marginBottom: 40 }}>
        <div className="tsc-label">Real Students</div>
        <h2 className="serif" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>
          They said it. We just left it <em>here.</em>
        </h2>
      </Reveal>
      <Reveal as="div" delay={80}>
        <Testimonials />
      </Reveal>
    </section>

    <section className="tcta">
      <div className="tsc-label" style={{ position: "relative", zIndex: 1 }}>
        Get Started
      </div>
      <h2
        className="serif"
        style={{
          fontSize: "clamp(34px,5vw,60px)",
          marginBottom: 14,
          position: "relative",
          zIndex: 1,
        }}
      >
        Your classmates already
        <br />
        downloaded <em>it.</em>
      </h2>
      <p
        style={{
          fontSize: 16,
          color: "var(--grey)",
          maxWidth: 440,
          margin: "0 auto 28px",
          lineHeight: 1.7,
          position: "relative",
          zIndex: 1,
        }}
      >
        Free to download. Kenyan content. Real teachers. An AI that doesn't
        waste your time.
      </p>
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          flexWrap: "wrap",
        }}
      >
        <a
          href={PLAY_STORE}
          target="_blank"
          rel="noopener"
          className="tbtn tbtn-orange"
          style={{ textDecoration: "none", padding: "14px 32px", fontSize: 14 }}
        >
          Google Play
        </a>
        <button
          className="tbtn tbtn-ghost"
          style={{ padding: "13px 28px", fontSize: 14 }}
        >
          App Store (Coming Soon)
        </button>
      </div>
      <div className="tag" style={{ position: "relative", zIndex: 1 }}>
        Where Learning Meets Vibes.
      </div>
    </section>
  </>
);

const PricingPage = () => (
  <>
    <section className="tsc tsc-c" style={{ paddingTop: 140 }}>
      <Reveal as="div" delay={0}>
        <div className="tsc-label">Pricing</div>
        <h2>
          Most of it's free.
          <br />
          The rest is <em>worth it.</em>
        </h2>
        <p className="tsp">
          Start free. Top up with a day pass when you need full access. No
          monthly contracts, no surprises — just pay via M-Pesa and go.
        </p>
      </Reveal>
    </section>
    <section className="tsc" style={{ paddingTop: 0 }}>
      <div className="tprow" style={{ gridTemplateColumns: "repeat(3,1fr)", maxWidth: 960 }}>
        <div className="tpc">
          <h3>Free</h3>
          <div className="pr">
            KES 0<small> / forever</small>
          </div>
          <span className="prs">Get a feel for Tuki</span>
          <ul>
            <li>Browse TukiFeeds (limited)</li>
            <li>2 AI chat credits per day</li>
            <li>Students Corner access</li>
            <li>Basic e-books</li>
            <li>Community posts</li>
          </ul>
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener"
            className="pbtn tbtn-ghost"
            style={{ textDecoration: "none" }}
          >
            Get Started — Free
          </a>
        </div>
        <div className="tpc pop">
          <span className="pop-b">MOST POPULAR</span>
          <h3>Day Pass</h3>
          <div className="pr">
            KES 5<small> / day</small>
          </div>
          <span className="prs">Full access, no commitment</span>
          <ul>
            <li>All TukiFeeds, posts & content</li>
            <li>3 AI credits</li>
            <li>Full content access</li>
            <li>Students Corner</li>
            <li>Pay only when you need it</li>
          </ul>
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener"
            className="pbtn tbtn-orange"
            style={{ textDecoration: "none" }}
          >
            Get Day Pass — KES 5
          </a>
        </div>
        <div className="tpc">
          <h3>Premium Pass</h3>
          <div className="pr">
            KES 10<small> / day</small>
          </div>
          <span className="prs">Everything, unlimited</span>
          <ul>
            <li>Full content access</li>
            <li>Unlimited AI tools</li>
            <li>Mnemonic Maker</li>
            <li>Math Solver AI</li>
            <li>Full E-Book library</li>
            <li>TukiLabs access</li>
          </ul>
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener"
            className="pbtn tbtn-dark"
            style={{ textDecoration: "none" }}
          >
            Go Premium — KES 10
          </a>
        </div>
      </div>
      <Reveal as="div" delay={80} style={{ textAlign: "center", marginTop: 40 }}>
        <p style={{ fontSize: 14, color: "var(--grey)", marginBottom: 12 }}>
          Teachers join <b style={{ color: "var(--ink)" }}>free</b>. Set your own
          pricing. Direct M-Pesa payouts.
        </p>
        <a
          href={PLAY_STORE}
          target="_blank"
          rel="noopener"
          className="tbtn tbtn-dark"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            padding: "12px 28px",
            fontSize: 13,
          }}
        >
          Join as a Teacher →
        </a>
      </Reveal>
    </section>
  </>
);

const AboutPage = () => (
  <>
    <section className="tsc tsc-c" style={{ paddingTop: 140 }}>
      <Reveal as="div" delay={0}>
        <div className="tsc-label">About Tuki</div>
        <h2>
          Built in Nairobi.
          <br />
          For <em>Kenya.</em>
        </h2>
        <p className="tsp">
          We're a small team of five. Some of us went to national schools, some
          to schools nobody has heard of. But we all had the same problem —
          we spent more time figuring out <em>where</em> to study than actually
          studying.
        </p>
      </Reveal>
    </section>

    <section className="tsc" style={{ maxWidth: 720, margin: "0 auto", paddingTop: 0 }}>
      <Reveal as="div" delay={0}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            fontSize: 16,
            lineHeight: 1.85,
            color: "var(--grey)",
          }}
        >
          <p>
            The textbooks were expensive. The YouTube tutorials were American.
            The good tutors were across town and charged by the hour. And the
            WiFi — let's not even talk about the WiFi.
          </p>
          <p>
            We kept asking the same question: why is it so hard to just{" "}
            <strong style={{ color: "var(--ink)" }}>learn</strong>? The knowledge
            exists. The teachers exist. The students definitely exist. What was
            missing was one place that actually understood the Kenyan student —
            their curriculum, their budget, their phone, their 45-minute matatu
            ride home.
          </p>
          <p>
            So we built it. Tuki started as a group chat argument that got out
            of hand. Someone said "we should just make the thing." Three months
            later, we had a working app. Now, thousands of students
            can use it to study, and teachers can earn real money from
            content they were already creating anyway.
          </p>
          <p>
            We're not a Silicon Valley startup chasing growth metrics. We're
            five Kenyans who genuinely believe that a student in Eldoret
            deserves the same quality of education as one in Karen — and that
            the phone in their pocket is enough to make that happen.
          </p>
        </div>
      </Reveal>
    </section>

    <section className="tsc" style={{ maxWidth: 720, margin: "0 auto", paddingTop: 0 }}>
      <Reveal as="div" delay={0}>
        <div className="tsc-label" style={{ textAlign: "center" }}>What we believe</div>
        <h2 className="serif" style={{ textAlign: "center", fontSize: 32, marginBottom: 36 }}>
          A few things we don't compromise on
        </h2>
      </Reveal>
    </section>

    <section
      className="tsc"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 16,
        maxWidth: 800,
        margin: "0 auto",
        paddingTop: 0,
      }}
    >
      {[
        {
          icon: "📱",
          t: "Phone-first, always",
          d: "Over 90% of Kenyan students get online through their phone. We don't build for laptops and then squeeze it down — we start with the phone and work up.",
        },
        {
          icon: "🇰🇪",
          t: "Actually Kenyan",
          d: "Every piece of content is aligned to the Kenyan curriculum. No copy-pasting from British or American syllabuses. If it doesn't help with your KCSE, it doesn't belong here.",
        },
        {
          icon: "💰",
          t: "Teachers get paid",
          d: "Good teachers change lives. They should also be able to pay rent. Every shilling earned on Tuki goes straight to M-Pesa — no middlemen, no waiting.",
        },
      ].map((v, i) => (
        <Reveal key={i} as="div" delay={i * 90}>
          <div
            style={{
              background: "var(--cream)",
              borderRadius: "var(--r)",
              padding: 28,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</div>
            <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
              {v.t}
            </h4>
            <p style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.7 }}>
              {v.d}
            </p>
          </div>
        </Reveal>
      ))}
    </section>
    <section className="tcta">
      <Reveal as="div" delay={0}>
        <div className="tsc-label" style={{ position: "relative", zIndex: 1 }}>
          Join us
        </div>
        <h2
          className="serif"
          style={{
            fontSize: "clamp(32px,4.5vw,52px)",
            marginBottom: 14,
            position: "relative",
            zIndex: 1,
          }}
        >
          Your classmates already
          <br />
          downloaded <em>it.</em>
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--grey)",
            maxWidth: 400,
            margin: "0 auto 24px",
            lineHeight: 1.7,
            position: "relative",
            zIndex: 1,
          }}
        >
          Free to download. Kenyan content. Real teachers.
        </p>
        <div style={{ position: "relative", zIndex: 1 }}>
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener"
            className="tbtn tbtn-orange"
            style={{
              textDecoration: "none",
              padding: "14px 32px",
              fontSize: 14,
            }}
          >
            Download Now
          </a>
        </div>
        <div className="tag" style={{ position: "relative", zIndex: 1 }}>
          Where Learning Meets Vibes.
        </div>
      </Reveal>
    </section>
  </>
);

/* ────────── APP ────────── */
export default function App() {
  const [page, setPage] = useState("Home");

  const changePage = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const PageComponent =
    { Home: HomePage, Pricing: PricingPage, About: AboutPage }[page] || HomePage;

  return (
    <div className="tuki">
      <style>{css}</style>
      <Nav page={page} setPage={changePage} />
      <div className="page" key={page}>
        <PageComponent />
      </div>
      <footer className="tfoot">
        <div className="tfoot-r">
          <div
            className="fl"
            style={{ cursor: "pointer" }}
            onClick={() => changePage("Home")}
          >
            Tuki<em>Study</em>
          </div>
          <div className="tfoot-links">
            {["Home", "Pricing", "About"].map((p) => (
              <span key={p} onClick={() => changePage(p)}>
                {p}
              </span>
            ))}
            <span>Twitter</span>
            <span>Instagram</span>
          </div>
          <div className="copy">© 2026 TukiStudy P.L.C. · Made in Nairobi 🇰🇪</div>
        </div>
      </footer>
    </div>
  );
}
