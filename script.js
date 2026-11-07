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
document.querySelectorAll("[data-rank]").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("dialogTitle").textContent = button.dataset.rank;
    document.getElementById("dialogPrice").textContent = button.dataset.price + " COIN";
    dialog.showModal();
  });
});
document.getElementById("dialogClose").addEventListener("click", () => dialog.close());
document.getElementById("dialogOk").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});