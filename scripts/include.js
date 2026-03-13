/* Simple include loader: replace elements with `data-include="path"` with fetched HTML. */
(function () {
  function loadIncludes() {
    const includes = document.querySelectorAll('[data-include]');
    const promises = [];
    includes.forEach(el => {
      const url = el.getAttribute('data-include');
      if (!url) return;
      const p = fetch(url)
        .then(resp => {
          if (!resp.ok) throw new Error('Failed to load ' + url);
          return resp.text();
        })
        .then(html => {
          el.innerHTML = html;
        })
        .catch(err => {
          console.error(err);
        });
      promises.push(p);
    });
    return Promise.all(promises).then(() => {
      document.dispatchEvent(new CustomEvent('includesLoaded'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIncludes);
  } else {
    loadIncludes();
  }
})();
