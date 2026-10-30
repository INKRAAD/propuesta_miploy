const botonMenu = document.querySelector(".menu-btn");
const menu = document.querySelector("#menu");

if (botonMenu && menu) {
  botonMenu.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    botonMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
}

let enlaceListo = "";

function guardarOriginal(el) {
  if (el.dataset.en != null) return;
  if (el.tagName === "IMG") el.dataset.en = el.getAttribute("alt") || "";
  else if (el.tagName === "META") el.dataset.en = el.getAttribute("content") || "";
  else el.dataset.en = el.textContent;
}

function pintarAviso() {
  const aviso = document.querySelector("#aviso-form");
  if (!aviso || aviso.hidden || !enlaceListo) return;
  const es = document.documentElement.lang === "es";
  const texto = es
    ? `El mensaje quedó armado en este navegador. No se envió a un servidor. <a href="${enlaceListo}">Abrir el correo para mandarlo a info@miploy.com</a>. Respondemos en el día hábil, de lunes a viernes, de 8:00 a. m. a 5:00 p. m.`
    : `The message is ready in this browser. It was not sent to a server. <a href="${enlaceListo}">Open email to send it to info@miploy.com</a>. We reply the same business day, Monday to Friday, 8:00 a.m. to 5:00 p.m.`;
  aviso.innerHTML = texto;
}

function aplicarIdioma(idioma) {
  const es = idioma === "es";
  document.documentElement.lang = es ? "es" : "en";
  document.querySelectorAll("[data-es]").forEach((el) => {
    guardarOriginal(el);
    const valor = es ? el.dataset.es : el.dataset.en;
    if (el.tagName === "IMG") el.alt = valor;
    else if (el.tagName === "META") el.setAttribute("content", valor);
    else el.textContent = valor;
  });
  document.querySelectorAll("[data-es-ph]").forEach((el) => {
    if (el.dataset.enPh == null) el.dataset.enPh = el.placeholder || "";
    el.placeholder = es ? el.dataset.esPh : el.dataset.enPh;
  });
  document.querySelectorAll("[data-es-aria]").forEach((el) => {
    if (el.dataset.enAria == null) el.dataset.enAria = el.getAttribute("aria-label") || "";
    el.setAttribute("aria-label", es ? el.dataset.esAria : el.dataset.enAria);
  });
  document.querySelectorAll("[data-lang]").forEach((boton) => {
    boton.setAttribute("aria-pressed", boton.dataset.lang === (es ? "es" : "en") ? "true" : "false");
  });
  try {
    localStorage.setItem("miploy-lang", es ? "es" : "en");
  } catch (error) {
    /* el navegador puede bloquear el almacenamiento; el idioma igual cambia en esta página */
  }
  pintarAviso();
}

document.querySelectorAll("[data-lang]").forEach((boton) => {
  boton.addEventListener("click", () => aplicarIdioma(boton.dataset.lang));
});

let idiomaInicial = "en";
try {
  if (localStorage.getItem("miploy-lang") === "es") idiomaInicial = "es";
} catch (error) {
  idiomaInicial = "en";
}
aplicarIdioma(idiomaInicial);

const formulario = document.querySelector("#contacto-form");

if (formulario) {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datos = new FormData(formulario);
    const es = document.documentElement.lang === "es";
    const rol = formulario.rol.selectedOptions[0].textContent;
    const cuerpo = es
      ? [`Nombre: ${datos.get("nombre")}`, `Teléfono: ${datos.get("telefono")}`, `Soy: ${rol}`, `Ciudad: ${datos.get("ciudad")}`, `Oficio o puesto: ${datos.get("oficio")}`, "", datos.get("mensaje")].join("\n")
      : [`Name: ${datos.get("nombre")}`, `Phone: ${datos.get("telefono")}`, `I am: ${rol}`, `City: ${datos.get("ciudad")}`, `Trade or role: ${datos.get("oficio")}`, "", datos.get("mensaje")].join("\n");
    const asunto = es ? "Mensaje desde la web de MiPloy" : "Message from the MiPloy site";
    enlaceListo = `mailto:info@miploy.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    const aviso = document.querySelector("#aviso-form");
    aviso.hidden = false;
    pintarAviso();
    formulario.reset();
  });
}
