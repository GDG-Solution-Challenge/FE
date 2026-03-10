const TOKEN_KEY = 'accessToken';
const USER_ID_KEY = 'userId';

const decodeJwt = (token: string): Record<string, unknown> => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
};

export const authStore = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    const payload = decodeJwt(token);
    const userId = payload['sub'];
    if (userId) {
      localStorage.setItem(USER_ID_KEY, String(userId));
    }
  },

  getUserId: (): number | null => {
    const val = localStorage.getItem(USER_ID_KEY);
    return val ? Number(val) : null;
  },

  setUserId: (id: number) => {
    localStorage.setItem(USER_ID_KEY, String(id));
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },
};
