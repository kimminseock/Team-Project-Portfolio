import {useState} from "react";
import {useNavigate} from "react-router-dom";
import './SearchHeader.css';

const SearchHeader = ({onSearch}) => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        onSearch(value); // 검색어 전달.
    };
    const goBack = () => {
        navigate(-1)
    }
    return (
        <div className="SearchHeader">
            <div className="title">
                <button onClick={goBack}>
                    <img src={require('../img/arrow-small-left.png')} alt="뒤로가기 아이콘"
                         style={{width: '30px'}}/>
                </button>
                <h2>검색</h2>
            </div>
            <div className="search-field">
                <input
                    type="text"
                    value={search}
                    onChange={handleChange}
                    placeholder="메모 검색"
                />
            </div>
        </div>
    );
}
export default SearchHeader;