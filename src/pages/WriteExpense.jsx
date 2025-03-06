import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './WriteExpense.css';

const WriteExpense = ({addData}) => {
    // expenseData : 지출에 대한 data를 저장한 상태
    const [expenseData, setExpenseData] = useState({
        date: '',
        excategory: '',
        expense: '',
        cash: '',
        memo: '',
    });
    // 페이지 이동하는 함수
    // 추가 버튼을 클릭 시 메인 페이지로 이동하기 위한 함수
    const navigate = useNavigate();

    // 폼의 각 입력 필드 값이 변경될 때마다 호출
    const handleChange = (e) => {
        // name : 입력 필드의 이름 (date, income 등)
        // value : 입력된 값
        const {name, value} = e.target;
        // 금액 필드의 값이 변경될 때
        if (name === "expense") {
            // 숫자가 아니거나 10억을 넘는 경우 업데이트 차단.
            if (isNaN(value) || parseInt(value) > 1000000000 || parseInt(value) < 0) {
                return;
            }
        }
        setExpenseData({...expenseData, [name]: value});
    };

    const handleSubmit = (e) => {
        // 이벤트 기본 동작을 막고 사용자가 작성한 데이터를 처리를 위해 사용
        // 새로고침을 방지하기 위한 함수 => firebase에 저장하기 전이라 새로고침하면 작성자의 값이 날라감
        e.preventDefault();

        // 유효성 검사
        // 날짜, 카테고리, 지출 작성 칸이 비워져 있다면
        if (!expenseData.date || !expenseData.excategory || !expenseData.expense) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }

        // 지출 데이터 추가
        addData({
            // expenseData의 값을 addData에 전달
            ...expenseData,
            income: 0, // 지출에서는 수입은 항상 0
            // income은 문자열이기 때문에 숫자형으로 변환
            expense: parseInt(expenseData.expense),
            cash: expenseData.cash, // 카테고리 구분용
        });

        alert('지출이 추가되었습니다!');
        navigate('/'); // 메인 페이지로 이동
    }
        return (
            <div className="WriteExpense">
                <form onSubmit={handleSubmit}>
                    <div className="date">
                        <label>날짜</label>
                        <input
                            type="date"
                            name="date"
                            value={expenseData.date}
                            onChange={handleChange}
                            required
                            className={!expenseData.date ? 'input-empty' : 'input-filled'}
                        />
                    </div>
                    <div className="category">
                        <label>카테고리</label>
                        <select
                            name="excategory"
                            value={expenseData.excategory}
                            onChange={handleChange}
                            required
                            className={!expenseData.excategory ? 'input-empty' : 'input-filled'}
                        >
                            <option value="">선택</option>
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
                            value={expenseData.cash}
                            onChange={handleChange}
                            required
                            className={!expenseData.cash ? 'input-empty' : 'input-filled'}
                        >
                            <option value="">선택</option>
                            <option value="현금">현금</option>
                            <option value="카드">카드</option>
                        </select>
                    </div>
                    <div className="money">
                        <label>금액</label>
                        <input
                            type="number"
                            name="expense"
                            value={expenseData.expense}
                            onChange={handleChange}
                            required
                            placeholder="금액을 입력해주세요"
                            className={!expenseData.expense ? 'input-empty' : 'input-filled'}
                            max={1000000000} // 브라우저 기본 동작으로 최대값 제한
                        />
                    </div>
                    <div className="memo">
                        <label>메모</label>
                        <textarea
                            name="memo"
                            value={expenseData.memo}
                            onChange={handleChange}
                            placeholder="지출명을 입력해주세요"
                            className={!expenseData.memo ? 'input-empty' : 'input-filled'}
                            maxLength={12}
                        />
                    </div>
                    <button type="submit">추가하기</button>
                </form>
            </div>
        );
}
export default WriteExpense;