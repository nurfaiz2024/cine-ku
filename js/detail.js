/* =====================================================
   Cine-ku — Detail page
   ===================================================== */
(async function () {
  const root = document.getElementById("detailRoot");
  if (!root) return;

  const id = new URLSearchParams(location.search).get("id");
  if (!id) {
    root.innerHTML = `<p class="loading">Movie ID tidak ditemukan.</p>`;
    return;
  }

  try {
    const [details, credits, videos] = await Promise.all([
      TMDb.details(id), TMDb.credits(id), TMDb.videos(id),
    ]);

    const trailer = (videos.results || []).find(v => v.site === "YouTube" && v.type === "Trailer")
                  || (videos.results || []).find(v => v.site === "YouTube");
    const cast = (credits.cast || []).slice(0, 10);

    const isFav = Wishlist.has(details.id);

    root.innerHTML = `
      <section class="detail-backdrop" style="background-image:url('${Img.backdrop(details.backdrop_path)}')">
        <div class="detail-container">
          <div class="detail-poster">
            <img src="${Img.poster(details.poster_path, 'w500')}" alt="${details.title}" />
          </div>
          <div class="detail-info">
            <h1>${details.title}</h1>
            ${details.tagline ? `<p class="detail-tagline">"${details.tagline}"</p>` : ""}
            <div class="detail-meta">
              <span class="rating">★ ${details.vote_average?.toFixed(1) || "N/A"}</span>
              <span>📅 ${details.release_date || "—"}</span>
              <span>⏱️ ${details.runtime || 0} menit</span>
              <span>🌐 ${(details.original_language || "").toUpperCase()}</span>
              <span>📺 ${details.status || "—"}</span>
            </div>
            <div class="detail-genres">
              ${(details.genres || []).map(g => `<span class="genre-pill">${g.name}</span>`).join("")}
            </div>
            <p class="detail-overview">${details.overview || "Tidak ada deskripsi."}</p>
            <div class="detail-actions">
              ${trailer ? `<button class="btn-primary" id="btnTrailer">▶ Watch Trailer</button>` : ""}
              <button class="btn-secondary" id="btnFav">${isFav ? "❤️ Tersimpan" : "🤍 Tambah ke Wishlist"}</button>
            </div>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <h2>Informasi Film</h2>
        <div class="info-grid">
          <div><h4>Status</h4><p>${details.status || "—"}</p></div>
          <div><h4>Bahasa</h4><p>${(details.spoken_languages || []).map(l => l.english_name).join(", ") || "—"}</p></div>
          <div><h4>Durasi</h4><p>${details.runtime || 0} menit</p></div>
          <div><h4>Rilis</h4><p>${details.release_date || "—"}</p></div>
          <div><h4>Budget</h4><p>${details.budget ? "$" + details.budget.toLocaleString() : "—"}</p></div>
          <div><h4>Revenue</h4><p>${details.revenue ? "$" + details.revenue.toLocaleString() : "—"}</p></div>
        </div>
      </section>

      ${cast.length ? `
      <section class="detail-section">
        <h2>Pemeran Utama</h2>
        <div class="cast-grid">
          ${cast.map(c => `
            <div class="cast-card">
              <img loading="lazy" src="${Img.profile(c.profile_path)}" alt="${c.name}" />
              <div class="cast-info">
                <div class="cast-name">${c.name}</div>
                <div class="cast-character">${c.character || ""}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>` : ""}
    `;

    // Trailer modal
    const modal = document.getElementById("trailerModal");
    const frame = document.getElementById("trailerFrame");
    const btnTrailer = document.getElementById("btnTrailer");
    btnTrailer?.addEventListener("click", () => {
      frame.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      modal.classList.add("active");
    });
    document.getElementById("trailerClose").addEventListener("click", () => {
      modal.classList.remove("active");
      frame.innerHTML = "";
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        frame.innerHTML = "";
      }
    });

    // Favorite
    const btnFav = document.getElementById("btnFav");
    btnFav.addEventListener("click", () => {
      if (!window.cineUser) {
        alert("Login dengan Google dulu untuk menyimpan ke wishlist.");
        window.cineAuth?.login();
        return;
      }
      const nowFav = Wishlist.toggle(details);
      btnFav.textContent = nowFav ? "❤️ Tersimpan" : "🤍 Tambah ke Wishlist";
    });

  } catch (err) {
    console.error(err);
    root.innerHTML = `<p class="loading">Gagal memuat detail. Periksa koneksi & API Key TMDb.</p>`;
  }
})();
