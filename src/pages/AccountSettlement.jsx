import React, { useState } from "react";
import './AccountSettlement.css'

const AccountSettlement = ({ data, targetBudget, updateTargetBudget }) => {
    const [isEditing, setIsEditing] = useState(false); // 작성 모드 상태
    const [editedBudget, setEditedBudget] = useState(targetBudget);

    // 예결산 카테고리들을 정의
    const budgetCategories = ["식비", '교통|차량', '취미|여가', '패션|미용', '생활|편의', '주거|통신', '건강', '교육', '경조사|회비', '기타'];
    // 예결산 카테고리들이 포함된 값만 필터링
    // 필터링으로 존재하는 값만 categories 배열에 추가
    const categories = budgetCategories.filter((category) => targetBudget.hasOwnProperty(category));

    // 카테고리별로 지출 합계를 계산
    const expensesByCategory = categories.reduce((acc, category) => {
        const totalExpense = data
            // excategory 항목이 현재 category와 일치하는 항목을 필터링
            // | 문자를 /로 바꿔서 비교
            .filter((item) => item.excategory === category.replace('|', '/'))
            // 필터링된 항목들 expense 값을 합산
            .reduce((sum, item) => sum + item.expense, 0);
        // 이 값을 acc 객체에 저장
        acc[category] = totalExpense;
        return acc;

    }, {});

    // 예결산을 수정할 때 호출되는 함수
    const handleBudgetChange = (excategory, newBudget) => {
        updateTargetBudget(excategory, Number(newBudget));
    };

    const calculateProgress = (expense, budget) => {
        if (budget === 0) return 0; // 목표 금액이 0인 경우
        return Math.min((expense / budget) * 100, 100); // 최대 100%로 제한
    };

    // 목표 금액과 지출이 0원 이상인 카테고리만 필터링
    // 수정본 코드 추가 - 2024-12-10
    const filteredCategories = categories.filter(
        (category) => targetBudget[category] > 0
    );

    // goback 추가
    const saveChanges = () => {
        // 수정 코드
        setEditedBudget(targetBudget); // 초기값으로 되돌리기
        setIsEditing(false); // 작성 모드 종료
    };
    const cancelChanges = () => {
        Object.keys(editedBudget).forEach((category) => {
            // editedBudget 값이 저장된 상태를 updateTargetBudget에 반영
            updateTargetBudget(category, editedBudget[category]);
        });
        setIsEditing(false); // 작성 모드 종료
    };

    return (
        <div className="AccountSettlement">
            {isEditing ? (
                <div className="account-settlement-edit">
                    <h2>카테고리별 예산 작성</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>카테고리</th>
                            <th>목표 금액</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category) => (
                            <tr key={category}>
                                <td>{category.replace('|', '/')}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={targetBudget[category]}
                                        onChange={(e) =>
                                            handleBudgetChange(category, e.target.value)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button onClick={cancelChanges}>취소</button>
                    <button onClick={saveChanges}>완료</button>
                </div>
            ) : (
                <div className="account-settlement-page">
                <h2>
                        <img src={require('../img/settlement-book.png')} alt="정산 아이콘" style={{width: '25px'}}/>정산
                    </h2>
                    <div className="account-settlement-info">
                        <h3>총 예산 </h3>
                        <p>{Object.values(targetBudget).reduce((sum, budget) => sum + budget, 0).toLocaleString()}원</p>
                        <button onClick={() => setIsEditing(true)}>작성</button>
                    </div>
                    <table>
                        {filteredCategories.map((category) => {
                            const expense = expensesByCategory[category] || 0;
                            const budget = targetBudget[category];
                            const progress = calculateProgress(expense, budget);

                            return (
                                <tbody key={category}>
                                    <tr>
                                        <td>{category.replace('|', '/')}</td>
                                        <td>{budget.toLocaleString()}원</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <div
                                                style={{
                                                    position: "relative",
                                                    height: "35px",
                                                    background: "#EFEFEF",
                                                    border: "none",
                                                    borderRadius: "17px",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: `${progress}%`,
                                                        height: "100%",
                                                        backgroundColor: "#574BED",
                                                        // progress === 100 ? "red" : "green",
                                                    }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{expense.toLocaleString()}원</td>
                                        <td>{(budget - expense).toLocaleString()}원</td>
                                    </tr>
                                </tbody>
                        );
                        })}
                    </table>
                </div>
            )}
        </div>
    );
}
export default AccountSettlement;
