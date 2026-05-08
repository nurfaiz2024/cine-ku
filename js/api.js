/* =====================================================
   Cine-ku — TMDb API helper
   -----------------------------------------------------
   GANTI nilai TMDB_API_KEY dengan API key milik kamu
   dari https://www.themoviedb.org/settings/api
   ===================================================== */
const TMDB_API_KEY = "0bd0b1ec1788c7c4a1e3f3054303ed66";
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

const Img = {
  poster:   (path, size = "w342") => path ? `${IMG_BASE}/${size}${path}` : "https://via.placeholder.com/342x513/14141d/666?text=No+Image",
  backdrop: (path, size = "original") => path ? `${IMG_BASE}/${size}${path}` : "",
  profile:  (path, size = "w185") => path ? `${IMG_BASE}/${size}${path}` : "https://via.placeholder.com/185x278/14141d/666?text=N/A",
};

async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb ${res.status}`);
  return res.json();
}

const TMDb = {
  popular:   (page = 1) => tmdbFetch("/movie/popular",   { page }),
  topRated:  (page = 1) => tmdbFetch("/movie/top_rated", { page }),
  upcoming:  (page = 1) => tmdbFetch("/movie/upcoming",  { page }),
  search:    (q, page = 1) => tmdbFetch("/search/movie", { query: q, page, include_adult: false }),
  details:   (id) => tmdbFetch(`/movie/${id}`),
  credits:   (id) => tmdbFetch(`/movie/${id}/credits`),
  videos:    (id) => tmdbFetch(`/movie/${id}/videos`),
};

window.TMDb = TMDb;
window.Img = Img;
