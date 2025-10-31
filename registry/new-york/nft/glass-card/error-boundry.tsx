"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  className?: string;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center p-6 bg-destructive/10 border border-destructive/20 rounded-lg",
            this.props.className,
          )}
        >
          <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            {this.state.error?.message ||
              "An unexpected error occurred while loading this component."}
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error("Error caught by useErrorHandler:", error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError, error };
};

// API Error Boundary specifically for API-related errors
interface APIErrorBoundaryProps {
  children: ReactNode;
  onRetry?: () => void;
  className?: string;
}

export const APIErrorBoundary: React.FC<APIErrorBoundaryProps> = ({
  children,
  onRetry,
  className,
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log API errors for monitoring
    console.error("API Error:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  };

  const fallback = (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4 bg-muted/50 border border-border rounded-lg",
        className,
      )}
    >
      <AlertTriangle className="h-6 w-6 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground text-center mb-3">
        Failed to load data. Please check your connection and try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </button>
      )}
    </div>
  );

  return (
    <ErrorBoundary
      fallback={fallback}
      onError={handleError}
      className={className}
    >
      {children}
    </ErrorBoundary>
  );
};