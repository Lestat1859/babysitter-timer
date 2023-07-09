import React, {useState,useEffect} from "react";

import {buttonImages} from "../../utils/buttonImages";
import {stringify} from "uuid/index";

type ButtonProps={
    label:string,
    type:string,
    clickFunction:Function,
    iconImage?:string
    hiddenMd?:boolean
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
const transparentBgStyle:string=`px-3 py-2 text-sm text-gray-600 font-semibold rounded-full md:hidden  
                    hover:text-white hover:bg-blue-600 hover:border-transparent 
                    focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`

function Buttons (props:ButtonProps){
    const [style, setStyle]= useState(defaultStyle);
    const [iconImage, setIconImage]= useState("");

    useEffect(() => {
        let style:string=''
    switch (props.type) {
        case "standard":
            style = defaultStyle;
            break;
        case "cancel":
            style = cancelStyle;
            break;
        case "back":
            style = backStyle;
            break;
        case "validate":
            style = validateStyle;
            break;
        case "transparentBgStyle" :
            style= transparentBgStyle;
            break;
    }

    if (props.hiddenMd) {style = style + " md:hidden"}
    setStyle(style);

    }, [props.type]);

    useEffect(() => {

        switch (props.iconImage) {
            case "clock":
                setIconImage(buttonImages.get('clock'));
                break;
            case "delete":
                setIconImage(buttonImages.get('delete'));
                break;
            case "back":
                setIconImage(buttonImages.get('back'));
                break;
            case "save":
                setIconImage(buttonImages.get('save'));
                break;
            case "add":
                setIconImage(buttonImages.get('add'));
                break;
            case "edit":
                setIconImage(buttonImages.get('edit'));
                break;
            case "detail":
                setIconImage(buttonImages.get('detail'));
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
