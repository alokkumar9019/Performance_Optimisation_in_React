import React from 'react'
import useForm from '../Hooks/useForm'

const Login = () => {
    const {values,handleForm,resetForm} = useForm({
        name:"",
        email:"",
        message:"",
    })

    const handleSubmit=(e)=>{
       e.preventDefalut();
        console.log("Fill Form is:",values);
        resetForm();
    }
  return (
    <div>
        <h1>FillForm</h1>
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder='Enter Name' value={values.name} onChange={handleForm} />
            <input type="email" name="email" placeholder='Enter Email' value={values.email} onChange={handleForm} />
            
            <button type='submit'>Send</button>
        </form>
    </div>
  )
}

export default Login;