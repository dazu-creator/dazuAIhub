import React, { useState, useEffect } from 'react';

const QuoteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg aria-hidden="true" className={className} width="45" height="36" viewBox="0 0 45 36" fill="url(#quote-gradient)" xmlns="http://www.w3.org/2000/svg">
     <defs>
        <linearGradient id="quote-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'var(--gradient-start)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'var(--gradient-end)', stopOpacity: 1}} />
        </linearGradient>
    </defs>
    <path d="M13.5938 36C10.0521 36 6.94271 34.8125 4.26562 32.4375C1.58854 30.0625 0.25 27.2188 0.25 23.9062C0.25 19.5312 1.58854 15.3438 4.26562 11.3438C6.94271 7.34375 10.4844 3.65625 14.8854 0.28125L19.75 4.65625C15.9062 7.40625 13.0625 10.25 11.2188 13.1875C9.375 16.125 8.45833 19.3438 8.45833 22.8438H13.5938V36ZM38.2812 36C34.7396 36 31.6302 34.8125 28.9531 32.4375C26.276 30.0625 24.9375 27.2188 24.9375 23.9062C24.9375 19.5312 26.276 15.3438 28.9531 11.3438C31.6302 7.34375 35.1719 3.65625 39.5729 0.28125L44.4375 4.65625C40.5938 7.40625 37.75 10.25 35.9062 13.1875C34.0625 16.125 33.1458 19.3438 33.1458 22.8438H38.2812V36Z" />
  </svg>
);


const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote: "The AI Masterclass completely changed how I approach my work. The instructors at Dazu AI Hub are true experts and made complex topics easy to understand.",
      name: "Lydiah Shiroh",
      title: "Lead Developer, Tech Solutions Inc.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      quote: "Dazu AI Hub's web development service was exceptional. They built a fast, modern, and AI-integrated site for my business that has significantly boosted user engagement.",
      name: "Aadan Hussein",
      title: "Founder, Hussein Ventures",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      quote: "The automation solutions created by Dazu have saved my team countless hours. Their ability to understand our workflow and apply AI has been a complete game-changer.",
      name: "Victor Owino",
      title: "Operations Manager, Swift Logistics",
      avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      quote: "The 'Introduction to Prompt Engineering' course was a revelation. I now communicate with AI tools with so much more precision, and my team's content output has doubled.",
      name: "Amina Yusuf",
      title: "Content Strategist, Digital Nomads KE",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      quote: "As a visual artist, the 'Generative AI for Creatives' course opened up a new world of possibilities. It's an incredible tool for brainstorming and creating unique art.",
      name: "Ken Omondi",
      title: "Graphic Designer & Illustrator",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      quote: "I was intimidated by AI, but the 'AI for Business' course made it so accessible. I'm now using AI for marketing and inventory, and it's made a huge difference for my small shop.",
      name: "Brenda Wanjiku",
      title: "Small Business Owner, Wanjiku's Crafts",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <div>
        <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
                What Our <span className="gradient-text">Clients Say</span>
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                We are proud to help our clients achieve their goals.
            </p>
        </div>
        <div className="max-w-3xl mx-auto relative">
            <div className="relative h-[320px] sm:h-[280px] w-full overflow-hidden" aria-live="polite">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        id={`testimonial-panel-${index}`}
                        role="tabpanel"
                        aria-labelledby={`testimonial-tab-${index}`}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                        aria-hidden={index !== activeIndex}
                    >
                        <figure className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 relative overflow-hidden h-full flex flex-col">
                            <QuoteIcon className="absolute top-6 left-6 text-slate-100 dark:text-slate-700 opacity-20 w-16 h-16" />
                            <blockquote className="relative z-10 flex flex-col h-full">
                                <p className="text-slate-700 dark:text-slate-300 text-lg mb-6 flex-grow">"{testimonial.quote}"</p>
                                <footer className="flex items-center mt-auto">
                                    <img className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-white dark:border-slate-700 shadow-md" src={testimonial.avatar} alt={`Headshot of ${testimonial.name}, ${testimonial.title}`} />
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-slate-100 text-lg">{testimonial.name}</p>
                                        <cite className="text-sm text-transparent bg-clip-text not-italic" style={{backgroundImage: 'var(--gradient)'}}>{testimonial.title}</cite>
                                    </div>
                                </footer>
                            </blockquote>
                        </figure>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button onClick={goToPrev} aria-label="Previous testimonial" className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-slate-700 transition">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
             <button onClick={goToNext} aria-label="Next testimonial" className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-slate-700 transition">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Indicator Dots */}
            <div className="flex justify-center space-x-3 pt-6" role="tablist" aria-label="Testimonials">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        role="tab"
                        id={`testimonial-tab-${index}`}
                        aria-controls={`testimonial-panel-${index}`}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                        aria-selected={index === activeIndex}
                        tabIndex={index === activeIndex ? 0 : -1}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex ? 'p-1' : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'}`}
                    >
                        <div 
                            className="w-full h-full rounded-full"
                            style={{background: index === activeIndex ? 'var(--gradient)' : 'transparent'}}
                        ></div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Testimonials;