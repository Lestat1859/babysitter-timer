import { atom } from "recoil";
import {IbabySitting} from "./Interfaces/IbabySitting";


const defaultDurationState:IbabySitting[] = [];


const durationState = atom({
    key: "durationState",
    default: defaultDurationState
});

export {durationState};
