/// <reference types="react" />
import { OnShouldStartLoadWithRequest } from './WebViewTypes';
declare const defaultOriginWhitelist: string[];
declare const createOnShouldStartLoadWithRequest: (loadRequest: (shouldStart: boolean, url: string, lockIdentifier: number) => void, originWhitelist: ReadonlyArray<string>, onShouldStartLoadWithRequest?: OnShouldStartLoadWithRequest | undefined) => ({ nativeEvent }: import("react-native").NativeSyntheticEvent<import("./WebViewTypes").WebViewNavigation>) => void;
declare const getViewManagerConfig: (viewManagerName: "RNCUIWebView" | "RNCWKWebView" | "RNCWebView") => {
    Commands: import("./WebViewTypes").WebViewCommands;
};
declare const defaultRenderLoading: () => JSX.Element;
declare const defaultRenderError: (errorDomain: string | undefined, errorCode: number, errorDesc: string) => JSX.Element;
export { defaultOriginWhitelist, createOnShouldStartLoadWithRequest, getViewManagerConfig, defaultRenderLoading, defaultRenderError, };
//# sourceMappingURL=WebViewShared.d.ts.map