import React,{useState} from 'react';
import image from '../assets/section-1.png'

const Our_story = () => {
  const [count, setCount] = useState(0)

  return (
    <section class="py-24 relative xl:mr-0 lg:mr-5 mr-0">
    <div class="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div class="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
            <div class="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                <div class="w-full flex-col justify-center items-start gap-8 flex">
                    <div class="flex-col justify-start lg:items-start items-center gap-4 flex">
                        <h6 class="text-[#41444B] text-base font-normal font-[lato] leading-relaxed">About Us</h6>
                        <div class="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                            <h2
                                class="text-black text-4xl font-medium font-[cinzel] leading-normal lg:text-start text-center">
                                The Tale of Our Hridhayam</h2>
                            <p
                                class="text-[#41444B] text-base font-normal font-[lato] leading-relaxed lg:text-start text-center">
                                Our achievement story is a testament to teamwork and perseverance. Together, we've
                                overcome challenges, celebrated victories, and created a narrative of progress and
                                success.</p>
                        </div>
                    </div>
                    <div class="w-full flex-col justify-center items-start gap-6 flex">
                        <div class="w-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                            <div
                                class="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                <h4 class="text-black text-2xl font-thin font-[cinzel] leading-9">200+ Products</h4>
                                <p class="text-[#41444B] text-base font-[lato] font-normal leading-relaxed">Influencing Digital
                                    Landscapes Together</p>
                            </div>
                            <div
                                class="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                <h4 class="text-black text-2xl font-thin font-[cinzel] leading-9">Best Craftmanship
                                </h4>
                                <p class="text-[#41444B] text-base font-[lato] font-normal leading-relaxed">Excellence Achieved
                                    Through Success</p>
                            </div>
                        </div>
                        <div class="w-full h-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                            <div
                                class="w-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                <h4 class="text-black text-2xl font-thin font-[cinzel] leading-9">New Designs Daily</h4>
                                <p class="text-[#41444B] text-base font-normal font-[lato] leading-relaxed">Our Dedication to
                                    Innovation Wins Understanding</p>
                            </div>
                            <div
                                class="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                <h4 class="text-black text-2xl font-thin font-[cinzel] leading-9">99% Happy
                                    Clients</h4>
                                <p class="text-[#41444B] text-base font-normal font-[lato] leading-relaxed">Mirrors our Focus on
                                    Client Satisfaction.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full lg:justify-start justify-center items-start flex">
                <div
                    class="sm:w-[564px] w-full sm:h-[646px] h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 relative">
                    <img class="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover"
                        src={image} alt="about Us image" />
                </div>
            </div>
        </div>
    </div>
</section>
                                        
  )
}

export default Our_story;
