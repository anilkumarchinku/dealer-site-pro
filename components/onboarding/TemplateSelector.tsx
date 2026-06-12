'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { allTemplates, type TemplateStyle } from '@/lib/templates';
import { validateCombination, type TemplateRecommendation } from '@/lib/templates/template-validation';
import type { Brand } from '@/lib/types';
import { TemplateWarning } from './TemplateWarning';

interface TemplateSelectorProps {
  onSelect: (templateId: TemplateStyle) => void;
  selectedTemplate?: TemplateStyle;
  onBack?: () => void;
  onNext?: (templateId: TemplateStyle) => void;
  primaryBrand?: Brand;
  recommendation?: TemplateRecommendation | null;
  showBlockedWarning?: boolean;
}

const mockupImages: Record<string, string> = {
  luxury: '/images/template-luxury.png',
  family: '/images/template-family.png',
  sporty: '/images/template-sporty.png',
  professional: '/images/template-professional.png',
};

function TemplateMockupImage({ templateId }: { templateId: string }) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={mockupImages[templateId]}
        alt={`${templateId} theme preview`}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
    </div>
  );
}

export function TemplateSelector({
  onSelect,
  selectedTemplate,
  onBack,
  onNext,
  primaryBrand,
  recommendation,
  showBlockedWarning,
}: TemplateSelectorProps) {
  const [selected, setSelected] = useState<TemplateStyle>(selectedTemplate || 'luxury');
  const [validation, setValidation] = useState<ReturnType<typeof validateCombination> | null>(null);

  const handleSelect = (templateId: TemplateStyle) => {
    setSelected(templateId);
    onSelect(templateId);

    if (primaryBrand) {
      setValidation(validateCombination(primaryBrand, templateId));
    }
  };

  useEffect(() => {
    if (primaryBrand && selectedTemplate) {
      setValidation(validateCombination(primaryBrand, selectedTemplate));
    }
  }, [primaryBrand, selectedTemplate]);

  return (
    <Card className="animate-fade-in overflow-hidden rounded-xl border-[#D8E0EA] bg-white shadow-[0_18px_55px_rgba(7,20,54,0.08)]">
      <CardHeader className="border-b border-[#E3E9F2] bg-gradient-to-r from-[#F8FBFF] to-white px-7 py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#155EEF]">
              Website Style
            </p>
            <CardTitle className="text-3xl font-black tracking-[-0.035em] text-[#071436]">
              Choose Your Website Style
            </CardTitle>
            <CardDescription className="mt-2 max-w-2xl text-base font-medium leading-6 text-[#62708A]">
              Pick the look that best matches your dealership&apos;s personality.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-[#CFE0FF] bg-white px-4 py-2 text-sm font-black text-[#155EEF] shadow-[0_10px_24px_rgba(21,94,239,0.08)] sm:block">
              {selected.charAt(0).toUpperCase() + selected.slice(1)} selected
            </div>
            <ThemeToggle />
          </div>
        </div>

        {recommendation && recommendation.confidence === 'high' && (
          <p className="mt-4 flex w-fit items-center gap-2 rounded-full border border-[#CFE0FF] bg-white px-4 py-2 text-sm font-bold text-[#155EEF]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF4FF] text-xs">i</span>
            <span>
              We recommend{' '}
              <strong>{recommendation.template.charAt(0).toUpperCase() + recommendation.template.slice(1)}</strong>{' '}
              for {primaryBrand} dealers
            </span>
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-5 px-7 py-6">
        {(validation && validation.shouldBlock) || showBlockedWarning ? (
          <TemplateWarning
            validation={validation ?? validateCombination(primaryBrand as Brand, selected)}
            onChangeTemplate={(template) => handleSelect(template)}
            onContinueAnyway={() => setValidation(null)}
          />
        ) : null}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {allTemplates.map((template) => {
            const isSelected = selected === template.id;
            const isRecommended =
              (recommendation?.template === template.id && recommendation?.confidence === 'high') ||
              (!recommendation && template.recommended);

            const isBlocked = primaryBrand
              ? validateCombination(primaryBrand, template.id).shouldBlock
              : false;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelect(template.id)}
                disabled={isBlocked}
                className={cn(
                  'relative flex min-h-[330px] flex-col overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] focus-visible:ring-offset-2',
                  isSelected
                    ? 'border-[#155EEF] shadow-[0_18px_48px_rgba(21,94,239,0.18)] ring-4 ring-[#155EEF]/10'
                    : isBlocked
                      ? 'cursor-not-allowed border-[#D8E0EA] opacity-50'
                      : 'cursor-pointer border-[#D8E0EA] shadow-[0_10px_28px_rgba(7,20,54,0.04)] hover:-translate-y-0.5 hover:border-[#155EEF] hover:shadow-[0_20px_50px_rgba(7,20,54,0.10)]'
                )}
              >
                <div className="relative h-[220px] w-full flex-shrink-0 overflow-hidden bg-[#EEF2F7]">
                  <div className="absolute left-0 right-0 top-0 z-10 flex h-7 items-center gap-1.5 border-b border-[#D8E0EA] bg-[#F7F9FC] px-3">
                    <div className="h-2 w-2 rounded-full bg-[#FF8A8A]" />
                    <div className="h-2 w-2 rounded-full bg-[#FFD36E]" />
                    <div className="h-2 w-2 rounded-full bg-[#58D68D]" />
                    <div className="ml-3 h-3 flex-1 rounded-full border border-[#D8E0EA] bg-white" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 top-7">
                    <TemplateMockupImage templateId={template.id} />
                  </div>

                  {isSelected && (
                    <div className="absolute right-3 top-10 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#071436] text-white shadow-[0_10px_24px_rgba(7,20,54,0.22)]">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                  )}

                  {isRecommended && (
                    <div className="absolute left-3 top-10 z-20">
                      <Badge className="h-7 rounded-full bg-[#155EEF] px-3 text-[11px] font-black text-white shadow-[0_10px_24px_rgba(21,94,239,0.22)] hover:bg-[#155EEF]">
                        Recommended
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col bg-white p-5">
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-black tracking-[-0.02em] text-[#071436]">
                    <span className="text-base">{template.icon}</span>
                    {template.name}
                  </h3>
                  <p className="mb-3 text-sm font-medium leading-6 text-[#62708A]">
                    {template.description}
                  </p>
                  <p className="mt-auto text-xs font-medium text-[#62708A]">
                    Perfect for:{' '}
                    <span className="font-black text-[#071436]">{template.perfectFor}</span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="justify-between border-t border-[#E3E9F2] bg-[#F8FBFF] px-7 py-4">
        {onBack ? (
          <Button
            variant="ghost"
            onClick={onBack}
            className="font-black text-[#35445C] hover:bg-white hover:text-[#155EEF]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {onNext && (
          <Button
            type="button"
            onClick={() => onNext(selected)}
            className="h-11 rounded-md bg-[#155EEF] px-6 font-black text-white hover:bg-[#0F4FD3]"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface TemplatePreviewCardProps {
  templateId: TemplateStyle;
}

export function TemplatePreviewCard({ templateId }: TemplatePreviewCardProps) {
  const template = allTemplates.find((item) => item.id === templateId);

  if (!template) return null;

  return (
    <div className="rounded-lg border border-[#D8E0EA] bg-white p-6 shadow-[0_14px_42px_rgba(7,20,54,0.07)]">
      <h3 className="mb-4 text-lg font-black text-[#071436]">{template.name} Template Preview</h3>

      <div className="space-y-4 text-sm text-[#35445C]">
        <div>
          <span className="font-black text-[#071436]">Typography:</span>
          <p>{template.design.typography.headingFont} headings, {template.design.typography.bodyFont} body</p>
        </div>

        <div>
          <span className="font-black text-[#071436]">Layout:</span>
          <p>{template.design.layout.heroStyle} hero, {template.design.layout.gridColumns} column grid</p>
        </div>

        <div>
          <span className="font-black text-[#071436]">Style:</span>
          <p>{template.design.shapes.borderRadius} corners, {template.design.shapes.cardStyle} cards</p>
        </div>

        <div>
          <span className="font-black text-[#071436]">Effects:</span>
          <p>{template.design.effects.animations} animations, {template.design.effects.shadows} shadows</p>
        </div>
      </div>
    </div>
  );
}
