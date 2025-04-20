import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ('./WriteIncome.css');

const WriteIncome = ({addData}) => {
    // incomeData : 수입에 대한 data를 저장한 상태
    const [incomeData, setIncomeData] = useState({
        date: '',
        incategory: '',
        income: '',
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
        const { name, value } = e.target;
        if (name === "income") {
            // 숫자가 아니거나 10억을 넘는 경우 업데이트 차단
            if (isNaN(value) || parseInt(value) > 1000000000 ||  parseInt(value) < 0) {
                return;
            }
        }
        setIncomeData({ ...incomeData, [name]: value });
    };

    const handleSubmit = (e) => {
        // 이벤트 기본 동작을 막고 사용자가 작성한 데이터를 처리를 위해 사용
        // 새로고침을 방지하기 위한 함수 => firebase에 저장하기 전이라 새로고침하면 작성자의 값이 날라감
        e.preventDefault();

        // 유효성 검사
        // 날짜, 카테고리, 수입 작성 칸이 비워져 있다면
        if (!incomeData.date || !incomeData.incategory || !incomeData.income) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }

        // 수입 데이터 추가
        addData({
            // incomeData의 값을 addData에 전달
            ...incomeData,
            // income은 문자열이기 때문에 숫자형으로 변환
            income: parseInt(incomeData.income),
            expense: 0, // 수입에서는 지출은 항상 0
            cash: incomeData.cash, // 카테고리 구분용
        });

        alert('수입이 추가되었습니다!');
        navigate('/'); // 메인 페이지로 이동
    };

    return (
        <div className="WriteIncome">
            <form onSubmit={handleSubmit}>
                <div className="date">
                    <label>날짜</label>
                    <input
                        type="date"
                        name="date"
                        value={incomeData.date}
                        onChange={handleChange}
                        required
                        className={!incomeData.date ? 'input-empty' : 'input-filled'}
                    />
                </div>
                <div className="category">
                    <label>카테고리</label>
                    <select
                        name="incategory"
                        value={incomeData.incategory}
                        onChange={handleChange}
                        required
                        className={!incomeData.incategory ? 'input-empty' : 'input-filled'}
                    >
                        <option value="">선택</option>
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
                        value={incomeData.cash}
                        onChange={handleChange}
                        required
                        className={!incomeData.cash ? 'input-empty' : 'input-filled'}
                    >
                        <option value="">선택</option>
                        <option value="현금">현금</option>
                        <option value="카드">통장</option>
                    </select>
                </div>
                <div className="money">
                    <label>금액</label>
                    <input
                        type="number"
                        name="income"
                        value={incomeData.income}
                        onChange={handleChange}
                        required
                        className={!incomeData.income ? 'input-empty' : 'input-filled'}
                        max={1000000000} // 브라우저 기본 동작으로 최대값 제한
                    />
                </div>
                <div className="memo">
                    <label>메모</label>
                    <textarea
                        name="memo"
                        value={incomeData.memo}
                        onChange={handleChange}
                        className={!incomeData.memo ? 'input-empty' : 'input-filled'}
                        maxLength={12}
                    />
                </div>
                <button type="submit">추가하기</button>
            </form>
        </div>
    );
}
export default WriteIncome;
