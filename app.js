const requestedLang=new URLSearchParams(location.search).get('lang');
const browserLang=navigator.languages?.[0] || navigator.language || '';
const lang=['ko','ja'].includes(requestedLang)?requestedLang:(/^ko(?:-|$)/i.test(browserLang)?'ko':'ja');
const ja=lang==='ja';
const labels=ja?['表紙','プロローグ','有限オートマトン','括弧を閉じる順番','文字を読んで計算する','スタックでは足りないなら','テープを増やしたら？','どこまで短く書けるでしょうか？','終わることは、終わるのですが。','エピローグ','参考資料・出典']:['표지','프롤로그','유한 오토마타','괄호를 닫는 순서','글자를 읽어서 계산하기','스택으로 부족하다면','테이프를 더 늘리면?','얼마나 짧게 쓸 수 있을까요?','끝나기는 하는데요.','에필로그','참고자료 및 출처'];
const starts=[1,2,3,5,7,10,14,17,22,28,29];
document.documentElement.lang=lang;
document.title=ja?'古畑ラナと学ぶコンピュータ科学':'후루하타 라나와 배우는 컴퓨터과학';
document.querySelector('#title').innerHTML=ja?'古畑ラナと学ぶ<br>コンピュータ科学':'후루하타 라나와 배우는 <br>컴퓨터과학';
document.querySelector('[data-lang="'+lang+'"]').setAttribute('aria-current','page');
document.querySelector('#contents-label').textContent=ja?'目次':'목차';
document.querySelector('#page-label').textContent=ja?'ページ':'페이지';
document.querySelector('#top').textContent=ja?'表紙へ':'표지로';
document.querySelector('#notice').textContent=ja?'『ブルーアーカイブ』の非公式ファン創作物です。原作およびキャラクターの権利は各権利者に帰属します。':'『블루 아카이브』의 비공식 팬 창작물입니다. 원작과 캐릭터의 권리는 각 권리자에게 있습니다.';
const pdf=document.querySelector('#pdf');pdf.href='assets/'+lang+'/rana-computer-science-'+lang+'.pdf';pdf.textContent=ja?'日本語版PDFをダウンロード':'한국어판 PDF 다운로드';
document.querySelector('#file-info').textContent=ja?'全29ページ、60 MB':'29페이지, 60 MB';
const chapters=document.querySelector('#chapters'),pages=document.querySelector('#pages'),select=document.querySelector('#page-select');
select.setAttribute('aria-label',ja?'ページを選択':'페이지 선택');
document.querySelector('#book').setAttribute('aria-label',ja?'本を読む':'책 읽기');
labels.forEach((name,i)=>{const a=document.createElement('a');a.href='#page-'+starts[i];const n=document.createElement('span');n.className='number';n.textContent=i>=2&&i<=8?String(i-1):'';const t=document.createElement('span');t.textContent=name;a.append(n,t);chapters.append(a);});
for(let i=1;i<=29;i++){const figure=document.createElement('figure');figure.className='book-page';figure.id='page-'+i;const img=document.createElement('img');img.src='assets/'+lang+'/page-'+String(i).padStart(2,'0')+'.webp';img.width=1400;img.height=1986;img.alt=document.title+', '+i+(ja?'ページ':'페이지');img.loading=i===1?'eager':'lazy';img.decoding='async';if(i===1)img.fetchPriority='high';const caption=document.createElement('figcaption');caption.textContent=i+' / 29';figure.append(img,caption);pages.append(figure);const o=document.createElement('option');o.value=i;o.textContent=i+' / 29';select.append(o);}
function markPage(n){select.value=n;let c=0;starts.forEach((start,i)=>{if(n>=start)c=i;});[...chapters.children].forEach((a,i)=>{if(i===c)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
function jump(){const match=location.hash.match(/^#page-(\d+)$/);if(!match)return;const n=Number(match[1]);if(n<1||n>29)return;document.getElementById('page-'+n).scrollIntoView({behavior:'instant',block:'start'});markPage(n);}
select.addEventListener('change',()=>{const n=select.value;if(location.hash==='#page-'+n)jump();else location.hash='page-'+n;});
window.addEventListener('hashchange',jump);
chapters.addEventListener('click',event=>{if(event.target.closest('a')&&matchMedia('(max-width:850px)').matches)document.querySelector('.contents').open=false;});
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)markPage(Number(e.target.id.slice(5)));},{rootMargin:'-60px 0px -60% 0px',threshold:0});
document.querySelectorAll('.book-page').forEach(p=>observer.observe(p));
const mobileLayout=matchMedia('(max-width:850px)');
document.querySelector('.contents').open=!mobileLayout.matches;
mobileLayout.addEventListener('change',event=>{document.querySelector('.contents').open=!event.matches;});
markPage(1);requestAnimationFrame(jump);
