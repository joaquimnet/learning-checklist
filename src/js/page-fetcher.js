export async function fetchListing() {
  const res = await fetch(`./pages.txt`);
  const content = await res.json();
  return content;
}

export async function fetchPage(url) {
  const res = await fetch(url);
  const content = await res.text();
  return content;
}
