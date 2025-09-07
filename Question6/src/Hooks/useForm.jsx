import { useState } from "react"


function useForm(initialValue={}){
    const [values,setValue]=useState(initialValue);

    const handleForm=(e)=>{
        const {name,value}=e.target;
        setValue(prev=>({...prev,[name]:value}))
    }

    const resetForm=()=>setValue(initialValue);

    return {values,handleForm,resetForm} ;
}

export default useForm;