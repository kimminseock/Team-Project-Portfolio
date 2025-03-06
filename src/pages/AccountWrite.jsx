import WriteExpense from "./WriteExpense";
import WriteIncome from "./WriteIncome";
import {useNavigate} from "react-router-dom";
import './AccountWrite.css'

const AccountWrite = ({ currentPage, onPageChange, addData}) => {
    const navigate = useNavigate();
    // 수정본 새로 생긴 코드 뒤로가기 버튼 코드.
    const goback = () => {
        navigate(-1)
    }
    return (
        <div className="AccountWrite">
            <div className="title">
                <button onClick={goback} className="go-back-button">
                    <img src={require('../img/arrow-small-left.png')} alt="뒤로가기 아이콘"
                         style={{width: '30px'}}/>
                </button>
                <h2>새로운 항목 추가</h2>
            </div>
            {/* 수입, 지출 버튼 */}
            <div className="button-wrapper">
                <button onClick={() => onPageChange("income")} className={currentPage === "income" ? "active" : ''}>
                    수입
                </button>
                <button onClick={() => onPageChange("expense")} className={currentPage === "expense" ? "active" : ''}>
                    지출
                </button>
            </div>
            <div className="content">
                {/* 현재 페이지에 따라 렌더링 */}
                {currentPage === "expense" ? <WriteExpense addData={addData}/> : <WriteIncome addData={addData}/>}
            </div>
        </div>
    );
}
export default AccountWrite;