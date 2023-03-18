import styles from "./Sliderbar.module.scss";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { memo, useState } from "react";
function Sliderbar() {
  const [isHiden, setIsHiden] = useState(false);
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
        <div className={clsx("row", styles.CustomRows)}>
          <div className="col c-0 l-12 m-12">
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
          <div className="col c-12 l-0 m-0">
            <FontAwesomeIcon
              icon={faBars}
              className={styles.iconBar}
              onClick={() => setIsHiden((p) => !p)}
            />
            <div
              id={styles.BarMobie}
              className={clsx({ [styles.active3]: isHiden })}
            >
              {Lists.map((List, index) => {
                return (
                  <li
                    onClick={() => setIsHiden(false)}
                    className={List.Path === pathname ? styles.active1 : ""}
                    key={index}
                  >
                    <Link to={List.Path} className={styles.LinkToA}>
                      {List.Content}
                    </Link>
                  </li>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Sliderbar);
