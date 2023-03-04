import styles from "./productDetail.module.scss";
import { addCommas } from "../../FuncTions";
import Button from "../../components/Button";
import { getSecttion, setSecttion } from "../../Storage";

import { Context } from "../../Context";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import clsx from "clsx";
function ImgProduct({ src }) {
  return (
    <div className={styles.ImgProduct}>
      <img src={`/img/imgProduct/${src}`} />
    </div>
  );
}

function Action({ data }) {
  const navigate = useNavigate();
  const { isLogin, setMyCarts, myCarts } = useContext(Context);
  const [SL, setSL] = useState(1);
  const { productDetail, valueRadio } = data;

  console.log("mycart", myCarts);
  function ListSize() {
    function hanlerOnchange(idSize, nameSize) {
      data.setValueRadio({ idSize, nameSize });
    }

    return (
      <div className={styles.ListSize}>
        {data.dataSize.map((item, index) => {
          return (
            <div className={styles.blockSize} key={index}>
              <label
                className={clsx({
                  [styles.activeLabel]: data.valueRadio.idSize == item.MA_SIZE,
                })}
                style={{ marginLeft: index === 0 ? "0px" : "" }}
                htmlFor={`id${item.MA_SIZE}`}
              >
                {item.TEN_SIZE}
              </label>
              <input
                id={`id${item.MA_SIZE}`}
                onChange={() => {
                  hanlerOnchange(item.MA_SIZE, item.TEN_SIZE);
                }}
                type="radio"
                checked={data.valueRadio.idSize == item.MA_SIZE}
                value={item.MA_SIZE}
              />
            </div>
          );
        })}
      </div>
    );
  }

  function HandleSubmit(e) {
    e.preventDefault();

    const CheckMatchSp = myCarts.some(
      (item) =>
        item.MA_SIZE === valueRadio.idSize && item.MA_SP === productDetail.MA_SP
    );
    console.log(CheckMatchSp); // true là them sl false là thêm mới
    let newCarts = [];
    setMyCarts((prevMyCarts) => {
      if (CheckMatchSp) {
        const copyeMyCarts1 = [...prevMyCarts];
        copyeMyCarts1.forEach((element) => {
          if (
            element.MA_SP == productDetail.MA_SP &&
            element.MA_SIZE == valueRadio.idSize
          ) {
            element.SL = element.SL + SL;
            element.Price = element.SL * parseInt(element.GIA_BAN);
          }
        });
        newCarts = [...copyeMyCarts1];
      } else {
        // add dữ liệu
        const newProductDetail = { ...productDetail };
        newProductDetail.MA_SIZE = valueRadio.idSize;
        newProductDetail.TEN_SIZE = valueRadio.nameSize;
        newProductDetail.SL = SL;
        newProductDetail.Price = SL * parseInt(productDetail.GIA_BAN);
        //
        newCarts = [...myCarts, newProductDetail];
      }
      //save data session
      setSecttion("myCarts", newCarts);
      return newCarts;
    });
  }
  function Tang() {
    setSL((SL) => SL + 1);
  }
  function Giam() {
    setSL((SL) => {
      if (SL == 1) {
        return 1;
      }
      return SL - 1;
    });
  }
  function handlerOnchange(e) {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setSL(value);
    }
  }
  return (
    <form onSubmit={HandleSubmit} className={styles.Action}>
      <Link> Trang chủ</Link>
      <div className={styles.nameProduct}>{productDetail.TEN_SP}</div>
      <ListSize />
      <div className={styles.price}>{addCommas(productDetail.GIA_BAN)} đ</div>
      <div className={styles.Click}>
        <div className={styles.actionSL}>
          <div className={styles.tru} onClick={Giam}>
            -
          </div>
          <input
            type="text"
            value={SL}
            onChange={(e) => {
              handlerOnchange(e);
            }}
          />
          <div className={styles.cong} onClick={Tang}>
            +
          </div>
        </div>
        <Button width="170px" height="40px" fontSize="20px">
          Thêm Vào giỏ
        </Button>
      </div>
    </form>
  );
}
function ProductDetail() {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState({});
  const [dataSize, setDataSize] = useState([]);

  const [valueRadio, setValueRadio] = useState();

  if (dataSize.length > 0 && valueRadio === undefined) {
    setValueRadio({
      idSize: dataSize[0].MA_SIZE,
      nameSize: dataSize[0].TEN_SIZE,
    });
  }

  useEffect(() => {
    axios
      .get(`http://localhost/backendBanQuanAo/Size/resFullSize.php?id=${id}`)
      .then(({ data }) => {
        setDataSize(data.result);
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    axios
      .get(
        `http://localhost/backendBanQuanAo/products/ResfullProduct.php?id=${id}`
      )
      .then(({ data }) => {
        setProductDetail(data.result);
      })
      .catch((err) => {
        console.log("Loi catch", err);
      });
  }, []);

  const data = { dataSize, valueRadio, setValueRadio, productDetail };
  return (
    <div className={styles.wrapper}>
      <div className="grid wide">
        <div className="row">
          <div className="col l-6">
            <ImgProduct src={productDetail.HINH_SP} />
          </div>
          <div className="col l-6">
            <Action data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
