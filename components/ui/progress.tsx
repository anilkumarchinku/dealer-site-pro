import { cn } from "@/lib/utils";

interface ProgressProps {
    currentStep: number;
    totalSteps?: number;
    labels?: string[];
}

export function Progress({ currentStep, totalSteps = 5, labels }: ProgressProps) {
    const defaultLabels = [
        "About You",
        "Your Brands",
        "Services",
        "Style",
        "Launch"
    ];

    const stepLabels = labels || defaultLabels;

    return (
        <div className="w-full">
            {/* Progress Bar */}
            <div className="relative mb-8">
                {/* Background Line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-muted rounded-full" />

                {/* Active Line */}
                <div
                    className="absolute top-4 left-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />

                {/* Step Circles */}
                <div className="relative flex justify-between">
                    {Array.from({ length: totalSteps }).map((_, index) => {
                        const stepNum = index + 1;
                        const isComplete = stepNum < currentStep;
                        const isCurrent = stepNum === currentStep;

                        return (
                            <div key={index} className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                                        isComplete && "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
                                        isCurrent && "bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-4 ring-blue-500/30",
                                        !isComplete && !isCurrent && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isComplete ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        stepNum
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "mt-2 text-xs font-medium transition-colors",
                                        isCurrent ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {stepLabels[index]}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
