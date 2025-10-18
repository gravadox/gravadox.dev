import { Scene, Camera, WebGLRenderer } from 'three';

export {}; // makes this file a module

declare global {
  interface Window {
    APP?: {
      scene?: Scene;
      camera?: Camera;
      renderer?: WebGLRenderer;
    };
  }
}
