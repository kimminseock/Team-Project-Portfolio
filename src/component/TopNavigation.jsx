import {NavLink, useNavigate} from "react-router-dom";
import './TopNavigation.css'
const TopNavigation = () => {
    return (
        // 수정
        <nav className="TopNavigation">
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>일일</NavLink>
                </li>
                <li>
                    <NavLink to="/month" className={({isActive}) => (isActive ? "active" : "")}>월간</NavLink>
                </li>
                <li>
                    <NavLink to="/calender" className={({isActive}) => (isActive ? "active" : "")}>달력</NavLink>
                </li>
                <li>
                    <NavLink to="/settlement" className={({isActive}) => (isActive ? "active" : "")}>예결산</NavLink>
                </li>
            </ul>
        </nav>
    );
}
export default TopNavigation;