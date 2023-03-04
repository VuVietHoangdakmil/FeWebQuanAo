import styles from'./Input.module.scss'
function Input({ label, name, type, value, onChange,placeholder, error }) {
    return (<div className={styles.warrap}>
        <label htmlFor={name}>{label}</label>
        <input
            
            type={type} 
            value={value} 
            onChange={onChange}
            name={name}
            placeholder={placeholder}
        />
        {error && <div className={styles.error}>{error}</div>}
    </div>);
}

export default Input;