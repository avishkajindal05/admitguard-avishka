import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronDown, HelpCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormFieldProps {
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'toggle';
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  placeholder?: string;
  options?: string[];
  strict?: boolean;
  ruleKey: string;
  error?: string;
  warning?: string;
  exceptionRationale?: string;
  onExceptionRationaleChange?: (value: string) => void;
  onToggleException?: (enabled: boolean) => void;
  isExceptionEnabled?: boolean;
  disabled?: boolean;
  helperText?: string;
  min?: number;
  max?: number;
  toggleLabel?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  options,
  strict = true,
  ruleKey,
  error,
  warning,
  exceptionRationale,
  onExceptionRationaleChange,
  onToggleException,
  isExceptionEnabled = false,
  disabled = false,
  helperText,
  min,
  max,
  toggleLabel
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const renderInput = () => {
    const commonClasses = cn(
      "w-full h-11 px-3 rounded-lg border transition-all duration-200 outline-none text-[15px] bg-white",
      isFocused ? "border-primary ring-2 ring-primary/10 shadow-sm" : "border-[#D1D5DB]",
      error ? "border-strict-border bg-strict-bg/10" : warning ? "border-soft-border bg-soft-bg/10" : "hover:border-[#9CA3AF]",
      disabled && "bg-[#F3F4F6] cursor-not-allowed text-[#9CA3AF] border-[#E5E7EB]"
    );

    switch (type) {
      case 'select':
        return (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => { setIsFocused(false); onBlur?.(); }}
              onFocus={() => setIsFocused(true)}
              disabled={disabled}
              className={cn(commonClasses, "appearance-none pr-10")}
              data-rule-key={ruleKey}
            >
              <option value="">Select {label}</option>
              {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        );
      case 'toggle':
        return (
          <div className="flex items-center gap-3 h-11">
            <button
              type="button"
              onClick={() => !disabled && onChange(!value)}
              disabled={disabled}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                value ? "bg-primary" : "bg-[#E5E7EB]",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  value ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
            <span className="text-sm font-medium text-[#4B5563]">{value ? 'Yes' : 'No'}</span>
          </div>
        );
      default:
        return (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => { setIsFocused(false); onBlur?.(); }}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            className={commonClasses}
            data-rule-key={ruleKey}
          />
        );
    }
  };

  return (
    <div className="space-y-1.5 mb-6 group">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#374151] flex items-center gap-1.5">
          {label}
          {strict && <span className="text-strict-text font-bold">*</span>}
          {!strict && <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF] cursor-help" />}
        </label>
        {toggleLabel && (
          <button 
            type="button"
            onClick={() => onChange(value)} // This is just a placeholder for the % / CGPA toggle
            className="text-[11px] font-semibold text-primary uppercase tracking-wider hover:underline"
          >
            {toggleLabel}
          </button>
        )}
      </div>

      <div className="relative">
        {renderInput()}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          {error && <AlertCircle className="w-4 h-4 text-strict-text" />}
          {warning && <AlertTriangle className="w-4 h-4 text-soft-text" />}
          {!error && !warning && value && <CheckCircle2 className="w-4 h-4 text-success-text" />}
        </div>
      </div>

      {/* Validation Message Area - Reserved space to avoid layout shift */}
      <div className="min-h-[18px] flex flex-col gap-1">
        {error && (
          <p className="text-[13px] text-strict-text font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
        {warning && (
          <div className="space-y-2">
            <p className="text-[13px] text-soft-text font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
              {warning}
            </p>
            {!strict && onToggleException && (
              <div className="flex items-center gap-2 bg-soft-bg/30 p-2 rounded-lg border border-soft-border/30">
                <input
                  type="checkbox"
                  id={`exception-${ruleKey}`}
                  checked={isExceptionEnabled}
                  onChange={(e) => onToggleException(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D1D5DB] text-primary focus:ring-primary"
                />
                <label htmlFor={`exception-${ruleKey}`} className="text-[13px] font-medium text-soft-text cursor-pointer">
                  Request Exception
                </label>
              </div>
            )}
          </div>
        )}
        {helperText && !error && !warning && (
          <p className="text-[13px] text-[#6B7280] italic">{helperText}</p>
        )}
      </div>

      {/* Exception Rationale UI Shell */}
      {isExceptionEnabled && !strict && (
        <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#374151] uppercase tracking-wider">
              Exception Rationale
            </label>
            <span className="text-[11px] text-[#9CA3AF] font-mono">
              {exceptionRationale?.length || 0} / 30 min chars
            </span>
          </div>
          <textarea
            value={exceptionRationale}
            onChange={(e) => onExceptionRationaleChange?.(e.target.value)}
            placeholder="Provide rationale for this exception (e.g., 'Approved by Admissions Dean', 'Special case due to...')"
            className={cn(
              "w-full min-h-[80px] p-3 rounded-lg border border-[#D1D5DB] outline-none text-[14px] transition-all focus:border-primary focus:ring-2 focus:ring-primary/10",
              (exceptionRationale?.length || 0) >= 30 ? "border-success-border bg-success-bg/5" : "border-soft-border bg-soft-bg/5"
            )}
          />
          <p className="text-[12px] text-[#6B7280]">
            Rationale must satisfy later rules (≥30 chars + required keywords).
          </p>
        </div>
      )}
    </div>
  );
};

export default FormField;
