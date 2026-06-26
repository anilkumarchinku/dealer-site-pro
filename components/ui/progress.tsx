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
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />

                {/* Active Line */}
                <div
                    className="absolute top-4 left-0 h-1 rounded-full bg-primary transition-all duration-500"
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
                                        isComplete && "bg-primary text-primary-foreground",
                                        isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                                        !isComplete && !isCurrent && "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
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
                                        isCurrent ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
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
