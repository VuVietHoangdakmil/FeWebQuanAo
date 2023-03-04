import styles from './Pagenumber.module.scss'
function Pagenumber({pageNumber, pageActive}) {
    return (  
        <div className={styles.wrapper}>
            <span>Trang</span>
            <span className={styles.pagenumber}>{pageNumber}</span>
            <span>/</span>
            <span className={styles.pageactive}>{pageActive}</span>
        </div>
    );
}

export default Pagenumber;