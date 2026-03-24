declare module "*.css";
declare module "*.scss";
declare module "*.sass";

export {};
declare global {
  interface Window {
    google: typeof google;
  }
}