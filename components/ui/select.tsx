import * as React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`block w-full rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-base shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:opacity-50 transition-colors ${className}`}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";