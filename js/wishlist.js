/* =====================================================
   Cine-ku — Wishlist (Local Storage)
   ===================================================== */
const WL_KEY = "cineku_wishlist";

const Wishlist = {
  all() {
    try { return JSON.parse(localStorage.getItem(WL_KEY)) || []; }
    catch { return []; }
  },
  has(id) { return this.all().some(m => m.id === id); },
  add(movie) {
    const list = this.all();
    if (!list.some(m => m.id === movie.id)) {
      list.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
      });
      localStorage.setItem(WL_KEY, JSON.stringify(list));
    }
  },
  remove(id) {
    const list = this.all().filter(m => m.id !== id);
    localStorage.setItem(WL_KEY, JSON.stringify(list));
  },
  toggle(movie) {
    if (this.has(movie.id)) { this.remove(movie.id); return false; }
    this.add(movie); return true;
  },
};

window.Wishlist = Wishlist;
