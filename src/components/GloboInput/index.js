import styles from "./GloboInput.module.scss";
import clsx from "clsx"
function InputG({ label, name, type, value, onChange, placeholder, error, onClick }) {
  return (
    <div className={styles.warrap}>
      {/* <label htmlFor={name}>{label}</label> */}
      <input
        className={clsx({[styles.active]: error })}
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        onClick={onClick}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export default InputG;