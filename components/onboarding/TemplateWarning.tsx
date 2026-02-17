'use client';

import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { CombinationScore } from '@/lib/templates/template-validation';
import type { TemplateStyle } from '@/lib/templates';

interface TemplateWarningProps {
  validation: CombinationScore;
  onChangeTemplate?: (template: TemplateStyle) => void;
  onContinueAnyway?: () => void;
}

/**
 * Warning component for suboptimal template choices
 * Shows different severity levels based on combination score
 */
export function TemplateWarning({
  validation,
  onChangeTemplate,
  onContinueAnyway
}: TemplateWarningProps) {
  // Don't show anything for perfect combinations
  if (validation.quality === 'perfect' || (!validation.shouldBlock && !validation.shouldWarn)) {
    return null;
  }

  // Blocked combination (score <= 4)
  if (validation.shouldBlock) {
    return (
      <div className="bg-red-900/20 border-2 border-red-500 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-300 mb-2">
              This combination is not recommended
            </h3>
            <p className="text-red-200 mb-4">{validation.message}</p>
            {validation.recommendation && onChangeTemplate && (
              <button
                onClick={() => onChangeTemplate(validation.recommendation!)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Switch to {validation.recommendation.charAt(0).toUpperCase() + validation.recommendation.slice(1)} Template
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Warned combination (score = 5)
  if (validation.shouldWarn && validation.quality === 'mediocre') {
    return (
      <div className="bg-yellow-900/20 border-2 border-yellow-500 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <AlertCircle className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-yellow-300 mb-2">
              Consider a different template
            </h3>
            <p className="text-yellow-200 mb-4">{validation.message}</p>
            <div className="flex gap-3">
              {validation.recommendation && onChangeTemplate && (
                <button
                  onClick={() => onChangeTemplate(validation.recommendation!)}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Use {validation.recommendation.charAt(0).toUpperCase() + validation.recommendation.slice(1)} Template
                </button>
              )}
              {onContinueAnyway && (
                <button
                  onClick={onContinueAnyway}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Continue Anyway
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Suboptimal combination (score = 6-7)
  if (validation.shouldWarn && validation.quality === 'good') {
    return (
      <div className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-blue-300 mb-1">
              Suggestion
            </h3>
            <p className="text-blue-200 text-sm mb-3">{validation.message}</p>
            {validation.recommendation && onChangeTemplate && (
              <button
                onClick={() => onChangeTemplate(validation.recommendation!)}
                className="text-sm px-4 py-2 bg-blue-600/50 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Try {validation.recommendation.charAt(0).toUpperCase() + validation.recommendation.slice(1)} Template
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Success badge for perfect combinations
 */
export function TemplatePerfectBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <span className="text-sm font-semibold text-green-300">Perfect Match!</span>
    </div>
  );
}

/**
 * Score indicator component
 */
export function TemplateScoreIndicator({ score }: { score: number }) {
  const getColor = (score: number) => {
    if (score >= 9) return 'text-green-400';
    if (score >= 7) return 'text-blue-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLabel = (score: number) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Fair';
    return 'Not Recommended';
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-2xl font-bold ${getColor(score)}`}>{score}/10</span>
      <span className="text-sm text-slate-400">{getLabel(score)}</span>
    </div>
  );
}
