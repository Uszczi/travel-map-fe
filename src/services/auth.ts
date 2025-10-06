import { postForm, postJson } from '@/src/services/common';

import { tokenStore } from '../store/tokenStore';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export default class AuthService {
  private readonly base_url: string;

  constructor(base_url: string = process.env.NEXT_PUBLIC_API_URL ?? '') {
    this.base_url = base_url;
  }

  async login(params: { username: string; password: string }) {
    const res = await postForm<AuthResponse>(`${this.base_url}/login`, params);
    tokenStore.set(res.access_token);
  }

  async logout() {
    await postJson(`${this.base_url}/logout`, {});
    tokenStore.clear();
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
