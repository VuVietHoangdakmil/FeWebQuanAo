import styles from "./Sliderbar.module.scss";


import { Link, useLocation } from "react-router-dom";
import {memo} from "react"
function Sliderbar() {
  console.log("renderSlider")
  const { pathname } = useLocation();
  const Lists = [
    { Path: "/", Content: "Trang chủ" },
    { Path: "/Allproduct", Content: "Tất cả" },
    { Path: "", Content: "Quần" },
    { Path: "/Shirt", Content: "Áo" },
    { Path: "", Content: "Giới thiệu" },
  ];

  return (
    <div className={styles.wrapper}>
      <div className="grid wide" id={styles.rowHeader}>
        <ul>
          {Lists.map((List, index) => {
            return (
              <li
                className={List.Path === pathname ? styles.active : ""}
                key={index}
              >
                <Link to={List.Path}>{List.Content}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default memo(Sliderbar);
