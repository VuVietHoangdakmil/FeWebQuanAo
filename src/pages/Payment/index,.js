import styles from "./payment.module.scss";
import { useState, useContext, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import { setSecttion } from "../../Storage";
import { Context } from "../../Context";
import Button from "../../components/Button";
import {
  addCommas,
  truncateString,
  removeVietnameseTones,
} from "../../FuncTions";
import InputG from "../../components/GloboInput";
import { Navigate, useNavigate } from "react-router";
import Messenger from "../../components/Messenger";
import Loading from "../../components/Load";
import { debounce } from "lodash";
import clsx from "clsx";
function Title({ children }) {
  return (
    <h1 className={clsx(styles.TitleClass, styles.TitleClass2)}>{children}</h1>
  );
}
function ListAdress({ dataAddress, ClickItemDiachi, setInputSearch }) {
  return (
    <ul className={styles.boxDataTinhThanh}>
      {dataAddress.map((item) => (
        <li
          onClick={() => {
            ClickItemDiachi(item.name, item.code);
            setInputSearch(false);
          }}
          key={item.code}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
function InfoPay({ ValueInput, setValueInput, IsValue, setIsValue }) {
  const T = "Tỉnh";
  const Q = "Quận";
  const P = "Phường";
  const [btnActive, setBtnActive] = useState(0);
  const [dataTinhThanh, setDataTinhThanh] = useState([]);
  const [dataQuan, setDataQuan] = useState([]);
  const [dataQuanFilter, setDataQuanFilter] = useState([]);
  const [dataPhuong, setDataPhuong] = useState([]);
  const [dataPhuongFilter, setDataPhuongFilter] = useState([]);
  const [dataOffset, setDataOffset] = useState({
    offsetWidth: "227px",
    offsetLeft: "0px",
  });
  const [HienDataDiachi, setHienDataDiachi] = useState(T);
  const [isFormDiachi, setIsFormDiachi] = useState(false);
  const [isFormTK, setIsFormTK] = useState(false);
  const [renderEff, setRenderEff] = useState(false);
  const [isInputSearch, setInputSearch] = useState(false);
  const [ValueInputSearch, setValueInputSearch] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const DomBtn = useRef({});

  const ListbtnTinhThanh = ["Tỉnh/Thành Phố", "Quận/Huyện", "Phường/Xã"];
  const DataDiaChi =
    HienDataDiachi === T
      ? dataTinhThanh
      : HienDataDiachi === Q
      ? dataQuanFilter
      : dataPhuongFilter;
  const { tinh, quan, phuong } = ValueInput.TinhThanh;
  const styleUnderline = {
    width: dataOffset.offsetWidth,
    left: dataOffset.offsetLeft,
  };

  useEffect(() => {
    if (DomBtn.current.btn0) {
      const width = DomBtn.current.btn0.offsetWidth;
      setDataOffset((p) => ({ ...p, offsetWidth: `${width}px` }));
    }
  }, [renderEff]);
  const domBoxAddress = useRef();
  useEffect(() => {
    if (tinh.trim() !== "" && quan.trim() !== "" && phuong.trim() !== "") {
      setIsValue((prevIs) => ({ ...prevIs, TinhThanh: false }));
    }
  }, [phuong]);

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then(({ data }) => {
        setDataTinhThanh(data);
      })
      .catch((err) => alert(err));
  }, []);
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/d/")
      .then(({ data }) => {
        setDataQuan(data);
      })
      .catch((err) => alert(err));
  }, []);
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/w/")
      .then(({ data }) => {
        setDataPhuong(data);
      })
      .catch((err) => alert(err));
  }, []);
  useEffect(() => {
    document.addEventListener("mousedown", HandlerClickOutside);

    return () => {
      document.removeEventListener("mousedown", HandlerClickOutside);
    };
  }, []);

  const dataDiaChiConCat = useMemo(() => {
    console.log("ko dc render cai nay nhieu lan");
    return dataPhuong.map((item) => {
      let dataQuanFilter1 = GetDataTuCapConLenCapCha(
        item.district_code,
        dataQuan
      );
      let dataTinhFilter1 = GetDataTuCapConLenCapCha(
        dataQuanFilter1.province_code,
        dataTinhThanh
      );
      return {
        dataT: { nameT: dataTinhFilter1.name, idT: dataTinhFilter1.code },
        dataQ: { nameQ: dataQuanFilter1.name, idQ: dataQuanFilter1.code },
        dataP: { nameP: item.name, idP: item.code },
        name: `${dataTinhFilter1.name} ${dataQuanFilter1.name} ${item.name}`,
      };
    });
  }, [dataPhuong]);

  const HandlerTimKiem = debounce((e) => {
    if (e.target.value.trim().length > 0) {
      setIsFormDiachi(false);
      setIsFormTK(true);
    } else {
      setIsFormDiachi(true);
      setIsFormTK(false);
    }
    const keyword = e.target.value;
    const isdataPhuongNull = IsDataSeacrhTQHnull(dataPhuong, keyword);
    const isdataQuanNull = IsDataSeacrhTQHnull(dataQuan, keyword);
    const isdataTinhNull = IsDataSeacrhTQHnull(dataTinhThanh, keyword);

    console.log("T", isdataTinhNull);
    console.log("Q", isdataQuanNull);
    console.log("H", isdataPhuongNull);

    let dataConCat = [];
    // gop huyen quan co cung
    if (!isdataPhuongNull) {
      dataConCat = dataSearchDiaChi(dataPhuong, keyword).map((item) => {
        let dataQuanFilter1 = GetDataTuCapConLenCapCha(
          item.district_code,
          dataQuan
        );
        let dataTinhFilter1 = GetDataTuCapConLenCapCha(
          dataQuanFilter1.province_code,
          dataTinhThanh
        );
        return {
          dataP: { nameP: item.name, idP: item.code },
          dataQ: { nameQ: dataQuanFilter1.name, idQ: dataQuanFilter1.code },
          dataT: { nameT: dataTinhFilter1.name, idT: dataTinhFilter1.code },
        };
      });
    } else if (!isdataQuanNull) {
      dataConCat = dataSearchDiaChi(dataQuan, keyword).map((item) => {
        let dataTinhFilter1 = GetDataTuCapConLenCapCha(
          item.province_code,
          dataTinhThanh
        );
        return {
          dataP: false,
          dataQ: { nameQ: item.name, idQ: item.code },
          dataT: { nameT: dataTinhFilter1.name, idT: dataTinhFilter1.code },
        };
      });
    } else if (!isdataTinhNull) {
      dataConCat = dataSearchDiaChi(dataTinhThanh, keyword).map((item) => {
        return {
          dataP: false,
          dataQ: false,
          dataT: { nameT: item.name, idT: item.code },
        };
      });
    } else {
      dataConCat = dataSearchDiaChi(dataDiaChiConCat, keyword);
    }

    setValueInputSearch(keyword);

    setDataSearch(dataConCat);
  }, 500);

  console.log("da ta tim kiem", dataSearch);

  const HandlerOnChange = (e) => {
    const { value, name } = e.target;

    setValueInput((prevValue) => ({ ...prevValue, [name]: value }));

    if (value.trim() == "") {
      setIsValue((prevIs) => ({
        ...prevIs,
        [name]: "Vui Lòng Không để trống",
      }));
    } else {
      setIsValue((prevIs) => ({ ...prevIs, [name]: false }));
    }
  };
  const HandlerClick = (e, index) => {
    if (index === 0) {
      setHienDataDiachi(T);
      setBtnActive(index);
      setDataOffset({
        offsetWidth: `${e.target.offsetWidth}px`,
        offsetLeft: `${e.target.offsetLeft}px`,
      });
    }
    if (index === 1 && tinh.trim() !== "") {
      setHienDataDiachi(Q);
      setBtnActive(index);
      setDataOffset({
        offsetWidth: `${e.target.offsetWidth}px`,
        offsetLeft: `${e.target.offsetLeft}px`,
      });
    }
    if (index === 2 && quan.trim() !== "") {
      setHienDataDiachi(P);
      setBtnActive(index);
      setDataOffset({
        offsetWidth: `${e.target.offsetWidth}px`,
        offsetLeft: `${e.target.offsetLeft}px`,
      });
    }
  };
  const HandlerClickOutside = (e) => {
    if (domBoxAddress.current && !domBoxAddress.current.contains(e.target)) {
      setIsFormDiachi(false);
      setInputSearch(false);
      setIsFormTK(false);
    }
  };
  function DomOffsets(btn) {
    return {
      offsetWidth: DomBtn.current[btn].offsetWidth + "px",
      offsetLeft: DomBtn.current[btn].offsetLeft + "px",
    };
  }

  const ClickItemDiachi = (name, id) => {
    if (HienDataDiachi === T) {
      if (quan.trim !== "") {
        setValueInput((prev) => ({
          ...prev,
          TinhThanh: { ...prev.TinhThanh, tinh: name, quan: "", phuong: "" },
        }));
      } else {
        setValueInput((prev) => ({
          ...prev,
          TinhThanh: { ...prev.TinhThanh, tinh: name },
        }));
      }
      console.log(DomOffsets("btn0").offsetLeft);
      setDataQuanFilter(GetQuan(id));
      setHienDataDiachi(Q);
      setBtnActive(1);
      setDataOffset({
        offsetWidth: DomOffsets("btn1").offsetWidth,
        offsetLeft: DomOffsets("btn1").offsetLeft,
      });
    } else if (HienDataDiachi === Q) {
      if (phuong !== "") {
        setValueInput((prev) => ({
          ...prev,
          TinhThanh: { ...prev.TinhThanh, phuong: "" },
        }));
      } else {
        setValueInput((prev) => ({
          ...prev,
          TinhThanh: { ...prev.TinhThanh, quan: `, ${name}` },
        }));
      }
      setDataPhuongFilter(GetPhuong(id));
      setHienDataDiachi(P);
      setBtnActive(2);
      setDataOffset({
        offsetWidth: DomOffsets("btn2").offsetWidth,
        offsetLeft: DomOffsets("btn2").offsetLeft,
      });
    } else {
      setIsFormDiachi(false);
      setValueInput((prev) => ({
        ...prev,
        TinhThanh: { ...prev.TinhThanh, phuong: `, ${name}` },
      }));
    }
  };

  function GetQuan(idProvince) {
    return dataQuan.filter((item) => item.province_code == idProvince);
  }
  function GetPhuong(id) {
    return dataPhuong.filter((item) => item.district_code == id);
  }

  function GetDataTuCapConLenCapCha(id, dataParent) {
    return dataParent.find((item) => item.code === id);
  }

  function IsDataSeacrhTQHnull(dataIsKt, keyword) {
    return !dataIsKt.some(
      (item) =>
        removeVietnameseTones(item.name)
          .replace(/\s+/g, "")
          .indexOf(removeVietnameseTones(keyword).replace(/\s+/g, "")) !== -1
    );
  }

  function ClickInputTinhThanh() {
    setIsFormDiachi(true);
    setInputSearch(true);
    setRenderEff(p=>!p);
  }

  function dataSearchDiaChi(dataSearch, keyword) {
    return dataSearch.filter((value) => {
      return (
        removeVietnameseTones(value.name)
          .replace(/\s+/g, "")
          .indexOf(removeVietnameseTones(keyword).replace(/\s+/g, "")) !== -1
      );
    });
  }
  const startSetDataOffsetStyles = debounce((btn) => {
    setDataOffset({
      offsetWidth: DomOffsets(btn).offsetWidth,
      offsetLeft: DomOffsets(btn).offsetLeft,
    });
  }, 1);
  function HandlerClikItemTK({ dataP, dataQ, dataT }) {
    setIsFormDiachi(true);
    setInputSearch(false);
    setIsFormTK(false);
    setValueInput((p) => ({
      ...p,
      TinhThanh: {
        tinh: `${dataT ? `${dataT.nameT}` : ""}`,
        quan: `${dataQ ? `, ${dataQ.nameQ}` : ""}`,
        phuong: `${dataP ? `, ${dataP.nameP}` : ""}`,
      },
    }));

    if (dataP === false && dataQ === false && dataT !== false) {
      setDataQuanFilter(GetQuan(dataT.idT));
      setHienDataDiachi(Q);
      setBtnActive(1);
      startSetDataOffsetStyles("btn1");
    } else if (dataP === false && dataQ !== false && dataT !== false) {
      setDataQuanFilter(GetQuan(dataT.idT));
      setDataPhuongFilter(GetPhuong(dataQ.idQ));
      setHienDataDiachi(P);
      setBtnActive(2);
      startSetDataOffsetStyles("btn2");
    } else {
      setDataQuanFilter(GetQuan(dataT.idT));
      setDataPhuongFilter(GetPhuong(dataQ.idQ));
      setIsFormDiachi(false);
    }
  }
  return (
    <div className={styles.InfoPay}>
      <Title>THÔNG TIN ĐƠN HÀNG</Title>
      <InputG
        placeholder="Họ Tên"
        error={IsValue.Hoten}
        value={ValueInput.Hoten}
        name={"Hoten"}
        onChange={(e) => {
          HandlerOnChange(e);
        }}
      />
      <InputG
        placeholder="Địa chỉ"
        error={IsValue.Diachi}
        value={ValueInput.Diachi}
        name={"Diachi"}
        onChange={(e) => {
          HandlerOnChange(e);
        }}
      />
      <div className={styles.boxTinhThanh} ref={domBoxAddress}>
        <InputG
          readOnly
          onClick={ClickInputTinhThanh}
          placeholder="Tỉnh thành, quận huyện, phường xã"
          error={IsValue.TinhThanh}
          value={`${tinh}${quan}${phuong}`}
          name={"TinhThanh"}
          onChange={(e) => {
            HandlerOnChange(e);
          }}
        />
        {isInputSearch && (
          <input
            onChange={(e) => {
              HandlerTimKiem(e);
            }}
            className={styles.SearchTinhThanh}
            placeholder="tim kiem"
          ></input>
        )}
        {isFormDiachi && (
          <div className={styles.boxKhuVuc}>
            <div className={styles.BtnS}>
              {ListbtnTinhThanh.map((item, index) => (
                <div
                  className={clsx(
                    { [styles.active]: index === btnActive },
                    styles.Btn
                  )}
                  key={index}
                  onClick={(e) => HandlerClick(e, index)}
                  ref={(dom) => {
                    DomBtn.current[`btn${index}`] = dom;
                  }}
                >
                  {item}
                </div>
              ))}
              <div
                style={styleUnderline}
                className={styles.underline}
                
              ></div>
            </div>

            <ListAdress
              dataAddress={DataDiaChi}
              ClickItemDiachi={ClickItemDiachi}
              setInputSearch={setInputSearch}
            />
          </div>
        )}
        {isFormTK && (
          <ul className={styles.FormTk}>
            {dataSearch.length > 0 ? (
              dataSearch.map((item, index) => (
                <li key={index} onClick={() => HandlerClikItemTK(item)}>{`${
                  item.dataT ? `${item.dataT.nameT}` : ""
                } ${item.dataQ ? `, ${item.dataQ.nameQ}` : ""}  ${
                  item.dataP ? `, ${item.dataP.nameP}` : ""
                }`}</li>
              ))
            ) : (
              <h1>Không có kết quả muốn tìm kiếm !</h1>
            )}
          </ul>
        )}
      </div>
      <InputG
        placeholder="Số điện thoại"
        error={IsValue.SDT}
        value={ValueInput.SDT}
        name={"SDT"}
        onChange={(e) => {
          HandlerOnChange(e);
        }}
      />
      <InputG
        placeholder="Email"
        error={IsValue.Email}
        value={ValueInput.Email}
        name={"Email"}
        onChange={(e) => {
          HandlerOnChange(e);
        }}
      />
      <textarea placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."></textarea>
    </div>
  );
}
function InfoBill({ SumMoney, myCarts }) {
  const [isCheck, setCheck] = useState(false);

  function ListBill() {
    return (
      <ul className={styles.ULBox}>
        {myCarts.map((item) => (
          <li key={`${item.MA_SP}${item.MA_SIZE}`}>
            <div>
              <p className={styles.ULBoxNameSp}>
                {truncateString(item.TEN_SP, 35)}{" "}
              </p>
              <p className={styles.ULBoxSl}>x-{item.SL}</p>
            </div>
            <span>{addCommas(item.Price)} đ</span>
          </li>
        ))}
      </ul>
    );
  }
  function CheckPayOnline() {
    return (
      <div className={styles.formGroup}>
        <input
          type="checkbox"
          id="checkPay"
          checked={isCheck}
          onChange={() => {
            setCheck(!isCheck);
          }}
        />
        <label htmlFor="checkPay">Thanh Toán Online</label>
      </div>
    );
  }
  return (
    <div className={styles.InfoBill}>
      <Title>ĐƠN HÀNG CỦA BẠN</Title>
      <div className={styles.Title2}>
        <span className={styles.flex1}>SẢN PHẨM</span>
        <span>TỔNG</span>
      </div>
      <ListBill />
      <div className={styles.sumMoney}>
        <p>TỔNG TIỀN</p>
        <span>{addCommas(SumMoney)}đ</span>
      </div>
      <CheckPayOnline />
      <Button width={"150px"} height="35px" fontSize={"16px"}>
        ĐẶT HÀNG
      </Button>
    </div>
  );
}
function Payment() {
  const { infoUser, myCarts, isLogin, setMyCarts } = useContext(Context);
  const [IsViewPaySuccess, setIsViewPaySuccess] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const objValue = () => ({
    Hoten: "",
    Diachi: "",
    TinhThanh: { tinh: "", quan: "", phuong: "" },
    SDT: "",
    Email: "",
  });
  const dataIsValue = () => ({
    Hoten: false,
    Diachi: false,
    TinhThanh: false,
    SDT: false,
    Email: false,
  });
  const [dataDH, setDataDH] = useState({});
  const [ValueInput, setValueInput] = useState(objValue);
  const [IsValue, setIsValue] = useState(dataIsValue);
  const ValueInputArr = Object.values(ValueInput);
  const ValueInputEntries = Object.entries(ValueInput);
  const { tinh, quan, phuong } = ValueInput.TinhThanh;
  const isValueNotNull = ValueInputArr.every((item) => {
    if (typeof item === "object" && item !== null) {
      return (
        item.tinh.trim() !== "" &&
        item.quan.trim() !== "" &&
        item.phuong.trim() !== ""
      );
    } else {
      return item.trim() !== "";
    }
  });
  const SumMoney = useMemo(() => {
    return myCarts.reduce((ltru, item) => {
      const sum = ltru + item.Price;
      return sum;
    }, 0);
  }, [myCarts]);
  useEffect(() => {
    if (Object.keys(dataDH).length > 0) {
      setValueInput((prveData) => ({
        ...prveData,
        Hoten: dataDH.TEN_KH,
        SDT: dataDH.SDT_NHAN_HANG,
        Email: dataDH.EMAIL,
      }));
    }
  }, [dataDH]);

  useEffect(() => {
    axios
      .get(
        `http://localhost/backendBanQuanAo/ThongTinNhanHang/ResfullThongTinNhanHang.php?id=${infoUser.MA_KH}`
      )
      .then(({ data }) => {
        setDataDH(data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  function PostDataDatHang() {
    const data = {
      DataGioHang: JSON.stringify(myCarts),
      Makh: infoUser.MA_KH,
      TongTien: SumMoney,
      SDT: ValueInput.SDT,
      Email: ValueInput.Email,
      Diachi: `${ValueInput.Diachi}, ${tinh}${quan}${phuong}`,
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    return axios.post(
      "http://localhost/backendBanQuanAo/DatHang/DatHang.php",
      data,
      headers
    );
  }
  function PostSendMail() {
    const data = {
      EmailNguoiNhan: ValueInput.Email,
      NameNguoiNhan: ValueInput.Hoten,
      TongTien: `${addCommas(SumMoney)} đ`,
      SDT: ValueInput.SDT,
      Diachi: `${ValueInput.Diachi}, ${tinh}${quan}${phuong}`,
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    return axios.post(
      "http://localhost/backendBanQuanAo/sendMail.php",
      data,
      headers
    );
  }
  function PostAllDatHang(PostDataDatHang, PostSendMail) {
    setIsLoad((prev) => !prev);
    axios
      .all([PostDataDatHang(), PostSendMail()])
      .then(
        axios.spread((DatHang, sendMail) => {
          if (DatHang.data.success) {
            setMyCarts([]);
            setSecttion("myCarts", []);
            setIsViewPaySuccess(true);
          } else {
            alert("Đơn hàng đặt bị lỗi");
          }
          if (!sendMail.data.success) {
            alert("không gửi được mail");
          }
          setIsLoad((prev) => !prev);
        })
      )
      .catch((error) => {
        alert(error.message);
      });
  }
  function handerlesubmit(e) {
    e.preventDefault();

    if (isValueNotNull) {
      //cho call api
      PostAllDatHang(PostDataDatHang, PostSendMail);
    }

    ValueInputEntries.forEach((item) => {
      if (typeof item[1] === "object" && item[1] !== null) {
        if (
          item[1].tinh.trim() === "" ||
          item[1].quan.trim() === "" ||
          item[1].phuong.trim() === ""
        ) {
          setIsValue((preveIsValue) => ({
            ...preveIsValue,
            [item[0]]: "Vui Lòng Không để trống",
          }));
        } else {
          setIsValue((preveIsValue) => ({
            ...preveIsValue,
            [item[0]]: false,
          }));
        }
      } else {
        if (item[1].trim() === "") {
          setIsValue((preveIsValue) => ({
            ...preveIsValue,
            [item[0]]: "Vui Lòng Không để trống",
          }));
        } else {
          setIsValue((preveIsValue) => ({
            ...preveIsValue,
            [item[0]]: false,
          }));
        }
      }
    });

    // bắt lỗi
  }
  if (!isLogin) {
    return <Navigate to="/" />;
  }
  return (
    <>
      {isLoad ? (
        <Loading />
      ) : (
        <div className={styles.warpper}>
          <div className="grid wide">
            {myCarts.length > 0 && !IsViewPaySuccess ? (
              <form
                onSubmit={handerlesubmit}
                id={styles.customok}
                className="row"
              >
                <div className="col l-7 c-12 m-7">
                  <InfoPay
                    IsValue={IsValue}
                    setIsValue={setIsValue}
                    ValueInput={ValueInput}
                    setValueInput={setValueInput}
                  />
                </div>
                <div className="col l-5 c-12 m-7">
                  <InfoBill SumMoney={SumMoney} myCarts={myCarts} />
                </div>
              </form>
            ) : (
              <Messenger>
                Bạn đã đặt hàng thành công cảm ơn bạn đã tin tưởng shop của
                chúng tôi
              </Messenger>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Payment;
