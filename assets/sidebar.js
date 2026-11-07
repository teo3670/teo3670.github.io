// Shared sidebar menu for every page. Add a category by adding an object to MENU below.
(function(){
  'use strict';
  var root = document.documentElement;

  // ---------- MENU ----------
  // id:       unique name
  // label:    text shown in the menu
  // href:     page the category opens
  // icon:     image shown next to it (path from the site root)
  // pages:    file names that count as "inside" this category (the first is its own page)
  // children: optional sub-links shown while the category is open
  var MENU = [
    { id: 'portfolio', label: 'Portfolio', href: 'index.html', icon: 'assets/td-favicon-32.png', pages: ['index.html'],
      children: [
        { label: 'About',   href: '#about',   target: 'about' },
        { label: 'BALab',   href: '#balab',   target: 'balab' },
        { label: 'Work',    href: '#work',    target: 'work' },
        { label: 'GitHub',  href: '#github',  target: 'github' },
        { label: 'Toolkit', href: '#toolkit', target: 'toolkit' },
        { label: 'Contact', href: '#contact', target: 'contact' }
      ] },
    { id: 'presidentsim', label: 'PresidentSim', href: 'presidentsim.html', icon: 'assets/presidentsim-icon.png',
      pages: ['presidentsim.html', 'presidentsim-privacy.html'],
      children: [
        { label: 'Privacy policy', href: 'presidentsim-privacy.html' }
      ] },
    { id: 'hellenic', label: 'Hellenic Infographics', href: 'hellenic.html', icon: 'assets/hellenic-logo.jpg', pages: ['hellenic.html'] }
  ];

  var file = (location.pathname.split('/').pop() || 'index.html');
  if(file.indexOf('.') === -1) file = file + '.html';

  var narrow = function(){ return window.innerWidth < 1000; };
  try{
    if(!narrow() && localStorage.getItem('sidebar') !== '0') root.classList.add('sidebar-open');
  }catch(e){
    if(!narrow()) root.classList.add('sidebar-open');
  }

  function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  function build(){
    var items = MENU.map(function(c){
      var current = c.pages.indexOf(file) !== -1;
      var onOwnPage = c.href === file;
      var kids = '';
      if(current && c.children){
        kids = '<ul class="side-sub">' + c.children.map(function(k){
          var kidActive = k.href === file;
          return '<li><a class="side-link' + (kidActive ? ' active' : '') + '" href="' + esc(k.href) + '"' +
            (k.target ? ' data-target="' + esc(k.target) + '"' : '') + (kidActive ? ' aria-current="page"' : '') + '>' + esc(k.label) + '</a></li>';
        }).join('') + '</ul>';
      }
      var active = onOwnPage;
      return '<li><a class="side-link' + (active ? ' active' : '') + '" href="' + esc(c.href) + '"' +
        (active ? ' aria-current="page"' : '') + '><img class="side-ic" src="' + esc(c.icon) + '" alt="">' + esc(c.label) + '</a>' + kids + '</li>';
    }).join('');

    var aside = document.createElement('aside');
    aside.className = 'sidebar'; aside.id = 'sidebar'; aside.setAttribute('aria-label', 'Site menu');
    aside.innerHTML =
      '<div class="side-heading">Categories</div>' +
      '<ul class="side-list" id="sideNav">' + items + '</ul>';
    var backdrop = document.createElement('div');
    backdrop.className = 'side-backdrop'; backdrop.id = 'sideBackdrop';
    document.body.insertBefore(backdrop, document.body.firstChild);
    document.body.insertBefore(aside, document.body.firstChild);

    var topbar = document.querySelector('.topbar');
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'menu-btn'; btn.id = 'menuBtn';
    btn.setAttribute('aria-label', 'Toggle menu'); btn.setAttribute('aria-controls', 'sidebar');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    (topbar || document.body).insertBefore(btn, (topbar || document.body).firstChild);

    function setOpen(open){
      root.classList.toggle('sidebar-open', open);
      btn.setAttribute('aria-expanded', String(open));
      try{ if(!narrow()) localStorage.setItem('sidebar', open ? '1' : '0'); }catch(e){}
    }
    btn.setAttribute('aria-expanded', String(root.classList.contains('sidebar-open')));
    btn.addEventListener('click', function(){ setOpen(!root.classList.contains('sidebar-open')); });
    backdrop.addEventListener('click', function(){ setOpen(false); });
    aside.addEventListener('click', function(e){
      var a = e.target.closest('a');
      if(a && narrow() && (a.getAttribute('href').charAt(0) === '#')) setOpen(false);
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && narrow() && root.classList.contains('sidebar-open')) setOpen(false);
    });

    var spy = Array.prototype.slice.call(aside.querySelectorAll('.side-sub .side-link[data-target]'));
    if(spy.length && 'IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(!en.isIntersecting) return;
          spy.forEach(function(l){ l.classList.toggle('active', l.getAttribute('data-target') === en.target.id); });
        });
      }, { rootMargin: '-35% 0px -60% 0px' });
      spy.forEach(function(l){ var t = document.getElementById(l.getAttribute('data-target')); if(t) io.observe(t); });
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
