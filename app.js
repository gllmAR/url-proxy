(function () {
  const params = new URLSearchParams(location.search);
  let target = params.get("u") || "";

  // Also support #u=… (so you can use a fragment instead of ?u= which looks less like a redirector)
  if (!target && location.hash.startsWith("#")) {
    const h = new URLSearchParams(location.hash.slice(1));
    target = h.get("u") || "";
  }

  const destEl = document.getElementById("dest");
  const btn = document.getElementById("go");

  if (!target) {
    destEl.textContent = "Missing u parameter.";
    return;
  }

  let url;
  try {
    url = new URL(target);
  } catch {
    destEl.textContent = "Invalid URL.";
    return;
  }

  // OPTIONAL: restrict to Codeberg to avoid abuse (keep if you only need Codeberg)
  const allowedHosts = [/\.codeberg\.page$/i, /^codeberg\.org$/i, /\.codeberg\.org$/i];
  const ok = allowedHosts.some(rx => rx.test(url.hostname));
  if (!ok) {
    destEl.innerHTML = `Blocked: only Codeberg targets are allowed. Got <code>${url.hostname}</code>.`;
    return;
  }

  // Show as plain text + make a button the user must click.
  destEl.textContent = url.href;

  btn.disabled = false;
  btn.addEventListener("click", () => {
    // Use noopener for safety
    window.open(url.href, "_blank", "noopener,noreferrer");
  });
})();
