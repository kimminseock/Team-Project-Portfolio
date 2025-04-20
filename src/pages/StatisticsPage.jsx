import StatisticsExpense from "./StatisticsExpense";
import StatisticsIncome from "./StatisticsIncome";
import './StatisticsPage.css'

const StatisticsPage = ({currentPage, onPageChange, data}) => {
    return(
        // 수정 완.
        <div className="StatisticsPage">
            {/* 수입, 지출 버튼 */}
            <div className="button-wrapper">
                <button onClick={() => onPageChange("income")} className={currentPage === "income" ? "active" : ''}>
                    수입
                </button>
                <button onClick={() => onPageChange("expense")} className={currentPage === "expense" ? "active" : ''}>
                    지출
                </button>
            </div>

            {/* 현재 페이지에 따라 렌더링 */}
            {currentPage === "expense" ? <StatisticsExpense data={data}/> : <StatisticsIncome data={data}/>}
        </div>
    );
}
export default StatisticsPage;
