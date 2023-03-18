import styles from "./Home.module.scss";
import Button from "../../components/Button";
import { addCommas, truncateString } from "../../FuncTions";
import { setSecttion } from "../../Storage";

import { NoSearch } from "../../components/NoResult";
import { Context } from "../../Context";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useState, useEffect, useContext, memo } from "react";
import axios from "axios";


const Slider = memo(() => {
  console.log("render Slider");
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { id: 1, src: "img/imgBia/img3.jpg", alt: "Image 1" },
    { id: 2, src: "img/imgBia/img1.jpg", alt: "Image 2" },
    { id: 3, src: "img/imgBia/img2.jpg", alt: "Image 3" },
  ];

  const handleClickNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handleClickPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (

    <div className={styles.slider}>
      <button className={styles.prev} onClick={handleClickPrev}>
        &#10094;
      </button>
      <button className={styles.next} onClick={handleClickNext}>
        &#10095;
      </button>
      <div className={styles.vtris}>
        {images.map((item, index) => (
          <div
            key={index}
            className={`${styles.vtri} ${
              index === currentIndex ? styles.active : ""
            }`}
          ></div>
        ))}
      </div>
      <div className={styles.images}>
        {images.map((image, index) => (
          <img
            key={image.id}
            className={
              index === currentIndex
                ? styles.active
                : index > currentIndex
                ? styles.activeNext
                : styles.activePrev
            }
            src={image.src}
            alt={image.alt}
          />
        ))}
      </div>
    </div>
  );
});
function Title({ children }) {
  return (
    <div className={styles.Title}>
      <h1>{children}</h1>
    </div>
  );
}

function ProductNew() {
  const [dataProduct, setDataProduct] = useState([]);
  const [dataProductTK, setDataProductTK] = useState([]);
  const { keyword, isLogin, setMyCarts, myCarts } = useContext(Context);
  const navigate = useNavigate();
  function Search() {
    const results = dataProduct.filter((product) =>
      product.TEN_SP.replace(/\s+/g, "")
        .toLowerCase()
        .includes(keyword.replace(/\s+/g, "").toLowerCase())
    );
    setDataProductTK(results);
  }
  useEffect(() => {
    Search();
  }, [keyword]);

  useEffect(() => {
    axios
      .get("http://localhost/backendBanQuanAo/products/Get8Product.php")
      .then(({ data }) => {
        const { success, result, message } = data;
        if (success) {
          setDataProduct(result);
        } else {
          console.log("sai");
        }
      });
  }, []);

  async function AddCart(idSp) {
    try {
      const { data } = await axios.get(
        `http://localhost/backendBanQuanAo/Size/resFullSize.php?id=${idSp}`
      );
      const { success, result } = data;
      const arrproductDetail = dataProduct.filter((item) => item.MA_SP == idSp);
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
  function Prodcutnew({ src, name, price, id }) {
    return (
      <div className={styles.PoductNew}>
        <Link to={`/Product/detail/${id}`}>
          <img src={src}></img>
        </Link>
        <h1>{truncateString(name, 19)}</h1>
        <div>{price}</div>
        <Button
          width="120px"
          height="35px"
          fontSize="15px"
          onClick={() => AddCart(id)}
        >
          Thêm Vào Giỏ
        </Button>
      </div>
    );
  }

  let dataProductall = keyword.length <= 0 ? dataProduct : dataProductTK;
  return (
    <div className={styles.ProductNewWarrper}>
      <Title>Sản Phẩm Mới</Title>
      <div className={clsx("row", styles.cutstomRow)}>
        {dataProductall.map((item) => (
          <div key={item.MA_SP} className="col l-3 c-12">
            <Prodcutnew
              id={item.MA_SP}
              src={`/img/imgProduct/${item.HINH_SP}`}
              name={item.TEN_SP}
              price={addCommas(item.GIA_BAN) + "đ"}
            />
          </div>
        ))}
      </div>
      {dataProductall.length == 0 && <NoSearch>Không có kết quả !</NoSearch>}
    </div>
  );
}

function Home() {
  console.log("rendering");
  return (
    <div className={styles.wrapper}>
      <div className="grid wide">
        <div className="row ">
          <div className="col l-12 m-12 c-12">
            <Slider />
          </div>
        </div>
        <ProductNew />
      </div>
    </div>
  );
}

export default memo(Home);
