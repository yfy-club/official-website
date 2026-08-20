import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type FieldProps = {
  className?: string;
  error?: string;
  hint?: string;
  id: string;
  label: string;
  children: ReactNode;
};

export function Field({ children, className = "", error, hint, id, label }: FieldProps) {
  const descriptionId = error || hint ? `${id}-description` : undefined;
  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={id} id={`${id}-label`}>{label}</label>
      {children}
      {(error || hint) && (
        <p className={error ? "field__error" : "field__hint"} id={descriptionId}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`field__control ${className}`.trim()} {...props} />;
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`field__control ${className}`.trim()} {...props} />;
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`field__control field__textarea ${className}`.trim()} {...props} />;
}
