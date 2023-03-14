import { useState, memo } from "react";
import { truncateString, GetTime, GetDate, addCommas } from "../../FuncTions";
import {
  faCalendarDay,
  faClock,
  faPhone,
  faMailBulk,
  faMapMarkedAlt,
  faDollarSign,
  faCheck,
  faExclamation,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

import Button1 from "../../components/Button";

function ColItem({
  styles,
  date,
  sdt,
  email,
  address,
  money,
  trangThaiGh,
  TrangThaiTT,
  maDh,
  CallApiHuyDon,
  makh,
}) {
  const [IsHoverTT, setIsHoverTT] = useState(false);

  const HandlerRemove = () => {
    if (window.confirm("Bạn có muốn hủy đơn")) {
      CallApiHuyDon(maDh, makh);
    } else {
    }
  };
  return (
    <div className={clsx("col", "l-4", styles.CusTomColItem)}>
      <ul className={styles.ItemDonHang}>
        <li>
          <div className={styles.boxIcon}>
            <FontAwesomeIcon icon={faCalendarDay} className={styles.icon} />
          </div>
          <div className={styles.Content}>{GetDate(date)}</div>
        </li>
        <li>
          <div className={styles.boxIcon}>
            <FontAwesomeIcon icon={faClock} className={styles.icon} />
          </div>
          <div className={styles.Content}>{GetTime(date)}</div>
        </li>
        <li>
          <div className={styles.boxIcon}>
            <FontAwesomeIcon icon={faPhone} className={styles.icon} />
          </div>
          <div className={styles.Content}>{sdt}</div>
        </li>
        <li className={styles.btnHoverEmail}>
          <div className={styles.boxIcon}>
            <FontAwesomeIcon icon={faMailBulk} className={styles.icon} />
          </div>
          <div className={styles.Content}>{truncateString(email, 15)}</div>
          <div className={styles.ContenFullMail}>
            <div>{email}</div>
          </div>
        </li>
        <li className={styles.btnHoverAddress}>
          <div className={styles.boxIcon}>
            <FontAwesomeIcon icon={faMapMarkedAlt} className={styles.icon} />
          </div>
          <div className={styles.Content}>{truncateString(address, 15)}</div>
          <div className={styles.wrapperTrangThai}>
            <div>{address}</div>
          </div>
        </li>
        <li>
          <div className={styles.boxIcon}>
            <FontAwesomeIcon icon={faDollarSign} className={styles.icon} />
          </div>
          <div className={styles.Content}>{addCommas(money)} đ</div>
        </li>
        <li>
          <Button1 onClick={HandlerRemove} width="30px" height="30px">
            <FontAwesomeIcon icon={faTrashAlt} className="IconRemove" />
          </Button1>
        </li>
        {TrangThaiTT == 1 ? (
          <li className={styles.boxTrangThai}>
            <FontAwesomeIcon icon={faCheck} className={styles.IconCheckPay} />
            <div className={styles.ConTentPay}>Đơn Hàng Đã Thanh Toán</div>
          </li>
        ) : (
          <li className={styles.boxTrangThai}>
            <FontAwesomeIcon
              icon={faExclamation}
              className={styles.IconNoCheckPay}
            />
            <div className={styles.ConTentNoPay}>Đơn Hàng Chưa Thanh Toán</div>
          </li>
        )}
      </ul>
      <div
        className={styles.btnHoverTrangThai}
        onMouseOver={() => setIsHoverTT(true)}
        onMouseOut={() => setIsHoverTT(false)}
      >
        {!IsHoverTT ? (
          "Trạng Thái"
        ) : (
          <div
            className={
              trangThaiGh == 0
                ? styles.ColorRed
                : trangThaiGh == 2
                ? styles.ColorYellow
                : styles.ColorGreen
            }
          >
            {trangThaiGh == 0
              ? "Chưa Giao"
              : trangThaiGh == 2
              ? "Đang Vận Chuyển"
              : "Đã Tới địa chỉ"}
          </div>
        )}
      </div>
    </div>
  );
}
export default memo(ColItem);
