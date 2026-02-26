import React, { useState, useMemo, useEffect } from 'react';
import Card from '../components/Card';
import FormField from '../components/FormField';
import ExceptionCounter from '../components/ExceptionCounter';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessScreen from '../components/SuccessScreen';
import { FIELD_CONFIG } from '../constants';
import { CandidateData, Exception, Submission } from '../types';
import { useAppContext } from '../context/AppContext';
import { AlertCircle } from 'lucide-react';
import { rulesConfig } from '../config/rules';
import { validateField, validateRationale } from '../utils/validationEngine';

const AdmissionForm: React.FC = () => {
  const { addSubmission } = useAppContext();
  const [formData, setFormData] = useState<CandidateData>({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    highestQualification: '',
    graduationYear: '',
    percentageOrCgpa: '',
    scoreType: 'percentage',
    screeningScore: '',
    interviewStatus: '',
    aadhaarNumber: '',
    offerLetterSent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [softWarnings, setSoftWarnings] = useState<Record<string, string>>({});
  const [exceptionStates, setExceptionStates] = useState<Record<string, { enabled: boolean; rationale: string; rationaleError?: string }>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<Submission | null>(null);

  // Derived states for UI dependencies
  const isRejected = formData.interviewStatus === 'Rejected';

  const handleFieldChange = (field: keyof CandidateData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-reset Offer Letter to "No" if status is Rejected
      if (field === 'interviewStatus' && value === 'Rejected') {
        newData.offerLetterSent = false;
      }

      // Real-time strict validation
      const result = validateField(field, value, newData, rulesConfig.rules);
      
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        if (result.error) newErrors[field] = result.error;
        else delete newErrors[field];
        return newErrors;
      });

      // Cross-field validation: if interviewStatus changes, re-validate offerLetterSent
      if (field === 'interviewStatus') {
        const offerResult = validateField('offerLetterSent', newData.offerLetterSent, newData, rulesConfig.rules);
        setErrors(prev => {
          const next = { ...prev };
          if (offerResult.error) next.offerLetterSent = offerResult.error;
          else delete next.offerLetterSent;
          return next;
        });
      }

      return newData;
    });
  };

  // Synchronize soft warnings and clean up stale exception states
  useEffect(() => {
    const newSoftWarnings: Record<string, string> = {};
    const fields = Object.keys(formData) as (keyof CandidateData)[];
    
    fields.forEach(field => {
      const result = validateField(field, formData[field], formData, rulesConfig.rules);
      if (result.warning) {
        newSoftWarnings[field] = result.warning;
      }
    });

    setSoftWarnings(newSoftWarnings);

    // Automatically clean up exception states when a warning resolves
    setExceptionStates(prev => {
      const next = { ...prev };
      let hasChanges = false;
      Object.keys(next).forEach(field => {
        if (!newSoftWarnings[field]) {
          delete next[field];
          hasChanges = true;
        }
      });
      return hasChanges ? next : prev;
    });
  }, [formData]);

  const isFormValid = useMemo(() => {
    const hasStrictErrors = Object.keys(errors).length > 0;
    const requiredFields: (keyof CandidateData)[] = ['fullName', 'email', 'phone', 'highestQualification', 'aadhaarNumber', 'interviewStatus'];
    const allRequiredFilled = requiredFields.every(field => !!formData[field]);
    
    if (hasStrictErrors || !allRequiredFilled || isRejected) return false;

    // Check soft warnings and overrides
    const softFields = Object.keys(softWarnings);
    for (const field of softFields) {
      const state = exceptionStates[field];
      const rule = rulesConfig.rules.find(r => r.field === field);
      if (!state || !state.enabled) return false;
      if (!validateRationale(state.rationale, rule)) return false;
    }

    return true;
  }, [errors, softWarnings, exceptionStates, formData, isRejected]);

  const handleExceptionToggle = (field: string, enabled: boolean) => {
    setExceptionStates((prev: Record<string, { enabled: boolean; rationale: string; rationaleError?: string }>) => {
      const p = prev as Record<string, { enabled: boolean; rationale: string; rationaleError?: string }>;
      const current = p[field] || { enabled: false, rationale: '' };
      return {
        ...p,
        [field]: { ...current, enabled }
      };
    });
  };

  const handleRationaleChange = (field: string, rationale: string) => {
    const rule = rulesConfig.rules.find(r => r.field === field);
    const isValid = validateRationale(rationale, rule);
    const rationaleError = rationale.length > 0 && !isValid 
      ? `Rationale must be at least ${rule?.rationaleMinLength || 30} characters and include an approval phrase.`
      : "";

    setExceptionStates((prev: Record<string, { enabled: boolean; rationale: string; rationaleError?: string }>) => {
      const p = prev as Record<string, { enabled: boolean; rationale: string; rationaleError?: string }>;
      const current = p[field] || { enabled: false, rationale: '' };
      return {
        ...p,
        [field]: { ...current, rationale, rationaleError }
      };
    });
  };

  const activeExceptions = useMemo(() => {
    return Object.entries(softWarnings)
      .filter(([field, _]) => {
        const state = exceptionStates[field];
        const rule = rulesConfig.rules.find(r => r.field === field);
        return state?.enabled && validateRationale(state.rationale, rule);
      })
      .map(([field, _]) => ({
        field: field as keyof CandidateData,
        rationale: exceptionStates[field].rationale
      }));
  }, [softWarnings, exceptionStates]);

  const exceptionCount = activeExceptions.length;
  const isFlagged = exceptionCount > 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmSubmission = () => {
    const newSubmission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      candidateData: { ...formData },
      exceptionCount,
      exceptions: activeExceptions,
      flagged: isFlagged,
    };

    addSubmission(newSubmission);
    setLastSubmission(newSubmission);
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      highestQualification: '',
      graduationYear: '',
      percentageOrCgpa: '',
      scoreType: 'percentage',
      screeningScore: '',
      interviewStatus: '',
      aadhaarNumber: '',
      offerLetterSent: false,
    });
    setErrors({});
    setSoftWarnings({});
    setExceptionStates({});
    setLastSubmission(null);
  };

  if (lastSubmission) {
    return <SuccessScreen submission={lastSubmission} onReset={handleReset} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/20">1</div>
          <span className="text-sm font-bold text-[#1F2937]">Candidate Details</span>
        </div>
        <div className="w-16 h-[2px] bg-[#EAECEF]" />
        <div className="flex items-center gap-2 opacity-40">
          <div className="w-8 h-8 rounded-full bg-[#EAECEF] text-[#9CA3AF] flex items-center justify-center text-sm font-bold">2</div>
          <span className="text-sm font-medium text-[#4B5563]">Verification</span>
        </div>
      </div>

      {isRejected && (
        <div className="bg-strict-bg border border-strict-border p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5 text-strict-text" />
          <p className="text-sm font-bold text-strict-text uppercase tracking-wider">
            Rejected candidates cannot be enrolled.
          </p>
        </div>
      )}

      <Card title="Admission Enrollment Form" subtitle="Enter candidate details for eligibility screening.">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {Object.entries(FIELD_CONFIG).map(([key, config]: [string, any]) => {
              const fieldKey = key as keyof CandidateData;
              const rule = rulesConfig.rules.find(r => r.field === fieldKey);
              const isStrict = rule?.type === 'strict';
              const exceptionAllowed = rule?.exceptionAllowed === true;
              const isFieldDisabled = false; // Allow interaction to trigger errors as requested
              
              // Use real-time errors from state
              const error = errors[fieldKey] || '';
              const warning = softWarnings[fieldKey] || '';

              const exceptionState = exceptionStates[key] || { enabled: false, rationale: '', rationaleError: '' };

              return (
                <FormField
                  key={key}
                  label={fieldKey === 'percentageOrCgpa' ? (formData.scoreType === 'percentage' ? 'Percentage' : 'CGPA') : config.label}
                  type={config.type as any}
                  value={formData[fieldKey]}
                  onChange={(val) => handleFieldChange(fieldKey, val)}
                  onBlur={() => handleFieldChange(fieldKey, formData[fieldKey])}
                  placeholder={config.placeholder}
                  options={config.options}
                  strict={isStrict}
                  ruleKey={config.ruleKey}
                  error={error}
                  warning={warning}
                  disabled={isFieldDisabled}
                  isExceptionEnabled={exceptionState.enabled}
                  onToggleException={exceptionAllowed ? (enabled) => handleExceptionToggle(key, enabled) : undefined}
                  exceptionRationale={exceptionState.rationale}
                  rationaleError={exceptionState.rationaleError}
                  onExceptionRationaleChange={(val) => handleRationaleChange(key, val)}
                  helperText={
                    fieldKey === 'offerLetterSent' 
                      ? (formData.interviewStatus === 'Rejected' 
                          ? "Offer letter cannot be sent to rejected candidates." 
                          : (formData.offerLetterSent ? "Offer-letter depends on Interview Status ∈ {Cleared, Waitlisted}" : undefined))
                      : undefined
                  }
                  toggleLabel={fieldKey === 'percentageOrCgpa' ? (formData.scoreType === 'percentage' ? "Switch to CGPA" : "Switch to %") : undefined}
                  onToggleLabelClick={() => {
                    if (fieldKey === 'percentageOrCgpa') {
                      handleFieldChange('scoreType', formData.scoreType === 'percentage' ? 'cgpa' : 'percentage');
                    }
                  }}
                />
              );
            })}
          </div>

          {isFlagged && (
            <div className="bg-amber-100 border border-amber-400 text-amber-800 rounded-md p-3 mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-2" aria-live="polite">
              <span role="img" aria-label="warning">⚠️</span>
              <p className="text-sm font-medium">
                This candidate has more than 2 exceptions. Entry will be flagged for manager review.
              </p>
            </div>
          )}

          <div className="pt-8 border-t border-[#EAECEF] flex flex-col md:flex-row items-center justify-between gap-6">
            <ExceptionCounter count={exceptionCount} />
            
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 h-11 rounded-lg border border-[#D1D5DB] text-sm font-semibold text-[#4B5563] hover:bg-[#F8F9FB] transition-all"
              >
                Reset Form
              </button>
              <div className="relative group">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="px-10 h-11 rounded-lg bg-primary text-sm font-bold text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Submit Admission
                </button>
                {!isFormValid && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1F2937] text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {isRejected ? "Rejected candidates cannot be enrolled" : "Fix validation errors to submit"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </Card>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmission}
        candidateData={formData}
        exceptionCount={exceptionCount}
        exceptions={activeExceptions}
        isFlagged={isFlagged}
      />
    </div>
  );
};

export default AdmissionForm;
