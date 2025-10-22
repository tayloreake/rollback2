import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Something went wrong with the quote form
              </h3>
            </div>
          </div>
          
          <div className="text-sm text-red-700 mb-4">
            We're sorry, but the quote form encountered an error. Please try one of these options:
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try Again
            </button>
            <a
              href="/Quote"
              className="px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-md border border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Go to Quote Page
            </a>
            <a
              href="tel:+254721410517"
              className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Call +254 721 410 517
            </a>
          </div>

          {/* Development error details - only show in non-production */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-3 bg-gray-100 rounded text-xs">
              <summary className="cursor-pointer font-medium text-gray-700">
                Error Details (Development Only)
              </summary>
              <div className="mt-2 text-gray-600">
                <div className="font-medium">Error:</div>
                <pre className="whitespace-pre-wrap mb-2">{this.state.error && this.state.error.toString()}</pre>
                <div className="font-medium">Stack Trace:</div>
                <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;