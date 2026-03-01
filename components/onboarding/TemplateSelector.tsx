'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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

// ─── Template preview images ────────────────────────────────────────────────

const mockupImages: Record<string, string> = {
  luxury: '/images/template-luxury.png',
  family: '/images/template-family.png',
  sporty: '/images/template-sporty.png',
  professional: '/images/template-professional.png',
};

function TemplateMockupImage({ templateId }: { templateId: string }) {
  const src = mockupImages[templateId];
  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={`${templateId} theme preview`}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
    </div>
  );
}

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
    return;
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
                {/* Real website screenshot preview */}
                <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
                  {/* Fake browser chrome bar */}
                  <div className="absolute top-0 left-0 right-0 h-5 bg-gray-200 flex items-center gap-1 px-2 z-10 border-b border-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <div className="ml-2 flex-1 h-2.5 bg-gray-100 rounded-full border border-gray-300" />
                  </div>

                  {/* Theme preview image */}
                  <div className="absolute inset-0 top-5">
                    <TemplateMockupImage templateId={template.id} />
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
