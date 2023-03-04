import './Load.scss';

function Load() {
    return (
      <div className="loader">
        <div className="loaderchild">
          <div className="okok">
            <div className="square"></div>
            <div className="square"></div>
            <div className="square last"></div>
            <div className="square clear"></div>
            <div className="square"></div>
            <div className="square last"></div>
            <div className="square clear"></div>
            <div className="square "></div>
            <div className="square last"></div>
          </div>
          <h1>Vui Lòng Đợi Một Chút</h1>
        </div>
      </div>
    );
}

export default Load;