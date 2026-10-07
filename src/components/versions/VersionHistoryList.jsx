import React, { useState } from 'react';
import { History, GitCompare, Bookmark, ArrowRight, Layers, AlertCircle } from 'lucide-react';
import { VersionCard } from './VersionCard';
import { Button } from '../common/Button';

export const VersionHistoryList = ({
  versions = [],
  currentVersionNumber = 1,
  onViewSnapshot,
  onUseAsStartingPoint,
  onLaunchCompare,
}) => {
  const [selectedVersions, setSelectedVersions] = useState([]);

  const handleToggleCompare = (version) => {
    setSelectedVersions((prev) => {
      const exists = prev.some((v) => v.id === version.id);
      if (exists) {
        return prev.filter((v) => v.id !== version.id);
      }
      if (prev.length >= 2) {
        // Keep the latest selected one and add the new one
        return [prev[1], version];
      }
      return [...prev, version];
    });
  };

  const handleCompareTrigger = () => {
    if (selectedVersions.length === 2 && onLaunchCompare) {
      // Sort so earlier version is A, later is B
      const sorted = [...selectedVersions].sort((a, b) => a.versionNumber - b.versionNumber);
      onLaunchCompare(sorted[0], sorted[1]);
    }
  };

  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-slate-50 dark:bg-navy-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-navy-700">
        <Bookmark className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
          No saved estimate versions yet
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Calculate and save your project estimate from the Results Dashboard to create Version 1.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compare Floating / Top Bar if versions are selected */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-navy-900/70 rounded-2xl border border-slate-200 dark:border-navy-700">
        <div className="flex items-center gap-2.5">
          <History className="w-4 h-4 text-brand-500" />
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
            {versions.length} Immutable {versions.length === 1 ? 'Snapshot' : 'Snapshots'} Recorded
          </span>
          <span className="text-xs text-slate-400">
            (Select 2 versions to compare)
          </span>
        </div>

        {selectedVersions.length === 2 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Comparing <strong className="text-brand-600">v{selectedVersions[0].versionNumber}</strong> vs{' '}
              <strong className="text-brand-600">v{selectedVersions[1].versionNumber}</strong>
            </span>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleCompareTrigger}
              className="text-xs shadow-md"
            >
              <GitCompare className="w-3.5 h-3.5 mr-1" />
              Compare Now
            </Button>
          </div>
        )}
      </div>

      {/* List of Version Cards */}
      <div className="space-y-3">
        {versions.map((ver, idx) => {
          const isLatest = ver.versionNumber === currentVersionNumber || idx === 0;
          const isSelected = selectedVersions.some((sv) => sv.id === ver.id);

          return (
            <VersionCard
              key={ver.id}
              version={ver}
              isLatest={isLatest}
              isSelectedForCompare={isSelected}
              onToggleCompare={handleToggleCompare}
              onViewSnapshot={onViewSnapshot}
              onUseAsStartingPoint={onUseAsStartingPoint}
            />
          );
        })}
      </div>
    </div>
  );
};
