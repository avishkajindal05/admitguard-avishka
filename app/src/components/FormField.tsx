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
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
  placeholder?: string;
  options?: string[];
  strict?: boolean;
  ruleKey: string;
  error?: string;
  warning?: string;
  exceptionRationale?: string;
  rationaleError?: string;
  onExceptionRationaleChange?: (value: string) => void;
  onToggleException?: (enabled: boolean) => void;
  isExceptionEnabled?: boolean;
  disabled?: boolean;
  helperText?: string;
  min?: number;
  max?: number;
  toggleLabel?: string;
  onToggleLabelClick?: () => void;
}

const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 
  'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Home', 'End'];

export const blockNonNumeric = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (allowedKeys.includes(e.key)) return;
  if (e.ctrlKey || e.metaKey) return; // allow Ctrl+A, Ctrl+C, Ctrl+V
  if (!/^\d$/.test(e.key)) e.preventDefault();
};

export const blockNonNumericAllowDecimal = (
  e: React.KeyboardEvent<HTMLInputElement>,
  currentValue: string
) => {
  if (allowedKeys.includes(e.key)) return;
  if (e.ctrlKey || e.metaKey) return;
  if (e.key === '.' && !currentValue.includes('.')) return; // one dot only
  if (!/^\d$/.test(e.key)) e.preventDefault();
};

export const blockNonAlpha = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (allowedKeys.includes(e.key)) return;
  if (e.ctrlKey || e.metaKey) return;
  if (/^[a-zA-Z\s\-']$/.test(e.key)) return;
  e.preventDefault();
};

export const stripNonNumeric = (val: string, max: number) => 
  val.replace(/\D/g, '').slice(0, max);

export const stripToAlpha = (val: string) => 
  val.replace(/[^a-zA-Z\s\-']/g, '');

export const stripToDecimal = (val: string, max: number) => {
  // Remove everything except digits and first decimal point
  let cleaned = val.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) cleaned = parts[0] + '.' + parts.slice(1).join('');
  return cleaned.slice(0, max);
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  onChange,
  onBlur,
  onKeyDown,
  maxLength,
  placeholder,
  options,
  strict = true,
  ruleKey,
  error,
  warning,
  exceptionRationale,
  rationaleError,
  onExceptionRationaleChange,
  onToggleException,
  isExceptionEnabled = false,
  disabled = false,
  helperText,
  min,
  max,
  toggleLabel,
  onToggleLabelClick
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const renderInput = () => {
    const commonClasses = cn(
      "w-full h-11 px-3 rounded-lg border transition-all duration-200 outline-none text-[15px] bg-white dark:bg-[#0F172A] dark:border-[#334155] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]",
      isFocused ? "border-primary ring-2 ring-primary/20 shadow-sm" : "border-[#D1D5DB] dark:border-[#334155]",
      error ? "border-red-500 bg-red-50/10 dark:bg-red-500/5" : warning ? "border-amber-500 bg-amber-50/10 dark:bg-amber-500/5" : "hover:border-[#9CA3AF] dark:hover:border-[#4B5563]",
      disabled && "bg-[#F3F4F6] dark:bg-[#1E293B] cursor-not-allowed text-[#9CA3AF] dark:text-[#64748B] border-[#E5E7EB] dark:border-[#334155]"
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
              aria-invalid={!!error}
              aria-describedby={error ? `${ruleKey}-error` : undefined}
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
            <span className="text-sm font-medium text-[#4B5563] dark:text-[#94A3B8]">{value ? 'Yes' : 'No'}</span>
          </div>
        );
      default:
        return (
          <input
            type={type === 'number' ? 'text' : type}
            inputMode={type === 'number' ? 'numeric' : undefined}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => { setIsFocused(false); onBlur?.(); }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            className={commonClasses}
            data-rule-key={ruleKey}
            aria-invalid={!!error}
            aria-describedby={error ? `${ruleKey}-error` : undefined}
          />
        );
    }
  };

  return (
    <div className="space-y-1.5 mb-6 group">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#374151] dark:text-[#CBD5E1] flex items-center gap-1.5">
          {label}
          {strict && <span className="text-strict-text font-bold">*</span>}
          {!strict && <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#64748B] cursor-help" />}
        </label>
        {toggleLabel && (
          <button 
            type="button"
            onClick={() => onToggleLabelClick?.()}
            className="text-[11px] font-semibold text-primary uppercase tracking-wider hover:underline"
          >
            {toggleLabel}
          </button>
        )}
      </div>

      <div className="relative">
        {renderInput()}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          {error && <AlertCircle className="w-4 h-4 text-red-500" />}
          {warning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
          {!error && !warning && value && <CheckCircle2 className="w-4 h-4 text-success-text" />}
        </div>
      </div>

      {/* Validation Message Area - Reserved space to avoid layout shift */}
      <div className="min-h-[20px] flex flex-col gap-1" aria-live="polite" id={`${ruleKey}-error`}>
        {error && (
          <p className="text-sm text-red-500 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
        {warning && (
          <div className="space-y-2">
            <p className="text-sm text-amber-600 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
              {warning}
            </p>
            {!strict && onToggleException && (
              <div className="flex items-center gap-2 bg-amber-50/30 p-2 rounded-lg border border-amber-200/30">
                <input
                  type="checkbox"
                  id={`exception-${ruleKey}`}
                  checked={isExceptionEnabled}
                  onChange={(e) => onToggleException(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D1D5DB] text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor={`exception-${ruleKey}`} className="text-[13px] font-medium text-amber-700 cursor-pointer">
                  Request Exception
                </label>
              </div>
            )}
          </div>
        )}
        {helperText && !error && !warning && (
          <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] italic">{helperText}</p>
        )}
      </div>

      {/* Exception Rationale UI Shell */}
      {warning && isExceptionEnabled && !strict && (
        <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#374151] dark:text-[#CBD5E1] uppercase tracking-wider">
              Exception Rationale
            </label>
            <span className="text-[11px] text-[#9CA3AF] dark:text-[#64748B] font-mono">
              {exceptionRationale?.length || 0} / 30 min chars
            </span>
          </div>
          <textarea
            value={exceptionRationale}
            onChange={(e) => onExceptionRationaleChange?.(e.target.value)}
            placeholder="Provide justification for exception (min 30 chars with approval phrase)"
            className={cn(
              "w-full min-h-[100px] p-3 rounded-lg border outline-none text-[14px] transition-all focus:ring-2 bg-white dark:bg-[#0F172A] dark:text-[#F1F5F9] dark:border-[#334155] dark:placeholder:text-[#64748B]",
              rationaleError 
                ? "border-red-500 bg-red-50/10 dark:bg-red-500/5 focus:ring-red-500/10" 
                : (exceptionRationale?.length || 0) >= 30 
                  ? "border-green-500 bg-green-50/5 dark:bg-green-500/5 focus:ring-green-500/10" 
                  : "border-amber-500 bg-amber-50/5 dark:bg-amber-500/5 focus:ring-amber-500/10"
            )}
          />
          {rationaleError ? (
            <p className="text-xs text-red-500 font-medium" aria-live="polite">
              {rationaleError}
            </p>
          ) : (
            <p className="text-[12px] text-[#6B7280] dark:text-[#94A3B8]">
              Rationale must be at least 30 characters and include an approval phrase (e.g., ‘approved by’, ‘special case’).
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FormField;
