import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import './MorePage.css'

const MorePage = ({data, fileName}) => {
    const handleExport = () => {
        // 1. 데이터 변환 및 총 지출비 추가
        const totalExpense = data.reduce((sum, item) => sum + item.expense, 0); // 총 지출비 계산
        const totalIcome = data.reduce((sum, item) => sum + item.income, 0);
        const transformedData = [
            ...data.map(({date, incategory, excategory, income, expense, memo, cash }) => ({
                날짜: date,
                지출카테고리: excategory,
                수입카테고리: incategory,
                수입: income,
                지출: expense,
                자산: cash,
                메모: memo,
            })),
            { 지출: "총 지출비", 총지출: totalExpense }, // 총 지출비 추가
            { 수입: "총 수입비", 총수입: totalIcome }, // 총 수입비 추가
        ];

        // 2. 엑셀 워크북 생성
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(transformedData);

        // 3. 워크북에 워크시트 추가
        XLSX.utils.book_append_sheet(workbook, worksheet, "가계부 데이터");

        // 4. 엑셀 파일 생성 및 다운로드 가능
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `${fileName}.xlsx`);
    };

    return (
        <div>
            <div className='setting'>
                <div className='setting_title'>
                    <h4>설정</h4>
                </div>
                <div className='setting_data'>
                    <p>데이터</p>
                    <div className='setting_category'>
                        <div className='setting_category1'>
                        <p>수입 카테고리</p>
                        <p>
                            <img src={require('../img/rightarrow.png')} alt="오른쪽 아이콘"
                                 style={{width: '20px'}}/>
                        </p>
                        </div>
                        <div className='setting_category2'>
                        <p>지출 카테고리</p>
                        <p>
                            <img src={require('../img/rightarrow.png')} alt="오른쪽 아이콘"
                                 style={{width: '20px'}}/>
                        </p>
                        </div>
                        <div className='setting_category3'>
                        <p>자산 카테고리</p>
                        <p>
                            <img src={require('../img/rightarrow.png')} alt="오른쪽 아이콘"
                                 style={{width: '20px'}}/>
                        </p>
                        </div>
                    </div>
                </div>
                <div className='setting_setting'>
                    <p>앱 설정</p>
                    <div>
                        <p>테마</p>
                        <p>
                            <img src={require('../img/rightarrow.png')} alt="오른쪽 아이콘"
                                 style={{width: '20px'}}/>
                        </p>
                    </div>

                </div>
                <div className='setting_backup'>
                    <p>데이터 백업</p>
                    <div>
                        <p onClick={handleExport}>엑셀 파일 내보내기</p>
                        <p>
                            <img src={require('../img/rightarrow.png')} alt="오른쪽 아이콘"
                                 style={{width: '20px'}}/>
                        </p>
                    </div>
                </div>
                <div className='setting_support'>
                    <p>지원</p>
                    <div>
                        <p>도움말</p>
                        <p>
                            <img src={require('../img/rightarrow.png')} alt="오른쪽 아이콘"
                                 style={{width: '20px'}}/>
                        </p>
                    </div>
                    <div>
                        <p>자주 묻는 질문</p>
                        <p>
                            <img src={require('../img/rightarrow.png')} alt="오른쪽 아이콘"
                                 style={{width: '20px'}}/>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MorePage;