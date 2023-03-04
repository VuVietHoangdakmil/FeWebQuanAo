import styles from'./NoResult.module.scss';



import {useHistory} from 'react-router-dom'
const NoSearch = ({children})=>{
    return(<div className={styles.NoSearch}>
        {children}
    </div>)
}
export{NoSearch}