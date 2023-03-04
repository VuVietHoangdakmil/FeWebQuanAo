import { useState } from "react";
import { Context } from "../Context";
import { getSecttion,setSecttion } from "../Storage";
import axios from "axios";
function Provider ({children}) {
    
    const [isLogin, setIsLogin]= useState(getSecttion('IsLogin') ?? false)
    const [myCarts, setMyCarts] = useState(getSecttion('myCarts') ?? [])
    const [infoUser, setInfoUser] = useState(getSecttion('infoUser') ?? {})
    const [keyword, setKeyword]= useState("")
    const CallApiLogin = (data)=>{
        const { SDT, password } = data;
        axios
          .post("http://localhost/backendBanQuanAo/Login.php", {
            SDT: SDT,
            password: password,
          })
          .then(({ data }) => {
            if (data.success) {
              setInfoUser(data.result);
              setSecttion("IsLogin", true);
              setInfoUser(data.result)
              setIsLogin(getSecttion("IsLogin"))
              setSecttion("infoUser", data.result);
            } else {
              alert("Sai Thông Tin Đăng Nhập");
            }
          });
    }
   
    const data = {
      setIsLogin: setIsLogin,
      isLogin: isLogin,
      keyword: keyword,
      setKeyword: setKeyword,
      myCarts,
      setMyCarts,
      CallApiLogin,
      infoUser,
    };

    return (
    <Context.Provider value={data}>
        {children}
    </Context.Provider>);
}

export default Provider ;