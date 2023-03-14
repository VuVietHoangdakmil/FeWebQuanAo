import styles from "./InfoOder.module.scss";
import { Context } from "../../Context";

import Pagenumber from "../../components/Pagenumber";
import Colitem from "./Colitem";
import ColLeftTk from "./ColLeftTk";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState, useEffect, Fragment, memo } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";

const ColLeftTk = memo(() => {
  const [checkTTDH, setCheckTTDH] = useState(undefined);

  const HandelerCheck = (id) => {
    if (id === checkTTDH) {
      setCheckTTDH(undefined);
    } else {
      setCheckTTDH(id);
    }
  };

  const listRadio = [
    { id: 0, text: "Chưa giao" },
    { id: 2, text: "Đang giao" },
    { id: 1, text: "Đã giao" },
  ];
  return (
    <div className={styles.wrapperLeft}>
      <h1>Tìm Kiếm</h1>
      <ul>
        {listRadio.map((item) => (
          <li key={item.id}>
            <label>{item.text}</label>
            <input
              type="checkbox"
              checked={checkTTDH === item.id}
              onChange={() => HandelerCheck(item.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
});

function InfoOder() {
  const { isLogin, infoUser } = useContext(Context);
  const [pageNumber, setPageNumber] = useState(0); // trang hiện tại đang đứng
  const [ListDon, setListDon] = useState([]);
  const ListDonTT = [...ListDon].reverse();

  const handlePageClick1 = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost/backendBanQuanAo/DonDatHang/ResfullDonDatHang.php?idKH=${infoUser.MA_KH}&ttdh=0`
      )
      .then(({ data }) => {
        setListDon(data.result);
      });
  }, []);

  const CallApiHuyDon = (idDH, idKH) => {
    const data = {
      trangThaiHuy: 1,
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    axios
      .patch(
        `http://localhost/backendBanQuanAo/DonDatHang/ResfullDonDatHang.php?idDH=${idDH}&idKH=${idKH}&ttDH=0`,
        data,
        headers
      )
      .then(({ data }) => {
        if (data.success) {
          alert("Hủy Thành Công Đơn Hàng");
        } else {
          alert("đơn hàng chưa đc hủy");
        }
        setListDon(data.result);
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  const itemsPerPage = 6;
  const pageCount = Math.ceil(ListDonTT.length / itemsPerPage); // số lượng count hiện trên dom
  const startIndex = pageNumber * itemsPerPage; //2
  const slicedData = ListDonTT.slice(startIndex, startIndex + itemsPerPage);

  //xư lý lỗi khi xóa một sản phẩm
  useEffect(() => {
    if (pageNumber !== 0) {
      setPageNumber((page) => page - 1);
    }
  }, [pageCount]);

  const ListDonCustom = slicedData;
  if (!isLogin) {
    return <Navigate to="/" />;
  } else {
    return (
      <div className={styles.wrapper}>
        <div className="grid wide">
          <div className={clsx("row", styles.CustomRow)}>
            <div className="col l-3">
              <ColLeftTk />
            </div>
            <div className="col l-9">
              <div className={clsx("row", styles.CustomRow2)}>
                {ListDonCustom.map((item) => (
                  <Fragment key={item.MA_DH}>
                    <Colitem
                      styles={styles}
                      date={item.THOI_GIAN_DAT}
                      sdt={item.SDT_NHAN_HANG}
                      email={item.EMAIL_NHAN_HANG}
                      address={item.DIA_CHI_NHAN_HANG}
                      money={item.TONG_TIEN}
                      trangThaiGh={item.TINH_TRANG_GH}
                      TrangThaiTT={item.TINH_TRANG_THANH_TOAN}
                      maDh={item.MA_DH}
                      makh={infoUser.MA_KH}
                      CallApiHuyDon={CallApiHuyDon}
                    />
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          <ReactPaginate
            previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
            nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick1}
            containerClassName={"pagination"}
            activeClassName={"active"}
            forcePage={pageNumber}
          />
          <Pagenumber pageNumber={pageCount} pageActive={pageNumber + 1} />
        </div>
      </div>
    );
  }
}

export default InfoOder;
