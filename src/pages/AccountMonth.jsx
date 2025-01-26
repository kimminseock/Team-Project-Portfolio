import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import './AccountMonth.css';

// 플러그인 적용
dayjs.extend(isoWeek); // ISO 8601 기준의 주 계산을 활성화
dayjs.extend(isBetween); // 특정 날짜가 두 날짜 사이에 있는지 확인하는 기능

const AccountMonth = ({ data }) => {
    const [expandedMonth, setExpandedMonth] = useState(null); // 월 펼침 상태

    // 현재 날짜 기준으로 해당 년도를 가져옴
    // const currentYear = dayjs().year(); // 현재 연도
    const startOfYear = dayjs().startOf('year'); // 연도 시작일
    // const endOfYear = dayjs().endOf('year');
    const currentMonth = dayjs().format('YYYY-MM'); // 현재 월

    // 1월부터 12월까지 반복하면서 각 월의 시작일과 끝일 구하기
    const months = Array.from({ length: 12 }, (_, index) => { // 12개월 데이터 생성
        // 각 월의 시작일과 끝일을 계산
        const startOfMonth = startOfYear.month(index);
        const endOfMonth = startOfMonth.endOf('month');
        return {
            month: startOfMonth.format('YYYY-MM'),
            start: startOfMonth.format('YYYY-MM-DD'),
            end: endOfMonth.format('YYYY-MM-DD'),
        };
    }).reverse(); // 12월이 가장 위로 오게 하기 위해 배열을 역순으로 정렬

    // 주별 요약 계산
    const getWeeklyData = (startDate, endDate) => {
        const weeks = [];
        // dayjs는 라이브러리, 문자열을 날짜 객체로 쉽게 변환
        let currentStartDate = dayjs(startDate);
        // 현재 시작 날짜가 종료 날짜보다 이전이면 계속해서 루프를 실행하는 조건
        // currentStartDate가 endDate보다 작을 경우에만 루프가 계속 실행
        while (currentStartDate.isBefore(endDate)) {
            // 7일 계산
            const currentEndDate = currentStartDate.add(6, 'day');
            weeks.push({
                start: currentStartDate.format('YYYY-MM-DD'),
                end: currentEndDate.format('YYYY-MM-DD'),
                key: `${currentStartDate.format('YYYY-MM-DD')} ~ ${currentEndDate.format('YYYY-MM-DD')}`,
                items: [],
            });
            // currentStartDate를 현재 종료일에 1일을 더한 값으로 갱신
            currentStartDate = currentEndDate.add(1, 'day');
        }

        return weeks;
    };

    // 시작 날짜(monthStart)와 종료 날짜(monthEnd)를 받아서, 해당 월의 주별 데이터와 수입/지출 합계를 계산하여 반환
    const getWeeklyDataForMonth = (monthStart, monthEnd) => {
        const weeklyData = getWeeklyData(monthStart, monthEnd);

        return weeklyData.map((week) => {
            const weekItems = data.filter((item) => {
                const itemDate = dayjs(item.date);
                // itemDate가 week.start와 week.end 사이에 있는지 확인
                return itemDate.isBetween(week.start, week.end, 'day', '[]');
            });
            const totalIncome = weekItems.reduce((sum, item) => sum + item.income, 0);
            const totalExpense = weekItems.reduce((sum, item) => sum + item.expense, 0);

            return {
                ...week,
                items: weekItems,
                totalIncome,
                totalExpense,
            };
        });
    };

    useEffect(() => {
        // 페이지 로드 시, 현재 월에 해당하는 항목을 자동으로 펼쳐놓기
        setExpandedMonth(currentMonth);
    }, [currentMonth]);

    return (
        <div className="AccountMonth">
            {/* 해당 년도의 월별 항목 요약 */}
            {months.map(({ month }) => {
                const monthStart = dayjs(`${month}-01`);
                const monthEnd = dayjs(`${month}-01`).endOf('month');
                const weeklyData = getWeeklyDataForMonth(monthStart, monthEnd);

                // 월별 총 수입과 지출 계산
                const totalIncomeForMonth = weeklyData.reduce((sum, week) => sum + week.totalIncome, 0);
                const totalExpenseForMonth = weeklyData.reduce((sum, week) => sum + week.totalExpense, 0);

                return (
                    <div key={month}>
                        <div
                            className="account-month-sum"
                            onClick={() => setExpandedMonth(expandedMonth === month ? null : month)}
                        >
                            <h2>{month.slice(5, 8) + '월'}</h2>
                            <span>
                                {totalIncomeForMonth.toLocaleString()}원
                            </span>
                            <span>
                                {totalExpenseForMonth.toLocaleString()}원
                            </span>
                            <p className="icon">
                                <img src={require('../img/-angle-small-down.png')} alt="펼침 아이콘"
                                     style={{width: '14px', marginLeft: '3px'}}/>
                            </p>
                            <p>{(totalIncomeForMonth - totalExpenseForMonth).toLocaleString()}원</p>
                        </div>

                        {/* 해당 월을 클릭하면 주 단위 항목만 나옵니다 */}
                        {expandedMonth === month && (
                            <div className="account-month-item-wrapper">
                                {weeklyData.map(({ key, totalIncome, totalExpense }) => (
                                    <div className="account-month-item" key={key}>
                                        <p>{key.slice(5,7) + '.' + key.slice(8,13) + key.slice(18,20) + '.' + key.slice(21,23)}</p>
                                        <p>{totalIncome.toLocaleString()}원</p>
                                        <p>{totalExpense.toLocaleString()}원</p>
                                        <p>{(totalIncome - totalExpense).toLocaleString()}원</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AccountMonth;
