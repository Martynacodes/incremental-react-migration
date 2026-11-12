import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import type { Root } from "react-dom/client";
import type { Store } from "@reduxjs/toolkit";

import { HostContext } from "./host/context";
import { views } from "./views";

import type { HostBridge, HostCallbacks } from "./host/types";

import css from "./styles.css?inline";

// <next-app view="Groups"> with .store, .bridge and .callbacks set as properties.
class NextAppElement extends HTMLElement {
  static observedAttributes = ["view"];

  private root: Root | null = null;
  private readonly mountPoint: HTMLDivElement;
  private storeValue?: Store;
  private bridgeValue?: HostBridge;
  private callbacksValue?: HostCallbacks;

  constructor() {
    super();
    // Shadow DOM: the host's global CSS can't reach in, ours can't leak out.
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");

    style.textContent = css;
    this.mountPoint = document.createElement("div");
    shadow.append(style, this.mountPoint);
  }

  set store(value: Store) {
    this.storeValue = value;
    this.renderView();
  }

  set bridge(value: HostBridge) {
    this.bridgeValue = value;
    this.renderView();
  }

  set callbacks(value: HostCallbacks) {
    this.callbacksValue = value;
    this.renderView();
  }

  connectedCallback() {
    // If the host set properties before this element was defined, they live
    // on the instance and shadow our setters. Re-apply them through the setters.
    (["store", "bridge", "callbacks"] as const).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        const value = (this as Record<string, unknown>)[key];

        delete (this as Record<string, unknown>)[key];
        (this as Record<string, unknown>)[key] = value;
      }
    });

    this.root ??= createRoot(this.mountPoint);
    this.renderView();
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }

  attributeChangedCallback() {
    this.renderView();
  }

  private renderView() {
    if (!this.root || !this.storeValue || !this.bridgeValue || !this.callbacksValue) {
      return;
    }

    const viewName = this.getAttribute("view") ?? "";
    const View = views[viewName];

    this.root.render(
      <Provider store={this.storeValue}>
        <HostContext.Provider value={{ bridge: this.bridgeValue, callbacks: this.callbacksValue }}>
          {View ? <View /> : <p>Unknown view: {viewName}</p>}
        </HostContext.Provider>
      </Provider>
    );
  }
}

if (!customElements.get("next-app")) {
  customElements.define("next-app", NextAppElement);
}
