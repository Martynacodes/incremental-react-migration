import React from "react";

import { fakeApi } from "../fakeApi";

// Renders the <next-app> custom element and injects what it needs.
//
// Why a ref instead of JSX props: React 16 passes everything on a custom
// element as a string *attribute*, so an object like the Redux store
// would arrive as "[object Object]". We set DOM *properties* directly.
// (React 19 handles this natively, but the host is React 16.)
export class NextAppBridge extends React.Component {
  elementRef = React.createRef();

  componentDidMount() {
    this.syncProperties();
  }

  componentDidUpdate() {
    this.syncProperties();
  }

  syncProperties() {
    const element = this.elementRef.current;

    if (!element) {
      return;
    }

    element.store = this.props.store;
    element.bridge = { fetch: fakeApi };
    element.callbacks = this.props.callbacks;
  }

  render() {
    // Plain string values can still go through as attributes.
    return <next-app ref={this.elementRef} view={this.props.view} />;
  }
}
