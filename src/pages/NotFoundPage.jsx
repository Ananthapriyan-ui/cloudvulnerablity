import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Terminal } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center justify-center p-6 cyber-bg-grid relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center max-w-md">
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.3)] text-rose-400">
          <ShieldAlert className="w-14 h-14 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black font-mono tracking-wider text-rose-400">
            404: ACCESS_DENIED
          </span>
          <h1 className="text-xl font-bold text-slate-100">
            Target Asset Not Found
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            The requested target URL or resource endpoint does not exist in the security registry.
          </p>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-400 w-full">
          $ err_code: TARGET_404_NOT_FOUND
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            icon={Home}
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
