import { CandidateData } from '../types';
import { ValidationRule } from '../config/rules';

export interface ValidationResult {
  error?: string;
  warning?: string;
  isValid: boolean;
  canOverride: boolean;
  rule?: ValidationRule;
}

export const validateField = (
  fieldName: keyof CandidateData,
  value: any,
  formData: CandidateData,
  rules: ValidationRule[]
): ValidationResult => {
  const rule = rules.find(r => r.field === fieldName);
  if (!rule) return { isValid: true, canOverride: false };

  let isValid = true;

  // Helper to check if value is provided (including 0)
  const isPresent = (val: any) => val !== undefined && val !== null && val !== '';

  // Helper to evaluate a single token
  const evaluateToken = (token: string, val: any, currentFormData: CandidateData): boolean => {
    const [action, ...paramsArray] = token.split(':');
    const params = paramsArray.join(':'); // Rejoin in case params contained colons
    let tokenValid = true;

    switch (action) {
      case 'required':
        if (!isPresent(val)) tokenValid = false;
        break;

      case 'minLength':
        if (typeof val === 'string' && val.length < parseInt(params)) tokenValid = false;
        break;

      case 'noNumbers':
        if (typeof val === 'string' && /\d/.test(val)) tokenValid = false;
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof val === 'string' && !emailRegex.test(val)) tokenValid = false;
        break;

      case 'phone':
        if (params === 'india') {
          const phoneRegex = /^[6-9]\d{9}$/;
          if (typeof val === 'string' && !phoneRegex.test(val)) tokenValid = false;
        }
        break;

      case 'aadhaar':
        if (params === '12digits') {
          const aadhaarRegex = /^\d{12}$/;
          if (typeof val === 'string' && !aadhaarRegex.test(val)) tokenValid = false;
        }
        break;

      case 'ageRange':
        if (isPresent(val)) {
          const [min, max] = params.split('-').map(Number);
          const birthDate = new Date(val);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < min || age > max) tokenValid = false;
        }
        break;

      case 'range':
        if (isPresent(val)) {
          const [min, max] = params.split('-').map(Number);
          const numericVal = parseInt(val);
          if (isNaN(numericVal) || numericVal < min || numericVal > max) tokenValid = false;
        }
        break;

      case 'minValue':
        if (isPresent(val)) {
          const minThreshold = parseFloat(params);
          const numericVal = parseFloat(val);
          if (isNaN(numericVal) || numericVal < minThreshold) tokenValid = false;
        }
        break;

      case 'cgpaMin':
        if (isPresent(val)) {
          const minThreshold = parseFloat(params);
          const numericVal = parseFloat(val);
          if (isNaN(numericVal) || numericVal < minThreshold) tokenValid = false;
        }
        break;

      case 'scoreMin':
        if (isPresent(val)) {
          const minThreshold = parseInt(params);
          const numericVal = parseInt(val);
          if (isNaN(numericVal) || numericVal < minThreshold) tokenValid = false;
        }
        break;

      case 'allowedIfYes':
        if (val === true) {
          const [depField, depValuesStr] = params.split('=');
          const depValues = depValuesStr.split('|');
          const depValue = currentFormData[depField as keyof CandidateData];
          if (!depValues.includes(String(depValue))) tokenValid = false;
        }
        break;

      case 'modeAware':
        // Format: modeAware:scoreType=percentage:minValue:60|cgpa:cgpaMin:6.0
        const [modeField, modesStr] = params.split('=');
        const currentMode = currentFormData[modeField as keyof CandidateData];
        const modeConfigs = modesStr.split('|');
        
        for (const modeConfig of modeConfigs) {
          const modeParts = modeConfig.split(':');
          const modeName = modeParts[0];
          const subToken = modeParts.slice(1).join(':');
          
          if (currentMode === modeName) {
            if (!evaluateToken(subToken, val, currentFormData)) {
              tokenValid = false;
            }
          }
        }
        break;
    }
    return tokenValid;
  };

  for (const token of rule.validation) {
    if (!evaluateToken(token, value, formData)) {
      isValid = false;
      break;
    }
  }

  const result = {
    isValid,
    error: !isValid && rule.type === 'strict' ? rule.errorMessage : undefined,
    warning: !isValid && rule.type === 'soft' ? rule.warningMessage : undefined,
    canOverride: rule.type === 'soft' && rule.exceptionAllowed === true,
    rule
  };

  // Debug Logging
  if (!isValid) {
    console.log(`[Validation Failed] Field: ${fieldName}`, {
      value,
      type: rule.type,
      warning: result.warning,
      error: result.error,
      tokens: rule.validation
    });
  }

  return result;
};

export const validateRationale = (rationale: string, rule?: ValidationRule): boolean => {
  if (!rule) return false;
  const minLength = rule.rationaleMinLength || 30;
  const keywords = rule.rationaleKeywords || [];

  if (rationale.length < minLength) return false;
  if (keywords.length > 0) {
    return keywords.some(keyword => rationale.toLowerCase().includes(keyword.toLowerCase()));
  }
  return true;
};
