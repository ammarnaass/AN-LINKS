import React, { forwardRef } from "react";

export interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(function AppInput(
  {
    label,
    error,
    helperText,
    startAdornment,
    endAdornment,
    className = "",
    disabled,
    id,
    ...props
  },
  ref
) {
  const inputId = id || (label ? `input-${label.replace(/\s+/g, "-")}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 font-cairo" dir="rtl">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-on-surface-variant px-0.5">
          {label}
        </label>
      )}

      <div className="relative w-full flex items-center">
        {startAdornment && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-outline">
            {startAdornment}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full bg-surface-container-low border text-on-surface text-sm rounded-xl px-4 py-2.5 transition-all duration-200 placeholder:text-outline/60 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? "border-error focus:ring-error/30"
              : "border-outline-variant/40 focus:border-primary focus:ring-primary/20"
          } ${startAdornment ? "pr-10" : ""} ${endAdornment ? "pl-10" : ""} ${className}`}
          {...props}
        />

        {endAdornment && (
          <div className="absolute left-3.5 flex items-center text-outline">
            {endAdornment}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-error font-medium px-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-on-surface-variant/70 px-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

