import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="form-field">
      <label className="form-field__label">{label}</label>
      {children}
      {hint && <p className="form-field__hint">{hint}</p>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="form-field__input" {...props} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="form-field__textarea" {...props} />;
}
