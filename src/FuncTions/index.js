import { setSecttion } from "../Storage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const addCommas = (value) => {
  const stringFormat = `${value}`;
  const x = stringFormat.split(".");
  let x1 = x[0];
  const x2 = x.length > 1 ? `.${x[1]}` : "";
  const regex = /(\d+)(\d{3})/;
  while (regex.test(x1)) {
    x1 = x1.replace(regex, "$1,$2");
  }
  return x1 + x2;
};
const truncateString = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  } else {
    return str;
  }
};

export { addCommas, truncateString};
