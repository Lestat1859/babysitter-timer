import React, {useState, useEffect} from "react";
import {lastThreeYears} from "../Utils/dates";
import {format} from "date-fns";
import {babysittingFilterState} from "../recoil_states";
import {useRecoilState} from "recoil";


const years:number[] = lastThreeYears(new Date().getFullYear());
const months:string[] = ["Janvier","Février", "Mars", "Avril", "Mai", "juin", "juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function BabySittingFilters() {

    const [selectedYear,setSelectedYear] =  useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(),'MMMM'));
    const [filter, setFilter] = useRecoilState(babysittingFilterState);

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
        <>
            <h3>
                {selectedMonth} {selectedYear}
            </h3>

            <div>
                <label>Sélectionner l'année : </label>
                <select value={selectedYear} onChange={handleSelectYearChange}>
                    {years.map((year,index:number)=>(
                        <option key={`${year}-${index}`}>{year}</option>
                    ))}
                </select>
            </div>
            <div>
                {months.map((month,index)=>(
                    <button key={`${month}-${index}`} onClick={()=>handleMonthButtonClick(month,index+1)}>{month}</button>
                ))}
            </div>
        </>
    )

}

export default BabySittingFilters