import React, {useState} from "react";
import {lastThreeYears} from "../../utils/dates";
import {format} from "date-fns";
import {babysittingFilterState} from "../../recoil/recoil_states";
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
        <div className={"mb-5 pt-6 pb-8 px-8 max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-lg items-center space-x-4" }>
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
            <div>
                {months.map((month,index)=>(
                    <button className={"mx-1 px-4 py-1 text-sm text-blue-600 font-semibold rounded-md border border-blue-600 " +
                        "hover:text-white hover:bg-blue-600 hover:border-transparent " +
                        "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                        key={`${month}-${index}`} onClick={()=>handleMonthButtonClick(month,index+1)}>{month}</button>
                ))}
            </div>
        </div>
    )

}

export default BabySittingFilters