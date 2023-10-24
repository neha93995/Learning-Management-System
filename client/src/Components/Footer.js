import {BsFacebook, BsInstagram,BsLinkedin,BsTwitter} from 'react-icons/bs';

function Footer(){

    const currentDate = new Date();
    const year = currentDate.getFullYear();

    return (
        <>
        <footer className='relative left-0 botton-0 h-[10vh] flex flex-col sm:flex-row items-center justify-between text-white bg-gray-800 sm:px-20 ' >

            <section className='text-lg '>
                copyright {year} | all rights reserved
            </section>
            <section className='flex items-center justtify-center gap-5 text-2xl text-white'>
                <a > <BsFacebook/> </a>
                <a > <BsInstagram/> </a>
                <a > <BsLinkedin/> </a>
                <a > <BsTwitter/> </a>
            </section>
        </footer>
        </>
    )

}

export default Footer;