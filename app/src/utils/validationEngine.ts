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
  let message = '';

  for (const token of rule.validation) {
    const [action, params] = token.split(':');

    switch (action) {
      case 'required':
        if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
          isValid = false;
        }
        break;

      case 'minLength':
        if (typeof value === 'string' && value.length < parseInt(params)) {
          isValid = false;
        }
        break;

      case 'noNumbers':
        if (typeof value === 'string' && /\d/.test(value)) {
          isValid = false;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value === 'string' && !emailRegex.test(value)) {
          isValid = false;
        }
        break;

      case 'phone':
        if (params === 'india') {
          const phoneRegex = /^[6-9]\d{9}$/;
          if (typeof value === 'string' && !phoneRegex.test(value)) {
            isValid = false;
          }
        }
        break;

      case 'aadhaar':
        if (params === '12digits') {
          const aadhaarRegex = /^\d{12}$/;
          if (typeof value === 'string' && !aadhaarRegex.test(value)) {
            isValid = false;
          }
        }
        break;

      case 'ageRange':
        if (value) {
          const [min, max] = params.split('-').map(Number);
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < min || age > max) {
            isValid = false;
          }
        }
        break;

      case 'range':
        if (value) {
          const [min, max] = params.split('-').map(Number);
          const val = parseInt(value);
          if (val < min || val > max) {
            isValid = false;
          }
        }
        break;

      case 'minValue':
        if (value) {
          const min = parseFloat(params);
          if (parseFloat(value) < min) {
            isValid = false;
          }
        }
        break;

      case 'cgpaMin':
        if (value) {
          const min = parseFloat(params);
          if (parseFloat(value) < min) {
            isValid = false;
          }
        }
        break;

      case 'scoreMin':
        if (value) {
          const min = parseInt(params);
          if (parseInt(value) < min) {
            isValid = false;
          }
        }
        break;

      case 'allowedIfYes':
        if (value === true) {
          const [depField, depValuesStr] = params.split('=');
          const depValues = depValuesStr.split('|');
          const depValue = formData[depField as keyof CandidateData];
          if (!depValues.includes(String(depValue))) {
            isValid = false;
          }
        }
        break;

      case 'modeAware':
        // Format: modeAware:scoreType=percentage:minValue:60|cgpa:cgpaMin:6.0
        const [modeField, modesStr] = params.split('=');
        const currentMode = formData[modeField as keyof CandidateData];
        const modeConfigs = modesStr.split('|');
        
        for (const modeConfig of modeConfigs) {
          const [modeName, subAction, subParam] = modeConfig.split(':');
          if (currentMode === modeName) {
            const subResult = validateField(fieldName, value, formData, [{
              field: fieldName,
              type: rule.type,
              validation: [`${subAction}:${subParam}`]
            }]);
            if (!subResult.isValid) {
              isValid = false;
            }
          }
        }
        break;
    }

    if (!isValid) break;
  }

  return {
    isValid,
    error: !isValid && rule.type === 'strict' ? rule.errorMessage : undefined,
    warning: !isValid && rule.type === 'soft' ? rule.warningMessage : undefined,
    canOverride: rule.type === 'soft' && rule.exceptionAllowed === true,
    rule
  };
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
