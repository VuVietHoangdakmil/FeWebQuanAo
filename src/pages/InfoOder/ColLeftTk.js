import Button from "../../components/Button";

import { useState, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
function ColLeftTk({ styles, FilterTrangThaiDon }) {
  const [checkTTs, setCheckTTs] = useState({
    checkTTthanhtoan: false,
    checkTTGiaoHang: false,
  });
  console.log(checkTTs);

  const listRadioTTDonHang = [
    { id: 0, text: "Chưa giao" },
    { id: 2, text: "Đang giao" },
    { id: 1, text: "Đã giao" },
  ];
  const listRadioTTThanhToan = [
    { id: 0, text: "Chưa Thanh Toán" },
    { id: 1, text: "Đã Thanh Toán" },
  ];
  const HandelerCheckTTDonHang = (id, e) => {
    const { name } = e.target;

    if (id === checkTTs[name]) {
      setCheckTTs((p) => ({ ...p, [name]: false }));
    } else {
      setCheckTTs((p) => ({ ...p, [name]: id }));
    }
  };

  return (
    <div className={styles.wrapperLeft}>
      <h1>Tìm Kiếm</h1>
      <ul>
        {listRadioTTDonHang.map((item) => (
          <li key={item.id}>
            <label htmlFor={item.text}>
              <div className={styles.textContent}>{item.text}</div>
              <div
                className={clsx(styles.customCheckBox, {
                  [styles.activecolor]: checkTTs.checkTTGiaoHang === item.id,
                })}
              >
                <input
                  id={item.text}
                  name="checkTTGiaoHang"
                  type="checkbox"
                  checked={checkTTs.checkTTGiaoHang === item.id}
                  onChange={(e) => HandelerCheckTTDonHang(item.id, e)}
                />
                <FontAwesomeIcon
                  icon={faCheck}
                  className={styles.customiconcheck}
                />
              </div>
            </label>
          </li>
        ))}
      </ul>
      <ul>
        {listRadioTTThanhToan.map((item) => (
          <li key={item.id}>
            <label htmlFor={item.text}>
              <div className={styles.textContent}>{item.text}</div>
              <div
                className={clsx(styles.customCheckBox, {
                  [styles.activecolor]: checkTTs.checkTTthanhtoan === item.id,
                })}
              >
                <input
                  id={item.text}
                  name="checkTTthanhtoan"
                  type="checkbox"
                  checked={checkTTs.checkTTthanhtoan === item.id}
                  onChange={(e) => HandelerCheckTTDonHang(item.id, e)}
                />
                <FontAwesomeIcon
                  icon={faCheck}
                  className={styles.customiconcheck}
                />
              </div>
            </label>
          </li>
        ))}
      </ul>

      <Button width={"70px"} height="30px" onClick={() => FilterTrangThaiDon(checkTTs)}>Tìm Kiếm</Button>
    </div>
  );
}

export default memo(ColLeftTk);
