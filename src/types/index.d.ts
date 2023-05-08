export {};

declare global {
  interface Window {
    spotifyCallback: () => void;
  }
}
