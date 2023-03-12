import styles from "./Allproduct.module.scss";
import Product from "../../components/Product";
import { Context } from "../../Context";
import { NoSearch } from "../../components/NoResult";
import Pagenumber from "../../components/Pagenumber";
import { setSecttion } from "../../Storage";

import { useNavigate } from "react-router-dom";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useState, useEffect, useContext,memo} from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";

function Allproduct() {
  const navigate = useNavigate();
  const [proDuctAll, setProDuctAll] = useState([]);
  const [searchProduct, setSearchProduct] = useState([]);
  const { keyword, myCarts, setMyCarts } = useContext(Context);
  const [pageNumber, setPageNumber] = useState(0); // trang hiện tại đang đứng

  const itemsPerPage = 8; // số lượng tối đa hiển thị trên 1 trang
  let dataProduct = keyword.length <= 0 ? proDuctAll : searchProduct;

  const Search = (SearchData) => {
    const dataSearch = SearchData.filter((item) =>
      item.TEN_SP.replace(/\s+/g, "")
        .toLowerCase()
        .includes(keyword.replace(/\s+/g, "").toLowerCase())
    );
    setSearchProduct(dataSearch);
    setPageNumber(0);
  };

  const pageCount = Math.ceil(dataProduct.length / itemsPerPage); // số lượng count hiện trên dom
  const startIndex = pageNumber * itemsPerPage; //2
  const slicedData = dataProduct.slice(startIndex, startIndex + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    Search(proDuctAll);
  }, [keyword]);

  useEffect(() => {
    axios
      .get("http://localhost/backendBanQuanAo/products/ResfullProduct.php")
      .then(({ data }) => {
        const { success, result, message } = data;
        if (success) {
          setProDuctAll(result);
        } else {
          console.log("sai");
        }
      })
      .catch((error) => {
        console.log("error: " + error);
      });
  }, []);

  async function AddCart(idSp) {
    try {
      const { data } = await axios.get(
        `http://localhost/backendBanQuanAo/Size/resFullSize.php?id=${idSp}`
      );
      const { success, result } = data;
      const arrproductDetail = proDuctAll.filter((item) => item.MA_SP == idSp);
      const productDetail = { ...arrproductDetail[0] };
      console.log(productDetail);
      if (success) {
        console.log(myCarts);
        const CheckMatchSp = myCarts.some(
          (item) => item.MA_SIZE == result[0].MA_SIZE && item.MA_SP == idSp
        );
        console.log(CheckMatchSp); // true là them sl false là thêm mới
        let newCarts = [];
        setMyCarts((prevMyCarts) => {
          if (CheckMatchSp) {
            const copyeMyCarts1 = [...prevMyCarts];
            copyeMyCarts1.forEach((element) => {
              if (
                element.MA_SP === idSp &&
                element.MA_SIZE === result[0].MA_SIZE
              ) {
                element.SL = element.SL + 1;
                element.Price = element.SL * parseInt(element.GIA_BAN);
                console.log("true");
              }
            });
            newCarts = [...copyeMyCarts1];
            console.log(copyeMyCarts1);
          } else {
            // add dữ liệu
            const newProductDetail = { ...productDetail };
            newProductDetail.MA_SIZE = result[0].MA_SIZE;
            newProductDetail.TEN_SIZE = result[0].TEN_SIZE;
            newProductDetail.SL = 1;
            newProductDetail.Price = 1 * parseInt(productDetail.GIA_BAN);
            //
            newCarts = [...myCarts, newProductDetail];
          }
          //save data session
          setSecttion("myCarts", newCarts);
          return newCarts;
        });
      } else {
        console.log("khong co data");
      }
    } catch (error) {
      console.log("loi roi ", error);
    }
  }
  return (
    <div className={styles.wrapper}>
      <div className="grid wide">
        <h1 className={styles.title}>Tất cả sản phẩm</h1>
        <div className={clsx("row", styles.cusTomRow)}>
          {slicedData.map((item) => (
            <div className="col l-3" key={item.MA_SP}>
              <Product
                herf={`/Product/detail/${item.MA_SP}`}
                src={`/img/imgProduct/${item.HINH_SP}`}
                name={item.TEN_SP}
                price={item.GIA_BAN}
                onClick={() => {
                  AddCart(item.MA_SP);
                }}
              />
            </div>
          ))}
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
        />
        <Pagenumber pageNumber={pageCount} pageActive={pageNumber + 1} />

        {slicedData.length <= 0 && (
          <NoSearch>Không có kết quả cần tìm kiếm</NoSearch>
        )}
      </div>
    </div>
  );
}

export default Allproduct;
