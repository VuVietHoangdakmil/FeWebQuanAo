import { useSate, memo } from "react";

const ColLeftTk = ({styles}) => {
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
};

export default memo(ColLeftTk);
