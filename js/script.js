/* CONTADOR */
const dataCasamento = new Date("2027-05-29T10:00:00").getTime();

setInterval(() => {
  const agora = new Date().getTime();
  const distancia = dataCasamento - agora;

  const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

  const contador = document.getElementById("contador");
  if (contador) {
    contador.innerHTML = `
      <div><span>${dias}</span>dias</div>
      <div><span>${horas}</span>horas</div>
      <div><span>${minutos}</span>min</div>
      <div><span>${segundos}</span>seg</div>
    `;
  }
}, 1000);

/* MODAL */
function abrirModal() {
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

/* COPIAR PIX */
function copiarPix() {
  const chavePix = "01443937606";
  navigator.clipboard.writeText(chavePix);
}