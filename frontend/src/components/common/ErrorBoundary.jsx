import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#09090b",
                    color: "white",
                    fontFamily: "system-ui, sans-serif",
                    gap: "20px"
                }}>
                    <h2 style={{ fontSize: "24px", color: "#ef4444" }}>Something went wrong</h2>
                    <p style={{ color: "#a1a1aa" }}>The player encountered an unexpected error.</p>
                    <button
                        onClick={this.handleReload}
                        style={{
                            padding: "10px 20px",
                            background: "#8b5cf6",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600"
                        }}
                    >
                        Reload Application
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <pre style={{
                            padding: "20px",
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: "8px",
                            maxWidth: "800px",
                            overflow: "auto",
                            color: "#f87171",
                            marginTop: "20px"
                        }}>
                            {this.state.error?.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
