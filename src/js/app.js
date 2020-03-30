import o from 'domil';
import { fetchPage, fetchListing } from './page-fetcher';

const contentHolder = o('.content');

// console.log(contentEl);

// const path = location.pathname.substr(1).split('/');

// console.log(location.pathname.split('/'));
// console.log(path);

const pages = {};

function remToPixels(rem) {    
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const linkClickedEvtHandler = event => {
  event.preventDefault();

  const pageName = event.target.attributes.href.value;
  if (!pageName) return;

  if (pages[pageName]) {
    contentHolder.innerHTML = pages[pageName];
    return;
  }

  fetchPage(pageName).then(res => {
    console.log(`Fetching ${pageName}...`);
    pages[pageName] = res;
    contentHolder.innerHTML = res;
  });
};

const sidebarGroupTemplate = (category, topics) => {
  return `<div class="sidebar-group">
<span class="sidebar-header">
  ${category}
</span>
<ul>
  ${topics
    .map(topic => {
      return `<li><a href="${topic.path}">${topic.pageName}</a></li>`;
    })
    .join('\n')}
</ul>
</div>`;
};

fetchListing().then(pageListing => {
  const sidebarContent = Object.keys(pageListing)
    .map(category => {
      return sidebarGroupTemplate(category, pageListing[category]);
    })
    .join('\n');
  o('.sidebar').innerHTML = sidebarContent;
  o('a').forEach(el => el.addEventListener('click', linkClickedEvtHandler));
});

o('.fixed-overside').addEventListener('click', e => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('scroll', e => {
  if (window.scrollY >= remToPixels(4)) {
    // is visible
    o.css(o('.fixed-overside'), { zIndex: 1000000000000000 });
  } else {
    // is not visible
    o.css(o('.fixed-overside'), { zIndex: -1 });
  }
});
