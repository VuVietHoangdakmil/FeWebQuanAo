import styles from "./Cart.module.scss";
import clsx from "clsx";
import { addCommas } from "../../FuncTions";
import { Context } from "../../Context";
import Button from "../../components/Button";
import { setSecttion } from "../../Storage";
import { truncateString } from "../../FuncTions";
import Messenger from "../../components/Messenger";

import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useMemo, memo } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";
function ActionCart() {
  const { myCarts, setMyCarts } = useContext(Context);
  const [quantities, setQuantities] = useState({});
  const myCartsReversed = useMemo(() => {
    return [...myCarts].reverse();
  }, [myCarts]);

  useEffect(() => {
    const quantitiess = myCarts.reduce((lutru, item) => {
      lutru[`SL${item.MA_SP}${item.MA_SIZE}`] = item.SL;
      return lutru;
    }, {});
    setQuantities(quantitiess);
  }, [myCarts]);

  function TangSl(id) {
    setQuantities((prevQuantity) => {
      const slHT = prevQuantity[id];
      return { ...prevQuantity, [id]: slHT + 1 };
    });
  }
  function GiamSL(id) {
    const slHt = quantities[id];
    if (slHt >= 2) {
      setQuantities((prevQuantity) => {
        const slHT = prevQuantity[id];
        return { ...prevQuantity, [id]: slHT - 1 };
      });
    }
  }
  function updateSL() {
    setMyCarts((prevMtcart) => {
      const Mycarts = [...prevMtcart];
      Mycarts.forEach((myCart) => {
        myCart.SL = quantities[`SL${myCart.MA_SP}${myCart.MA_SIZE}`];
        myCart.Price = myCart.SL * myCart.GIA_BAN;
      });
      setSecttion("myCarts", Mycarts);
      return Mycarts;
    });
    alert("cập nhật thành công");
  }
  function deleteSP(index) {
    const IsDelete = window.confirm("Bạn có muốn xóa sản phẩm này");
    if (IsDelete) {
      myCartsReversed.splice(index, 1);
      setSecttion("myCarts", myCartsReversed);
      setMyCarts(myCartsReversed);
    } else {
    }
  }
  function handleOnchange(e, id) {
    const value = parseInt(e.target.value);
    if (!isNaN(value))
      setQuantities((prevQuantity) => {
        return { ...prevQuantity, [id]: value };
      });
  }
  function Infoproduct() {
    return (
      <Fragment>
        <div className={clsx("row", styles.Title_Table)}>
          <div className="col l-6 c-0 m-6">Sản Phẩm</div>
          <div className="col l-2 c-0 m-2">Giá</div>
          <div className="col l-2 c-0 m-2">Số Lượng</div>
          <div
            className={clsx(styles.customCol, "col", "l-2", "c-0", "m-2")}
            id={styles.customNone}
          >
            <span>Tổng</span>
          </div>
        </div>
        <ul className={`${styles.wrapperROWCONTENT}`}>
          {myCartsReversed.map((item, index) => (
            <li
              key={`${item.MA_SP}${item.MA_SIZE}`}
              className={clsx(
                "row",
                styles.ConTen_Table,
                styles.ConTen_TableMobie
              )}
            >
              <div className={`col l-6 c-10 ${styles.cusTomCol2}`}>
                <div className={styles.conTentSp}>
                  <div className={styles.rowMB}>
                    <div className={styles.colMB}>
                      <div className={styles.posisionMB}>
                        <img src={`/img/imgProduct/${item.HINH_SP}`} />
                        <span className={styles.conTentSize}>
                          {item.TEN_SIZE}
                        </span>
                        <button
                          onClick={() => {
                            deleteSP(index);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faXmark}
                            className={styles.iconremove}
                          />
                        </button>
                      </div>
                    </div>
                    <div className={styles.colMB}>
                      <span>{truncateString(item.TEN_SP, 15)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`col l-2 c-8 ${styles.cusTomCol2}`}>
                <p className={styles.conTentPrice}>
                  {addCommas(item.GIA_BAN)} đ
                </p>
              </div>
              <div className={`col l-2 c-8 ${styles.cusTomCol2}`}>
                <div className={clsx(styles.conTentQuality, styles.cusTomCol2)}>
                  <button
                    onClick={() => {
                      GiamSL(`SL${item.MA_SP}${item.MA_SIZE}`);
                    }}
                  >
                    -
                  </button>
                  <input
                    onChange={(e) =>
                      handleOnchange(e, `SL${item.MA_SP}${item.MA_SIZE}`)
                    }
                    value={quantities[`SL${item.MA_SP}${item.MA_SIZE}`]}
                  />
                  <button
                    onClick={() => {
                      TangSl(`SL${item.MA_SP}${item.MA_SIZE}`);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className={`col l-2 c-8 ${styles.cusTomCol2}`}>
                <p className={styles.conTentPriceSum}>
                  {addCommas(item.Price)} đ
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.btnUpdateMobie}>
          <Button
            onClick={updateSL}
            width={"200px"}
            height="40px"
            fontSize="18px"
          >
            Cập Nhật
          </Button>
        </div>
      </Fragment>
    );
  }

  return (
    <div className={styles.ActionCart}>
      <Infoproduct />
    </div>
  );
}
const ActionPay = memo(() => {
  console.log("returning ActionPay");
  const { myCarts, isLogin } = useContext(Context);
  const navigate = useNavigate();
  const SumMoneyCart = useMemo(() => {
    return myCarts.reduce((ltru, item) => {
      let sum = ltru + item.Price;
      return sum;
    }, 0);
  }, [myCarts]);

  function paying() {
    if (isLogin) {
      navigate("/Cart/Payment");
    } else {
      alert("Bạn chưa đăng nhập");
      navigate("/");
    }
  }
  function Title({ children }) {
    return (
      <div className={clsx("row", styles.Title_Table)}>
        <div className="col l-12">{children}</div>
      </div>
    );
  }
  function Row({ children, Title }) {
    return (
      <div className={styles.RowContent}>
        <p>{Title}</p>
        <span>{children}</span>
      </div>
    );
  }
  return (
    <div className={clsx(styles.ActionPay, styles.cusTomMobieColAction)}>
      <Title>Tổng Tiền </Title>
      <Row Title="Tổng Số Lượng"> {myCarts.length} </Row>
      <Row Title="Tổng Tiền"> {addCommas(SumMoneyCart)} đ </Row>
      <div className={styles.boxThanhtoan}>
        <Button onClick={paying} width="100%" height="40px" fontSize="20px">
          Thanh Toán
        </Button>
      </div>
    </div>
  );
});
function Carts() {
  const { myCarts } = useContext(Context);
  return (
    <div className={styles.wrapper}>
      <div className="grid wide">
        {myCarts.length > 0 ? (
          <div className="row">
            <div className="col l-7 c-12">
              <ActionCart />
            </div>
            <div className={`col l-5 c-12 `}>
              <ActionPay />
            </div>
          </div>
        ) : (
          <Messenger>Không có sản phẩm nào trong giỏ hàng</Messenger>
        )}
      </div>
    </div>
  );
}

export default memo(Carts);
