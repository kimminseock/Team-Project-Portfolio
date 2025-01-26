import {Link} from "react-router-dom";
import './Write.css'

const write = () => {
    return(
        <div className="Write">
            <div className="nav-buttons">
                <Link to="/write">
                    <button className="income-button">
                            <img alt="추가 버튼" src={require('../img/icon-plus.svg').default}
                                 style={{width: '25px'}}/>
                    </button>
                </Link>
            </div>
        </div>
)
}
export default write