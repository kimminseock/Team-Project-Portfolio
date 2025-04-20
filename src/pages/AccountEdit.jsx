import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import './AccountEdit.css';

// 수정 - 2024-12-10
const AccountEdit = ({ onUpdateItem, onDeleteData }) => {
    const location = useLocation();
    const navigate = useNavigate();
    // 현재 위치의 상태(state)에서 item 데이터를 가져옴, location.state가 없다면 undefind
    const { item } = location.state || {};

    // 초기 상태 설정
    const [editedItem, setEditedItem] = useState({
        ...item,
        // 수입, 지출 금액의 초기값, 데이터가 없다면 0으로 초기화
        income: item?.income || 0,
        expense: item?.expense || 0,
        // 데이터가 없다면 현금으로 설정
        cash: item?.cash || "현금",
        // 데이터가 없다면 월급으로 설정
        category: item?.category || "월급",
    });

    // item 데이터가 없을 경우 return div 출력
    if (!item) {
        return <div>데이터가 없습니다.</div>;
    }

    // 모든 입력 필드의 값을 업데이트
    // name 속성을 키로 사용
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedItem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 금액 입력을 정수로 변환
    // income 또는 expense 상태를 업데이트
    const handleAmountChange = (e, type) => {
        const value = parseInt(e.target.value, 10) || 0;
        // 2024-12-13 수정 : 숫자가 아니거나 10억을 넘는 경우 업데이트 차단
        if (isNaN(value) || parseInt(value) > 1000000000 || parseInt(value) < 0) {
            return;
        }
        setEditedItem((prev) => ({
            ...prev,
            income: type === "income" ? value : prev.income,
            expense: type === "expense" ? value : prev.expense,
        }));
    };

    const handleSave = () => {
        // cash, category, income, expense 입력값이 채워져 있는지 확인
        if (!editedItem.cash || !editedItem.category || (!editedItem.income && !editedItem.expense)) {
            alert("모든 항목을 정확히 입력해주세요.");
            return;
        }

        // 수정된 항목을 Firebase에 업데이트
        const updatedItem = { ...editedItem, id: item.firebaseKey }; // firebaseKey를 id로 추가
        onUpdateItem(updatedItem); // 상위 컴포넌트 상태 업데이트
        navigate('/'); // 메인 화면으로 이동
    };


    return (
        <div className="AccountEdit">
            <div className="title">
                <button onClick={() => navigate('/')} className="go-back-button">
                    <img src={require('../img/arrow-small-left.png')} alt="뒤로가기 아이콘"
                         style={{width: '30px'}}/>
                </button>
                <h2>상세내역</h2>
                <button
                    onClick={() => {
                        onDeleteData(item.firebaseKey);
                        navigate('/');
                    }}
                >
                    삭제하기
                </button>
            </div>
            <div className="content">
                {/* 수입 섹션 */}
                {editedItem.incategory && (
                    <div className="expense-edit">
                        {/*<h3>수입</h3>*/}
                        <div className="category">
                            <label>카테고리</label>
                            <select
                                name="incategory"
                                value={editedItem.incategory}
                                onChange={handleInputChange}
                            >
                                <option value="급여">급여</option>
                                <option value="용돈">용돈</option>
                                <option value="상여금/성과급">상여금/성과급</option>
                                <option value="금융소득">금융소득</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>
                        <div className="cash">
                            <label>자산</label>
                            <select
                                name="cash"
                                value={editedItem.cash}
                                onChange={handleInputChange}
                            >
                                <option value="현금">현금</option>
                                <option value="통장">통장</option>
                            </select>
                        </div>
                        <div className="money">
                            <label>금액</label>
                            <input
                                type="number"
                                value={editedItem.income}
                                onChange={(e) => handleAmountChange(e, "income")}
                                max={1000000000} // 브라우저 기본 동작으로 최대값 제한
                            />
                        </div>
                    </div>
                )}

                {/* 지출 섹션 */}
                {editedItem.excategory && (
                    <div className="income-edit">
                        {/*<h3>지출</h3>*/}
                        <div className="category">
                            <label>카테고리</label>
                            <select
                                name="excategory"
                                value={editedItem.excategory}
                                onChange={handleInputChange}
                            >
                                <option value="식비">식비</option>
                                <option value="교통/차량">교통/차량</option>
                                <option value="취미/여가">취미/여가</option>
                                <option value="패션/미용">패션/미용</option>
                                <option value="생활/편의">생활/편의</option>
                                <option value="주거/통신">주거/통신</option>
                                <option value="건강">건강</option>
                                <option value="교육">교육</option>
                                <option value="경조사/회비">경조사/회비</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>
                        <div className="cash">
                            <label>자산</label>
                            <select
                                name="cash"
                                value={editedItem.cash}
                                onChange={handleInputChange}
                            >
                                <option value="현금">현금</option>
                                <option value="카드">카드</option>
                            </select>
                        </div>
                        <div className="money">
                            <label>금액</label>
                            <input
                                type="number"
                                value={editedItem.expense}
                                onChange={(e) => handleAmountChange(e, "expense")}
                                max={1000000000} // 브라우저 기본 동작으로 최대값 제한
                            />
                        </div>
                    </div>
                )}
                <div className="memo">
                    <label>메모</label>
                    <input
                        type="text"
                        name="memo"
                        value={editedItem.memo}
                        onChange={handleInputChange}
                        // 2024-12-13 수정 : 메모 최대 길이 12
                        maxLength={12}
                    />
                </div>
            </div>
            <div className="button-wrapper">
                <button onClick={() => navigate('/')}>취소</button>
                <button onClick={handleSave}>저장</button>
            </div>
        </div>
    );
};

export default AccountEdit;
