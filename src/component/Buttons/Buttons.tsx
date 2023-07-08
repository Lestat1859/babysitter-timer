import React, {useState,useEffect} from "react";

type ButtonProps={
    label:string,
    type:string,
    clickFunction:Function,
    iconImage?:string
}

const defaultStyle:string= `mb-2 mr-2 px-4 py-2
                             flex justify-between items-center 
                             text-sm text-white font-semibold 
                             bg-blue-600 rounded-md 
                             border border-blue-600 
                             hover:text-blue-600 hover:bg-white hover:border-transparent
                             focus:text-blue-600 focus:bg-white focus:border-transparent`
const validateStyle:string= `mb-2 mr-2 px-4 py-2
                             flex justify-between items-center 
                             text-sm text-white font-semibold 
                             bg-green-600 rounded-md 
                             border border-green-600 
                             hover:text-green-600 hover:bg-white hover:border-transparent
                             focus:text-green-600 focus:bg-white focus:border-transparent`
const backStyle:string= `mb-2 mr-2 px-4 py-2
                             flex justify-between items-center 
                             text-sm text-white font-semibold 
                             bg-gray-600 rounded-md 
                             border border-gray-600 
                             hover:text-gray-600 hover:bg-white hover:border-transparent
                             focus:text-gray-600 focus:bg-white focus:border-transparent`
const cancelStyle:string= `mb-2 mr-2 px-4 py-2 
                             flex justify-between items-center
                             text-sm text-white font-semibold 
                             bg-red-600 rounded-md 
                             border border-red-600 
                             hover:text-red-600 hover:bg-white hover:border-transparent
                             focus:text-red-600 focus:bg-white focus:border-transparent`

const imageClock:string= "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z";
const imageAdd:string= "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z";
const imageSave:string= "M3 19V5a2 2 0 012-2h11.172a2 2 0 011.414.586l2.828 2.828A2 2 0 0121 7.828V19a2 2 0 01-2 2H5a2 2 0 01-2-2z M8.6 9h6.8a.6.6 0 00.6-.6V3.6a.6.6 0 00-.6-.6H8.6a.6.6 0 00-.6.6v4.8a.6.6 0 00.6.6zM6 13.6V21h12v-7.4a.6.6 0 00-.6-.6H6.6a.6.6 0 00-.6.6z";
const imageDelete:string= "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
const imageBack:string= "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3";
const imageEdit:string= "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10";

function Buttons (props:ButtonProps){
    const [style, setStyle]= useState(defaultStyle);
    const [iconImage, setIconImage]= useState("");

    useEffect(() => {
    switch (props.type) {
        case "standard":
            setStyle(defaultStyle);
            break;
        case "cancel":
            setStyle(cancelStyle);
            break;
        case "back":
            setStyle(backStyle);
            break;
        case "validate":
            setStyle(validateStyle);
            break;
    }

    }, [props.type]);

    useEffect(() => {
        switch (props.iconImage) {
            case "clock":
                setIconImage(imageClock);
                break;
            case "delete":
                setIconImage(imageDelete);
                break;
            case "back":
                setIconImage(imageBack);
                break;
            case "save":
                setIconImage(imageSave);
                break;
            case "add":
                setIconImage(imageAdd);
                break;
            case "edit":
                setIconImage(imageEdit);
                break;
            default:
                setIconImage("");
        }
    }, [props.iconImage]);


    return (
        <>
            <button
                className={style}
                onClick={()=>props.clickFunction()}>
                {props.label !=="" ? (<> {props.label} </>) : (<> </>)}
                {iconImage!==""?
                    (<>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d={iconImage} />
                        </svg>
                    </>)
                        :
                    (<>

                    </>)
                }
            </button>
        </>
    )
}

export default Buttons
