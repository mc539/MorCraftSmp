const SERVER_IP = "MorCraftSmp.aternos.me";
const toast = document.getElementById("toast");
let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
async function copyIp() {
  try {
    await navigator.clipboard.writeText(SERVER_IP);
    notify("Sunucu IP adresi kopyalandı!");
  } catch {
    const input = document.createElement("textarea");
    input.value = SERVER_IP;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    notify("Sunucu IP adresi kopyalandı!");
  }
}
document.getElementById("copyIp").addEventListener("click", copyIp);
document.getElementById("copyIpBottom").addEventListener("click", copyIp);
document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

const dialog = document.getElementById("rankDialog");
const STORE_API = "https://morcraftsmp-ai.onrender.com";
let selectedProduct = "";
let storeSession = "";
let pollTimer = null;
const productIds = { "VIP": "vip", "VIP+": "vip-plus", "MVP": "mvp" };
const linkHelp = document.getElementById("linkHelp");
const linkCode = document.getElementById("linkCode");
const purchaseButton = document.getElementById("purchaseRank");
document.querySelectorAll("[data-rank]").forEach(button => {
  button.addEventListener("click", () => {
    selectedProduct = productIds[button.dataset.rank];
    storeSession = "";
    purchaseButton.disabled = true;
    linkCode.hidden = true;
    linkHelp.textContent = "Kodu oluştur, sonra sunucu sohbetine !site KOD yaz.";
    document.getElementById("dialogTitle").textContent = button.dataset.rank;
    document.getElementById("dialogPrice").textContent = button.dataset.price + " COIN";
    dialog.showModal();
  });
});
document.getElementById("linkStart").addEventListener("click", async () => {
  const username = document.getElementById("mcUsername").value.trim();
  if (!/^[a-zA-Z0-9_]{1,16}$/.test(username)) {
    linkHelp.textContent = "Geçerli bir Minecraft kullanıcı adı yaz.";
    return;
  }
  const startButton = document.getElementById("linkStart");
  startButton.disabled = true;
  linkHelp.textContent = "Kod hazırlanıyor...";
  try {
    const response = await fetch(STORE_API + "/api/store/link/start", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Kod oluşturulamadı.");
    linkCode.hidden = false;
    linkCode.textContent = data.code;
    linkHelp.textContent = "Şimdi Minecraft sunucusunda sohbete !site " + data.code + " yaz. Kod 5 dakika geçerli.";
    const code = data.code;
    const deadline = Date.now() + 300000;
    if (pollTimer) clearTimeout(pollTimer);
    const poll = async () => {
      if (!dialog.open || Date.now() > deadline) return;
      try {
        const check = await fetch(STORE_API + "/api/store/link/status?code=" + encodeURIComponent(code));
        const state = await check.json();
        if (state.verified) {
          storeSession = state.sessionToken;
          purchaseButton.disabled = false;
          linkHelp.textContent = username + " hesabı doğrulandı. Artık satın alabilirsin.";
          return;
        }
      } catch {}
      pollTimer = setTimeout(poll, 2500);
    };
    poll();
  } catch (error) {
    linkHelp.textContent = error.message;
  } finally {
    startButton.disabled = false;
  }
});
purchaseButton.addEventListener("click", async () => {
  if (!storeSession || !selectedProduct) return;
  purchaseButton.disabled = true;
  linkHelp.textContent = "Satın alma işleniyor...";
  try {
    const response = await fetch(STORE_API + "/api/store/purchase", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({sessionToken: storeSession, product: selectedProduct})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Satın alma başarısız.");
    linkHelp.textContent = data.message || "Satın alma tamamlandı!";
    notify("Rütbe satın alma işlemi tamamlandı.");
  } catch (error) {
    linkHelp.textContent = error.message;
    purchaseButton.disabled = false;
  }
});
document.getElementById("dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => { if (pollTimer) clearTimeout(pollTimer); });
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});