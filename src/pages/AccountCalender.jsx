
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import './AccountCalender.css'

const AccountCalender = ({data, currentDate}) => {

    // 현재 월의 시작일과 종료일 계산
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);

    // 해당 월의 모든 날짜 가져오기
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    // 날짜별 데이터를 매핑
    // 데이터를 날짜별로 정리하여 dateMap이라는 객체
    const dateMap = data.reduce((acc, item) => {
        const {date, income, expense} = item;
        // acc는 합산 객체
        if(!acc[date]){
            acc[date] = {income: 0, expense: 0 };
        }
        acc[date].income += income;
        acc[date].expense += expense;

        return acc;
    }, {});

    // 첫 번째 요일을 맞추기 위해 빈 칸 추가
    const emptyCells = Array.from({ length: getDay(startDate) });
    return (
        <div className="AccountCalender">
            {/* 요일 표시 */}
            <div className="calendar-day-container">
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <div key={day} className="calendar-day">{day}</div>
                ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="calendar-body">
                {/* 빈 셀 렌더링 */}
                {emptyCells.map((_, index) => (
                    <div key={index} className="calendar-cell"></div>
                ))}

                {/* 날짜 셀 렌더링 */}
                {daysInMonth.map((day) => {
                    const formattedDate = format(day, "yyyy-MM-dd");
                    const {income = 0, expense = 0} = dateMap[formattedDate] || {};
                    const currentDate = new Date();
                    const currentDay = currentDate.getDate();

                    // data에 해당 날짜가 없으면 빈 셀로 표시
                    return (
                        <div key={formattedDate} className="calendar-cell">
                            <div className={`calendar-date ${currentDay === day.getDate() ? 'span' : ''}`}>{day.getDate()}</div>
                            {/* data에 해당 날짜가 있으면 수입/지출 정보 표시 */}
                            {income || expense ? (
                                <div className={'money'}>
                                    <div className="calendar-income">+{income}</div>
                                    <div className="calendar-expense">-{expense}</div>
                                    <div className="calendar-sum">{income - expense}</div>
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default AccountCalender;