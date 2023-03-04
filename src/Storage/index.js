const getSecttion = (key)=>{
    return JSON.parse(sessionStorage.getItem(key));
}
const setSecttion = (key,value)=>{
     sessionStorage.setItem(key,JSON.stringify(value))
}
export {getSecttion,setSecttion}