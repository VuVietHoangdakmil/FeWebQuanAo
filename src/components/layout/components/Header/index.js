import styles from "./Header.module.scss";
import { useState, useContext, useEffect, memo } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { getSecttion, setSecttion } from "../../../../Storage";
import { Context } from "../../../../Context";
import Input from "../../../Input";
import Blur from "../../../../components/Blur";
import BlockBlur from "../../../BlockBlur";
import Button from "../../../Button";

function FormDangNhap() {
  const { CallApiLogin } = useContext(Context);

  const messeNull = "Vui Lòng không để trống";
  const messeLength = "Yêu cầu độ dài của mật khẩu lớn hơn 5";
  const [isValid, setIsValid] = useState({
    SDT: false,
    password: false,
  });

  const [values, setValues] = useState({
    SDT: "",
    password: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (
      values.SDT.trim() == "" ||
      values.password.trim() == "" ||
      values.password.length < 6
    ) {
      if (values.SDT.trim() == "") {
        setIsValid((values) => ({ ...values, SDT: messeNull }));
      }
      if (values.password.trim() == "") {
        setIsValid((values) => ({ ...values, password: messeNull }));
      } else if (values.password.length < 6) {
        setIsValid((values) => ({ ...values, password: messeLength }));
      }
    } else {
      // xu ly  login
      const data = {
        SDT: values.SDT,
        password: values.password,
      };
      CallApiLogin(data);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setIsValid((isValid) => {
      if (value.trim() == "") {
        return { ...isValid, [name]: messeNull };
      } else {
        return { ...isValid, [name]: false };
      }
    });

    setValues((values) => {
      return { ...values, [name]: value };
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.FormDangNhap}>
      <h1> Đăng Nhập </h1>
      <Input
        error={isValid.SDT}
        value={values.SDT}
        onChange={(e) => {
          handleChange(e);
        }}
        type={"text"}
        name={"SDT"}
        label={"Số điện thoại"}
        placeholder={"Nhập Số Điện Thoại"}
      />
      <Input
        error={isValid.password}
        onChange={(e) => {
          handleChange(e);
        }}
        value={values.password}
        type={"password"}
        name={"password"}
        label={"Mật Khẩu"}
        placeholder={"Nhập Mật Khẩu"}
      />
      <Button fontSize="18px" width="120px" height="40px">
        Đăng Nhập
      </Button>
    </form>
  );
}

function FormDangKy() {
  console.log("FormDangKy");
  const { CallApiLogin } = useContext(Context);
  function isPhoneNumber(str) {
    const pattern = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
    return pattern.test(str);
  }
  const dataInputs = {
    Name: "",
    SDT: "",
    password: "",
    pwdpassword: "",
  };
  const dataIsInputs = {
    Name: false,
    SDT: false,
    password: false,
    pwdpassword: false,
  };
  const ContextErrors = {
    VALUE_NULL: "Vui lòng không để trống",
    VALUE_LENGHT: "Chiều dài mật khẩu từ 6 ký tự trở lên",
    VALUE_NO_MATCH: "Mật Khẩu Nhập Lại không khớp",
    TYPE_PHONE: "Vui lòng nhập đúng định dạng số điện thoại",
  };
  const [valueInputs, setValueInputs] = useState(dataInputs);
  const [isValid, setIsValid] = useState(dataIsInputs);
  // điều kiện kiểm tra các input
  const arrValueInputs = Object.values(valueInputs);
  const IfNoNullValue = arrValueInputs.every((value) => value.trim() != "");
  const IfLengthValue = valueInputs.password.length >= 6;
  const IfPassNoMatch =
    valueInputs.password.trim() === valueInputs.pwdpassword.trim();
  const IfFoneNumber =
    isPhoneNumber(valueInputs.SDT) && valueInputs.SDT.length >= 10;
  const arrdataValueInputs = Object.entries(valueInputs);

  function HandlerOnchange(e) {
    const { value, name } = e.target;

    if (name == "SDT") {
      if (isPhoneNumber(value) && value.length >= 10) {
        setIsValid((isValid) => ({ ...isValid, [name]: false }));
      }
    }
    if (name == "pwdpassword") {
      if (valueInputs.password.trim() === value.trim()) {
        setIsValid((isValid) => ({ ...isValid, [name]: false }));
      }
    }
    if (name == "password") {
      if (valueInputs.pwdpassword.trim() === value.trim()) {
        setIsValid((isValid) => ({ ...isValid, pwdpassword: false }));
      }
      if (value.length >= 6) {
        setIsValid((isValid) => ({ ...isValid, [name]: false }));
      }
    }
    setValueInputs((valueInputs) => {
      return { ...valueInputs, [name]: value };
    });
  }
  function HandlerOnsubmit(e) {
    e.preventDefault();

    if (IfNoNullValue && IfLengthValue && IfPassNoMatch && IfFoneNumber) {
      //CALL API REGETTRIES
      const headers = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      axios
        .post(
          "http://localhost/backendBanQuanAo/Regestri.php",
          {
            Name: valueInputs.Name,
            SDT: valueInputs.SDT,
            password: valueInputs.password,
          },
          headers
        )
        .then(({ data }) => {
          if (data.success) {
            CallApiLogin({
              SDT: valueInputs.SDT,
              password: valueInputs.password,
            });
          } else {
            alert("Số điện thoại đã có người sử dụng");
          }
        });
    } else {
      const isarrNULL = arrdataValueInputs.filter(
        (value) => value[1].trim() == ""
      );
      const isarrNotNULL = arrdataValueInputs.filter(
        (value) => value[1].trim() != ""
      );

      isarrNULL.forEach((item) => {
        setIsValid((isValid) => ({
          ...isValid,
          [item[0]]: ContextErrors.VALUE_NULL,
        }));
      });
      isarrNotNULL.forEach((item) => {
        setIsValid((isValid) => ({ ...isValid, [item[0]]: false }));
      });

      if (valueInputs.password.trim() != "") {
        if (!IfLengthValue) {
          setIsValid((isValid) => ({
            ...isValid,
            password: ContextErrors.VALUE_LENGHT,
          }));
        } else {
          setIsValid((isValid) => ({ ...isValid, password: false }));
        }
        console.log("cay");
        if (IfPassNoMatch) {
          setIsValid((isValid) => ({ ...isValid, pwdpassword: false }));
        } else {
          setIsValid((isValid) => ({
            ...isValid,
            pwdpassword: ContextErrors.VALUE_NO_MATCH,
          }));
        }
      }
      if (valueInputs.SDT.trim() != "") {
        if (IfFoneNumber) {
          setIsValid((isValid) => ({ ...isValid, SDT: false }));
        } else {
          setIsValid((isValid) => ({
            ...isValid,
            SDT: ContextErrors.TYPE_PHONE,
          }));
        }
      }
    }
  }
  return (
    <form onSubmit={HandlerOnsubmit} className={styles.FormDangNhap}>
      <h1> Đăng Ký </h1>
      <Input
        error={isValid.Name}
        value={valueInputs.Name}
        onChange={(e) => {
          HandlerOnchange(e);
        }}
        type={"text"}
        name={"Name"}
        label={"Họ Tên"}
        placeholder={"Nhập Họ Tên"}
      />
      <Input
        error={isValid.SDT}
        value={valueInputs.SDT}
        onChange={(e) => {
          HandlerOnchange(e);
        }}
        type={"text"}
        name={"SDT"}
        label={"SDT"}
        placeholder={"Nhập Số Điện Thoại"}
      />
      <Input
        error={isValid.password}
        value={valueInputs.password}
        onChange={(e) => {
          HandlerOnchange(e);
        }}
        type={"password"}
        name={"password"}
        label={"Mật Khẩu"}
        placeholder={"Nhập Mật Khẩu"}
      />
      <Input
        error={isValid.pwdpassword}
        value={valueInputs.pwdpassword}
        onChange={(e) => {
          HandlerOnchange(e);
        }}
        type={"password"}
        name={"pwdpassword"}
        label={"Nhập Lại Mật Khẩu"}
        placeholder={"Nhập Nhập Lại Mật Khẩu "}
      />
      <Button fontSize="18px" width="120px" height="40px">
        Đăng Ký
      </Button>
    </form>
  );
}

function DangKyAndDangNhap() {
  const [isBlockBlur, setBlockBlur] = useState(false);
  const [isfrom, setIsForm] = useState();
  function ClickDangNhap() {
    setBlockBlur(!isBlockBlur);
    setIsForm(true);
  }
  function ClickDangKy() {
    setBlockBlur(!isBlockBlur);
    setIsForm(false);
  }

  return (
    <>
      <div className={styles.DangKyAndDangNhap}>
        <button
          onClick={() => {
            ClickDangNhap();
          }}
          className={styles.Dangky}
        >
          Đăng Nhập
        </button>
        <div></div>
        <button
          onClick={() => {
            ClickDangKy();
          }}
          className={styles.DangNhap}
        >
          Đăng Ký
        </button>
      </div>
      {isBlockBlur && (
        <BlockBlur
          onClick={() => {
            setBlockBlur(!isBlockBlur);
          }}
        >
          <div
            className={styles.formpopup}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {isfrom ? <FormDangNhap /> : <FormDangKy />}
          </div>
        </BlockBlur>
      )}
    </>
  );
}

function ActionUser() {
  const navigate = useNavigate();
  const [isForm, setIsForm] = useState(false);
  const { setIsLogin, infoUser } = useContext(Context);
  function logout() {
    setSecttion("IsLogin", false);
    const kq = getSecttion("IsLogin");
    setIsLogin(kq);
    navigate("/");
  }

  function handleTogger() {
    setIsForm(!isForm);
  }
  return (
    <div className={styles.ActionUser}>
      <div className={styles.nameUser}>{infoUser.TEN_KH}</div>
      <img
        src={`img/AvatarDefault/${infoUser.HINH_DAI_DIEN}`}
        alt="Example Image"
      />
      <div className={styles.dropSeting}>
        <div
          onClick={() => {
            handleTogger();
          }}
          className={clsx(styles.iconSetting, { [styles.active]: isForm })}
        >
          <FontAwesomeIcon icon={faCaretDown} />
        </div>
        {isForm && (
          <div className={styles.menuSetting}>
            <ul>
              <li>
                <Link to="">Đơn Đã Đặt</Link>
              </li>
              <li>
                <Link to="">Thông Tin Cá Nhân</Link>
              </li>
              <li onClick={logout}>Đăng Xuất</li>
            </ul>
          </div>
        )}
      </div>
      {isForm && <Blur onClick={handleTogger} />}
    </div>
  );
}

function Header() {
  console.log("Header");
  const { isLogin, keyword, setKeyword, myCarts } = useContext(Context);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setKeyword("");
  }, [pathname]);

  function searchProducts(e) {
    const { value } = e.target;
    setKeyword(value);
  }
  function HandelerSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className={styles.wrapper}>
      <div className="grid wide" id={styles.rowHeader}>
        {isLogin ? <ActionUser /> : <DangKyAndDangNhap />}

        <div className={styles.LogoWeb}>HOÀNG</div>

        <div className={styles.Action}>
          <div className={styles.search}>
            <FontAwesomeIcon icon={faSearch} />
            <form onSubmit={HandelerSubmit}>
              <div className={styles.box}>
                <input
                  value={keyword}
                  onChange={(e) => {
                    searchProducts(e);
                  }}
                  type="text"
                />
                <button>
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </form>
          </div>
          <div
            onClick={() => {
              navigate("/Cart");
            }}
            className={styles.Cart}
          >
            <svg
              fill="white"
              width="44px"
              height="44px"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
            >
              <path d="M832 312H696v-16c0-101.6-82.4-184-184-184s-184 82.4-184 184v16H192c-17.7 0-32 14.3-32 32v536c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V344c0-17.7-14.3-32-32-32zm-432-16c0-61.9 50.1-112 112-112s112 50.1 112 112v16H400v-16zm392 544H232V384h96v88c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-88h224v88c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-88h96v456z"></path>
            </svg>
            <div style={{ left: myCarts.length < 10 ? "17.5px" : "13px" }}>
              {myCarts.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Header);
