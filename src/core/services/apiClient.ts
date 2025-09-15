import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  private handleUnauthorized() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<{ data: T }> {
    const response = await this.instance.get(url, config);
    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: T }> {
    const response = await this.instance.post(url, data, config);
    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: T }> {
    const response = await this.instance.put(url, data, config);
    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: T }> {
    const response = await this.instance.patch(url, data, config);
    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<{ data: T }> {
    const response = await this.instance.delete(url, config);
    return response;
  }
}

export const apiClient = new ApiClient();