import styles from "./InfoOder.module.scss";
import { Context } from "../../Context";
import { NoSearch } from "../../components/NoResult";

import Pagenumber from "../../components/Pagenumber";
import Colitem from "./Colitem";
import ColLeftTk from "./ColLeftTk";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState, useEffect, Fragment } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function InfoOder() {
  const KEY_KT = "noKQ";

  const { isLogin, infoUser } = useContext(Context);
  const [pageNumber, setPageNumber] = useState(0); // trang hiện tại đang đứng
  const [ListDon, setListDon] = useState([]);
  const [ListFilter, setListFilter] = useState([]);
  console.log(ListFilter);
  console.log("a");
  const ListDonTT =
    ListFilter.length > 0 && ListFilter[0] !== KEY_KT
      ? ListFilter
      : ListFilter[0] === KEY_KT
      ? []
      : [...ListDon].reverse();

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const FilterTrangThaiDon = (checkTTs) => {
    let check = false;
    const dk1 =
      (checkTTs.checkTTGiaoHang !== false || checkTTs.checkTTGiaoHang === 0) &&
      (checkTTs.checkTTthanhtoan !== false || checkTTs.checkTTthanhtoan === 0);
    const dk2 =
      checkTTs.checkTTGiaoHang !== false || checkTTs.checkTTGiaoHang === 0;
    const dk3 =
      checkTTs.checkTTthanhtoan !== false || checkTTs.checkTTthanhtoan === 0;

    const ListFilter = ListDon.filter((item) => {
      switch (true) {
        case dk1:
          check = true;
          return (
            parseInt(item.TINH_TRANG_GH) === checkTTs.checkTTGiaoHang &&
            parseInt(item.TINH_TRANG_THANH_TOAN) === checkTTs.checkTTthanhtoan
          );
        case dk2:
          check = true;
          return parseInt(item.TINH_TRANG_GH) === checkTTs.checkTTGiaoHang;
        case dk3:
          check = true;
          return (
            parseInt(item.TINH_TRANG_THANH_TOAN) === checkTTs.checkTTthanhtoan
          );
        default:
          return false;
      }
    });

    if (check) {
      if (ListFilter.length === 0) {
        setListFilter([KEY_KT]);
      } else {
        setListFilter(ListFilter);
      }
    } else {
      setListFilter(ListFilter);
    }
    setPageNumber(0);
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

  // paginate
  const itemsPerPage = 6;
  const pageCount = Math.ceil(ListDonTT.length / itemsPerPage); // số lượng count hiện trên dom
  const startIndex = pageNumber * itemsPerPage; //2
  const slicedData = ListDonTT.slice(startIndex, startIndex + itemsPerPage);
  // paginate end

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
            <div className="col l-3 m-3 c-12">
              <ColLeftTk
                styles={styles}
                FilterTrangThaiDon={FilterTrangThaiDon}
              />
            </div>
            <div className="col l-9 m-9 c-12">
              <div className={clsx("row", styles.CustomRow2)}>
                {ListDonCustom.length <= 0 ? (
                  <NoSearch>Không có kết quả !</NoSearch>
                ) : (
                  ListDonCustom.map((item) => (
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
                        setListDon={setListDon}
                      />
                    </Fragment>
                  ))
                )}
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
            onPageChange={handlePageClick}
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
