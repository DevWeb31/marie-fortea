declare namespace L {
  function map(element: HTMLElement): Map;
  
  interface Map {
    setView(center: [number, number], zoom: number): Map;
    remove(): void;
    invalidateSize(): void;
  }
  
  function tileLayer(url: string, options: any): TileLayer;
  
  interface TileLayer {
    addTo(map: Map): TileLayer;
  }
  
  function marker(coords: [number, number], options?: any): Marker;
  
  interface Marker {
    addTo(map: Map): Marker;
    bindPopup(content: string, options?: any): Marker;
  }
  
  function circle(coords: [number, number], options: any): Circle;
  
  interface Circle {
    addTo(map: Map): Circle;
  }
  
  interface PopupOptions {
    maxWidth?: number;
    maxHeight?: number;
    className?: string;
  }
}

declare global {
  interface Window {
    L: typeof L;
  }
}

export {};
