function CarosualSlide({image, title, description, slideNumber, totalSlide}) {

    return (
        <div id={`slide${slideNumber}`} className="carousel-item relative w-full flex flex-col items-center justify-center gap-4">
            <img src={image} alt="image" className="w-40 h-40 rounded-full border-4 border-gray-500 m-auto" />
            <p className="text-xl text-gray-200  text-center">"{description}"</p>
            <h3 className="text-2xl font-semibold">{title}</h3>
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/3">
                <a href={`#slide${slideNumber==1 ?slideNumber-1 :totalSlide}`} className="btn btn-circle">❮</a>
                <a href={`#slide${(slideNumber%totalSlide)+1}`} className="btn btn-circle">❯</a>
            </div>
        </div>
    )

}

export default CarosualSlide;