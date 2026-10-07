const $ = (s) => document.querySelector(s);

/* ---------- Suzuvchi yuraklar ---------- */
const heartsBox = $('#hearts');
const symbols = ['♡', '♥', '❀', '✿'];
function spawnHeart() {
  const h = document.createElement('span');
  h.className = 'heart';
    h.style.left = Math.random() * 100 + 'vw';
  const sz = 12 + Math.random() * 22; h.style.width = h.style.height = sz + 'px'; h.style.opacity = 0.35 + Math.random() * 0.45;
  h.style.animationDuration = 7 + Math.random() * 8 + 's';
  heartsBox.appendChild(h);
  setTimeout(() => h.remove(), 15000);
}
setInterval(spawnHeart, 700);

/* ---------- Ochish tugmasi ---------- */
$('#openBtn').addEventListener('click', () => {
  $('#intro').classList.add('hide');
  document.body.classList.remove('locked');
  for (let i = 0; i < 12; i++) setTimeout(spawnHeart, i * 80);
  setTimeout(() => $('#intro').remove(), 1400);
});

/* ---------- Bo'limlar sekin paydo bo'lishi ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.block').forEach((b) => { b.classList.add('reveal'); io.observe(b); });

/* ---------- Maktub ---------- */
const env = $('#envelope'), letter = $('#letter');
env.addEventListener('click', () => {
  const open = env.classList.toggle('open');
  letter.classList.toggle('open', open);
  env.setAttribute('aria-expanded', open);
  env.querySelector('.env-label').textContent = open ? 'Yopish uchun bos' : 'Ochish uchun bos';
  if (open) setTimeout(() => letter.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500);
});

/* ---------- Sabablar kartochkalari ---------- */
const reasons = [
  ["Kulgining", "Kulganingda vaqt to'xtab qolganday bo'ladi."],
  ["Ko'zlaring", "Ko'zlaringga qarasam, so'zlar yo'qoladi."],
  ["Mehring", "Sening mehring qalbimni isitadi."],
  ["Isming", "Gozal. Ismingni aytishning o'zi ham quvonch."],
  ["Yoningda", "Yoningda o'zimni eng baxtli his qilaman."],
  ["Sen", "Sen borsan, dunyo go'zal."]
];
const cardsBox = $('#cards');
reasons.forEach(([t, d]) => {
  const c = document.createElement('button');
  c.className = 'card';
  c.type = 'button';
  c.innerHTML = `<div class="card-in"><div class="face front"><i class="mini"></i>${t}</div><div class="face back">${d}</div></div>`;
  c.addEventListener('click', () => c.classList.toggle('flip'));
  cardsBox.appendChild(c);
});

/* ---------- Yulduzlar ---------- */
const wishes = [
  "Sen mening eng chiroyli tushimsan.",
  "Har kecha yulduzlardan seni so'rayman.",
  "Seni ko'rganda yuragim tezroq uradi.",
  "Sen bilan oddiy kun ham bayramga aylanadi.",
  "Osmondagi yulduzlar ham sening ko'zlaringchalik porlamaydi."
];
const starsBox = $('#stars');
wishes.forEach((w) => {
  const s = document.createElement('button');
  s.className = 'star';
  s.type = 'button';
  s.setAttribute('aria-label', 'Yulduz');
  s.textContent = '★';
  s.addEventListener('click', () => {
    document.querySelectorAll('.star').forEach((x) => x.classList.remove('on'));
    s.classList.add('on');
    $('#starMsg').textContent = w;
  });
  starsBox.appendChild(s);
});

/* ---------- Sevgi o'lchagichi ---------- */
const meter = $('#meter'), val = $('#meterVal'), msg = $('#meterMsg');
meter.addEventListener('input', () => {
  const v = +meter.value;
  meter.style.setProperty('--p', v + '%');
  if (v < 100) {
    val.textContent = v + '%';
    msg.textContent = v < 50 ? "Yana surib ko'r..." : "Hali ko'proq...";
  } else {
    val.textContent = '∞';
    msg.textContent = "O'lchagichga sig'maydi, Gozal ♡";
    val.style.transform = 'scale(1.2)';
    confettiBurst(18);
  }
  if (v < 100) val.style.transform = 'none';
});

/* ---------- Konfetti ---------- */
function confettiBurst(n = 60) {
  for (let i = 0; i < n; i++) {
    const c = document.createElement('span');
    c.className = 'confetti';
    c.textContent = ['♥', '♡', '❀', '✦'][i % 4];
    c.style.left = Math.random() * 100 + 'vw';
    c.style.fontSize = 14 + Math.random() * 24 + 'px';
    c.style.color = ['#ff7aa5', '#c2336b', '#e9b872', '#fff'][i % 4];
    c.style.animationDuration = 2.5 + Math.random() * 3 + 's';
    c.style.animationDelay = Math.random() * 0.8 + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 7000);
  }
}

/* ---------- "Yo'q" tugmasi qochadi ---------- */
const yes = $('#yesBtn'), no = $('#noBtn');
const noTexts = ["Yo'q", "Rostdanmi? 🥺", "Bir o'ylab ko'r", "Tuta olmaysan 😄", "Ha de!", "Yuragimni sindirma", "Yaxshisi \"Ha\" bos"];
let tries = 0;
function flee(e) {
  if (e && e.cancelable) e.preventDefault();
  tries++;
  no.style.position = 'fixed';
  const pad = 12, w = no.offsetWidth, h = no.offsetHeight;
  no.style.left = pad + Math.random() * (innerWidth - w - pad * 2) + 'px';
  no.style.top = pad + Math.random() * (innerHeight - h - pad * 2) + 'px';
  no.textContent = noTexts[tries % noTexts.length];
  yes.style.transform = `scale(${Math.min(1 + tries * 0.08, 1.5)})`;
}
['pointerenter', 'touchstart', 'click'].forEach((ev) => no.addEventListener(ev, flee, { passive: false }));

/* ---------- "Ha" bosilganda ---------- */
yes.addEventListener('click', () => {
  no.remove();
  const f = $('#final');
  f.hidden = false;
  f.classList.add('in');
  setTimeout(() => f.scrollIntoView({ behavior: 'smooth' }), 200);
  confettiBurst(90);
  setInterval(() => confettiBurst(25), 3000);
  for (let i = 0; i < 20; i++) setTimeout(spawnHeart, i * 100);
});