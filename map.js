const cities = [
  {
    name_en: "London, Canada",
    name_zh: "伦敦，加拿大",
    lat: 42.9849,
    lng: -81.2453,
    photo: "photos/london_ca.jpg",
    text_en: "Where it all began. Born here, this quiet Ontario city carries the first chapter of a story that would cross oceans and languages before finding its next home.",
    text_zh: '故事开始的地方。我在这里出生，这座安静的安大略小城，是我人生里第一个“家”的概念——那时候还不知道，这个家之后会换很多种语言，落在很多不同的地方。'
  },
  {
    name_en: "Guangzhou, China",
    name_zh: "广州，中国",
    lat: 23.1291,
    lng: 113.2644,
    photo: "photos/guangzhou.jpg",
    text_en: "Home from age 2 to 9. Guangzhou gave me Cantonese afternoons, endless dim sum mornings, and the deep fluency that only a childhood city can teach.",
    text_zh: '两岁到九岁，这里是我真正意义上"长大"的地方。广州教会我的不只是粤语和早茶，更是一种对生活细节的感知——那种只有在一个地方待够久才会长出来的东西。'
  },
  {
    name_en: "Montréal, Canada",
    name_zh: "蒙特利尔，加拿大",
    lat: 45.5017,
    lng: -73.5673,
    photo: "photos/montreal.jpg",
    text_en: "Nine years old and back in Canada, Montréal became the city that built me — its bilingual streets, winters that demand resilience, and a creative energy that shapes how I think.",
    text_zh: "九岁回来，一住就是好多年。蒙特利尔是一座很矛盾的城市——它冷，但有很多温热的东西藏在里面。法语和英语在这里共存，就像我脑子里不同的部分，有时候争吵，更多时候互补。"
  },
  {
    name_en: "Shanghai, China",
    name_zh: "上海，中国",
    lat: 31.2304,
    lng: 121.4737,
    photo: "photos/shanghai.jpg",
    text_en: "Where I live and study now. At Shanghai Jiao Tong University, I'm asking the questions that matter most to me — and this city's relentless forward motion makes the perfect backdrop.",
    text_zh: "现在住的地方，也是交大所在的城市。上海很快，快到有时候让人觉得喘不过气——但也正是这种快，逼着你想清楚自己到底要去哪里。"
  }
];

const currentLang = () => document.documentElement.lang || 'en';

const map = L.map('world-map', {
  center: [35, 10],
  zoom: 2,
  zoomControl: true,
  scrollWheelZoom: false,
  attributionControl: true
});

// CARTO dark tiles — no API key needed
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

const pulseIcon = L.divIcon({
  className: '',
  html: '<span class="map-pin"><span class="map-pin-pulse"></span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const card     = document.getElementById('city-card');
const cardImg  = document.getElementById('city-card-img');
const cardName = document.getElementById('city-card-name');
const cardText = document.getElementById('city-card-text');

let hideTimer;
let activeCity = null;

const OFFSET_X = 16; // px to the right of the cursor
const OFFSET_Y = -20; // slight upward offset

function positionCard(mouseEvent) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cw = card.offsetWidth  || 270;
  const ch = card.offsetHeight || 260;

  let x = mouseEvent.clientX + OFFSET_X;
  let y = mouseEvent.clientY + OFFSET_Y;

  // Flip to left if would overflow right edge
  if (x + cw > vw - 10) x = mouseEvent.clientX - cw - OFFSET_X;
  // Clamp vertically
  if (y + ch > vh - 10) y = vh - ch - 10;
  if (y < 10) y = 10;

  card.style.left = x + 'px';
  card.style.top  = y + 'px';
}

function showCard(city, mouseEvent) {
  clearTimeout(hideTimer);
  activeCity = city;
  const lang = currentLang();
  cardName.textContent = lang === 'zh' ? city.name_zh : city.name_en;
  cardText.textContent = lang === 'zh' ? city.text_zh : city.text_en;
  cardImg.src = city.photo;
  cardImg.alt = city.name_en;
  positionCard(mouseEvent);
  card.classList.add('visible');
  card.removeAttribute('aria-hidden');
}

function hideCard() {
  hideTimer = setTimeout(() => {
    card.classList.remove('visible');
    card.setAttribute('aria-hidden', 'true');
    activeCity = null;
  }, 150);
}

cities.forEach(city => {
  const marker = L.marker([city.lat, city.lng], { icon: pulseIcon }).addTo(map);

  marker.on('mouseover', (e) => showCard(city, e.originalEvent));
  marker.on('mousemove', (e) => { if (activeCity === city) positionCard(e.originalEvent); });
  marker.on('mouseout', hideCard);
  marker.on('click', (e) => showCard(city, e.originalEvent));
});

document.addEventListener('langChanged', () => {
  if (activeCity) {
    const lang = currentLang();
    cardName.textContent = lang === 'zh' ? activeCity.name_zh : activeCity.name_en;
    cardText.textContent = lang === 'zh' ? activeCity.text_zh : activeCity.text_en;
  }
});
