// Everything the host injects into <next-app>. This is the whole public contract.

export interface HostResponse<T> {
  status: number;
  data: T;
}

export interface HostBridge {
  // Authenticated fetch owned by the host (auth headers, base URL, error logging).
  fetch: <T = unknown>(method: string, url: string, body?: unknown) => Promise<HostResponse<T>>;
}

export interface HostCallbacks {
  // Host router navigation, so the new app never owns routing.
  navigate: (page: string) => void;
}

export interface HostContextValue {
  bridge: HostBridge;
  callbacks: HostCallbacks;
}
