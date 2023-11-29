import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {toast} from 'react-hot-toast';
import { createAccount } from "../Redux/Slices/AuthSlice";


function Signup(){

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [previewImage, setPreviewImage] = useState("");


    const [signupData, setSignupData] = useState({
        fullName:"",
        email:"",
        password:"",
        avatar:""
    })


    function handleUserInput(e)
    {
        const {name, value } = e.target;
        setSignupData({
            ...signupData,
            [name]:value

        })

    }

    function getImage(e)
    {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if(uploadedImage)
        {
            setSignupData({
                ...signupData,
                avatar:uploadedImage
            });

            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load",function(){
                setPreviewImage(this.result);
                console.log(previewImage);
                
            })
        }
    }

    async function createNewAccount(e)
    {
        e.preventDefault();
        if(!signupData.email || !signupData.password || !signupData.fullName || !signupData.avatar)
        {
            toast.error('PLEASE FILL ATT THE DETAILS');
            return;
        }

        // checking name field length

        if(signupData.fullName.length<5)
        {
            toast.error("name should be atleast of 5 characters");
            return ;
        }

        //cheking valid email
        if(!signupData.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
        {
            toast.error("invalid email formate");
            return;
        }

        //cheking password

        // if(!signupData.password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*_)(?!.*\W)(?!.* ).{8,16}$/))
        // {
        //     toast.error("password should be 8-16 character long with atleast one spcial, upper or digit");
        //     return;
        // }

        // formData 

        const formData= new FormData();
        formData.append("fullName",signupData.fullName);
        formData.append("email",signupData.email);
        formData.append("password",signupData.password);
        formData.append("avatar",signupData.avatar);
        
        // dispatch create account action
        console.log("formData",formData)
        console.log(formData.fullName);
        const response = dispatch(createAccount(formData));
        console.log('----------------',response);
        if(response?.payload?.success)
        {
            navigate('/');
        }

        setSignupData({
            fullName:"",
            email:"",
            password:"",
            avatar:""
        });

        setPreviewImage("");


    }


    return(
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh] ">
                <form noValidate onSubmit={createNewAccount} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black] ">

                    <h1 className="text-center text-2xl font-bold">Registration Page</h1>
                    <label htmlFor="avatar" className="cursor-pointer">
                        {
                            previewImage ?(
                                <img src={previewImage}alt="image sdfgsdf"  className="w-24 h-24 rounded-full m-auto" />
                            ):(
                                <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
                            )
                        }

                    </label>
                    <input 
                        className="hidden"
                        type="file"
                        id="avatar"
                        accept=".jpg, .jpeg, .png, .svg"
                        name="avatar"
                        onChange={getImage}
                     />

                     <div className="flex flex-col gap-1">
                        <label htmlFor="fullName" className="font-semibold">Name</label>
                        <input type="text" onChange={handleUserInput} value={signupData.fullName} required name="fullName" id="fullName"  placeholder="Enter your fullName ..." className="bg-transparent px-2 py-1 border "/>
                     </div>

                     <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input type="email" onChange={handleUserInput} value={signupData.email} required name="email" id="email"  placeholder="Enter your email ..." className="bg-transparent px-2 py-1 border "/>
                     </div>

                     <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-semibold">Password</label>
                        <input type="password" onChange={handleUserInput} value={signupData.password} required name="password" id="password"  placeholder="Enter your password ..." className="bg-transparent px-2 py-1 border "/>
                     </div>

                     <button type="submit" className=" bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-100 rounded-sm py-2 font-semibold text-lg cursor-pointer ">
                         Create account
                     </button>

                     <p className="text-center">
                        Already have an account ? <Link to='/login' className="link text-accent no-underline cursor-pointer" >Login</Link>
                     </p>
                </form>
            </div>
           
        </HomeLayout>
    )
}

export default Signup;