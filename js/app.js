import {projects} from './projects.js';
const $ = selector => document.querySelector(selector);
const grid = $('#project-grid');
const dialog = $('#project-dialog');
const lightbox = $('#lightbox');
const translations = {
 work:'Работы',about:'Обо мне',expertise:'Навыки',available:'Открыт для заказов',heroLabel:'НЕЗАВИСИМЫЙ UI/UX И БРЕНД-ДИЗАЙНЕР',heroOne:'Продуманный дизайн.',heroTwo:'Яркие впечатления.',heroDescription:'Создаю удобные интерфейсы и запоминающиеся логотипы. Добавляю характер в каждый пиксель.',explore:'Смотреть работы',letsTalk:'Давайте обсудим',experience:'ГОДА ТВОРЧЕСКОГО ОПЫТА',scroll:'СМОТРЕТЬ НИЖЕ',selectedWork:'ИЗБРАННЫЕ РАБОТЫ',workTitle:'Несколько моих проектов.',workIntro:'Разные миры. Внимание к каждой детали. Загляните за кулисы дизайна.',all:'Все работы',logos:'Логотипы',more:'Больше проектов',less:'Свернуть проекты',aboutLabel:'НЕМНОГО ОБО МНЕ',aboutTitle:'Хороший дизайн начинается с разговора.',aboutText:'Я TheSpiffyOne, UI/UX-дизайнер и дизайнер логотипов с опытом более трёх лет. От первого наброска до готового интерфейса в Roblox — мне важно, как продукт выглядит и как им пользоваться.',aboutTextTwo:'Верю, что открытое общение и честная обратная связь помогают создавать лучшие работы. Вы приносите идею — вместе мы находим её характер.',expertiseLabel:'ЧЕМ Я МОГУ ПОМОЧЬ',expertiseTitle:'Творческий взгляд. Практичный подход.',expertiseIntro:'Продуманный дизайн, технические знания и общение, которое помогает двигаться вперёд.',uiDesign:'UI/UX-дизайн',uiText:'Интерфейсы с характером. Удобные меню, продуманные сценарии и единый визуальный язык на каждом экране.',uiOne:'Дизайн интерфейсов и прототипы',uiTwo:'Внедрение в Roblox Studio',uiThree:'Ориентация на пользователя',brandDesign:'Айдентика',brandText:'Выразительные знаки с вашей индивидуальностью. Узнаваемые и универсальные логотипы с ясной идеей в основе.',brandOne:'Логотипы и визуальная айдентика',brandTwo:'Поиск идей и разработка концепций',brandThree:'Доработка на основе отзывов',communication:'Открытое общение',communicationText:'Хорошая работа — результат сотрудничества. В процессе всегда есть место вопросам, идеям и лучшим решениям.',communicationOne:'Регулярные отчёты о прогрессе',communicationTwo:'Конструктивная обратная связь',communicationThree:'Общее творческое направление',together:'ДАВАЙТЕ РАБОТАТЬ ВМЕСТЕ',contactOne:'Есть идея?',contactTwo:'Давайте воплотим её.',contactText:'Новый проект, большая идея или просто привет. Буду рад услышать, что вы задумали.',contactButton:'Написать в Discord',backWork:'Вернуться к работам'
};
const defaults = new Map([...document.querySelectorAll('[data-i18n]')].map(el=>[el,el.innerHTML]));
let language = 'en';
try { language = localStorage.getItem('portfolio-language') === 'ru' ? 'ru' : 'en'; } catch {}
let filter = 'all';
let expanded = false;
let activeProject = null;
let imageIndex = 0;
let returnFocus = null;
const text = (en, ru) => language === 'ru' ? ru : en;
const title = project => language === 'ru' && project.titleRu ? project.titleRu : project.title;
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const asset = value => encodeURI(value);
// Use SVG arrows so navigation stays clear even on systems without symbol fonts.
function drawIcons(root = document.body) {
 const paths = {'↗':'M6 18 18 6M6 6h12v12','↑':'m6 10 6-6 6 6M12 4v16','↓':'m6 14 6 6 6-6M12 4v16','←':'m10 6-6 6 6 6M4 12h16','→':'m14 6 6 6-6 6M4 12h16','✕':'m6 6 12 12M6 18 18 6'};
 const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes = [];
 while(walker.nextNode()) {
  const node = walker.currentNode;
  if (/[↗↑↓←→✕]/.test(node.textContent) && !node.parentElement.closest('script,style,svg,select,option')) nodes.push(node);
 }
 for(const node of nodes) {
  const fragment = document.createDocumentFragment();
  for(const part of node.textContent.split(/([↗↑↓←→✕])/)) {
   if(!paths[part]) {fragment.append(document.createTextNode(part));continue;}
   const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
   svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('class','arrow-icon');svg.setAttribute('aria-hidden','true');
   const path = document.createElementNS('http://www.w3.org/2000/svg','path');
   path.setAttribute('d',paths[part]);path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','1.7');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');
   svg.append(path);fragment.append(svg);
  }
  node.replaceWith(fragment);
 }
}
function applyLanguage() {
 document.documentElement.lang = language;
 $('#language').value = language;
 for (const [el,original] of defaults) {
  const value = translations[el.dataset.i18n];
  if (language === 'ru' && value) el.textContent = value;
  else el.innerHTML = original;
 }
 renderProjects();
 if (activeProject) renderDetails(activeProject);
 if (lightbox.open) renderImage();
 drawIcons();
}
function renderProjects() {
 const matching = projects.filter(project=>filter === 'all' || project.category === filter);
 const visible = expanded ? matching : matching.slice(0,6);
 grid.innerHTML = visible.map((project,index)=>`<article class="project-card ${project.category === 'logos' ? 'logo-card' : ''} ${project.featured && filter === 'all' ? 'featured' : ''}">
 <button class="project-button" data-project="${project.id}" aria-label="${escapeHtml(text('View project: ','Открыть проект: ')+title(project))}">
 <div class="project-cover">${project.personal ? `<div class="personal-cover"><img src="images/icons/logo_v2.svg" alt=""><p>THE<br>SPIFFYONE<span>®</span></p></div>` : `<img src="${asset(project.cover)}" alt="${escapeHtml(title(project))}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} width="1600" height="900">`}
 <span class="cover-label">${project.category === 'logos' ? 'BRAND IDENTITY' : 'UI/UX DESIGN'}</span><span class="view-project">${text('Explore project','Смотреть проект')} ↗</span></div>
 <div class="project-caption"><div class="project-info"><h3>${escapeHtml(title(project))}</h3><p>${escapeHtml(language === 'ru' ? project.subtitleRu : project.subtitle)}</p></div><div class="project-tags"><span class="tag">${project.category === 'logos' ? text('Logo design','Логотип') : 'UI/UX'}</span>${project.tools.includes('Roblox Studio') ? '<span class="tag">Roblox Studio</span>' : ''}</div><span class="project-arrow" aria-hidden="true">↗</span></div></button></article>`).join('');
 $('#results').textContent = text(`${matching.length} projects. Showing ${visible.length}.`, `Найдено проектов: ${matching.length}. Показано: ${visible.length}.`);
 $('#project-count').textContent = text(`${String(visible.length).padStart(2,'0')} / ${String(matching.length).padStart(2,'0')} projects`,`${String(visible.length).padStart(2,'0')} / ${String(matching.length).padStart(2,'0')} проектов`);
 $('#show-more').hidden = matching.length <= 6;
 $('#show-more').innerHTML = `<span>${expanded ? text('Fewer projects','Свернуть проекты') : text('More projects','Больше проектов')}</span><span>${expanded ? '↑' : '↓'}</span>`;
 drawIcons(grid);drawIcons($('#show-more'));
}
function renderDetails(project) {
 $('#project-detail').innerHTML = `<div class="detail-header"><p class="eyebrow section-label"><span>${project.category === 'logos' ? 'BRAND IDENTITY' : 'UI/UX DESIGN'}</span> / ${text('PROJECT DETAILS','О ПРОЕКТЕ')}</p><h2 id="project-title">${escapeHtml(title(project))}</h2><div class="project-tags">${project.tools.map(tool=>`<span class="tag">${tool}</span>`).join('')}</div><div class="detail-overview"><p>${escapeHtml(language === 'ru' ? project.descriptionRu : project.description)}</p><dl class="detail-meta"><div><dt>${text('DISCIPLINE','НАПРАВЛЕНИЕ')}</dt><dd>${project.category === 'logos' ? text('Logo & brand identity','Логотип и айдентика') : text('User interface design','Дизайн интерфейса')}</dd></div><div><dt>${text('TOOLKIT','ИНСТРУМЕНТЫ')}</dt><dd>${project.tools.join(' · ')}</dd></div><div><dt>${text('GALLERY','ГАЛЕРЕЯ')}</dt><dd>${project.images.length} ${text('images · click to enlarge','изображений · нажмите для увеличения')}</dd></div></dl></div></div><div class="detail-gallery">${project.images.map((im,index)=>`<figure class="gallery-item"><button class="gallery-image" data-image="${index}" aria-label="${escapeHtml(text('Enlarge: ','Увеличить: ')+(language === 'ru' ? im.ru : im.caption))}"><img src="${asset(im.src)}" alt="${escapeHtml(title(project)+' — '+(language === 'ru' ? im.ru : im.caption))}" ${index ? 'loading="lazy"' : ''}></button><figcaption><span>${escapeHtml(language === 'ru' ? im.ru : im.caption)}</span><span>${text('VIEW FULL SIZE','УВЕЛИЧИТЬ')} ↗</span></figcaption></figure>`).join('')}${project.video ? `<video class="detail-video" src="${asset(project.video)}" controls preload="none" aria-label="${escapeHtml(title(project))} video"></video>` : ''}</div><div class="detail-next"><p>${text('Have a project of your own?','Есть свой проект?')}</p><a class="button primary" href="https://discord.com/users/317666289197907969" target="_blank" rel="noopener noreferrer">${text('Let’s talk','Давайте обсудим')} ↗</a></div>`;
}
function openProject(project, opener) {
 if (!project) return;
 if (opener) returnFocus = opener;
 activeProject = project;
 renderDetails(project);
 drawIcons(dialog);
 if (!dialog.open) dialog.showModal();
 document.body.classList.add('modal-open');
 dialog.scrollTop = 0;
 $('#close-project').focus({preventScroll:true});
}
function closeProject() {
 if (lightbox.open) lightbox.close();
 if (dialog.open) dialog.close();
 activeProject = null;
 document.body.classList.remove('modal-open');
 if (location.hash.startsWith('#project/')) history.replaceState(null,'',location.pathname+location.search+'#work');
 if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
}
function renderImage() {
 const picture = activeProject.images[imageIndex];
 $('#lightbox-image').src = asset(picture.src);
 $('#lightbox-image').alt = title(activeProject)+' — '+(language === 'ru' ? picture.ru : picture.caption);
 $('#lightbox-caption').textContent = title(activeProject)+' / '+(language === 'ru' ? picture.ru : picture.caption);
 $('#image-counter').textContent = `${imageIndex+1} / ${activeProject.images.length}`;
 $('#previous-image').hidden = $('#next-image').hidden = activeProject.images.length < 2;
}
function moveImage(direction) {
 imageIndex = (imageIndex+direction+activeProject.images.length)%activeProject.images.length;
 renderImage();
}
function readRoute() {
 const match = location.hash.match(/^#project\/([a-z0-9-]+)$/);
 const project = match && projects.find(item=>item.id === match[1]);
 if (project) openProject(project);
 else if (dialog.open) closeProject();
}
grid.addEventListener('click', event=>{
 const button = event.target.closest('[data-project]');
 if (!button) return;
 const project = projects.find(item=>item.id === button.dataset.project);
 history.pushState(null,'',`#project/${project.id}`);
 openProject(project,button);
});
document.querySelector('.filters').addEventListener('click', event=>{
 const button = event.target.closest('[data-filter]');
 if (!button) return;
 filter = button.dataset.filter;
 expanded = false;
 document.querySelectorAll('[data-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el === button)));
 renderProjects();
});
$('#show-more').addEventListener('click',()=>{
 expanded = !expanded;
 renderProjects();
 if (!expanded) $('#work').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
});
$('#close-project').addEventListener('click',closeProject);
$('#back-work').addEventListener('click',event=>{event.preventDefault();closeProject();});
dialog.addEventListener('cancel',event=>{event.preventDefault();closeProject();});
dialog.addEventListener('click',event=>{if(event.target === dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeProject();}});
$('#project-detail').addEventListener('click',event=>{
 const image = event.target.closest('[data-image]');
 if (!image) return;
 imageIndex = Number(image.dataset.image);
 renderImage();lightbox.showModal();$('#close-lightbox').focus();
});
$('#close-lightbox').addEventListener('click',()=>lightbox.close());
$('#previous-image').addEventListener('click',()=>moveImage(-1));
$('#next-image').addEventListener('click',()=>moveImage(1));
lightbox.addEventListener('keydown',event=>{if(event.key === 'ArrowLeft'){event.preventDefault();moveImage(-1);}if(event.key === 'ArrowRight'){event.preventDefault();moveImage(1);}});
$('#language').addEventListener('change',event=>{language=event.target.value;try{localStorage.setItem('portfolio-language',language);}catch{}applyLanguage();});
window.addEventListener('hashchange',readRoute);
window.addEventListener('popstate',readRoute);
$('#year').textContent = new Date().getFullYear();
// Seeded coordinates keep the star field calm and stable across visits.
let seed = 4821;
const random = ()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
document.querySelectorAll('.stars').forEach(field=>{
 const fragment = document.createDocumentFragment();
 for(let index=0;index<210;index++){
  const star=document.createElement('i');star.className='star'+(index%19 === 0 ? ' bright' : '');
  star.style.cssText=`left:${random()*100}%;top:${random()*100}%;--size:${index%19 === 0 ? 2 : 1}px;--opacity:${.12+random()*.42}`;
  fragment.append(star);
 }
 field.append(fragment);
});
applyLanguage();readRoute();
