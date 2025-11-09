(function () {
  const params = new URLSearchParams(location.search);
  let target = params.get("u") || "";

  // Also allow hash form: #u=https://…
  if (!target && location.hash.startsWith("#")) {
    const h = new URLSearchParams(location.hash.slice(1));
    target = h.get("u") || "";
  }

  const msg = document.getElementById("msg");
  const link = document.getElementById("link");
  const linkwrap = document.getElementById("linkwrap");

  function show(text) { msg.textContent = text; }

  if (!target) {
    show("Missing ");
    const code = document.createElement("code");
    code.textContent = "u";
    msg.append("Missing ", code, " parameter. Example: ");
    const ex = document.createElement("code");
    ex.textContent = "?u=https://username.codeberg.page/project/";
    msg.appendChild(ex);
    return;
  }

  // Validate URL and restrict to https? and Codeberg hosts (avoid open-redirect abuse)
  let url;
  try { url = new URL(target); } catch { show("Invalid URL."); return; }
  if (!/^https?:$/.test(url.protocol)) { show("Only http/https allowed."); return; }

  const allowedHosts = [
    /\.codeberg\.page$/i,
    /^codeberg\.org$/i,
    /\.codeberg\.org$/i
  ];
  const ok = allowedHosts.some(rx => rx.test(url.hostname));
  if (!ok) { show(`Blocked host: ${url.hostname}`); return; }

  // Expose a clickable link (good for Safe Links scanners and manual click)
  link.href = url.href;
  link.textContent = url.href;
  linkwrap.hidden = false;

  // Small delay to let scanners fetch the HTML before we navigate
  setTimeout(() => { location.replace(url.href); }, 400);
})();
