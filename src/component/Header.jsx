import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Link} from "react-router-dom";
import './Header.css'

const Header = () => {
    const navigate = useNavigate();
    // 메뉴 상태 관리
    const [menuOpen, setMenuOpen] = useState(false);

    const onSubmit = () => {
        navigate('/');
    }
    // 메뉴 열림/닫힘
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }
    // 닫힘
    const closeMenu = () => {
        setMenuOpen(false);
    }

    return (
        <div className="Header">
            <p className="menubar" onClick={toggleMenu}>
                <img alt="메뉴바" src={require('../img/burger-menu.svg').default}
                     style={{width: '25px'}}/>
            </p>
            <h1 className="logo" onClick={onSubmit}>
                {/*241213 수정 - 로고 추가 */}
                <img alt="로고" src={require('../img/logo.png')}
                     style={{height: '28px'}}/>
            </h1>

            {menuOpen && <div className="overlay" onClick={closeMenu}></div>} {/* 오버레이 */}
            <div className={`sidebar ${menuOpen ? "open" : ""}`}>
                <ul>
                    <Link to={"/"} onClick={closeMenu}>
                        <li>
                            <p className="icon">
                                <img src={require('../img/clock-three.png')} alt="일일 아이콘"
                                     style={{width: '20px'}}/>
                            </p>
                            일일
                        </li>
                    </Link>
                    <Link to={"/month"} onClick={closeMenu}>
                        <li>
                            <p className="icon">
                                <img src={require('../img/square-m.png')} alt="월간 아이콘"
                                     style={{width: '20px'}}/>
                            </p>
                            월간
                        </li>
                    </Link>
                    <Link to={"/calender"} onClick={closeMenu}>
                        <li>
                            <p className="icon">
                                <img src={require('../img/calendar.png')} alt="달력 아이콘"
                                     style={{width: '20px'}}/>
                            </p>
                            달력
                        </li>
                    </Link>
                    <Link to={"/settlement"} onClick={closeMenu}>
                        <li>
                            <p className="icon">
                                <img src={require('../img/book.png')} alt="예결산 아이콘"
                                     style={{width: '20px'}}/>
                            </p>
                            예결산
                        </li>
                    </Link>
                    <Link to={"/statistics"} onClick={closeMenu}>
                        <li>
                            <p className="icon">
                                <img src={require('../img/chart-pie.png')} alt="통계 아이콘"
                                     style={{width: '20px'}}/>
                            </p>
                            통계
                        </li>
                    </Link>
                    <Link to={"/ai"} onClick={closeMenu}>
                        <li>
                            <p className="icon">
                                <img src={require('../img/artificial-intelligence.png')} alt="Ai 아이콘"
                                     style={{width: '20px'}}/>
                            </p>
                            Ai
                        </li>
                    </Link>
                    <Link to={"/more"} onClick={closeMenu}>
                        <li>
                            <p className="icon">
                                <img src={require('../img/menu-dots.png')} alt="더보기 아이콘"
                                     style={{width: '20px'}}/>
                            </p>
                            더보기
                        </li>
                    </Link>
                </ul>
            </div>
        </div>
    );
}
export default Header;