import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_PATH || "http://localhost:8000",
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
let csrfInitialized = false;
async function ensureCsrf() {
  if (csrfInitialized) return;
  const url = api.defaults.baseURL.split("/api")[0] + "/sanctum/csrf-cookie";
  await api.get(url);
  csrfInitialized = true;
}

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();

  if (["post", "put", "patch", "delete"].includes(method)) {
    await ensureCsrf();
  }

  return config;
});

export default api;
