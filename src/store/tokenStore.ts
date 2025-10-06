let accessToken: string | null = null;
export const tokenStore = {
  get: () => accessToken,
  set: (t: string | null) => (accessToken = t),
  clear: () => (accessToken = null),
};
