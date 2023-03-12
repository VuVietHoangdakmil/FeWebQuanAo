import styles from "./GloboInput.module.scss";
import clsx from "clsx"
function InputG({ label, name, type, value, onChange, placeholder, error, onClick ,readOnly , id  }) {
  return (
    <div className={styles.warrap}>
      <label htmlFor={name}>{label}</label>
      <input
        className={clsx({[styles.active]: error })}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        onClick={onClick}
        readOnly={readOnly}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export default InputG;