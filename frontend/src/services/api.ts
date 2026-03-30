import axios, { AxiosInstance } from "axios";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
      timeout: 10000,
    });

    // Interceptor para adicionar token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(email: string, password: string) {
    const res = await this.client.post("/auth/login", { email, password });
    return res.data;
  }

  async getDashboardSummary() {
    const res = await this.client.get("/dashboard/summary");
    return res.data;
  }

  async getDashboardCharts() {
    const res = await this.client.get("/dashboard/charts");
    return res.data;
  }

  async getAlerts() {
    const res = await this.client.get("/alerts");
    return res.data;
  }

  async getSystem() {
    const res = await this.client.get("/system");
    return res.data;
  }

  async getProfile() {
    const res = await this.client.get("/profile");
    return res.data;
  }

  async updateProfile(data: any) {
    const res = await this.client.put("/profile", data);
    return res.data;
  }
}

export default new ApiClient();
