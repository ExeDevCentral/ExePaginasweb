process.env.NEXT_PUBLIC_SUPABASE_URL ??= 'https://test.supabase.invalid'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= 'sb_publishable_test_only'

if (typeof globalThis.WebSocket === 'undefined') {
  // @ts-expect-error WebSocket mock for test environment under Node.js < 22
  globalThis.WebSocket = class DummyWebSocket {
    static readonly CONNECTING = 0
    static readonly OPEN = 1
    static readonly CLOSING = 2
    static readonly CLOSED = 3
    readonly readyState = 1
    addEventListener() {}
    removeEventListener() {}
    send() {}
    close() {}
  }
}
