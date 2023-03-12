import styles from "./Button.module.scss";

function Button({ children, onClick, width, height, fontSize }) {
  const css = {
    width: width,
    height: height,
    fontSize: fontSize,
  };
  return (
    <button style={css} onClick={onClick} className={styles.btn}>
      {children}
    </button>
  );
}

export default Button;
