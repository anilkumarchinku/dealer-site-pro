'use client';

import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className="bg-destructive/10 border-2 border-destructive rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-destructive mb-2">
              This combination is not recommended
            </h3>
            <p className="text-destructive/80 mb-4">{validation.message}</p>
            {validation.recommendation && onChangeTemplate && (
              <Button
                onClick={() => onChangeTemplate(validation.recommendation!)}
                variant="destructive"
              >
                Switch to {validation.recommendation.charAt(0).toUpperCase() + validation.recommendation.slice(1)} Template
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Warned combination (score = 5)
  if (validation.shouldWarn && validation.quality === 'mediocre') {
    return (
      <div className="bg-amber-500/10 border-2 border-amber-500 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300 mb-2">
              Consider a different template
            </h3>
            <p className="text-amber-600/80 dark:text-amber-400/80 mb-4">{validation.message}</p>
            <div className="flex gap-3">
              {validation.recommendation && onChangeTemplate && (
                <Button
                  onClick={() => onChangeTemplate(validation.recommendation!)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Use {validation.recommendation.charAt(0).toUpperCase() + validation.recommendation.slice(1)} Template
                </Button>
              )}
              {onContinueAnyway && (
                <Button
                  variant="secondary"
                  onClick={onContinueAnyway}
                >
                  Continue Anyway
                </Button>
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
      <div className="bg-primary/5 border border-primary/30 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Suggestion
            </h3>
            <p className="text-muted-foreground text-sm mb-3">{validation.message}</p>
            {validation.recommendation && onChangeTemplate && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onChangeTemplate(validation.recommendation!)}
              >
                Try {validation.recommendation.charAt(0).toUpperCase() + validation.recommendation.slice(1)} Template
              </Button>
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
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-sm font-semibold text-green-600 dark:text-green-400">Perfect Match!</span>
    </div>
  );
}

/**
 * Score indicator component
 */
export function TemplateScoreIndicator({ score }: { score: number }) {
  const getColor = (score: number) => {
    if (score >= 9) return 'text-green-600 dark:text-green-400';
    if (score >= 7) return 'text-primary';
    if (score >= 5) return 'text-amber-600 dark:text-amber-400';
    return 'text-destructive';
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
      <span className="text-sm text-muted-foreground">{getLabel(score)}</span>
    </div>
  );
}
