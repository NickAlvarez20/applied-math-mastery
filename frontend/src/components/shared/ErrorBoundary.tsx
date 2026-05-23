import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--color-danger)",
          }}
        >
          <h2>Something went wrong</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            {this.state.message}
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
            onClick={() => this.setState({ hasError: false, message: "" })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
