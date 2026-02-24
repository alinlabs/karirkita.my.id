import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h1>
            <p className="text-slate-500 mb-6">
              Maaf, aplikasi mengalami kendala teknis. Tim kami telah dinotifikasi.
              Silakan coba muat ulang halaman.
            </p>
            <div className="bg-slate-100 p-4 rounded-xl text-left mb-6 overflow-auto max-h-40">
                <code className="text-xs text-slate-600 font-mono">
                    {this.state.error?.message}
                </code>
            </div>
            <Button 
                onClick={() => window.location.reload()} 
                className="w-full justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Muat Ulang Aplikasi
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
