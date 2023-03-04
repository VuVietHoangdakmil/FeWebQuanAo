import styles from './Products.module.scss';
import Button from '../Button';
import {addCommas,truncateString} from '../../FuncTions'
import { Link } from 'react-router-dom';
function Product({src, name , price,herf,onClick}) {
    return (
        <div className={styles.PoductNew}>
            <Link to={herf}><img  src={src}></img></Link>
            <h1 >{truncateString(name,19)}</h1>
            <div>{addCommas(price)} đ</div>
            <Button onClick={onClick} width="120px" height="35px" fontSize="15px"> Thêm Vào Giỏ</Button>
        </div>);
}

export default Product;