import React from "react";
import { connect, ReactReduxContext } from "react-redux";

import { fetchExperiments } from "./reducers/experiments";

import { NextAppBridge } from "./components/NextAppBridge";

class App extends React.Component {
  state = { page: "experiments" };

  componentDidMount() {
    this.props.fetchExperiments();
  }

  navigate = (page) => this.setState({ page });

  renderExperiments() {
    const { experiments } = this.props;

    if (experiments.loading) {
      return <p>Loading experiments...</p>;
    }

    return (
      <table className="legacy-table">
        <thead>
          <tr>
            <th>Experiment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {experiments.items.map((experiment) => (
            <tr key={experiment.id}>
              <td>{experiment.name}</td>
              <td>{experiment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    const { page } = this.state;
    const { activeGroupCount } = this.props;

    return (
      <div className="legacy-shell">
        <header className="legacy-header">
          <strong>Experiments Console</strong>
          <span className="tag">host: React {React.version}</span>
          <span className="store-readout">
            Active groups in shared store: <b data-testid="active-groups">{activeGroupCount}</b>
          </span>
        </header>

        <div className="legacy-body">
          <nav className="legacy-nav">
            <button className={page === "experiments" ? "active" : ""} onClick={() => this.navigate("experiments")}>
              Experiments <small>(legacy)</small>
            </button>
            <button className={page === "groups" ? "active" : ""} onClick={() => this.navigate("groups")}>
              Groups <small>(migrated)</small>
            </button>
          </nav>

          <main className="legacy-main">
            {page === "experiments" && (
              <section>
                <h2>Experiments</h2>
                <p className="hint">Rendered by the legacy React 16 app.</p>
                {this.renderExperiments()}
              </section>
            )}

            {page === "groups" && (
              <ReactReduxContext.Consumer>
                {({ store }) => (
                  <NextAppBridge view="Groups" store={store} callbacks={{ navigate: this.navigate }} />
                )}
              </ReactReduxContext.Consumer>
            )}
          </main>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  experiments: state.experiments,
  activeGroupCount: state.groups.items.filter((group) => group.status === "active").length,
});

export default connect(mapStateToProps, { fetchExperiments })(App);
