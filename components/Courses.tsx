import React from 'react';

interface CourseCardItem {
    name: string;
    description: string;
    image: string;
    price?: number;
    duration?: string;
}

const courseOptions = [
    { name: 'AI Masterclass (5 sessions)', price: 10000 },
    { name: 'AI for Business & Branding (4 sessions)', price: 10000 },
    { name: 'Advanced AI for Your Profession (5 sessions)', price: 15000 },
    { name: 'Automation and Agents Class (5 sessions)', price: 10000 },
    { name: 'Introduction to Prompt Engineering (3 sessions)', price: 8000 },
    { name: 'Generative AI for Creatives (4 sessions)', price: 12000 },
    { name: 'AI Ethics and Responsible Innovation (3 sessions)', price: 10000 },
    { name: 'Web development using Ai < 1 month>', price: 30000 },
];

const courseDetails: Omit<CourseCardItem, 'price'>[] = [
    {
        name: 'AI Masterclass (5 sessions)',
        description: 'A comprehensive journey from the fundamentals to advanced concepts of AI, machine learning, and neural networks.',
        image: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?q=80&w=1471&auto=format&fit=crop',
        duration: "5 Sessions"
    },
    {
        name: 'AI for Business & Branding (4 sessions)',
        description: 'Learn how to leverage AI to grow your business, optimize marketing, and build a powerful, future-proof brand.',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632&auto=format&fit=crop',
        duration: "4 Sessions"
    },
    {
        name: 'Advanced AI for Your Profession (5 sessions)',
        description: 'Specialized training to apply AI in your specific field, from healthcare and finance to creative arts and engineering.',
        image: 'https://images.unsplash.com/photo-1579621970795-87f54f12c1c6?q=80&w=1470&auto=format&fit=crop',
        duration: "5 Sessions"
    },
    {
        name: 'Automation and Agents Class (5 sessions)',
        description: 'Learn to build custom AI agents and automate complex tasks, boosting efficiency in your personal and professional life.',
        image: 'https://images.unsplash.com/photo-1679083216171-82802d2074e6?q=80&w=1470&auto=format&fit=crop',
        duration: "5 Sessions"
    },
     {
        name: 'Introduction to Prompt Engineering (3 sessions)',
        description: 'Master the art of communicating with AI. Learn to write effective prompts to get the best results from generative models.',
        image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1374&auto=format&fit=crop',
        duration: "3 Sessions"
    },
    {
        name: 'Generative AI for Creatives (4 sessions)',
        description: 'Unleash your creativity with AI. A hands-on course for artists, designers, and writers on using AI tools for creative projects.',
        image: 'https://images.unsplash.com/photo-1685491442163-ea06427318f7?q=80&w=1470&auto=format&fit=crop',
        duration: "4 Sessions"
    },
    {
        name: 'AI Ethics and Responsible Innovation (3 sessions)',
        description: 'Explore the ethical considerations of AI. Learn to build and deploy AI systems that are fair, transparent, and accountable.',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1470&auto=format&fit=crop',
        duration: "3 Sessions"
    },
    {
        name: 'Web development using Ai < 1 month>',
        description: 'Learn to build modern, AI-powered websites in under a month. This course covers everything from frontend design to backend integration with AI services.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1472&auto=format&fit=crop',
        duration: "< 1 Month"
    },
];

const allCourses: CourseCardItem[] = courseDetails.map(detail => {
    const pricedCourse = courseOptions.find(c => c.name === detail.name);
    return {
        ...detail,
        price: pricedCourse?.price
    };
});

const CourseCard: React.FC<{ item: CourseCardItem, onSelect: (courseName: string) => void }> = ({ item, onSelect }) => (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-200/80 dark:border-slate-700/80 flex flex-col overflow-hidden card-hover-effect">
        <div className="w-full h-48 overflow-hidden">
            <img src={item.image} alt={`Promotional image for the ${item.name} course`} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{item.name}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-grow text-base">{item.description}</p>
            {(item.price) && (
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                        {item.price ? (
                             <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                KES {item.price.toLocaleString()}
                            </p>
                        ): (
                            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        )}
                    </div>
                </div>
            )}
        </div>
         <div className="p-6 pt-0">
             <button
                onClick={() => onSelect(item.name)}
                className="w-full text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity duration-300 shadow-lg text-center"
                style={{ background: 'var(--gradient)' }}
            >
                Register Now
            </button>
        </div>
    </div>
);

const Courses: React.FC<{ onCourseSelect: (courseName: string) => void }> = ({ onCourseSelect }) => {
    return (
        <div>
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
                    <span className="gradient-text">Explore</span> Our Training Programs
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Designed for all skill levels, our courses are tailored to help you master the future of tech.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {allCourses.map((course) => (
                    <CourseCard key={course.name} item={course} onSelect={onCourseSelect} />
                ))}
            </div>
        </div>
    );
};

export default Courses;