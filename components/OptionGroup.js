import { optionsOf, resolve } from "@/lib/fields";

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
              {o.shape && <span className="ratio-shape" style={{ width: o.shape.w, height: o.shape.h }} />}
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
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

export function TextField({ id, label, placeholder, value, onChange }) {
  return (
    <div className="field">
      <label className="label" htmlFor={id}>{label}</label>
      <input
        id={id}
        className="field-input"
        type="text"
        maxLength={200}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// 레시피의 FIELDS 정의대로 옵션 입력칸을 그려요
export function OptionFields({ fields, values, onChange }) {
  return fields.map((f) =>
    f.pair ? (
      <div key={f.pair.map((p) => p.id).join("-")} className="pair">
        <OptionFields fields={f.pair} values={values} onChange={onChange} />
      </div>
    ) : (
      <OptionField key={f.id} field={f} values={values} onChange={onChange} />
    )
  );
}

function OptionField({ field: f, values, onChange }) {
  const set = (value) => onChange(f, value);
  if (f.kind === "text") {
    return <TextField id={f.id} label={f.label} placeholder={resolve(f.placeholder, values)} value={values[f.id]} onChange={set} />;
  }
  const options = optionsOf(f, values);
  if (f.kind === "select") {
    return <SelectField id={f.id} label={f.label} options={options} value={values[f.id]} onChange={set} />;
  }
  return (
    <RadioGroup legend={f.label} name={f.id} row={f.row} className={f.className} options={options} value={values[f.id]} onChange={set} />
  );
}
