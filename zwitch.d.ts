// zwitch.d.ts
export {};

declare global {
  interface Window {
    Layer: {
      checkout: (
        config: {
          token: string;
          accesskey: string;
          theme?: {
            logo?: string;
            color?: string;
            error_color?: string;
          };
        },
        successCallback: (response: any) => void,
        errorCallback: (error: any) => void
      ) => void;
    };
  }
}