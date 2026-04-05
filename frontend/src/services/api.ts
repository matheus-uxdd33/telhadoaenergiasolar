import axios, { AxiosInstance } from "axios";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const apiBase = typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL
      : "/api";

    this.client = axios.create({
      baseURL: apiBase,
      timeout: 10000,
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async register(email: string, password: string, name?: string, phone?: string) {
    const res = await this.client.post("/auth/register", { email, password, name, phone });
    return res.data;
  }

  async login(email: string, password: string) {
    const res = await this.client.post("/auth/login", { email, password });
    return res.data;
  }

  async getMe() {
    const res = await this.client.get("/auth/me");
    return res.data;
  }

  async logout() {
    const res = await this.client.post("/auth/logout");
    return res.data;
  }

  async getPlans() {
    const res = await this.client.get("/billing/plans");
    return res.data;
  }

  async getCurrentPlan() {
    const res = await this.client.get("/billing/current");
    return res.data;
  }

  async createCheckout(planCode: string, paymentMethod: "pix" | "card") {
    const res = await this.client.post("/billing/checkout", { planCode, paymentMethod });
    return res.data;
  }

  async confirmDevelopmentPayment(paymentId: string) {
    const res = await this.client.post(`/billing/payments/${paymentId}/confirm-dev`);
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

  async getInverterBrands() {
    const res = await this.client.get("/system/brands");
    return res.data;
  }

  async testSystemConnection(data: any) {
    const res = await this.client.post("/system/test-connection", data);
    return res.data;
  }

  async updateSystemCredentials(data: any) {
    const res = await this.client.put("/system/credentials", data);
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
