export function isUserInAuthWhiteList(user:string):boolean{
    const whiteList = process.env.REACT_APP_ACCESS_WHITELIST || "";
    return !!whiteList.split(";").find((element)=>element === user)
}

