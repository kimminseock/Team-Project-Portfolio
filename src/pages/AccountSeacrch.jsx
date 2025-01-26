import { useState } from "react";
import SearchHeader from "../component/SearchHeader";

const AccountSeacrch = ({ data }) => {
    const [filteredData, setFilteredData] = useState([]); // 초기 필터링 데이터는 빈 배열
    const [searchTerm, setSearchTerm] = useState(""); // 현재 검색어 상태

    const handleSearch = (search) => {
        setSearchTerm(search); // 검색어 업데이트

        // 검색어가 있는 경우 필터링, 없는 경우 빈 배열 유지
        if (search.trim() !== "") {
            const results = data.filter(item =>
                item.memo?.includes(search) // 메모에 검색어가 포함되어 있는지 확인
            );
            setFilteredData(results);
        } else {
            setFilteredData([]); // 검색어가 없으면 빈 배열로 설정
        }
    };

    return (
        <div>
            <SearchHeader onSearch={handleSearch} />
            <div>
                {searchTerm.trim() === "" ? (
                    // 검색어가 없을 때
                    <p>결과 데이터가 없습니다.</p>
                ) : filteredData.length === 0 ? (
                    // 검색어는 있지만 결과가 없을 때
                    <p>결과 데이터가 없습니다.</p>
                ) : (
                    // 검색 결과가 있을 때
                    filteredData.map((item, index) => (
                        <div key={`${item.date}-${index}`}>
                            <p>카테고리: {item.category}</p>
                            <p>메모: {item.memo}</p>
                            <p>날짜: {item.date}</p>
                            <p>수입: {item.income}</p>
                            <p>지출: {item.expense}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AccountSeacrch;
