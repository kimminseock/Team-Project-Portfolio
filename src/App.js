import './App.css';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import {useEffect, useState} from "react";
import Header from "./component/Header";
import TopNavigation from "./component/TopNavigation";
import BottomNavigation from "./component/BottomNavigation";
import AccountDaily from "./pages/AccountDaily";
import AccountMonth from "./pages/AccountMonth";
import AccountSettlement from "./pages/AccountSettlement";
import AccountCalender from "./pages/AccountCalender";
import Account_write from "./pages/AccountWrite";
import Write from "./component/Write";
import StatisticsPage from "./pages/StatisticsPage";
import AiPage from "./pages/AiPage";
import MorePage from "./pages/MorePage";
import HeaderTitle from "./component/HeaderTitle";
import HeaderContent from "./component/HeaderContent";
import WriteIncome from "./pages/WriteIncome";
import WriteExpense from "./pages/WriteExpense";
import StatisticsIncome from "./pages/StatisticsIncome";
import StatisticsExpense from "./pages/StatisticsExpense";
import AccountSearch from "./pages/AccountSearch";
import AccountFilter from "./pages/AccountFilter";
import AccountEdit from "./pages/AccountEdit";
import app from "./firebaseApp";

import {getDatabase, ref, set, get, query, orderByChild, onValue,serverTimestamp ,push, remove, update} from 'firebase/database'
import openAI from "./js/openAI";

// realtime database 참조 가져오기
const database = getDatabase(app); // 참고를 가져오는 코드

function App() { // useLocation을 쓰기 위해 별도로 만든 함수
    // 날짜를 관리, 현재 날자로 시작하는 useState
    const [currentDate, setCurrentDate] = useState(new Date());

    // 수입, 지출 기본 페이지 설정을 위한 상태
    const [currentPage, setCurrentPage] = useState("expense"); // "expense"를 기본값으로 설정

    // Ai 메세지 설정을 위한 useState
    const [messages, setMessages] = useState([]);

    // 수정을 위해 id값 부여
    const [data, setData] = useState([]);

    const [targetBudget, setTargetBudget] = useState({});

    // 목데이터 확인용
    // const mockData = [
    //     { id: 1, date: '2024-12-29', incategory:'급여', income: 2000, expense: 0, cash: '', memo: '집에 가고 싶다' },
    //     { id: 2, date: '2024-12-02', incategory:'용돈', income: 1000, expense: 0,cash: '', memo: '집~~' },
    //     { id: 3, date: '2024-12-02', incategory:'상여금/성과급', income: 50000, expense: 0, cash: '', memo: '가나다라마바사아자차카' },
    // ]

    // 파이어베이스에 저장할 데이터
    const dataPath = 'dataPath';
    // 파이어베이스에 저장할 데이터
    const budgetPath = 'budgetPath';
    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        const dataRef = ref(database, dataPath);
        onValue(dataRef, (snapshot) => {
            const dataFromFirebase = snapshot.val();
            if (dataFromFirebase) {
                setData(Object.values(dataFromFirebase)); // 데이터가 있다면 상태에 저장
                // console.log('Data from Firebase: ', dataFromFirebase); // 데이터 확인용
            } else {
                // console.log('No data available');
            }
        });
    }, []);

    const fetchTargetBudget = () => {
        const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
        const budgetRef = ref(database, `${budgetPath}/${monthKey}`);
        onValue(budgetRef, (snapshot) => {
            const dataFromFirebase = snapshot.val();

            if (dataFromFirebase) {
                setTargetBudget(dataFromFirebase);
            } else {
                // 예산이 없으면 기본 예산 설정
                setTargetBudget({
                    '식비': 0,
                    '교통|차량': 0,
                    '취미|여가': 0,
                    '패션|미용': 0,
                    '생활|편의': 0,
                    '주거|통신': 0,
                    '건강': 0,
                    '교육': 0,
                    '경조사|회비': 0,
                    '기타': 0,
                });
            }
        });
    };

    useEffect(() => {
        fetchTargetBudget();
    }, [currentDate]); // 월이 바뀔 때마다 fetchTargetBudget 호출

    // 목표 금액 업데이트 함수
    const updateTargetBudget = (category, newBudget) => {
        const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

        setTargetBudget((prev) => {
            const updatedBudget = {
                ...prev,
                [category]: newBudget,
            };

            // 월별 예산을 Firebase에 업데이트
            const budgetRef = ref(database, `${budgetPath}/${monthKey}`);
            set(budgetRef, updatedBudget);

            return updatedBudget;
        });
    };

    // Firebase에 데이터를 추가하는 함수
    const addData = (newEntry) => {
        const newDataRef = push(ref(database, dataPath)); // 새로운 항목을 위한 참조 생성
        set(newDataRef, newEntry) // 생성한 참조에 데이터 저장
            .then(() => {
                console.log('Data added successfully');
            })
            .catch((error) => {
                console.error('Error adding data: ', error);
            });
    };

    // 수입, 지출 페이지 전환 함수
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        fetchDataFromFirebase();
    }, []);

    // 데이터 삭제 함수
    const fetchDataFromFirebase = () => {
        const dataRef = ref(database, dataPath);
        onValue(dataRef, (snapshot) => {
            const dataFromFirebase = snapshot.val();
            if (dataFromFirebase) {
                // 데이터를 배열로 변환하며 firebaseKey를 포함
                const formattedData = Object.entries(dataFromFirebase).map(([key, value]) => ({
                    ...value,
                    firebaseKey: key, // firebaseKey 추가
                }));
                setData(formattedData); // 상태 업데이트
            } else {
                setData([]); // 데이터가 없을 경우 상태를 빈 배열로 설정
            }
        });
    };

    // 특정 데이터를 삭제하는 함수
    // setData(prevData => {...}): setData는 상태를 업데이트하는 함수입니다. prevData는 현재의 data 상태를 나타내며, 이 상태를 수정
    const onDeleteData = (firebaseKey) => {
        const dataRef = ref(database, `${dataPath}/${firebaseKey}`);
        if(window.confirm('정말 삭제하시겠습니까?')) {
            remove(dataRef)
                .then(() => {
                    console.log('Data deleted successfully');
                    // 상태에서 삭제된 항목 제거
                    setData((prevData) => prevData.filter((item) => item.firebaseKey !== firebaseKey));
                })
                .catch((error) => {
                    console.error('Error deleting data: ', error);
                });
        }
    };

    // 모든 데이터를 삭제하는 함수
    const onClearAllData = () => {
        setData([]);
    };

    // 이전/다음 월 이동 함수
    const handlePrevMonth = () => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
    const handleNextMonth = () => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));

    // URL 경로를 가져오는 useLocation
    const location = useLocation();
    // boolean형으로 url 경로가 /write이면 true
    const isWrite = location.pathname === "/write";
    const isStatistics = location.pathname === "/statistics";
    const isMore = location.pathname === "/more";
    const isAi = location.pathname === "/ai";
    const isSearch = location.pathname === "/search";
    const isFilter = location.pathname === "/filter";
    const isEdit = location.pathname === "/edit";


    // 년수를 나타냄
    const currentYear = currentDate.getFullYear();
    // 달을 나타냄
    const currentMonth = currentDate.getMonth() + 1;

    const totalIncome = data // data 안의 배열을 값들을 가져옴
        .filter(item => { // data 배열에서 특정 조건에 맞는 항목을 추출
            // split : 날짜를 -를 기준으로 배열로 만듬 map : 문자열 날짜 배열을 숫자형으로 변환
            // year은 년도 month 달을 저장
            const [year, month] = item.date.split('-').map(Number);
            // 현재 년도와 달에 해당하는 항목만 유지
            return year === currentYear && month === currentMonth;
        })
        // reduce는 배열을 하나씩 처리하며 값을 누적, 초기값은 0
        // sum의 초기값은 0, income의 값이 sum과 합산 계산이 끝날 때까지 합산
        .reduce((sum, item) => sum + item.income, 0);

    const totalExpense = data
        .filter(item => {
            const [year, month] = item.date.split('-').map(Number);
            return year === currentYear && month === currentMonth;
        })
        .reduce((sum, item) => sum + item.expense, 0);

    const filteredData = data.filter(item => {
        // item.date.split('-')은 2024-12-02를 ['2024', '12', '02']를 년,월,일로 따로 저장
        // map(Number)은 저장한 값이 문자형이기 때문에 각 data 값들을 반복적으로 돌면서 숫자형으로 변환
        const [year, month] = item.date.split('-').map(Number);
        // 추출한 year와 month가 currentYear와 currentMonth와 비교하여 조건에 맞는 항목만 포함
        return year === currentYear && month === currentMonth;
    });

    // firebase에도 수정 될 수 있게 수정 2024-12-10
    const onUpdateItem = (updatedItem) => {
        const { firebaseKey, ...itemData } = updatedItem; // firebaseKey를 분리

        // Firebase에서 데이터 업데이트
        const itemRef = ref(database, `${dataPath}/${firebaseKey}`);
        update(itemRef, itemData) // Firebase 업데이트
            .then(() => {
                console.log("Data updated successfully");
            })
            .catch((error) => {
                console.error("Error updating data: ", error);
            });

        // 로컬 상태 업데이트
        setData((prevData) =>
            prevData.map((item) =>
                item.firebaseKey === firebaseKey ? { ...item, ...itemData } : item
            )
        );
    };

    // 대화 내역 저장
    const onSend = async (message) => {
        await openAI.send(messages, message, setMessages, data);
    }

    return (
        <div className="App">
            <div className="header-container">
                {!isEdit && !isWrite && !isSearch && !isFilter && <Header
                    currentDate={currentDate}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                    data={data}/>}
                {!isEdit && !isWrite && !isMore && !isAi && !isSearch && !isFilter &&
                    <HeaderTitle currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth}
                                 data={data}/>}
                {!isEdit && !isStatistics && !isWrite && !isMore && !isAi && !isSearch && !isFilter &&
                    <HeaderContent totalIncome={totalIncome} totalExpense={totalExpense}/>}
                {!isEdit && !isStatistics && !isWrite && !isMore && !isAi && !isSearch && !isFilter && <TopNavigation/>}
            </div>
            <main className={`${isEdit || isWrite || isSearch || isFilter ? 'main4' : isAi || isMore ? 'main3' : isStatistics ? 'main2' : 'main'}`}>
                <Routes>
                    <Route path={'/'} element={<AccountDaily data={data} currentYear={currentYear} currentMonth={currentMonth} />} />
                    <Route path={'/month'} element={<AccountMonth data={data} />} />
                    <Route path={'/calender'} element={<AccountCalender data={data} currentDate={currentDate}/>} />
                    {/*<Route path={'/write'} element={<Account_write data={data} addData={addData}/>} />*/}
                    <Route path="/write" element={
                        <Account_write
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            addData={addData}
                        />
                    } />
                    <Route path={'/write-income'} element={<WriteIncome />} />
                    <Route path={'/write-expense'} element={<WriteExpense />} />
                    <Route path={'/Statics-income'} element={<StatisticsIncome />} />
                    <Route path={'/Statics-expense'} element={<StatisticsExpense />} />
                    <Route path={"/edit"} element={<AccountEdit onUpdateItem={onUpdateItem} onDeleteData={onDeleteData}/>} />
                    <Route path={'/search'} element={<AccountSearch data={data} />} />
                    {/* 필터 수정 */}
                    <Route path={'/filter'} element={<AccountFilter data={data} currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth}/>} />
                    <Route path={'/settlement'} element={<AccountSettlement
                        data={filteredData}
                        targetBudget={targetBudget}
                        updateTargetBudget={updateTargetBudget}
                    />}/>
                    <Route path={'/statistics'} element={<StatisticsPage
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        data={filteredData}
                    />} />
                    <Route path={'/ai'} element={<AiPage onSend={onSend} messages={messages}/>} />
                    <Route path={'/more'} element={<MorePage data={data} fileName="가계부_데이터"/>} />
                </Routes>
            </main>
            {!isEdit && !isWrite && !isStatistics && !isMore && !isAi && !isSearch && !isFilter && <Write />}
            {!isEdit && !isWrite && !isSearch && !isFilter && <BottomNavigation />}
        </div>
    );
}

export default App;
