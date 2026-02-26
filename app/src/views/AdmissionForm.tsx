import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import FormField from '../components/FormField';
import ExceptionCounter from '../components/ExceptionCounter';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessScreen from '../components/SuccessScreen';
import { FIELD_CONFIG } from '../constants';
import { CandidateData, Exception, Submission } from '../types';
import { useAppContext } from '../context/AppContext';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

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

  const validateRationale = (rationale: string) => {
    if (rationale.length < 30) return false;
    const requiredPhrases = ["approved by", "special case", "documentation pending", "waiver granted"];
    return requiredPhrases.some(phrase => rationale.toLowerCase().includes(phrase));
  };

  const validateSoftField = (field: keyof CandidateData, value: any, currentFormData: CandidateData) => {
    let warning = '';
    switch (field) {
      case 'dob':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 18 || age > 35) {
            warning = 'Candidate must be between 18 and 35 years old.';
          }
        }
        break;
      case 'graduationYear':
        if (value) {
          const year = parseInt(value);
          if (year < 2015 || year > 2025) {
            warning = 'Graduation year must be between 2015 and 2025.';
          }
        }
        break;
      case 'percentageOrCgpa':
        if (value) {
          const val = parseFloat(value);
          if (currentFormData.scoreType === 'percentage') {
            if (val < 60) warning = 'Percentage must be ≥ 60%.';
          } else {
            if (val < 6.0) warning = 'CGPA must be ≥ 6.0.';
          }
        }
        break;
      case 'screeningScore':
        if (value) {
          const val = parseInt(value);
          if (val < 40) warning = 'Screening score must be ≥ 40.';
        }
        break;
    }
    return warning;
  };

  const validateField = (field: keyof CandidateData, value: any, currentFormData: CandidateData) => {
    let error = '';
    switch (field) {
      case 'fullName':
        if (!value || value.trim().length === 0) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Minimum 2 characters';
        } else if (/\d/.test(value)) {
          error = 'Name cannot contain numbers';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          error = 'Enter a valid email address.';
        }
        break;
      case 'phone':
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!value || !phoneRegex.test(value)) {
          error = 'Phone number must be 10 digits and start with 6, 7, 8, or 9.';
        }
        break;
      case 'highestQualification':
        if (!value) {
          error = 'Please select a qualification.';
        }
        break;
      case 'interviewStatus':
        if (!value) {
          error = 'Please select an interview status.';
        }
        break;
      case 'aadhaarNumber':
        const aadhaarRegex = /^\d{12}$/;
        if (!value || !aadhaarRegex.test(value)) {
          error = 'Aadhaar must be exactly 12 digits. Should not contain letters';
        }
        break;
      case 'offerLetterSent':
        if (value === true && !['Cleared', 'Waitlisted'].includes(currentFormData.interviewStatus)) {
          error = 'Offer letter can only be sent if interview is Cleared or Waitlisted.';
        }
        break;
    }
    return error;
  };

  const handleFieldChange = (field: keyof CandidateData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Real-time validation
      const fieldError = validateField(field, value, newData);
      const fieldWarning = validateSoftField(field, value, newData);
      
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        if (fieldError) newErrors[field] = fieldError;
        else delete newErrors[field];
        return newErrors;
      });

      setSoftWarnings(prevWarnings => {
        const newWarnings = { ...prevWarnings };
        if (fieldWarning) newWarnings[field] = fieldWarning;
        else delete newWarnings[field];
        return newWarnings;
      });

      // Cross-field validation: if interviewStatus changes, re-validate offerLetterSent
      if (field === 'interviewStatus') {
        const offerError = validateField('offerLetterSent', newData.offerLetterSent, newData);
        setErrors(prev => {
          const next = { ...prev };
          if (offerError) next.offerLetterSent = offerError;
          else delete next.offerLetterSent;
          return next;
        });
      }

      // Re-validate percentageOrCgpa if scoreType changes
      if (field === 'scoreType') {
        const scoreWarning = validateSoftField('percentageOrCgpa', newData.percentageOrCgpa, newData);
        setSoftWarnings(prev => {
          const next = { ...prev };
          if (scoreWarning) next.percentageOrCgpa = scoreWarning;
          else delete next.percentageOrCgpa;
          return next;
        });
      }

      return newData;
    });
  };

  const isFormValid = useMemo(() => {
    const hasStrictErrors = Object.keys(errors).length > 0;
    const requiredFields: (keyof CandidateData)[] = ['fullName', 'email', 'phone', 'highestQualification', 'aadhaarNumber', 'interviewStatus'];
    const allRequiredFilled = requiredFields.every(field => !!formData[field]);
    
    if (hasStrictErrors || !allRequiredFilled || isRejected) return false;

    // Check soft warnings and overrides
    const softFields = Object.keys(softWarnings);
    for (const field of softFields) {
      const state = exceptionStates[field];
      if (!state || !state.enabled) return false;
      if (!validateRationale(state.rationale)) return false;
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
    const isValid = validateRationale(rationale);
    const rationaleError = rationale.length > 0 && !isValid 
      ? "Rationale must be at least 30 characters and include an approval phrase (e.g., ‘approved by’, ‘special case’)."
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
    return Object.entries(exceptionStates)
      .filter(([_, state]) => (state as { enabled: boolean }).enabled)
      .map(([field, state]) => ({
        field: field as keyof CandidateData,
        rationale: (state as { rationale: string }).rationale
      }));
  }, [exceptionStates]);

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
                  strict={config.strict}
                  ruleKey={config.ruleKey}
                  error={error}
                  warning={warning}
                  disabled={isFieldDisabled}
                  isExceptionEnabled={exceptionState.enabled}
                  onToggleException={(enabled) => handleExceptionToggle(key, enabled)}
                  exceptionRationale={exceptionState.rationale}
                  rationaleError={exceptionState.rationaleError}
                  onExceptionRationaleChange={(val) => handleRationaleChange(key, val)}
                  helperText={fieldKey === 'offerLetterSent' && formData.offerLetterSent ? "Offer-letter depends on Interview Status ∈ {Cleared, Waitlisted}" : undefined}
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
