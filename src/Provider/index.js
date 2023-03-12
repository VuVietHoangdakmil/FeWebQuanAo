import { useState, useEffect } from "react";
import { Context } from "../Context";
import { getSecttion, setSecttion } from "../Storage";
import {
  auth,
  proverderGG,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "../FireBase";
import axios from "axios";
import { async } from "@firebase/util";

function Provider({ children }) {
  const [isLogin, setIsLogin] = useState(getSecttion("IsLogin") ?? false);
  const [myCarts, setMyCarts] = useState(getSecttion("myCarts") ?? []);
  const [infoUser, setInfoUser] = useState(getSecttion("infoUser") ?? {});
  const [keyword, setKeyword] = useState("");
  const CallApiLogin = (data) => {
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
          setInfoUser(data.result);
          setIsLogin(getSecttion("IsLogin"));
          setSecttion("infoUser", data.result);
        } else {
          alert("Sai Thông Tin Đăng Nhập");
        }
      });
  };

  const LoginGG = () => {
    signInWithPopup(auth, proverderGG).then(({ user }) => {
      const { displayName, email, photoURL, uid } = user;
      const data = { SDT: email, password: uid };
      CallApiAddUser(displayName, uid, email, photoURL);
      CallApiLogin(data);
    });
  };

  // useEffect(() => {
  //   console.log("re-rendering...");
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       const { displayName, email, photoURL, uid } = user;
  //       const data = { SDT: email, password: uid };

  //     } else {
  //       console.log("use no login");
  //     }
  //   });
  // }, []);

  const LogOutGoogle = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const CallApiAddUser = async (Name, password, email, AVTAR_DEFAULT) => {
    const data1 = {
      Name,
      password,
      email,
      AVTAR_DEFAULT,
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    try {
      const { data } = await axios.post(
        "http://localhost/backendBanQuanAo/LoginWithGoogle/AddUserCheck.php",
        data1,
        headers
      );

      if (data.success) {
        console.log("add thêm tai khoan");
      } else {
        console.log("đa co use này");
      }
    } catch (error) {
      alert("có lỗi ", error);
    }
  };
  const data = {
    setIsLogin: setIsLogin,
    isLogin: isLogin,
    keyword: keyword,
    setKeyword: setKeyword,
    myCarts,
    setMyCarts,
    CallApiLogin,
    infoUser,
    setInfoUser,
    LoginGG,
    LogOutGoogle,
  };

  return <Context.Provider value={data}>{children}</Context.Provider>;
}

export default Provider;
