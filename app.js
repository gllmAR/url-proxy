(function () {
  const msg = document.getElementById("msg");
  const goBtn = document.getElementById("go");

  function show(html) { msg.innerHTML = html; }

  // Accept ?u=https://... or #u=https://...
  const qs = new URLSearchParams(location.search);
  let target = qs.get("u") || "";
  if (!target && location.hash.startsWith("#")) {
    const h = new URLSearchParams(location.hash.slice(1));
    target = h.get("u") || "";
  }
  if (!target) {
    show('Missing <code>u</code> parameter. Example: <code>?u=https://username.codeberg.page/project/</code>');
    goBtn.style.display = "none";
    return;
  }

  // Validate URL
  let url;
  try { url = new URL(target); } catch {
    show("Invalid URL.");
    goBtn.style.display = "none";
    return;
  }

  // Reduce “open-redirect” abuse: allow only Codeberg hosts
  const allowed = [
    /\.codeberg\.page$/i,
    /^codeberg\.org$/i,
    /\.codeberg\.org$/i
  ].some(rx => rx.test(url.hostname));
  if (!allowed) {
    show(`Blocked: only Codeberg targets are allowed. Got <code>${url.hostname}</code>.`);
    goBtn.style.display = "none";
    return;
  }

  // Present destination + require user action (helps with Safe Links detonations)
  const href = url.href;
  show(`Proceed to: <a rel="noreferrer" href="${href}">${href}</a>`);
  goBtn.href = href;

  // Optional auto-redirect when explicitly requested (add &go=1)
  if (qs.get("go") === "1") {
    // Short delay so scanners can fetch the HTML before we navigate
    setTimeout(() => location.replace(href), 80);
  } else {
    // Click navigates without leaving this page in history
    goBtn.addEventListener("click", (e) => {
      e.preventDefault();
      location.replace(href);
    });
  }
})();
