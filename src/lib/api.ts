export function getApiUrl(path: string): string {
  if (typeof window !== 'undefined') {
    const isCapacitor = window.location.protocol.startsWith('capacitor') || 
                        window.location.protocol.startsWith('file') || 
                        (window.location.hostname === 'localhost' && window.location.port !== '3000' && window.location.port !== '3001');
    if (isCapacitor) {
      return `https://fsin-calculator.ru${path}`;
    }
  }
  return path;
}
