import React, { useMemo, useState} from "react";
import {lastThreeYears} from "../../utils/dates";
import {format} from "date-fns";
import { fr } from 'date-fns/locale';
import {babysittingFilterState} from "../../recoil/recoil_states";
import {useRecoilState} from "recoil";
import {monthList} from "../../utils/months";
import Buttons from "../Buttons/Buttons";
import {logEvent} from "firebase/analytics";
import {fireBaseAnalytics} from "../../utils/firebase";

function BabySittingFilters() {
    const years = useMemo(() => lastThreeYears(new Date().getFullYear()), []);
    const months:string[] = useMemo(() => monthList, []);;
    const actualMonth = useMemo(() => {
        return format(new Date(),'MMMM',{ locale: fr })
            .slice(0, 1)
            .toUpperCase()
            .concat(format(new Date(),'MMMM',{ locale: fr }).slice(1));
    }, []);

    const [selectedYear,setSelectedYear] =  useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<string>(actualMonth);
    const [filter, setFilter] = useRecoilState(babysittingFilterState);

    function handleSelectYearChange(event:any){
        logEvent(fireBaseAnalytics,"filter_button_select_year");
        setSelectedYear(event.target.value)
        setFilter({
            ...filter,
            year:event.target.value
        })
    }

    function handleMonthButtonClick(monthString:string, monthNumber:number){
        logEvent(fireBaseAnalytics,"filter_button_select_month");
        setSelectedMonth(monthString);
        setFilter({
            ...filter,
            month:monthNumber
        })
    }

    return (
        <div className={"mb-5 pt-6 pb-6 px-8 max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-lg items-center" }>
            <h2 className={"mb-3 text-xl font-semibold"}>Filtres</h2>
            <h4>
                {selectedMonth} {selectedYear}
            </h4>

            <div className={"mb-2"}>
                <label>Sélectionner l'année : </label>
                <select className={"p-1.5 border rounded-md border border-blue-600 text-blue-600"} value={selectedYear} onChange={handleSelectYearChange}>
                    {years.map((year,index:number)=>(
                        <option key={`${year}-${index}`}>{year}</option>
                    ))}
                </select>
            </div>
            <div className={"flex overflow-x-scroll scrollbar-hide scroll-smooth md:flex-wrap md:overflow-hidden"}>
                {months.map((month,index)=>(
                    <Buttons key={`${month}-${index}`}  label={month} clickFunction={()=>handleMonthButtonClick(month,index+1)} type={"standard"} ></Buttons>
                ))}
            </div>
        </div>
    )
}

export default BabySittingFilters
