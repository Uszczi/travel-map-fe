import { postForm, postJson } from '@/src/services/common';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export default class AuthService {
  private readonly base_url: string;

  constructor(base_url: string = process.env.NEXT_PUBLIC_API_URL ?? '') {
    this.base_url = base_url;
  }

  async login(params: { username: string; password: string }): Promise<AuthResponse> {
    return await postForm<AuthResponse>(`${this.base_url}/login`, params);
  }

  async logout() {
    return await postJson(`${this.base_url}/logout`, {});
  }

  async refresh() {}

  async passwordReset(params: { email: string }) {
    return await postJson(`${this.base_url}/password-reset`, params);
  }

  async passwordResetConfirm(params: { token: string; password: string }) {
    return await postJson(`${this.base_url}/password-reset/confirm`, params);
  }
  async register(params: { email: string; password: string }) {
    return await postJson(`${this.base_url}/register`, params);
  }
}

export const authService = new AuthService();
