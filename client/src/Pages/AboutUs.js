import HomeLayout from "../Layouts/HomeLayout";
import AboutImg from '../Images/AboutImg.png';
import abdulKalam from '../Images/APJAbdulKalam.png';
import steveJobs from '../Images/SteveJobs.png';
import eintein from '../Images/einstein.png';
import billGates from '../Images/billGates.png';
import CarosualSlide from "../Components/CarosualSlide";

function AboutUs() {
    const celebraties = [
        {
            title:"Einstein",
            description:"Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
            image:eintein,
            slideNumber:1
        },
        {
            title:"APJ Abdul Kalam",
            description:"If you fail, never give up because FAIL means First Attempt In Learning",
            image:abdulKalam,
            slideNumber:2
        },
        {
            title:"Steve Jobs",
            description:"The one who are crazy enough to think that they can change the world, are the ones who do",
            image:steveJobs,
            slideNumber:3
        },
        {
            title:"Bill Gates",
            description:"It's fine to celebrate success, but it is more important to heed the lessons of failure.",
            image:billGates,
            slideNumber:4
        },
    ]
    return (
        <HomeLayout>

            <div className="pl-20 pt-20 flex-col text-white">
                <div className="flex items-center gap-5 mx-10">
                    <section className="w-1/2 space-y-10">
                        <h1 className="text-5xl text-yellow-500 font-semibold">Affordable and quality education</h1>
                        <p>Our goal is to provide the Affordableand quality education to the world.
                            Wee are Provideing the platform for the aspiring and students to share their skills, creativity and knowledge to each other to empower and contribute inthe growth and wellness of mankind.
                        </p>
                    </section>
                    <div className="w-1/3 m-5">
                        <img
                            id="test1"
                            style={{
                                filter: 'drop-shadow(0px 2px 2px green)'
                            }}
                            className="drop-shadow-2xl "
                            src={AboutImg}
                            alt='about main image'
                        />

                    </div>
                </div>
            </div>

            <div className="flex justify-center ">

                <div className="carousel w-1/3 my-16">
                    {
                        celebraties && celebraties.map((celebrity)=>{
                            return (
                                <CarosualSlide
                                    {...celebrity}
                                    totalSlide={celebraties.length}
                                    key={celebrity.slideNumber}

                                />
                            )
                        })
                    }
                </div>

            </div>
        </HomeLayout>
    )
}

export default AboutUs;