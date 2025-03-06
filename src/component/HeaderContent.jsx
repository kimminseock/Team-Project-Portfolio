import './HeaderContent.css';

const HeaderContent = ({totalIncome, totalExpense}) => {
    return (
        // 수정 완
        <div className="HeaderContent">
            <div className="totalIncome">
                <span>총 수입</span>
                <p>{totalIncome.toLocaleString()}원</p>
            </div>
            <div className="totalExpense">
                <span>총 지출</span>
                <p>{totalExpense.toLocaleString()}원</p>
            </div>
        </div>
    );
}
export default HeaderContent;