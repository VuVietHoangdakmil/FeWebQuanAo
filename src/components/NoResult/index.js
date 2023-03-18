import styles from'./NoResult.module.scss';

const NoSearch = ({children})=>{
    return(<div className={styles.NoSearch}>
        
        {children}
    </div>)
}
export{NoSearch}