import { motion } from "framer-motion";
import { Award, ListChecks, Headphones, Shield } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function AboutMakita({ data, filteredData }) {
     const { aboutuses, webdetail, strengths } = filteredData;
     const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
     const [isHovering, setIsHovering] = useState(false);
     const [timelineScrollPosition, setTimelineScrollPosition] = useState(0);
     const timelineRef = React.useRef(null);
     
      const sectionOne = aboutuses?.find(
        (item) => item.correlative === "section-1-about"
    );
    const sectionTwo = aboutuses?.find(
        (item) => item.correlative === "section-2-about"
    );
    const sectionThree = aboutuses?.find(
        (item) => item.correlative === "section-3-about"
    );
    const sectionFour = aboutuses?.find(
        (item) => item.correlative === "section-4-about"
    );

    // Auto-advance timeline
    useEffect(() => {
        if (!isHovering) {
            const interval = setInterval(() => {
                setActiveTimelineIndex((prev) => {
                    try {
                        const timelineData = sectionThree?.timeline ? JSON.parse(sectionThree.timeline) : [];
                        return (prev + 1) % timelineData.length;
                    } catch (e) {
                        return 0;
                    }
                });
            }, 5000); // Change every 5 seconds

            return () => clearInterval(interval);
        }
    }, [isHovering, sectionThree?.timeline]);
    
    // Scroll timeline to active point
    useEffect(() => {
        if (timelineRef.current) {
            try {
                const timelineData = sectionThree?.timeline ? JSON.parse(sectionThree.timeline) : [];
                if (timelineData.length > 0) {
                    const container = timelineRef.current;
                    const scrollContainer = container.querySelector('.timeline-scroll');
                    const points = container.querySelectorAll('.timeline-point');
                    
                    if (points[activeTimelineIndex]) {
                        const point = points[activeTimelineIndex];
                        const pointOffset = point.offsetLeft;
                        const containerWidth = scrollContainer.clientWidth;
                        
                        // Calculate position to center the point
                        const scrollTo = pointOffset - (containerWidth / 2) + (point.clientWidth / 2);
                        
                        // Smooth scroll to the position
                        scrollContainer.scrollTo({
                            left: scrollTo,
                            behavior: 'smooth'
                        });
                    }
                }
            } catch (e) {
                console.error("Error scrolling timeline:", e);
            }
        }
    }, [activeTimelineIndex, sectionThree?.timeline]);

  

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    console.log("Section Tree Timeline" , sectionThree);


    return (
        <div className="font-paragraph">
            {/* Custom styles for timeline */}
            <style jsx>{`
               
                .timeline-scroll::-webkit-scrollbar {
                    height: 8px;
                }
                .timeline-scroll::-webkit-scrollbar-track {
                   background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
                }
                .timeline-scroll::-webkit-scrollbar-thumb {
                   background: rgba(255, 255, 255, 0.8);
      border-radius: 20px;
      border: 2px solid transparent;
      background-clip: padding-box;
                }
               
                
               
                
                /* Smooth scroll behavior */
                .timeline-scroll {
                    scroll-behavior: smooth;
                }
                
                /* Removed scroll indicators gradients */
                
                /* Timeline specific styles */
                .timeline-scroll .flex-col {
                    position: relative;
                    transition: transform 0.3s ease;
                }
                
                /* Removed content connector lines */
                
                /* Hover effects for timeline points */
                .timeline-scroll .flex-col:hover .timeline-point {
                   
                    box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
                }
                
                /* Active timeline point with pulsing effect */
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                    }
                }
                
                .timeline-point.scale-100 {
                    animation: pulse 2s infinite;
                }
                
                /* Content transition effects */
                .timeline-scroll h3, 
                .timeline-scroll p,
                .timeline-scroll .text-primary {
                    transition: all 0.3s ease;
                }
                
                /* Timeline responsive adjustments */
                @media (max-width: 768px) {
                    .timeline-scroll .flex-col {
                        min-width: 180px;
                    }
                    
                    .timeline-scroll h3 {
                        font-size: 1rem;
                    }
                    
                    .timeline-scroll p {
                        font-size: 0.875rem;
                    }
                }
            `}</style>
            {/* Hero Section */}
            <div className="bg-gray-50 py-16 customtext-neutral-dark">
                <div className="px-[5%] mx-auto 2xl:px-0 2xl:max-w-7xl">
                    <div className="  mb-12">
                        <h1 className="max-w-6xl text-center  mx-auto text-3xl lg:text-5xl font-bold mb-6">
                            {sectionOne?.title}
                        </h1>


                        <div 
                            className="customtext-neutral-dark columns-1 md:columns-2 gap-8 text-justify" 
                            dangerouslySetInnerHTML={{ __html: sectionOne?.description }}
                        ></div>


                        <div className="mt-8 flex justify-center items-center">
                            <a href="/contacto" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all">
                                Contáctame
                            </a>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden shadow-md mt-10">
                        <img
                            src={`/storage/images/aboutus/${sectionOne?.image}`}
                            alt={sectionOne?.title || "Makita Cover"}
                            className="w-full aspect-[16/6] object-cover"
                             onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        />
                    </div>
                </div>
            </div>

            {/* Sobre nosotros section */}
            <div className="py-16">
                <div className="px-[5%] mx-auto 2xl:px-0 2xl:max-w-7xl">
                    <div className="grid md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-5">
                            <img
                                src={`/storage/images/aboutus/${sectionTwo?.image}`}
                                alt={sectionTwo?.title || "Trabajador con herramienta Makita"}
                                className="w-full aspect-[4/3] rounded-xl shadow-md object-cover"
                                onError={(e) => {
                                    e.target.src = "/api/cover/thumbnail/null";
                                }}
                            />
                        </div>

                        <div className="md:col-span-7">
                            <h2 className="text-3xl font-bold mb-6">
                               {sectionTwo?.title || "Sobre nosotros"}
                            </h2>

                        <div className="customtext-neutral-dark   gap-8 text-left" dangerouslySetInnerHTML={{ __html: sectionTwo?.description }}></div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline section */}
            <div className="bg-neutral-dark text-white py-20 relative overflow-hidden">
                <div className="px-[5%] mx-auto 2xl:px-0 2xl:max-w-7xl">
                    {sectionThree?.image && (
                        <img
                            src={`/storage/images/aboutus/${sectionThree.image}`}
                            alt={sectionThree?.title || "Timeline Background"}
                            className="w-full h-full object-cover absolute inset-0 "
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        />
                    )}
                    
                    <div className="relative z-10" id="timeline" ref={timelineRef}>
                        <div className="text-center mb-12">
                           
                            {sectionThree?.description && (
                                <div 
                                    className="text-xl text-gray-300 max-w-3xl mx-auto"
                                    dangerouslySetInnerHTML={{ __html: sectionThree.description }}
                                />
                            )}
                        </div>

                        {/* Timeline Progress Bar Style - Alternating Content */}
                        {sectionThree?.timeline && (() => {
                            let timelineData = [];
                            try {
                                timelineData = JSON.parse(sectionThree.timeline);
                            } catch (e) {
                                console.error("Error parsing timeline:", e);
                                return <p className="text-center text-gray-400">Error al cargar el timeline</p>;
                            }

                            if (!timelineData || timelineData.length === 0) {
                                return <p className="text-center text-gray-400">No hay eventos en el timeline</p>;
                            }

                            return (
                                <div 
                                    className="relative w-full overflow-x-auto timeline-scroll pb-12"
                                    onMouseEnter={() => setIsHovering(true)}
                                    onMouseLeave={() => setIsHovering(false)}
                                >
                                    <div className="relative flex flex-col items-center min-w-max ">
                                        {/* Timeline line */}
                                        <div className="absolute left-0 right-0 top-1/2 h-[3px] bg-gray-600 z-0" style={{transform: 'translateY(-50%)'}}></div>
                                        
                                        {/* Active timeline progress bar */}
                                        <div 
                                            className="absolute left-0 top-1/2 h-[3px] bg-white z-1 transition-all duration-500"
                                            style={{
                                                width: `${(activeTimelineIndex / (timelineData.length - 1)) * 100}%`,
                                                transform: 'translateY(-50%)'
                                            }}
                                        ></div>
                                        
                                        {/* Timeline points and content */}
                                        <div className="flex w-full justify-between relative z-10" style={{alignItems: 'center'}}>
                                            {timelineData.map((event, index) => {
                                                const isActive = index <= activeTimelineIndex;
                                                const isEven = index % 2 === 0;
                                                
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className="flex flex-col  relative"
                                                        style={{
                                                            minWidth: '220px',
                                                            width: `${100 / timelineData.length}%`
                                                        }}
                                                        onClick={() => setActiveTimelineIndex(index)}
                                                    >
                                                        {/* Top content */}
                                                        {isEven ? (
                                                            <div 
                                                                className={` pb-10 w-full mb-16 max-w-[600px] text-left transition-opacity duration-300 ${
                                                                    isActive ? 'opacity-100' : 'opacity-50'
                                                                }`}
                                                            >
                                                                <h3 className="text-xl font-bold mb-2 text-white">{event.year} - {event.name}</h3>
                                                                <p className="text-gray-300 text-sm leading-relaxed line-clamp-6">{event.description}</p>
                                                            </div>
                                                        ) : (
                                                            <div className="mb-12 h-[110px]"></div>
                                                        )}
                                                        
                                                        {/* Point */}
                                                        <div 
                                                            className={` flex items-center justify-center top-1/2 -translate-y-1/2 w-6 h-6 p-2 rounded-full border-2 transition-all duration-300 z-20 absolute 
                                                                ${isActive 
                                                                    ? ' border-white scale-100' 
                                                                    : ' border-transparent scale-75'
                                                            } `}
                                                            style={{
                                                                position: 'absolute',
                                                               
                                                                zIndex: 30
                                                            }}
                                                        >
                                                            <div className={`min-w-3 min-h-3 max-w-3 max-h-3 rounded-full  
                                                            ${isActive 
                                                                    ? ' bg-white ' 
                                                                    : ' bg-white '
                                                            }`}></div>
                                                        </div>
                                                        
                                                       
                                                        
                                                        {/* Bottom content */}
                                                        {!isEven ? (
                                                            <div 
                                                                className={`mt-8 w-full max-w-[600px] text-left transition-opacity duration-300 ${
                                                                    isActive ? 'opacity-100' : 'opacity-50'
                                                                }`}
                                                            >
                                                                <h3 className="text-xl font-bold mb-2 text-white"> {/* Year indicator under point */}
                                                       
                                                            {event.year} -
                                                       {event.name}</h3>
                                                                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">{event.description}</p>
                                                            </div>
                                                        ) : (
                                                            <div className="mt-8 h-[80px]"></div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* Garantía de calidad */}
            <div className="py-16">
                <div className=" mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">{sectionFour?.title}</h2>

                          <div className="customtext-neutral-dark text-lg mb-6" dangerouslySetInnerHTML={{ __html: sectionFour?.description }}></div>

                        </div>

                        <div>
                            <img
                                 src={`/storage/images/aboutus/${sectionFour?.image}`}
                                alt="Control de calidad Makita"
                                className="w-full h-auto rounded-xl shadow-md object-cover"
                               onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


