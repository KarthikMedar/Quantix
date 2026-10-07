import React from 'react';
import { Users, IndianRupee, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatCurrencyINR } from '../../utils/formatters';

export const ResourceTable = ({ resources = [], totalHeadcount = 0, totalHours = 0 }) => {
  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-500" />
            Recommended Team Composition & Resource Allocation
          </h3>
          <p className="text-xs text-slate-400">
            Tailored engineering roles, headcount quantities, standard hourly rates (INR), and staffing justifications.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="brand" size="md">
            {totalHeadcount} Specialists Recommended
          </Badge>
        </div>
      </div>

      {/* Visual Role Allocation Distribution Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold">Workload Distribution by Role</span>
          <span className="font-mono">{resources.reduce((sum, r) => sum + r.allocatedHours, 0)} Total Allocated Hours</span>
        </div>

        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5 p-0.5">
          {resources.map((r, i) => {
            const colors = [
              'bg-blue-500',
              'bg-indigo-500',
              'bg-violet-500',
              'bg-emerald-500',
              'bg-amber-500',
              'bg-cyan-500',
              'bg-rose-500',
              'bg-teal-500',
            ];
            const color = colors[i % colors.length];
            const pct = Math.round((r.allocatedHours / (totalHours || 1)) * 100);
            return (
              <div
                key={r.roleId}
                style={{ width: `${Math.max(2, pct)}%` }}
                className={`h-full rounded-full ${color}`}
                title={`${r.role}: ${r.allocatedHours} hrs (${pct}%)`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
          {resources.map((r, i) => {
            const colors = [
              'bg-blue-500',
              'bg-indigo-500',
              'bg-violet-500',
              'bg-emerald-500',
              'bg-amber-500',
              'bg-cyan-500',
              'bg-rose-500',
              'bg-teal-500',
            ];
            const color = colors[i % colors.length];
            return (
              <div key={r.roleId} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span>{r.role} ({r.quantity}x)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left text-xs min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3">Quantity</th>
              <th className="py-3 px-3">Hourly Rate</th>
              <th className="py-3 px-3">Allocated Hours</th>
              <th className="py-3 px-3">Total Cost</th>
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
                    {r.quantity} {r.quantity === 1 ? 'person' : 'people'}
                  </span>
                </td>

                <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                  ₹{r.hourlyRate}/hr
                </td>

                <td className="py-3.5 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {r.allocatedHours} hrs
                </td>

                <td className="py-3.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrencyINR(r.totalCost)}
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
