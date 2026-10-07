import React from 'react';
import { Users, IndianRupee, Clock, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ExplainButton } from './ExplainButton';
import { formatCurrencyINR } from '../../utils/formatters.js';

export const TeamBreakdown = ({ resources = [], totalHeadcount = 0, totalHours = 0, onOpenExplain }) => {
  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Recommended Team Composition & Resource Headcount
            </h3>
            <ExplainButton onClick={() => onOpenExplain('team')} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sized using discipline workload limits, parallel work capacity, and communication boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="brand" size="md">
            {totalHeadcount} Specialists Required
          </Badge>
        </div>
      </div>

      {/* Assumptions Callout: Productive Hours vs Team Efficiency (Section 22) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Gross Working Day</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">8.0 Hours / Day</span>
          <span className="text-[10px] text-slate-400 block">Contracted business hours</span>
        </div>

        <div>
          <span className="text-[10px] text-brand-600 dark:text-brand-400 uppercase font-bold block">Productive Capacity</span>
          <span className="font-bold text-brand-700 dark:text-brand-300">6.0 Hours / Day</span>
          <span className="text-[10px] text-slate-400 block">Excludes administrative overhead</span>
        </div>

        <div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold block">Team Efficiency</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-300">75% Parallel Factor</span>
          <span className="text-[10px] text-slate-400 block">Sync meetings & code reviews</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Engineering Discipline</th>
              <th className="py-3 px-3">Headcount (FTE)</th>
              <th className="py-3 px-3">Hourly Rate</th>
              <th className="py-3 px-3">Allocated Work</th>
              <th className="py-3 px-3">Discipline Cost</th>
              <th className="py-3 px-3">Staffing Justification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {resources.map((r) => (
              <tr key={r.roleId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-3">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {r.role}
                  </span>
                </td>

                <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {r.quantity} {r.quantity === 1 ? 'specialist' : 'specialists'}
                  </span>
                </td>

                <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                  ₹{r.hourlyRate}/hr
                </td>

                <td className="py-3.5 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {r.allocatedHours || r.hours} hrs
                </td>

                <td className="py-3.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {r.formattedCost || formatCurrencyINR(r.totalCost)}
                </td>

                <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 leading-snug max-w-xs">
                  {r.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
