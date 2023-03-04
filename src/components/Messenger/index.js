import styles from "./Nocart.module.scss";
import Button from "../Button";

import { useNavigate } from "react-router";
function Messenger({children}) {
  const naviagate = useNavigate() 
  function handerlerOnClick(){
    naviagate("/")
  }
  return (
    <div className={styles.wrapper}>
      <h1>{children}</h1>
      <Button
        width={"250px"}
        height={"40px"}
        fontSize="20px"
        onClick={handerlerOnClick}
      >
        Quay trở lại cửa hàng
      </Button>
    </div>
  );
}

export default Messenger;
