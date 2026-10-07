import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <Card className="max-w-md w-full p-8 sm:p-10 bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center border border-rose-200/50 dark:border-rose-900/50">
          <Search className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
            404
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The page you requested could not be located in the EstimateAI directory.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/" variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Go to Home
          </Button>
          <Button to="/dashboard" variant="outline" size="md">
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};
