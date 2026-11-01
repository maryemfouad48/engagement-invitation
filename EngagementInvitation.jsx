import { useEffect, useRef, useState } from "react";

// عدّل البيانات من هنا فقط
const DETAILS = {
  bride: "جودي",
  groom: "كريم",
  dateLabel: "الأربعاء ١١ نوفمبر ٢٠٢٦",
  timeLabel: "الساعة الثامنة مساءً",
  eventISO: "2026-11-11T20:00:00",
  venue: "دار الحرس الجمهوري",
  address: "قاعة القصر الصغير، صلاح سالم",
  mapUrl: "https://maps.app.goo.gl/ThMAgs7AL8xeBP8a9",
};

const toArabicDigits = (n) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

function useCountdown(iso) {
  const target = new Date(iso).getTime();
  const calc = () => Math.max(0, Math.floor((target - Date.now()) / 1000));
  const [secs, setSecs] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setSecs(calc()), 1000);
    return () => clearInterval(id);
  }, [iso]);
  return {
    days: Math.floor(secs / 86400),
    hours: Math.floor((secs % 86400) / 3600),
    minutes: Math.floor((secs % 3600) / 60),
    seconds: secs % 60,
  };
}

function Countdown({ iso }) {
  const t = useCountdown(iso);
  const items = [
    [t.days, "يوم"],
    [t.hours, "ساعة"],
    [t.minutes, "دقيقة"],
    [t.seconds, "ثانية"],
  ];
  return (
    <div className="wi-cd">
      {items.map(([v, label]) => (
        <div key={label}>
          <b>{toArabicDigits(v)}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Rules() {
  const rules = [
    ["👶", "ممنوع الأطفال", "الليلة للكبار بس، سيبوا الصغيرين عند تيتا واستمتعوا بسهرة من غير جري بين الترابيزات."],
    ["⚪", "ممنوع لبس الأبيض", "الأبيض محجوز للعروسة، اختاروا أي لون تاني وخلّوا الصور حلوة."],
  ];
  return (
    <section className="wi-frame wi-rise">
      <h2>قبل ما تيجي، شوية قوانين لطيفة</h2>
      <div className="wi-rules">
        {rules.map(([icon, title, text]) => (
          <div className="wi-rule" key={title}>
            <div className="wi-no" aria-hidden="true">{icon}</div>
            <p><b>{title}</b><span>{text}</span></p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function WeddingInvitation() {
  const d = DETAILS;
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open || !rootRef.current) return;
    const els = rootRef.current.querySelectorAll(".wi-rise");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("wi-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("wi-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [open]);

  const unlock = () => {
    setOpen(true);
    setTimeout(() => setGone(true), 1200);
  };

  return (
    <div className={`wi-root${open ? " wi-ready" : ""}`} dir="rtl" lang="ar" ref={rootRef}>
      <style>{css}</style>
      <div className="wi-petals" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} style={{ "--i": i + 1 }} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <em key={`h${i}`} style={{ "--i": i + 1 }}>♥</em>
        ))}
      </div>
      {!gone && (
        <button className={`wi-intro${open ? " wi-go" : ""}`} onClick={unlock} aria-label="افتح الدعوة">
          <span className="wi-seal">ج ك</span>
          <span className="wi-it">دعوة خطوبة</span>
          <span className="wi-is">اضغط لفتح الدعوة</span>
        </button>
      )}
      {open && !gone &&
        Array.from({ length: 14 }, (_, k) => {
          const a = (k / 14) * Math.PI * 2;
          const d = 120 + ((k * 37) % 80);
          return (
            <span key={k} className="wi-burst" style={{ "--x": `${Math.cos(a) * d}px`, "--y": `${Math.sin(a) * d}px`, fontSize: 14 + ((k * 7) % 14) }}>♥</span>
          );
        })}
      <main className="wi-wrap">
        <section className="wi-frame wi-rise">
          <p className="wi-bism">بسم الله الرحمن الرحيم</p>
          <svg className="wi-orn" viewBox="0 0 140 18" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <path d="M2 9h52M86 9h52" />
            <path d="M70 15C60 8 62 2 67 2C69 2 70 4 70 5C70 4 71 2 73 2C78 2 80 8 70 15z" />
            <circle cx="58" cy="9" r="2" />
            <circle cx="82" cy="9" r="2" />
          </svg>
          <p className="wi-verse">وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً</p>
          <p className="wi-small">بقلوب يملؤها الفرح نتشرف بدعوتكم لحضور حفل خطوبتنا</p>
          <h1>
            {d.bride}
            <span className="wi-amp">و</span>
            {d.groom}
          </h1>
          <p className="wi-date">{d.dateLabel}</p>
          <p className="wi-small">{d.timeLabel}</p>
          <Countdown iso={d.eventISO} />
        </section>

        <section className="wi-frame wi-rise">
          <h2>مكان الحفل</h2>
          <p className="wi-date">{d.venue}</p>
          <p className="wi-small">{d.address}</p>
          <div className="wi-row">
            <a className="wi-btn wi-alt" href={d.mapUrl} target="_blank" rel="noreferrer">
              افتح الخريطة
            </a>
          </div>
        </section>

        <Rules />

        <p className="wi-small" style={{ textAlign: "center" }}>بحضوركم تكتمل فرحتنا ✦</p>
      </main>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Reem+Kufi:wght@500;700&family=Cairo:wght@400;600&display=swap');
.wi-root{--bg:#F7F0E5;--card:#F0E2D0;--ink:#702D3D;--soft:#93616A;--gold:#C5A477;--line:#C58B91;--frame:#C58B91;--accent:#702D3D;--on-accent:#F7F0E5;
  background:var(--bg);color:var(--ink);font-family:'Cairo',system-ui,sans-serif;line-height:1.8;min-height:100vh;overflow-x:hidden}
.wi-root *{box-sizing:border-box;margin:0}
.wi-wrap{max-width:520px;margin:0 auto;padding:20px 18px 48px}
.wi-frame{position:relative;background:var(--card);border:1px solid var(--line);border-radius:28px;padding:44px 24px;text-align:center;margin-bottom:18px}
.wi-frame::before{content:"";position:absolute;inset:8px;border:1px solid var(--frame);border-radius:21px;opacity:1;pointer-events:none}
.wi-bism{font-family:'Amiri',serif;color:var(--ink);font-size:1.25rem}
.wi-orn{display:block;margin:14px auto;width:140px;height:18px;color:var(--frame)}
.wi-small{color:var(--soft);font-size:.95rem}
.wi-verse{font-family:'Amiri',serif;font-size:1.2rem;margin:18px 0 6px}
.wi-root h1{font-family:'Reem Kufi','Cairo',sans-serif;font-weight:700;font-size:clamp(2.6rem,12vw,3.6rem);line-height:1.3;margin:10px 0}
.wi-amp{display:block;font-family:'Amiri',serif;color:var(--frame);font-size:1.6rem;line-height:1.2;font-weight:400}
.wi-root h2{font-family:'Reem Kufi','Cairo',sans-serif;font-weight:500;font-size:1.3rem;color:var(--ink);margin-bottom:8px}
.wi-date{font-family:'Amiri',serif;font-size:1.5rem;margin-top:6px}
.wi-cd{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:18px}
.wi-cd div{background:#FAF5EC;border:1px solid var(--line);border-radius:14px;padding:10px 0}
.wi-cd b{display:block;font-family:'Reem Kufi',sans-serif;font-size:1.6rem;color:var(--ink);line-height:1.2}
.wi-cd span{font-size:.8rem;color:var(--soft)}
.wi-row{display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap}
.wi-btn{display:inline-flex;align-items:center;justify-content:center;font-family:inherit;font-weight:600;font-size:1rem;border:1px solid var(--accent);background:var(--accent);color:var(--on-accent);padding:12px 26px;border-radius:999px;cursor:pointer;min-height:46px;text-decoration:none}
.wi-btn.wi-alt{background:transparent;color:var(--accent)}
.wi-btn[aria-pressed="true"]{outline:3px solid var(--frame);outline-offset:2px}
.wi-input{width:100%;font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:12px 16px;text-align:center;margin-top:12px}
.wi-input:focus-visible,.wi-btn:focus-visible{outline:3px solid var(--frame);outline-offset:2px}
.wi-rules{display:grid;gap:12px;margin-top:14px;text-align:right}
.wi-rule{display:flex;gap:14px;align-items:center;background:var(--bg);border:1px dashed var(--gold);border-radius:18px;padding:12px 14px}
.wi-no{position:relative;flex:none;width:52px;height:52px;border-radius:50%;border:3px solid var(--accent);display:grid;place-items:center;font-size:1.5rem;overflow:hidden}
.wi-no::after{content:"";position:absolute;width:140%;height:3px;background:var(--accent);transform:rotate(-45deg)}
.wi-rule b{display:block;font-family:'Reem Kufi',sans-serif;font-weight:500;color:var(--ink)}
.wi-rule span{font-size:.9rem;color:var(--soft)}
.wi-thanks{margin-top:16px;font-family:'Amiri',serif;font-size:1.25rem;color:var(--gold);min-height:2em}
/* premium effects */
.wi-wrap{position:relative;z-index:1}
.wi-frame{box-shadow:0 22px 44px -26px rgba(112,45,61,.3)}
.wi-rise{animation:none;opacity:0;transform:translateY(30px) scale(.98);transition:opacity 1.1s cubic-bezier(.2,.7,.2,1),transform 1.1s cubic-bezier(.2,.7,.2,1)}
.wi-rise.wi-in{opacity:1;transform:none}
.wi-intro{position:fixed;inset:0;z-index:50;display:grid;place-content:center;justify-items:center;gap:14px;border:0;background:radial-gradient(circle at 50% 38%,#fbf6ee,#ecd9c4);color:var(--ink);font-family:inherit;cursor:pointer;transition:transform 1.1s cubic-bezier(.7,0,.2,1),opacity .9s ease}
.wi-intro.wi-go{transform:translateY(-100%);opacity:0;pointer-events:none}
.wi-seal{position:relative;width:132px;height:132px;border-radius:50%;display:grid;place-items:center;margin-bottom:12px;background:radial-gradient(circle at 35% 30%,#d9a3a8,#c58b91 55%,#8e4a58);box-shadow:0 14px 28px rgba(142,74,88,.4),inset 0 -6px 12px rgba(0,0,0,.25);color:#f5ecdb;font-family:'Reem Kufi','Cairo',sans-serif;font-size:2.3rem;animation:pulse 2.6s ease-in-out infinite}
.wi-seal::before{content:"";position:absolute;inset:11px;border:1.5px solid rgba(197,164,119,.95);border-radius:50%}
.wi-go .wi-seal{animation:crack .7s ease forwards}
.wi-it{font-family:'Reem Kufi','Cairo',sans-serif;font-size:1.5rem;color:var(--ink)}
.wi-is{font-size:.9rem;color:var(--soft)}
@keyframes pulse{50%{transform:scale(1.07)}}
@keyframes crack{to{transform:scale(1.5) rotate(10deg);opacity:0}}
.wi-petals{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:0}
.wi-petals i{position:absolute;top:-30px;left:calc(var(--i)*9.3% - 3%);width:calc(9px + var(--i)*1.1px);height:calc(9px + var(--i)*1.1px);border-radius:100% 0 100% 0;background:var(--frame);opacity:.17;animation:fall calc(15s + var(--i)*1.4s) linear infinite;animation-delay:calc(var(--i)*-2.3s)}
@keyframes fall{to{transform:translate3d(40px,110vh,0) rotate(360deg)}}
.wi-orn path,.wi-orn circle{stroke-dasharray:120;stroke-dashoffset:120}
.wi-ready .wi-orn path,.wi-ready .wi-orn circle{animation:draw 2.2s .5s ease forwards}
@keyframes draw{to{stroke-dashoffset:0}}
.wi-root h1{background:linear-gradient(110deg,var(--ink) 38%,#C5A477 50%,var(--ink) 62%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sheen 6s linear infinite}
@keyframes sheen{from{background-position:130% 0}to{background-position:-130% 0}}
.wi-btn{transition:transform .3s ease,box-shadow .3s ease}
.wi-btn:hover{transform:translateY(-2px);box-shadow:0 10px 20px -8px rgba(112,45,61,.4)}
@media (prefers-reduced-motion:reduce){.wi-rise{opacity:1;transform:none;transition:none}.wi-petals{display:none}.wi-root h1{animation:none}.wi-seal{animation:none}.wi-orn path,.wi-orn circle{animation:none!important;stroke-dashoffset:0}}
/* romantic effects */
.wi-petals::before,.wi-petals::after{content:"";position:absolute;width:62vmax;height:62vmax;border-radius:50%;filter:blur(70px);opacity:.45;animation:drift 20s ease-in-out infinite alternate}
.wi-petals::before{top:-25vmax;left:-20vmax;background:radial-gradient(circle,#ecc5c6,transparent 65%)}
.wi-petals::after{bottom:-28vmax;right:-22vmax;background:radial-gradient(circle,#e6d1b0,transparent 65%);animation-delay:-8s}
@keyframes drift{to{transform:translate3d(8vmax,6vmax,0) scale(1.15)}}
.wi-petals em{position:absolute;bottom:-30px;left:calc(var(--i)*11% - 3%);font-style:normal;line-height:1;color:var(--frame);opacity:0;font-size:calc(11px + var(--i)*1.6px);animation:floatup calc(13s + var(--i)*1.5s) ease-in infinite;animation-delay:calc(var(--i)*-1.9s)}
@keyframes floatup{15%{opacity:.38}to{opacity:0;transform:translate3d(-34px,-112vh,0) rotate(18deg)}}
.wi-frame::after{content:"✦";position:absolute;top:-11px;left:50%;transform:translateX(-50%);padding:0 10px;background:var(--bg);color:var(--gold);font-size:1.05rem;line-height:1;animation:twinkle 3.2s ease-in-out infinite}
@keyframes twinkle{50%{opacity:.45;transform:translateX(-50%) scale(1.25)}}
.wi-seal{animation:beat 2.2s ease-in-out infinite}
@keyframes beat{0%,100%{transform:scale(1)}14%{transform:scale(1.1)}28%{transform:scale(1)}42%{transform:scale(1.1)}}
.wi-burst{position:fixed;left:50%;top:50%;z-index:60;pointer-events:none;color:var(--frame);line-height:1;opacity:0;animation:burst 1.1s ease-out forwards}
@keyframes burst{from{opacity:1;transform:translate(-50%,-50%) scale(.4)}to{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(1.3)}}
@media (prefers-reduced-motion:reduce){.wi-petals em,.wi-burst{display:none}.wi-frame::after,.wi-petals::before,.wi-petals::after,.wi-seal{animation:none}}
`;
