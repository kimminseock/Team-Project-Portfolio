import {useState} from "react";
import SearchHeader from "../component/SearchHeader";
import './AccountSearch.css'

const AccountSearch = ({data}) => {
    // filteredData : 필터링된 데이터를 저장
    // setFilteredData : 필터링된 데이터를 업데이트
    const [filteredData, setFilteredData] = useState(data); // 초기 필터링 데이터는 빈 배열
    const [searchTerm, setSearchTerm] = useState(""); // 현재 검색어 상태

    const handleSearch = (search) => {
        setSearchTerm(search); // 검색어 업데이트
        // 검색어가 있는 경우 필터링, 없는 경우 빈 배열 유지
        if (search.trim() !== "") {
            const results = data.filter(item =>
                item.memo?.includes(search) // 메모에 검색어가 포함되어 있는지 확인.
            );
            setFilteredData(results);
        } else {
            setFilteredData([]); // 검색어가 없으면 빈 배열로 설정
        }
    };

    // 검색 결과 합계
    let sum = 0;
    for (let i = 0; i < filteredData.length; i++) {
        sum = sum + filteredData[i].income - filteredData[i].expense;
    }

    // 해당날짜의 요일
    function getDayOfWeek(date) {
        const week = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = week[new Date(date).getDay()];
        return dayOfWeek;
    }

    return (
        <div className="AccountSearch">
            <SearchHeader onSearch={handleSearch} />
            <div className="search-result">
                {searchTerm.trim() && filteredData.length !==0 ?
                    <div className="search-result-sum">
                        <p>
                            {'총 ' + filteredData.length + '건'}
                        </p>
                        <p>
                            {sum.toLocaleString() + '원'}
                        </p>
                    </div> : ''
                }
                {searchTerm.trim() === "" ? (
                    // 검색어가 없을 때
                    <div className="no-search">
                        <p>검색어를 입력해주세요.</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    // 검색어는 있지만 결과가 없을 때
                    <div className="no-result">
                        <p>검색 결과가 없습니다.</p>
                    </div>
                ) : (
                    // 검색 결과가 있을 때
                    filteredData.map((item, index) => (
                        <div className="search-result-item" key={`${item.date}-${index}`}>
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
                                        (item.incategory === '급여' ? 'salary' :
                                        item.incategory === '용돈' ? 'pin-money' :
                                        item.incategory === '상여금/성과급' ? 'bonus' :
                                        item.incategory === '금융소득' ? 'financial-income' : 'etc')
                                    }.png`)} alt="카테고리 아이콘"/>)
                                }
                            </p>
                            <div className="search-result-item-info">
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
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
export default AccountSearch;