import React, {useState} from "react";
import {lastThreeYears} from "../Utils/dates";
import {format} from "date-fns";


const years:number[] = lastThreeYears(new Date().getFullYear());
const months:string[] = ["Janvier","Février", "Mars", "Avril", "Mai", "juin", "juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function BabySittingFilters() {

    const [selectedYear,setSelectedYear] =  useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(),'MMMM'));

    function handleSelectYearChange(event:any){
        //console.log('handler : ' + event.target.value)
        setSelectedYear(event.target.value)
    }

    function handleMonthButtonClick(month:string){
        setSelectedMonth(month);
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
                {months.map((month)=>(
                    <button onClick={()=>handleMonthButtonClick(month)}>{month}</button>
                ))}
            </div>
        </>
    )

}

export default BabySittingFilters