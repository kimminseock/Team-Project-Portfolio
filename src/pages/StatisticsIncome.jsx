import './StatisticsIncome.css'
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import React, { useState } from "react";

const StatisticsIncome = ({data = []}) => {
    // 수정
    const [clickedData, setClickedData] = useState('');

    // 색 피그마 지정 색으로 수정
    const COLORS = ["#574BED", "#5E8AEB", "#24D0DC", "#FB709B","#F49713", "#F0BB1D", "#FEDD44"];
    // const otherColor = "#E4E8EB";

    // 같은 카테고리끼리 합산
    // reduce는 배열을 순회하면서 하나의 값을 도출
    const inCategoryData = data.reduce((acc, item) => {
        if (!item.incategory || !item.income || item.income === 0) {
            return acc; // 카테고리가 없거나 expense가 0이면 무시
        }

        if (acc[item.incategory]) {
            acc[item.incategory].income += item.income;
        } else {
            acc[item.incategory] = { incategory: item.incategory, income: item.income };
        }
        return acc;
    }, {});

    // 카테고리 데이터를 배열로 변환
    let groupedData = Object.values(inCategoryData);

    groupedData = groupedData.filter(item => item.income > 0);
    // 비율을 기준으로 내림차순 정렬
    const sortedData = [...groupedData].sort((a, b) => b.income - a.income);
    const totalIncome = sortedData.reduce((sum, item) => sum + item.income, 0);

    // 수정
    // 클릭된 항목의 카테고리와 그 카테고리가 전체 수입에서 차지하는 비율을 상태로 저장
    const handleClick = (e) => {
        const percentage = ((e.value / totalIncome) * 100).toFixed(0);
        setClickedData({ clickedCategory: e.name, percentage });
    }

    return (
        <div className="StatisticsIncome">
            <div className="graph-wrapper">
                <PieChart width={440} height={320}>
                    <Pie
                        data={sortedData}
                        dataKey="income"
                        nameKey="incategory"
                        cx="50%"
                        cy="50%"
                        innerRadius={84}
                        outerRadius={160}
                        onClick={handleClick}
                        isAnimationActive={false}
                    >
                        {sortedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]
                                }
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(income) => `${income.toLocaleString()}원`}/>
                </PieChart>
                {!clickedData && (
                    <div className="click-data-default">
                        {sortedData
                            .filter((item, index) => index === 0) // 조건에 맞는 항목 필터링
                            .map((item, index) => (
                                <div key={index}>
                                    {/* 필터링된 항목 출력 */}
                                    <p>{item.incategory}</p>
                                    <p className="percent">{(item.income / totalIncome * 100).toFixed(0)}%</p>
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
            <div className="income-list">
                <ul>
                    {sortedData.map((item, index) => (
                        <li key={index}>
                            <div>
                                <div className="color-dot"
                                     style={{backgroundColor: `${COLORS[index % COLORS.length]}`}}></div>
                                <div>
                                    <p>{item.incategory}</p>
                                    <p className="percent">{(item.income / totalIncome * 100).toFixed(0)}%</p>
                                </div>
                            </div>
                            <p className="income">{item.income.toLocaleString()}원</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default StatisticsIncome;