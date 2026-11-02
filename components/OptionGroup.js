export function RadioGroup({ legend, name, options, value, onChange, row = false, className = "" }) {
  const listClass = ["radios", row && "row", className].filter(Boolean).join(" ");
  return (
    <fieldset className="field">
      <legend className="label">{legend}</legend>
      <div className={listClass}>
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label key={o.value} className={checked ? "radio is-checked" : "radio"}>
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
              />
              <span className="radio-ring" aria-hidden="true" />
              {o.hint ? (
                <span className="radio-text">
                  {o.label}
                  <small>{o.hint}</small>
                </span>
              ) : (
                <span>{o.label}</span>
              )}
              {o.extra}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SelectField({ id, label, options, value, onChange }) {
  return (
    <div className="field">
      <label className="label" htmlFor={id}>{label}</label>
      <div className="select-wrap">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}