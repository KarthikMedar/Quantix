import React, { useEffect } from 'react';
import { StepIndicator } from '../components/wizard/StepIndicator';
import { Step1ProjectInfo } from '../components/wizard/Step1ProjectInfo';
import { Step2FeatureManagement } from '../components/wizard/Step2FeatureManagement';
import { Step3ReviewProject } from '../components/wizard/Step3ReviewProject';
import { useProjectEstimation } from '../context/ProjectEstimationContext';

export const NewEstimatePage = () => {
  const { currentStep, setCurrentStep } = useProjectEstimation();

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleGoToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Step Progress Indicator */}
      <StepIndicator
        currentStep={currentStep}
        onStepClick={handleGoToStep}
      />

      {/* Wizard Steps */}
      {currentStep === 1 && (
        <Step1ProjectInfo onNext={() => setCurrentStep(2)} />
      )}

      {currentStep === 2 && (
        <Step2FeatureManagement
          onNext={() => setCurrentStep(3)}
          onPrev={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <Step3ReviewProject
          onGoToStep={handleGoToStep}
          onPrev={() => setCurrentStep(2)}
        />
      )}
    </div>
  );
};
