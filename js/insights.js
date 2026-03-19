document.addEventListener("DOMContentLoaded", () => {
  renderInsightProfiles();
  renderInsightPosts();
});

function renderInsightProfiles() {
  const container = document.getElementById("insight-profiles");
  if (!container || !window.insightsData) return;

  const profiles = window.insightsData.profiles || [];
  container.innerHTML = profiles.map(profile => `
    <a class="block bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-cyan-400 transition-all" href="${profile.url}" target="_blank" rel="noopener noreferrer">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm font-semibold text-cyan-400">${escapeHtml(profile.name)}</div>
          <div class="text-xs text-slate-400">${escapeHtml(profile.label)}</div>
        </div>
        <div class="text-xs text-slate-500">外部リンク →</div>
      </div>
      <p class="text-sm text-slate-300 mt-3">${escapeHtml(profile.description)}</p>
    </a>
  `).join("");
}

function renderInsightPosts() {
  const container = document.getElementById("insight-posts");
  if (!container || !window.insightsData) return;

  const posts = (window.insightsData.posts || [])
    .filter(post => post.featured)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  container.innerHTML = posts.map(post => `
    <a class="insight-post-card" href="${post.url}" target="_blank" rel="noopener noreferrer">
      ${renderPostMedia(post)}
      <div class="insight-post-content">
        <div class="insight-post-meta">
          <div class="insight-platform">${escapeHtml(post.platform)}</div>
          <div class="insight-date">${escapeHtml(formatDate(post.date))}</div>
        </div>
        <h3 class="insight-post-title">${escapeHtml(post.title)}</h3>
        <p class="insight-post-summary">${escapeHtml(post.summary)}</p>
        <div class="insight-tags">
          ${ (post.tags || []).map(tag => `<span class="insight-tag">${escapeHtml(tag)}</span>`).join('') }
        </div>
      </div>
    </a>
  `).join("");
}

function renderPostMedia(post) {
  const cover = post.cover && post.cover.trim();
  const fallback = getPlatformFallback(post.platform);
  const alt = post.coverAlt || post.title || post.platform;

  // Use background-image as the primary visual so that if <img> fails
  // the background (cover or platform default) remains visible.
  const bg = cover || fallback || '';

  if (!bg) {
    return `<div class="insight-post-media">${buildFallbackMarkup(post)}</div>`;
  }

  // Escape single quotes in fallback markup for use inside onerror string
  const fallbackMarkupEsc = buildFallbackMarkup(post).replace(/'/g, "&#39;");

  return `
    <div class="insight-post-media" style="background-image: url('${bg}'); background-size: cover; background-position: center;">
      <img src="${cover || fallback}" alt="${escapeHtml(alt)}" class="insight-post-image" loading="lazy" onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='${fallbackMarkupEsc}'" />
    </div>
  `;
}

function getPlatformFallback(platform) {
  const map = {
    "X": "assets/platform/x-default.svg",
    "note": "assets/platform/note-default.svg",
    "theLetter": "assets/platform/theletter-default.svg",
    "TheLetter": "assets/platform/theletter-default.svg"
  };

  return map[platform] || "";
}

function buildFallbackMarkup(post) {
  const tags = (post.tags || []).slice(0, 2).map(tag => `<span class="insight-fallback-tag">${escapeHtml(tag)}</span>`).join("");

  return `
    <div class="insight-fallback insight-fallback--${slugify(post.platform)}">
      <div class="insight-fallback-platform">${escapeHtml(post.platform || "Insight")}</div>
      <div class="insight-fallback-title">${escapeHtml(post.title || "")}</div>
      <div class="insight-fallback-tags">${tags}</div>
    </div>
  `;
}

function slugify(text = "") {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, function (s) {
    return ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[s];
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, function (s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[s];
  });
}
