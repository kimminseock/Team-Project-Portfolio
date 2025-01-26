import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import './AccountDaily.css'

const AccountDaily = ({data, currentMonth, currentYear}) => {
    const [isTooltip, setIsTooltip] = useState(false);
    const [isTooltipModal, setIsTooltipModal] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // 처음 방문 시 설명 창 1초간 표시
        if (isTooltipModal) {
            setIsTooltip(true); // 설명 창 표시
            const timer = setTimeout(() => {
                setIsTooltip(false); // 1초 후 숨김
                setIsTooltipModal(false); // 처음 방문 처리 완료
            }, 1000);

            return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
        }
    }, [isTooltipModal]);

    // 설명 창 표시 함수
    const showTooltip = () => {
        if (!isTooltipModal) {
            setIsTooltip(true);
        }
    };

    // 설명 창 숨김 함수
    const hideTooltip = () => {
        setIsTooltip(false);
    };
    // 날짜별로 데이터 그룹화
    // data.reduce를 사용해 data 배열을 날짜별로 그룹화
    const groupedData = data.reduce((acc, item) => { // acc는 groupedData 객체로, 각 날짜별로 관련된 데이터를 배열로 묶어 저장
        if (!acc[item.date]) { // item.date가 acc 객체에 없으면 빈 배열을 만들어 해당 날짜의 항목에 추가
            acc[item.date] = [];
        }
        acc[item.date].push(item); // 이미 존재 한다면 해당 날짜에 항목을 추가
        return acc;
    }, {});

    const handleItemClick = (item) => {
        navigate('/edit', { state: { item } }); // 이벤트 객체 대신 순수한 데이터 전달
    };
    // 현재 연도와 월과 비교하여 필터링
    const filteredDates = Object.keys(groupedData).filter((date) => {
        const [year, month] = date.split("-"); // 'YYYY-MM-DD' 형식에서 년도와 월 분리
        return parseInt(year, 10) === currentYear && parseInt(month, 10) === currentMonth;
    });
    // 필터링된 날짜 정렬
    const sortedDates = filteredDates.sort((a, b) => new Date(b) - new Date(a));

    // 필터링된 날짜 정렬의 길이가 0이라면 => 항목이 없다면
    if (sortedDates.length === 0) {
        return (
            <div className="empty-data-wrapper">
                <div className="empty-data">
                    <img src={require('../img/box.svg').default} alt="search" style={{ width: '65px' }} />
                    <p>현재 월에 데이터가 없습니다.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="AccountDaily">
            {/*<button className="clear-all-button" onClick={onClearAllData}>모두 삭제</button>*/}

            {sortedDates.map((date) => { // 정렬된 날짜별로 데이터를 랜더링
                const items = groupedData[date]; // items는 해당 날짜에 해당하는 모든 거래 항목
                const totalIncome = items.reduce((sum, item) => sum + item.income, 0); // 해당 날짜의 총 수입
                const totalExpense = items.reduce((sum, item) => sum + item.expense, 0); // 해당 날짜의 총 지출
                const balance = totalIncome - totalExpense; // 해당 날짜의 합계(잔액)

                // 해당날짜의 요일
                function getDayOfWeek(date) {
                    const week = ['일', '월', '화', '수', '목', '금', '토'];
                    const dayOfWeek = week[new Date(date).getDay()];
                    return dayOfWeek;
                }

                return (
                    <div
                        key={date} className="data-daily">
                        <div className="data-daily-sum">
                            <h3>
                                {date.slice(5, 7) + "월 " + (date.slice(8, 10) >= 10 ? date.slice(8, 10) + "일" : date.slice(9, 10) + "일")}
                                <span>{getDayOfWeek(date)}</span>
                            </h3>
                            <p>
                                <span>{"+" + totalIncome.toLocaleString()}</span>원
                            </p>
                            <p>
                                <span>{"-" + totalExpense.toLocaleString()}</span>원
                            </p>
                        </div>
                        <div className="data-daily-item-container">
                            {items.map((item, index) => (
                                <div key={index}>
                                    <div className="data-daily-item" onClick={() => handleItemClick(item)}>
                                        <p className="icon">
                                            {item.excategory ?
                                                (<img src={require(`../img/${
                                                    item.excategory === '식비' ? 'food' :
                                                        item.excategory === '교통/차량' ? 'traffic' :
                                                            item.excategory === '취미/여가' ? 'hobby' :
                                                                item.excategory === '패션/미용' ? 'fashion' :
                                                                    item.excategory === '생활/편의' ? 'convenience' :
                                                                        item.excategory === '주거/통신' ? 'house' :
                                                                            item.excategory === '건강' ? 'health' :
                                                                                item.excategory === '교육' ? 'education' :
                                                                                    item.excategory === '경조사/회비' ? 'event' : 'etc'
                                                }.png`)} alt="카테고리 아이콘"/>) :
                                                (<img src={require(`../img/${
                                                    (item.incategory === '급여' ? 'salary' :
                                                        item.incategory === '용돈' ? 'pin-money' :
                                                            item.incategory === '상여금/성과급' ? 'bonus' :
                                                                item.incategory === '금융소득' ? 'financial-income' : 'etc')
                                                }.png`)} alt="카테고리 아이콘"/>)
                                            }

                                        </p>
                                        <div className="data-daily-item-info">
                                            <div>
                                                <p>{item.incategory || item.excategory}</p>
                                                <div className="divider"></div>
                                                <p>{item.memo}</p>
                                                <p className={`transaction-amount ${item.income > 0 ? '' : 'expense'}`}>
                                                    {item.income > 0 ? '+' : '-'}
                                                    {item.income > 0 ? item.income.toLocaleString() : item.expense.toLocaleString()}원
                                                </p>
                                            </div>
                                            <p>{item.cash}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

        </div>
    )
}
export default AccountDaily