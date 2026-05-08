/* =====================================================
   Cine-ku — Search (realtime)
   ===================================================== */
(function () {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  if (!input) return;

  let timer = null;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (!q) {
      results.innerHTML = `<p class="empty-state">Mulai mengetik untuk mencari film...</p>`;
      return;
    }
    timer = setTimeout(() => doSearch(q), 350);
  });

  async function doSearch(q) {
    results.innerHTML = `<p class="empty-state">Mencari "${q}"...</p>`;
    try {
      const data = await TMDb.search(q);
      if (!data.results.length) {
        results.innerHTML = `<p class="empty-state">Tidak ada hasil untuk "${q}".</p>`;
        return;
      }
      results.innerHTML = "";
      data.results.forEach(m => results.appendChild(window.createMovieCard(m)));
    } catch (err) {
      console.error(err);
      results.innerHTML = `<p class="empty-state">Error pencarian. Periksa API Key TMDb.</p>`;
    }
  }
})();
