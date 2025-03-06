import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AccountFilter.css';

const AccountFilter = ({ data, currentDate, onPrevMonth, onNextMonth }) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    // 탭바의 수입, 지출 자산 중 먼저 보이는 페이지를 자산으로 하기 위해 초기값 자산으로 설정
    const [currentTab, setCurrentTab] = useState("자산");
    // 카테고리 저장하는 배열
    const [selectedCategories, setSelectedCategories] = useState([]);
    // 사용자가 선택한 자산 유형을 저장하는 배열
    const [selectedAssets, setSelectedAssets] = useState([]);

    // 수입 카테고리
    const incomeCategories = ["급여", "용돈", "상여금/성과급", "금융소득", "기타"];
    // 지출 카테고리
    const expenseCategories = ["식비", "교통/차량", "취미/여가", "패션/미용", "생활/편의", "주거/통신", "건강", "교육", "경조사/회비", "기타"];
    // 자산 카테고리
    const assetTypes = ["현금", "카드", "통장"];

    // 해당날짜의 요일
    function getDayOfWeek(date) {
        const week = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = week[new Date(date).getDay()];
        return dayOfWeek;
    }

    const navigate = useNavigate();

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            // 선택된 카테고리에 현재 클릭된 항목이 포함되었는지 확인
            prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
        );
    };

    const handleAssetChange = (asset) => {
        setSelectedAssets((prev) =>
            prev.includes(asset) ? prev.filter((type) => type !== asset) : [...prev, asset]
        );
    };

    // HeaderTitle의 currentDate를 기준으로 데이터 필터링
    // data.filter: data 배열을 순회하며 조건에 맞는 항목만 남김
    const filteredData = data.filter((item) => {
        // item.date: data 배열의 각 요소에서 date 속성을 가져옵니다.
        // new Date(item.date):
        // 문자열 형식의 날짜를 JavaScript의 Date 객체로 변환.
        // 이를 통해 날짜 비교가 가능합니다.
        const itemDate = new Date(item.date);

        // 선택된 카테고리와 자산 모두 비어있으면 아무 데이터도 표시하지 않음
        // selectedCategories.length === 0: 사용자가 카테고리를 선택하지 않은 경우.
        // selectedAssets.length === 0: 사용자가 자산 유형을 선택하지 않은 경우.
        if (selectedCategories.length === 0 && selectedAssets.length === 0) {
            // return false : 필터링할 기준이 없으므로 해당 항목은 결과에서 제외
            return false;
        }

        const isCategoryMatch =
            // selectedCategories.length === 0: 카테고리가 선택되지 않았다면, 모든 데이터가 카테고리 조건을 충족
            // selectedCategories.includes(item.category): 선택된 카테고리에 item.category가 포함된 경우 조건 충족
            // 선택된 카테고리가 없거나, 데이터의 category가 선택된 목록에 포함되어야 true
            selectedCategories.length === 0 || selectedCategories.includes(item.incategory) || selectedCategories.includes(item.excategory);
        const isAssetMatch =
            // selectedAssets.length === 0: 자산 유형이 선택되지 않았다면, 모든 데이터가 자산 조건을 충족
            // selectedAssets.includes(item.cash): 선택된 자산 유형에 데이터의 cash 속성이 포함된 경우 조건 충족
            // 선택된 자산 유형이 없거나, 데이터의 cash가 선택된 자산 유형에 포함되어야 true
            selectedAssets.length === 0 || selectedAssets.includes(item.cash);
        const isDateMatch =
            // itemDate.getFullYear(): 데이터의 date에서 연도를 가져옴
            itemDate.getFullYear() === currentDate.getFullYear() &&
            // itemDate.getMonth() + 1: 데이터의 date에서 월을 가져옵니다.
            // currentDate: 컴포넌트가 받은 현재 날짜 (Date 객체)
            // 데이터의 연도와 월이 현재 날짜와 동일해야 true
            itemDate.getMonth() + 1 === currentDate.getMonth() + 1;

        return isCategoryMatch && isAssetMatch && isDateMatch;
    });

    return (
        // 수정
        <div className="AccountFilter">
            <div className="header">
                <div className="calendar-wrapper">
                    <button onClick={onPrevMonth} className="calendar-button">
                        <img src={require('../img/angle-small-left.svg').default} alt="left"
                             style={{width: '25px'}}/>
                    </button>
                    <span className="calendar-month">{`${year}년 ${month}월`}</span>
                    <button onClick={onNextMonth} className="calendar-button">
                        <img src={require('../img/angle-small-right.svg').default} alt="right"
                             style={{width: '25px'}}/>
                    </button>
                </div>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        position: "absolute",
                        top: "27px",
                        right: "20px",
                        backgroundColor: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                    }}
                >
                    <img src={require('../img/close.png')} alt="닫기 버튼"
                         style={{width: '25px'}}/>
                </button>
            </div>
            <div className="content">
                <div className="filter-wrapper">
                    <h2>필터선택</h2>
                    <h3>분류</h3>
                    <div className="button-wrapper">
                        <button
                            onClick={() => setCurrentTab("수입")}
                            className={currentTab === "수입" ? "active" : ""}
                        >
                            수입
                        </button>
                        <button
                            onClick={() => setCurrentTab("지출")}
                            className={currentTab === "지출" ? "active" : ""}
                        >
                            지출
                        </button>
                        <button
                            onClick={() => setCurrentTab("자산")}
                            className={currentTab === "자산" ? "active" : ""}
                        >
                            자산
                        </button>
                    </div>
                    {/* 카테고리에따 따른 자산 필터링 UI */}
                    {currentTab === "수입" && (
                        <div>
                            <h3>수입 카테고리</h3>
                            {incomeCategories.map((category, index) => (
                                <label key={index} style={{marginRight: "10px"}}>
                                    <input
                                        type="checkbox"
                                        value={category}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryChange(category)}
                                    />
                                    {category}
                                </label>
                            ))}
                        </div>
                    )}
                    {currentTab === "지출" && (
                        <div>
                            <h3>지출 카테고리</h3>
                            <div className="checkbox">
                            {expenseCategories.map((category, index) => (
                                <label key={index} style={{marginRight: "10px"}}>
                                    <input
                                        type="checkbox"
                                        value={category}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryChange(category)}
                                    />
                                    {category}
                                    {index === 3 || index === 7 ? <br /> : ''}
                                </label>
                            ))}
                            </div>
                        </div>
                    )}
                    {currentTab === "자산" && (
                        <div>
                            <h3>자산 타입</h3>
                            {assetTypes.map((asset, index) => (
                                <label key={index} style={{marginRight: "10px"}}>
                                    <input
                                        type="checkbox"
                                        value={asset}
                                        checked={selectedAssets.includes(asset)}
                                        onChange={() => handleAssetChange(asset)}
                                    />
                                    {asset}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <div className='filter-result'>
                    <h3>결과</h3>
                    <ul>
                        {filteredData.length === 0 ? (
                            <p style={{color : '#c6c6c6', paddingTop: '10px'}}>선택된 데이터가 없습니다.</p>
                        ) : (
                            filteredData.map((item, index) => (
                                <li className="filter-result-item" key={index}>
                                    <p className="date">
                                        {item.date.slice(5, 7) + "월 " + (item.date.slice(8, 10) >= 10 ? item.date.slice(8, 10) + "일" : item.date.slice(9, 10) + "일")}
                                        <span>{getDayOfWeek(item.date)}</span>
                                    </p>
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
                                                item.incategory === '급여' ? 'salary' :
                                                item.incategory === '용돈' ? 'pin-money' :
                                                item.incategory === '상여금/성과급' ? 'bonus' :
                                                item.incategory === '금융소득' ? 'financial-income' : 'etc'
                                            }.png`)} alt="카테고리 아이콘"/>)
                                        }
                                    </p>
                                    <div className="filter-result-item-info">
                                        <div>
                                            <p>{item.excategory || item.incategory}</p>
                                            <div className="divider"></div>
                                            <p>{item.memo}</p>
                                            {item.income > 0 ? (
                                                <p>{'+' + item.income.toLocaleString()}원</p>
                                            ) : ''}
                                            {item.expense > 0 ? (
                                                <p>{'-' + item.expense.toLocaleString()}원</p>
                                            ) : ''}
                                        </div>
                                        <p>{item.cash}</p>
                                    </div>
                                </li>
                            ))
                            )}
                    </ul>
                </div>
            </div>
        </div>
);
};

export default AccountFilter;
