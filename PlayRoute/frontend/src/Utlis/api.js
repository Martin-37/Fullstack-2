/** API única: Vite redirige /api hacia el Gateway (puerto 8080). */
const BASE = "/api";
let renovacion = null;

async function renovar() {
  if (!renovacion) {
    renovacion = fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "X-Requested-With": "PlayRoute" },
    }).then(async (response) => {
      if (!response.ok) throw new Error("La sesión expiró. Vuelve a iniciar sesión.");
      const datos = await response.json();
      sessionStorage.setItem("playrouteToken", datos.accessToken);
      return datos.accessToken;
    }).finally(() => { renovacion = null; });
  }
  return renovacion;
}

export async function api(ruta, { method = "GET", body, auth = false } = {}) {
  const enviar = async (token) => fetch(`${BASE}${ruta}`, {
    method,
    credentials: "include",
    headers: {
      "X-Requested-With": "PlayRoute",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  let token = auth ? sessionStorage.getItem("playrouteToken") : null;
  let response = await enviar(token);
  if (response.status === 401 && auth) {
    try {
      token = await renovar();
      response = await enviar(token);
    } catch {
      sessionStorage.removeItem("playrouteToken");
      localStorage.removeItem("sesionActiva");
      localStorage.removeItem("rol");
      localStorage.removeItem("usuario");
      localStorage.removeItem("usuarioId");
      window.dispatchEvent(new Event("playroute-sesion"));
      throw new Error("La sesión expiró. Vuelve a iniciar sesión.");
    }
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error HTTP ${response.status}`);
  }
  if (response.status === 204 || response.status === 201 && response.headers.get("Content-Length") === "0") return null;
  const texto = await response.text();
  return texto ? JSON.parse(texto) : null;
}
