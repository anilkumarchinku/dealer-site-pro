'use client';

import { useState, useEffect } from 'react';
import { allTemplates, type TemplateStyle } from '@/lib/templates';
import { validateCombination, type TemplateRecommendation } from '@/lib/templates/template-validation';
import { TemplateWarning } from './TemplateWarning';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Brand } from '@/lib/types';

interface TemplateSelectorProps {
  onSelect: (templateId: TemplateStyle) => void;
  selectedTemplate?: TemplateStyle;
  onBack?: () => void;
  onNext?: () => void;
  primaryBrand?: Brand;
  recommendation?: TemplateRecommendation | null;
  showBlockedWarning?: boolean;
}

// ─── Mini browser mockup previews ────────────────────────────────────────────

function LuxuryMockup() {
  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col overflow-hidden">
      {/* Gold accent bar */}
      <div className="h-1 w-full bg-amber-400 flex-shrink-0" />
      {/* Navbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="flex gap-1.5 ml-auto">
          <div className="w-5 h-0.5 bg-zinc-500 rounded" />
          <div className="w-5 h-0.5 bg-zinc-500 rounded" />
          <div className="w-5 h-0.5 bg-zinc-500 rounded" />
        </div>
      </div>
      {/* Hero */}
      <div className="flex flex-1 gap-2 px-3 py-2 min-h-0">
        <div className="flex flex-col justify-center gap-1.5 flex-1">
          <div className="h-2 w-16 bg-amber-400 rounded" />
          <div className="h-1.5 w-20 bg-zinc-600 rounded" />
          <div className="h-1.5 w-14 bg-zinc-700 rounded" />
          <div className="mt-1.5 h-4 w-12 bg-amber-500 rounded-sm" />
        </div>
        <div className="w-16 h-12 bg-zinc-700 rounded-md self-center" />
      </div>
      {/* Cards row */}
      <div className="flex gap-1.5 px-3 pb-2 flex-shrink-0">
        <div className="flex-1 h-6 bg-zinc-800 rounded border border-zinc-700" />
        <div className="flex-1 h-6 bg-zinc-800 rounded border border-zinc-700" />
        <div className="flex-1 h-6 bg-zinc-800 rounded border border-zinc-700" />
      </div>
    </div>
  );
}

function FamilyMockup() {
  return (
    <div className="w-full h-full bg-slate-50 flex flex-col overflow-hidden">
      {/* Navbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-white" />
        <div className="flex gap-1.5 ml-auto">
          <div className="w-5 h-0.5 bg-blue-300 rounded" />
          <div className="w-5 h-0.5 bg-blue-300 rounded" />
          <div className="w-5 h-0.5 bg-blue-300 rounded" />
        </div>
      </div>
      {/* Hero */}
      <div className="flex flex-1 gap-2 px-3 py-2 min-h-0">
        <div className="flex flex-col justify-center gap-1.5 flex-1">
          <div className="h-2.5 w-16 bg-blue-700 rounded font-bold" />
          <div className="h-1.5 w-20 bg-gray-400 rounded" />
          <div className="h-1.5 w-14 bg-gray-300 rounded" />
          <div className="mt-1.5 h-4 w-12 bg-blue-500 rounded-sm" />
        </div>
        <div className="w-16 h-12 bg-blue-100 rounded-md self-center border border-blue-200" />
      </div>
      {/* Cards row */}
      <div className="flex gap-1.5 px-3 pb-2 flex-shrink-0">
        <div className="flex-1 h-7 bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-1.5 w-full bg-blue-400" />
        </div>
        <div className="flex-1 h-7 bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-1.5 w-full bg-green-400" />
        </div>
        <div className="flex-1 h-7 bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-1.5 w-full bg-orange-400" />
        </div>
      </div>
    </div>
  );
}

function SportyMockup() {
  return (
    <div className="w-full h-full bg-gray-950 flex flex-col overflow-hidden">
      {/* Red accent bar */}
      <div className="h-1 w-full bg-red-500 flex-shrink-0" />
      {/* Navbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 flex-shrink-0">
        <div className="w-3 h-3 rounded bg-red-500" />
        <div className="flex gap-1.5 ml-auto">
          <div className="w-5 h-0.5 bg-gray-600 rounded" />
          <div className="w-5 h-0.5 bg-gray-600 rounded" />
          <div className="w-5 h-0.5 bg-gray-600 rounded" />
        </div>
      </div>
      {/* Hero with skewed element */}
      <div className="flex-1 relative px-3 py-2 flex items-center min-h-0 overflow-hidden">
        <div
          className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-br from-red-600 to-orange-700"
          style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        />
        <div className="flex flex-col gap-1.5 z-10">
          <div className="h-2.5 w-14 bg-white rounded" />
          <div className="h-1.5 w-16 bg-gray-600 rounded" />
          <div className="mt-1 h-4 w-10 bg-red-500 rounded-sm" />
        </div>
      </div>
      {/* Cards row */}
      <div className="flex gap-1.5 px-3 pb-2 flex-shrink-0">
        <div className="flex-1 h-6 bg-gray-800 rounded border-l-2 border-red-500" />
        <div className="flex-1 h-6 bg-gray-800 rounded border-l-2 border-red-500" />
      </div>
    </div>
  );
}

function ProfessionalMockup() {
  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      {/* Blue accent bar */}
      <div className="h-1 w-full bg-blue-600 flex-shrink-0" />
      {/* Navbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-blue-600" />
        <div className="flex gap-1.5 ml-auto">
          <div className="w-5 h-0.5 bg-gray-300 rounded" />
          <div className="w-5 h-0.5 bg-gray-300 rounded" />
          <div className="w-5 h-0.5 bg-gray-300 rounded" />
        </div>
      </div>
      {/* Hero: split */}
      <div className="flex flex-1 min-h-0">
        <div className="w-2/5 bg-blue-600 flex flex-col justify-center px-2 py-2 gap-1">
          <div className="h-2 w-10 bg-white rounded" />
          <div className="h-1.5 w-12 bg-blue-300 rounded" />
          <div className="mt-1 h-3 w-8 bg-white rounded-sm" />
        </div>
        <div className="flex-1 flex flex-col justify-center px-2 py-2 gap-1">
          <div className="h-2 w-14 bg-gray-200 rounded" />
          <div className="h-1.5 w-10 bg-gray-200 rounded" />
        </div>
      </div>
      {/* Cards row */}
      <div className="flex gap-1.5 px-3 pb-2 flex-shrink-0">
        <div className="flex-1 h-6 bg-white rounded shadow-sm border border-gray-200 border-l-2 border-l-blue-600" />
        <div className="flex-1 h-6 bg-white rounded shadow-sm border border-gray-200 border-l-2 border-l-blue-600" />
        <div className="flex-1 h-6 bg-white rounded shadow-sm border border-gray-200 border-l-2 border-l-blue-600" />
      </div>
    </div>
  );
}

const mockupComponents: Record<TemplateStyle, React.FC> = {
  luxury: LuxuryMockup,
  family: FamilyMockup,
  sporty: SportyMockup,
  professional: ProfessionalMockup,
};

const mockupWrapperClasses: Record<TemplateStyle, string> = {
  luxury: 'bg-zinc-900',
  family: 'bg-slate-50',
  sporty: 'bg-gray-950',
  professional: 'bg-white',
};

// ─── Main component ───────────────────────────────────────────────────────────

export function TemplateSelector({
  onSelect,
  selectedTemplate,
  onBack,
  onNext,
  primaryBrand,
  recommendation,
}: TemplateSelectorProps) {
  const [selected, setSelected] = useState<TemplateStyle>(selectedTemplate || 'luxury');
  const [validation, setValidation] = useState<ReturnType<typeof validateCombination> | null>(null);

  const handleSelect = (templateId: TemplateStyle) => {
    setSelected(templateId);
    onSelect(templateId);

    if (primaryBrand) {
      const result = validateCombination(primaryBrand, templateId);
      setValidation(result);
    }
  };

  useEffect(() => {
    if (primaryBrand && selectedTemplate) {
      const result = validateCombination(primaryBrand, selectedTemplate);
      setValidation(result);
    }
  }, [primaryBrand, selectedTemplate]);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Choose Your Website Style</CardTitle>
        <CardDescription>
          Pick the look that best matches your dealership&apos;s personality
        </CardDescription>
        {recommendation && recommendation.confidence === 'high' && (
          <p className="text-sm text-blue-600 flex items-center gap-2 pt-1">
            <span>💡</span>
            <span>
              We recommend{' '}
              <strong>
                {recommendation.template.charAt(0).toUpperCase() +
                  recommendation.template.slice(1)}
              </strong>{' '}
              for {primaryBrand} dealers
            </span>
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Validation warning */}
        {validation && validation.shouldBlock && (
          <TemplateWarning
            validation={validation}
            onChangeTemplate={(template) => handleSelect(template)}
            onContinueAnyway={() => setValidation(null)}
          />
        )}

        {/* 2×2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTemplates.map((template) => {
            const isSelected = selected === template.id;
            const isRecommended =
              (recommendation?.template === template.id &&
                recommendation?.confidence === 'high') ||
              (!recommendation && template.recommended);

            let isBlocked = false;
            if (primaryBrand) {
              const tempValidation = validateCombination(primaryBrand, template.id);
              isBlocked = tempValidation.shouldBlock;
            }

            const MockupComponent = mockupComponents[template.id as TemplateStyle];

            return (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                disabled={isBlocked}
                className={cn(
                  'relative flex flex-col rounded-xl border-2 overflow-hidden text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isSelected
                    ? 'border-primary ring-2 ring-primary/30 shadow-lg scale-[1.02]'
                    : isBlocked
                      ? 'border-border opacity-50 cursor-not-allowed'
                      : 'border-border hover:border-primary/40 hover:shadow-md hover:scale-[1.01] cursor-pointer'
                )}
              >
                {/* Browser mockup preview */}
                <div
                  className={cn(
                    'relative h-44 w-full overflow-hidden flex-shrink-0',
                    mockupWrapperClasses[template.id as TemplateStyle]
                  )}
                >
                  {/* Fake browser chrome bar */}
                  <div className="absolute top-0 left-0 right-0 h-5 bg-gray-200 flex items-center gap-1 px-2 z-10 border-b border-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <div className="ml-2 flex-1 h-2.5 bg-gray-100 rounded-full border border-gray-300" />
                  </div>

                  {/* Mockup content */}
                  <div className="absolute inset-0 top-5">
                    <MockupComponent />
                  </div>

                  {/* Selection checkmark */}
                  {isSelected && (
                    <div className="absolute top-7 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md z-20">
                      <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                    </div>
                  )}

                  {/* Recommended badge */}
                  {isRecommended && (
                    <div className="absolute top-7 left-2 z-20">
                      <Badge className="text-[10px] px-1.5 py-0 h-5 bg-blue-600 hover:bg-blue-600 text-white shadow">
                        ✨ Recommended
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Card info */}
                <div className="flex-1 p-4 bg-card">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1">
                    <span>{template.icon}</span>
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">
                    {template.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Perfect for:{' '}
                    <span className="font-medium text-foreground/80">{template.perfectFor}</span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        {onBack ? (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {onNext && (
          <Button onClick={onNext}>
            Continue
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// ─── Template Preview Card (kept for existing consumers) ─────────────────────

interface TemplatePreviewCardProps {
  templateId: TemplateStyle;
}

export function TemplatePreviewCard({ templateId }: TemplatePreviewCardProps) {
  const template = allTemplates.find((t) => t.id === templateId);

  if (!template) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-100">
      <h3 className="text-lg font-bold mb-4">{template.name} Template Preview</h3>

      <div className="space-y-4 text-sm">
        <div>
          <span className="font-semibold">Typography:</span>
          <p className="text-gray-600">
            {template.design.typography.headingFont} (headings),{' '}
            {template.design.typography.bodyFont} (body)
          </p>
        </div>

        <div>
          <span className="font-semibold">Layout:</span>
          <p className="text-gray-600">
            {template.design.layout.heroStyle} hero,{' '}
            {template.design.layout.gridColumns} column grid
          </p>
        </div>

        <div>
          <span className="font-semibold">Style:</span>
          <p className="text-gray-600">
            {template.design.shapes.borderRadius} corners,{' '}
            {template.design.shapes.cardStyle} cards
          </p>
        </div>

        <div>
          <span className="font-semibold">Effects:</span>
          <p className="text-gray-600">
            {template.design.effects.animations} animations,{' '}
            {template.design.effects.shadows} shadows
          </p>
        </div>
      </div>
    </div>
  );
}
