import { canvas } from "../core/engine";

const body = document.getElementsByTagName("body")[0];
const loading = getLoadingScreen();
export function loadingScrenOn() {
  body!.append(loading);
}
export function canvasOn() {
  body!.removeChild(loading);
  body!.append(canvas);
}
function getLoadingScreen() {
  const loadingDiv = document.createElement("div");
  loadingDiv.innerHTML = `<div class="roundBoy"><span id="emoji">&#9786;</span>
<p>Loading...</p></div>`;
  loadingDiv.classList.add("loadingScreen");
  return loadingDiv;
}
export function showErrorScreen(error: string) {
  const errorDiv = document.createElement("div");
  errorDiv.innerHTML = `<span>${error}</span>`;
  errorDiv.classList.add("errorScreen");
  body!.removeChild(loading);
  body!.classList.add("dead");
  body!.append(errorDiv);
}
