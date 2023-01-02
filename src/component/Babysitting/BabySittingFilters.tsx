import React, {useEffect, useMemo, useRef, useState} from "react";
import {lastThreeYears} from "../../utils/dates";
import {format} from "date-fns";
import { fr } from 'date-fns/locale';
import {babysittingFilterState} from "../../recoil/recoil_states";
import {useRecoilState} from "recoil";

function BabySittingFilters() {
    const years = useMemo(() => lastThreeYears(new Date().getFullYear()), []);
    const months:string[] = useMemo(() => ["Janvier","Février", "Mars", "Avril", "Mai", "Juin", "juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], []);;
    const actualMonth = useMemo(() => {
        return format(new Date(),'MMMM',{ locale: fr })
            .slice(0, 1)
            .toUpperCase()
            .concat(format(new Date(),'MMMM',{ locale: fr }).slice(1));
    }, []);

    const [selectedYear,setSelectedYear] =  useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<string>(actualMonth);
    const [filter, setFilter] = useRecoilState(babysittingFilterState);
    const buttons = useRef([]);


    useEffect(() => {
        if (selectedMonth!== undefined){giveFocus(selectedMonth)}
    }, []);


    useEffect(() => {
       console.log("selected month changed");
    }, [selectedMonth]);

    function giveFocus(index:string){
        // @ts-ignore
        buttons.current[index].focus();
    }

    function handleSelectYearChange(event:any){
        //console.log('handler : ' + event.target.value)
        setSelectedYear(event.target.value)
        setFilter({
            ...filter,
            year:event.target.value
        })
    }

    function handleMonthButtonClick(monthString:string, monthNumber:number){
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
                <select className={"p-1.5 border"} value={selectedYear} onChange={handleSelectYearChange}>
                    {years.map((year,index:number)=>(
                        <option key={`${year}-${index}`}>{year}</option>
                    ))}
                </select>
            </div>
            <div className={"flex overflow-x-scroll scrollbar-hide scroll-smooth md:flex-wrap md:overflow-hidden"}>
                {months.map((month,index)=>(
                    <button ref={(input) => {
                        // @ts-ignore
                        buttons.current[month] = input;
                    }}
                        className={"mb-2 mr-2 px-4 py-2 text-sm text-blue-600 font-semibold rounded-md border border-blue-600 " +
                        "hover:text-white hover:bg-blue-600 hover:border-transparent"}
                        key={`${month}-${index}`} onClick={()=>handleMonthButtonClick(month,index+1)}>{month}</button>
                ))}
            </div>
        </div>
    )
}

export default BabySittingFilters