const fs = require('fs');
const parser = require('./ldm-parser');

const data = parser('./pages.ldm');

const slugify = string => {
  const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
  const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
  const p = new RegExp(a.split('').join('|'), 'g');
  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters in a with b
    .replace(/&/g, '-and-') // Replace & with ‘and’
    .replace(/[^\w-]+/g, '') // Remove all non-word characters such as spaces or tabs
    .replace(/--+/g, '-') // Replace multiple — with single -
    .replace(/^-+/, '') // Trim — from start of text
    .replace(/-+$/, ''); // Trim — from end of text
};

function generateMarkdown(pageName, items) {
  return `# ${pageName}

${'T'}ODO: Add here description of this category.

${items.reduce((acc, cur) => {
  return acc + `## ${cur}\n\n${'T'}ODO: Add details for ${cur} on the ${pageName} page.\n\n`;
}, '')}`;
}

const created = [];
const toJSON = {};

for (const key in data) {
  const path = `./src/pages/${slugify(key)}/`;
  fs.mkdirSync(path, { recursive: true });

  for (const pageName in data[key]) {
    const fullPathName = path + slugify(pageName) + '.md';
    const topic = {
      pageName,
      path: fullPathName.replace('./src', '.').replace(/\.md$/, '.html'),
    };

    if (fs.existsSync(fullPathName)) {
      toJSON[key] = [...(toJSON[key] || []), topic];
      continue;
    }
    const markdown = generateMarkdown(pageName, Object.keys(data[key][pageName]));
    fs.writeFileSync(fullPathName, markdown);
    created.push(topic);
    toJSON[key] = [...(toJSON[key] || []), topic];
  }
}

if (created.length) console.log(`\nCreated ${created.length} page files.\n`);

const jsonPath = './src/pages.txt';
if (fs.existsSync(jsonPath)) {
  fs.unlinkSync(jsonPath);
}
console.log('\n\nGenerating pages.txt\n\n');
fs.writeFileSync(jsonPath, JSON.stringify(toJSON, null, 2));
