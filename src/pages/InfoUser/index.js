import styles from "./InfoUser.module.scss";
import Button from "../../components/Button";
import Input from "../../components/GloboInput";
import { isURL } from "../../FuncTions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Context } from "../../Context";
import { useContext, useRef, useEffect } from "react";
import { setSecttion } from "../../Storage";
import clsx from "clsx";
import axios from "axios";

const TextInforUser = ({
  sdt,
  avaTar,
  Name,
  HanderLeOnChangeFile,
  UploadFile,
}) => {
  const [isFormUpdate, setFormUpdate] = useState(false);
  const domFormUpdate = useRef();
  const domEdit = useRef();
  let img;

  useEffect(() => {
    document.addEventListener("click", handelerRomveFrom);
    return () => {
      document.removeEventListener("click", handelerRomveFrom);
    };
  }, []);

  const handelerRomveFrom = (e) => {
    if (
      domFormUpdate.current &&
      !domFormUpdate.current.contains(e.target) &&
      !domEdit.current.contains(e.target)
    ) {
      setFormUpdate(false);
    }
  };
  const ClickActiveFormUpLoad = () => {
    setFormUpdate(true);
  };
  if (isURL(avaTar)) {
    img = avaTar;
  } else {
    img = `../../img/AvatarDefault/${avaTar}`;
  }
  return (
    <div className={styles.InfoUser}>
      <FontAwesomeIcon
        ref={domEdit}
        className={styles.EditImg}
        icon={faEdit}
        onClick={ClickActiveFormUpLoad}
      />
      <img src={img} />
      <div className={styles.InfoUserChildren}>
        <p className={styles.NameUser}>{Name}</p>
        <p className={styles.PhoneNumberUser}>{sdt}</p>
      </div>

      {isFormUpdate && (
        <div
          ref={domFormUpdate}
          className={clsx(styles.EditFile, {
            [styles.active]: !isFormUpdate,
          })}
        >
          <div className={styles.wrap}>
            <div className={styles.fileUpload}>
              <input type="file" onChange={(e) => HanderLeOnChangeFile(e)} />
              <FontAwesomeIcon icon={faUpload} className={styles.iconUpLoad} />
            </div>
          </div>
          <Button
            width="100px"
            fontSize="13px"
            height="40px"
            onClick={UploadFile}
          >
            Cập Nhật File
          </Button>
        </div>
      )}
    </div>
  );
};
const UpdateUser = ({ HanderLeOnChange, Value }) => {
  return (
    <>
      <div className={clsx("row", styles.customrow)}>
        <div className="col l-6">
          <div className={styles.formGroup}>
            <Input
              value={Value.name}
              label="Họ Tên"
              placeholder="Nhập Họ Tên"
              name="name"
              id="name"
              onChange={(e) => {
                HanderLeOnChange(e);
              }}
            />
          </div>
        </div>
        <div className="col l-6">
          <div className={styles.formGroup}>
            <Input
              value={Value.sdtUser}
              label="Số Điện Thoại"
              placeholder="Nhập Số Điện Thoại"
              name="sdtUser"
              id="sdtUser"
              onChange={(e) => {
                HanderLeOnChange(e);
              }}
            />
          </div>
        </div>
      </div>
      <div className={clsx("row", styles.customrow)}>
        <div className="col l-6">
          <div className={styles.formGroup}>
            <Input
              value={Value.EmailUser}
              label="Email"
              placeholder="Nhập Số Email"
              name="EmailUser"
              id="EmailUser"
              onChange={(e) => {
                HanderLeOnChange(e);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

function InfoUser() {
  const { infoUser, setInfoUser } = useContext(Context);
  const { EMAIL, HINH_DAI_DIEN, MA_KH, SDT, TEN_KH } = infoUser;
  const [file, setFile] = useState(null);
  const [Value, setValue] = useState({
    name: TEN_KH,
    sdtUser: SDT,
    EmailUser: EMAIL,
  });
  console.log(Value);
  const HanderLeOnChange = (e) => {
    const { name, value } = e.target;
    setValue((p) => ({ ...p, [name]: value }));
  };
  const HanderLeOnChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const UploadFile = () => {
    console.log(file);
    const formData = new FormData();
    formData.append("fileToUpload", file);
    formData.append("id", MA_KH);
    if (file) {
      if (file.size < 10000000) {
        const headers = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        axios
          .post(
            "http://localhost/backendBanQuanAo/updateFileImg/updateFile.php",
            formData,
            headers
          )
          .then(({ data }) => {
            console.log(data);
            if (data.success) {
              setInfoUser((p) => {
                const UserNew = { ...p, HINH_DAI_DIEN: file.name };
                setSecttion("infoUser", UserNew);
                setFile(null);
                return UserNew;
              });
              alert("Cập Nhật ảnh đại diện thành công");
            } else {
              if (data.message === undefined) {
                alert(`Không đúng định dạng hình ảnh`);
              } else {
                alert(`${data.message}`);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        alert("kích thước tập tin quá lớn");
      }
    } else {
      alert("Bạn chưa chọn hình ảnh");
    }
  };
  const UploadUser = () => {
    const data = {
      name: Value.name,
      sdt: Value.sdtUser,
      email: Value.EmailUser,
    };
    const header = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    axios
      .put(
        `http://localhost/backendBanQuanAo/KhachHang/RestFullKhachHang.php?id=${MA_KH}`,
        data,
        header
      )
      .then(({ data }) => {
        const { result } = data;
        if (data.success) {
          setInfoUser((p) => {
            const newdata = {
              ...p,
              EMAIL: result.email,
              SDT: result.sdt,
              TEN_KH: result.name,
            };
            setSecttion("infoUser", newdata);
            return newdata;
          });

          alert("cập nhật thông tin thành công");
        } else {
          alert("cập nhật thông tin thất bại");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={clsx("grid", "wide")}>
        <TextInforUser
          UploadFile={UploadFile}
          HanderLeOnChangeFile={HanderLeOnChangeFile}
          sdt={SDT}
          avaTar={HINH_DAI_DIEN}
          Name={TEN_KH}
        />
        <UpdateUser
          HanderLeOnChange={HanderLeOnChange}
          HanderLeOnChangeFile={HanderLeOnChangeFile}
          Value={Value}
        />
        <Button
          width="200px"
          fontSize="18px"
          height="40px"
          onClick={UploadUser}
        >
          Cập Nhật Thông Tin
        </Button>
      </div>
    </div>
  );
}

export default InfoUser;
