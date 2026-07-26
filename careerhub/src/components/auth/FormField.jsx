export default function FormField({ id, label, type = "text", value, onChange, placeholder, autoComplete, icon: Icon, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true" />
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className={`w-full text-sm rounded-lg border py-2.5 outline-none transition-colors focus-visible:border-violet ${
            Icon ? "pl-10 pr-3.5" : "px-3.5"
          } ${error ? "border-red-400" : "border-border"}`}
        />
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-600 mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
