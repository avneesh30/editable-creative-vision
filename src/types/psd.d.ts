declare module 'psd.js' {
  export default class PSD {
    constructor(buffer: Uint8Array);
    parse(): Promise<void>;
    tree(): any;
    header: {
      width: number;
      height: number;
    };
  }
} 