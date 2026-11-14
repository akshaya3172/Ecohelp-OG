import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const isError = toastMessage.toLowerCase().includes('fail') || 
                  toastMessage.toLowerCase().includes('error') || 
                  toastMessage.toLowerCase().includes('violation') ||
                  toastMessage.toLowerCase().includes('expired');

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-elevated border transition-all ${
        isError 
          ? 'bg-rose-50 border-rose-200 text-rose-900' 
          : 'bg-deepTeal text-warmSand border-softTurquoise/30'
      }`}>
        {isError ? (
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-softTurquoise shrink-0" />
        )}
        <p className="text-sm font-medium leading-relaxed">{toastMessage}</p>
      </div>
    </div>
  );
};
