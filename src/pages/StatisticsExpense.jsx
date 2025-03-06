import './StatisticsExpense.css'
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import React, { useState } from "react";

const StatisticsExpense = ({data = []}) => {
    // 수정
    const [clickedData, setClickedData] = useState('');

    // 색 피그마 지정 색으로 수정
    const COLORS = ["#574BED", "#5E8AEB", "#24D0DC", "#68F5B9", "#FF7676", "#FF8DB0", "#F49713", "#F0BB1D", "#FEDD44",];

    // 같은 카테고리끼리 합산
    const exCategoryData = data.reduce((acc, item) => {
        if (!item.excategory || !item.expense || item.expense === 0) {
            return acc; // 카테고리가 없거나 expense가 0이면 무시
        }

        if (acc[item.excategory]) {
            acc[item.excategory].expense += item.expense;
        } else {
            acc[item.excategory] = { excategory: item.excategory, expense: item.expense };
        }
        return acc;
    }, {});

    // 카테고리 데이터를 배열로 변환
    let groupedData = Object.values(exCategoryData);

    groupedData = groupedData.filter(item => item.expense > 0);
    // 비율을 기준으로 내림차순 정렬
    const sortedData = [...groupedData].sort((a, b) => b.expense - a.expense);

    const totalExpense = sortedData.reduce((sum, item) => sum + item.expense, 0);

    // 수정 완
    // 클릭된 항목의 카테고리와 그 카테고리가 전체 지출에서 차지하는 비율을 상태로 저장
    const handleClick = (e) => {
        const percentage = ((e.value / totalExpense) * 100).toFixed(0);
        setClickedData({ clickedCategory: e.name, percentage });
    }

    return (
        <div className="StatisticsExpense">
            {/*<h3>월별 지출 비율</h3>*/}
            <div className="graph-wrapper">
                <PieChart width={440} height={320}>
                    <Pie
                        data={sortedData}
                        dataKey="expense"
                        nameKey="excategory"
                        cx="50%"
                        cy="50%"
                        innerRadius={84}
                        outerRadius={160}
                        // label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}o
                        onClick={handleClick}
                        isAnimationActive={false}
                    >
                        {sortedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]
                                    // entry.excategory === "기타"
                                    //     ? otherColor
                                    //     : COLORS[index % COLORS.length]
                                }
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(expense) => `${expense.toLocaleString()}원`}/>
                </PieChart>
                {!clickedData && (
                    <div className="click-data-default">
                        {sortedData
                            .filter((item, index) => index === 0) // 조건에 맞는 항목 필터링
                            .map((item, index) => (
                                <div key={index}>
                                    {/* 필터링된 항목 출력 */}
                                    <p>{item.excategory}</p>
                                    <p className="percent">{(item.expense / totalExpense * 100).toFixed(0)}%</p>
                                </div>
                            ))}
                    </div>
                )}
                {clickedData && (
                    <div className="click-data">
                        <p>{clickedData.clickedCategory}</p>
                        <p>{clickedData.percentage}%</p>
                    </div>
                )}
            </div>
            <div className="expense-list">
                <ul>
                    {sortedData.map((item, index) => (
                        <li key={index}>
                            <div>
                                <div className="color-dot"
                                     style={{backgroundColor: `${COLORS[index % COLORS.length]}`}}></div>
                                <div>
                                    <p>{item.excategory}</p>
                                    <p className="percent">{(item.expense / totalExpense * 100).toFixed(0)}%</p>
                                </div>
                            </div>
                            <p className="expense">{item.expense.toLocaleString()}원</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default StatisticsExpense;