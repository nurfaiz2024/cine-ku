/* =====================================================
   Cine-ku — App utilities (card, slider, navbar, home, wishlist page)
   ===================================================== */

const BASE = window.CINEKU_BASE || ""; // "" atau "../"

// ============== HELPERS ==============
function year(date) { return date ? date.slice(0, 4) : "—"; }
function rating(r) { return r ? r.toFixed(1) : "N/A"; }

function detailUrl(id) {
  return `${BASE}pages/detail.html?id=${id}`;
}

function createMovieCard(movie) {
  const isFav = window.Wishlist?.has(movie.id);
  const card = document.createElement("article");
  card.className = "movie-card";
  card.innerHTML = `
    <div class="movie-poster">
      <img loading="lazy" src="${Img.poster(movie.poster_path)}" alt="${movie.title}" />
      <div class="movie-rating">★ ${rating(movie.vote_average)}</div>
      <button class="fav-btn ${isFav ? "active" : ""}" title="Favorite" aria-label="Favorite">
        ${isFav ? "❤️" : "🤍"}
      </button>
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${movie.title}</h3>
      <p class="movie-year">${year(movie.release_date)}</p>
      <p class="movie-overview">${movie.overview || "Tidak ada deskripsi."}</p>
    </div>
  `;
  // Click card -> detail
  card.addEventListener("click", (e) => {
    if (e.target.closest(".fav-btn")) return;
    window.location.href = detailUrl(movie.id);
  });
  // Favorite
  card.querySelector(".fav-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    if (!window.cineUser) {
      alert("Silakan login dengan Google terlebih dahulu untuk menyimpan ke wishlist.");
      window.cineAuth?.login();
      return;
    }
    const nowFav = window.Wishlist.toggle(movie);
    const btn = e.currentTarget;
    btn.classList.toggle("active", nowFav);
    btn.textContent = nowFav ? "❤️" : "🤍";
  });
  return card;
}

window.createMovieCard = createMovieCard;

// ============== NAVBAR HAMBURGER ==============
document.addEventListener("DOMContentLoaded", () => {
  const ham = document.getElementById("hamburger");
  const links = document.querySelector(".nav-links");
  ham?.addEventListener("click", () => links.classList.toggle("open"));

  const yEl = document.getElementById("year");
  if (yEl) yEl.textContent = new Date().getFullYear();
});

// ============== HOME PAGE ==============
async function initHome() {
  const heroSlides = document.getElementById("heroSlides");
  const heroDots = document.getElementById("heroDots");
  const popularSlider = document.getElementById("popularSlider");
  const topRatedSlider = document.getElementById("topRatedSlider");
  const upcomingSlider = document.getElementById("upcomingSlider");
  if (!heroSlides && !popularSlider) return; // bukan halaman home

  try {
    const [pop, top, up] = await Promise.all([
      TMDb.popular(), TMDb.topRated(), TMDb.upcoming(),
    ]);

    // ========== HERO CAROUSEL ==========
    const heroMovies = pop.results.slice(0, 5);
    heroMovies.forEach((m, i) => {
      const slide = document.createElement("div");
      slide.className = "hero-slide" + (i === 0 ? " active" : "");
      slide.style.backgroundImage = `url(${Img.backdrop(m.backdrop_path)})`;
      slide.innerHTML = `
        <div class="hero-content">
          <h1>${m.title}</h1>
          <div class="hero-meta">
            <span class="badge">★ ${rating(m.vote_average)}</span>
            <span>${year(m.release_date)}</span>
          </div>
          <p>${m.overview || ""}</p>
          <div class="hero-actions">
            <a href="${detailUrl(m.id)}" class="btn-primary">▶ Lihat Detail</a>
          </div>
        </div>`;
      heroSlides.appendChild(slide);

      const dot = document.createElement("button");
      dot.className = "hero-dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => goSlide(i));
      heroDots.appendChild(dot);
    });

    let current = 0;
    const slidesEls = () => heroSlides.querySelectorAll(".hero-slide");
    const dotsEls = () => heroDots.querySelectorAll(".hero-dot");
    function goSlide(i) {
      current = i;
      slidesEls().forEach((s, k) => s.classList.toggle("active", k === i));
      dotsEls().forEach((d, k) => d.classList.toggle("active", k === i));
    }
    setInterval(() => goSlide((current + 1) % heroMovies.length), 6000);

    // ========== SLIDERS ==========
    pop.results.forEach(m => popularSlider.appendChild(createMovieCard(m)));
    top.results.forEach(m => topRatedSlider.appendChild(createMovieCard(m)));
    up.results.forEach(m => upcomingSlider.appendChild(createMovieCard(m)));

    // Slider buttons
    document.querySelectorAll(".slider-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        const map = { popular: popularSlider, top_rated: topRatedSlider, upcoming: upcomingSlider };
        const slider = map[target];
        const dir = btn.classList.contains("next") ? 1 : -1;
        slider.scrollBy({ left: dir * (slider.clientWidth * 0.8), behavior: "smooth" });
      });
    });
  } catch (err) {
    console.error(err);
    if (popularSlider) popularSlider.innerHTML = `<p class="empty-state">Gagal memuat film. Pastikan API Key TMDb sudah benar di <code>js/api.js</code>.</p>`;
  }
}
initHome();

// ============== WISHLIST PAGE ==============
async function initWishlist() {
  const grid = document.getElementById("wishlistGrid");
  const empty = document.getElementById("wishlistEmpty");
  const loginReq = document.getElementById("loginRequired");
  if (!grid) return;

  function render() {
    grid.innerHTML = "";
    empty.style.display = "none";
    loginReq.style.display = "none";

    if (!window.cineUser) {
      loginReq.style.display = "block";
      return;
    }
    const list = Wishlist.all();
    if (!list.length) { empty.style.display = "block"; return; }
    list.forEach(m => grid.appendChild(createMovieCard(m)));
  }

  document.getElementById("loginPrompt")?.addEventListener("click", () => window.cineAuth?.login());
  window.addEventListener("cine-auth-changed", render);
  // initial
  render();
}
initWishlist();
