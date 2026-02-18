'use client';

import { useState, useEffect } from 'react';
import { allTemplates, type TemplateStyle } from '@/lib/templates';
import { validateCombination, type TemplateRecommendation } from '@/lib/templates/template-validation';
import { TemplateWarning } from './TemplateWarning';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Brand } from '@/lib/types';

/**
 * Template Selection Component - Matches Screenshot Design
 * Shows 4 template options for dealers to choose from
 * Colors are automatically applied based on their brand
 */

interface TemplateSelectorProps {
  onSelect: (templateId: TemplateStyle) => void;
  selectedTemplate?: TemplateStyle;
  onBack?: () => void;
  onNext?: () => void;
  primaryBrand?: Brand;
  recommendation?: TemplateRecommendation | null;
  showBlockedWarning?: boolean;
}

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

    // Validate combination if brand is available
    if (primaryBrand) {
      const result = validateCombination(primaryBrand, templateId);
      setValidation(result);
    }
  };

  // Validate on mount if template is already selected
  useEffect(() => {
    if (primaryBrand && selectedTemplate) {
      const result = validateCombination(primaryBrand, selectedTemplate);
      setValidation(result);
    }
  }, [primaryBrand, selectedTemplate]);

  // Template card gradient colors (matching screenshot)
  const templateGradients: Record<TemplateStyle, string> = {
    luxury: 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600',
    family: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
    sporty: 'bg-gradient-to-br from-red-500 via-red-600 to-orange-600',
    professional: 'bg-gradient-to-br from-gray-500 via-gray-600 to-cyan-600',
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Choose your website style
          </h2>
          <p className="text-gray-600 text-lg">
            Pick the look that matches your dealership's personality
          </p>
          {/* Subtle recommendation hint */}
          {recommendation && recommendation.confidence === 'high' && (
            <p className="text-sm text-blue-600 mt-3 flex items-center justify-center gap-2">
              <span>💡</span>
              <span>We recommend <strong>{recommendation.template.charAt(0).toUpperCase() + recommendation.template.slice(1)}</strong> for {primaryBrand} dealers</span>
            </p>
          )}
        </div>

        {/* Only show warning if there's an actual problem */}
        {validation && validation.shouldBlock && (
          <div className="mb-6">
            <TemplateWarning
              validation={validation}
              onChangeTemplate={(template) => handleSelect(template)}
              onContinueAnyway={() => setValidation(null)}
            />
          </div>
        )}

        {/* Template Options */}
        <div className="space-y-4 mb-8">
          {allTemplates.map((template) => {
            const isSelected = selected === template.id;
            const isRecommended = recommendation?.template === template.id;

            // Get score for this template (but don't show it unless it's really bad)
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
                className={`w-full p-6 rounded-lg transition-all duration-200 text-left border-2 ${isSelected
                    ? 'bg-blue-50 border-blue-500 shadow-md'
                    : isBlocked
                      ? 'bg-gray-50 border-gray-300 opacity-50 cursor-not-allowed'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
              >
                <div className="flex items-center gap-6">
                  {/* Template Icon/Preview - Vertical Bar with Gradient */}
                  <div
                    className={`w-16 h-16 rounded-lg ${templateGradients[template.id]} flex items-center justify-center flex-shrink-0 shadow-sm`}
                  />

                  {/* Template Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">{template.icon}</span>
                        {template.name}
                      </h3>
                      {/* Only show recommended badge, keep it clean */}
                      {isRecommended && recommendation.confidence === 'high' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 flex items-center gap-1">
                          ✨ Recommended
                        </span>
                      )}
                      {template.recommended && !isRecommended && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 flex items-center gap-1">
                          ✨ Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{template.description}</p>
                    <p className="text-sm text-gray-500">
                      Perfect for: <span className="font-medium text-gray-700">{template.perfectFor}</span>
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          {onBack ? (
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Button>
          ) : (
            <div />
          )}

          {onNext && (
            <Button
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-3"
            >
              Next: Review
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Template Preview Card (for showing what each template looks like)
 */
interface TemplatePreviewCardProps {
  templateId: TemplateStyle;
}

export function TemplatePreviewCard({ templateId }: TemplatePreviewCardProps) {
  const template = allTemplates.find((t) => t.id === templateId);

  if (!template) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-100">
      <h3 className="text-lg font-bold mb-4">
        {template.name} Template Preview
      </h3>

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
            {template.design.layout.heroStyle} hero, {template.design.layout.gridColumns} column grid
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
