import styles from './BlockBlur.module.scss';

function BlockBlur ({children,onClick }) {
    return (<div onClick={onClick} className={styles.blur}>
            {children}
    </div> );
}

export default  BlockBlur ;