import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('TeleVideo Pro App caught error:', error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.removeItem('televideo_pro_videos');
      localStorage.removeItem('televideo_pro_settings');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-3xl mb-4 shadow-xl">
            ⚡
          </div>
          <h1 className="text-xl font-bold mb-2">TeleVideo Pro</h1>
          <p className="text-xs text-slate-400 mb-5 max-w-xs">
            অ্যাপ লোড হতে সামান্য সমস্যা হয়েছে। নিচের বাটনে চাপ দিয়ে ফ্রেশ রিলোড করুন।
          </p>
          <button
            onClick={this.handleReload}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-semibold text-sm shadow-lg active:scale-95 transition-all"
          >
            🔄 ফ্রেশ রিলোড করুন (Reload)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  );
}
