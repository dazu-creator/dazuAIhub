import React, { useState, useEffect, useRef } from 'react';

const courseOptions = [
    { name: 'AI Masterclass (5 sessions)', price: 10000 },
    { name: 'AI for Business & Branding (4 sessions)', price: 10000 },
    { name: 'Advanced AI for Your Profession (5 sessions)', price: 15000 },
    { name: 'Automation and Agents Class (5 sessions)', price: 10000 },
    { name: 'Introduction to Prompt Engineering (3 Sessions)', price: 8000 },
    { name: 'Generative AI for Creatives (4 Sessions)', price: 12000 },
    { name: 'AI Ethics and Responsible Innovation (3 Sessions)', price: 10000 },
    { name: 'Web development using Ai < 1 month>', price: 30000 },
];


const MpesaIcon: React.FC = () => (
    <svg className="w-24 h-auto" viewBox="0 0 250 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="250" height="80" rx="10" fill="#4CAF50"/>
        <text x="125" y="50" fontFamily="Arial, sans-serif" fontSize="40" fill="white" textAnchor="middle" dominantBaseline="middle">M-PESA</text>
    </svg>
);

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCourse?: string;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, initialCourse }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        county: '',
        course: '',
        level: '',
        goals: '',
    });
    const [selectedCoursePrice, setSelectedCoursePrice] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStep, setFormStep] = useState(1); // 1: form, 2: success, 3: payment, 4: error
    const [formErrors, setFormErrors] = useState<Partial<typeof formData>>({});
    const [isRendered, setIsRendered] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            triggerRef.current = document.activeElement as HTMLElement;
            setIsRendered(true);
            if (initialCourse) {
                 setFormData(prev => ({ ...prev, course: initialCourse }));
            }
        } else {
            const timer = setTimeout(() => {
                 setIsRendered(false);
                 setFormData({ name: '', email: '', phone: '', county: '', course: '', level: '', goals: '' });
                 setFormErrors({});
                 setFormStep(1);
                 setIsSubmitting(false);
                 setServerError(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, initialCourse]);
    
     useEffect(() => {
        if (isOpen) {
            const modalNode = modalRef.current;
            if (!modalNode) return;

            const focusableElements = modalNode.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            firstElement?.focus();

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                } else if (e.key === 'Escape') {
                    onClose();
                }
            };

            modalNode.addEventListener('keydown', handleKeyDown);
            
            return () => {
                modalNode.removeEventListener('keydown', handleKeyDown);
                triggerRef.current?.focus();
            }
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        const course = courseOptions.find(c => c.name === formData.course);
        setSelectedCoursePrice(course ? course.price : 0);
    }, [formData.course]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name as keyof typeof formData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    
    const validateForm = () => {
        const errors: Partial<typeof formData> = {};
        if (!formData.name.trim()) errors.name = 'Full name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        else if (!/^(07|01)\d{8}$/.test(formData.phone)) errors.phone = 'Enter a valid Kenyan number (e.g., 0712345678)';
        if (!formData.county.trim()) errors.county = 'County is required';
        if (!formData.course) errors.course = 'Please select a course';
        if (!formData.level) errors.level = 'Please select your current level';
        if (!formData.goals.trim()) errors.goals = 'Please tell us your goals';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        setServerError(null);

        try {
            // In a real app, use import.meta.env.VITE_API_URL
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            setFormStep(2); // Success step
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setServerError(errorMessage);
            setFormStep(4); // Error step
        } finally {
            setIsSubmitting(false);
        }
    };

    const proceedToPayment = () => {
        setIsSubmitting(true);
        // Simulate STK push
        setTimeout(() => {
            setIsSubmitting(false);
            setFormStep(3);
        }, 2000);
    };

    if (!isRendered) return null;

    const formElementClasses = (hasError: boolean) => 
        `w-full px-4 py-3 rounded-xl transition input-3d ${hasError ? 'border border-red-500' : 'border border-transparent'}`;

    
    const renderContent = () => {
        switch (formStep) {
            case 1: // Form
                return (
                    <form onSubmit={handleSubmit} noValidate className="overflow-y-auto p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`${formElementClasses(!!formErrors.name)} bg-slate-50 dark:bg-slate-700`} required aria-describedby={formErrors.name ? "name-error" : undefined} />
                                {formErrors.name && <p id="name-error" className="text-red-500 text-xs mt-1" role="alert">{formErrors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="0712345678" className={`${formElementClasses(!!formErrors.phone)} bg-slate-50 dark:bg-slate-700`} required aria-describedby={formErrors.phone ? "phone-error" : undefined} />
                                {formErrors.phone && <p id="phone-error" className="text-red-500 text-xs mt-1" role="alert">{formErrors.phone}</p>}
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`${formElementClasses(!!formErrors.email)} bg-slate-50 dark:bg-slate-700`} required aria-describedby={formErrors.email ? "email-error" : undefined} />
                                {formErrors.email && <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">{formErrors.email}</p>}
                            </div>
                             <div>
                                <label htmlFor="county" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">County</label>
                                <input type="text" id="county" name="county" value={formData.county} onChange={handleChange} placeholder="e.g., Nairobi" className={`${formElementClasses(!!formErrors.county)} bg-slate-50 dark:bg-slate-700`} required aria-describedby={formErrors.county ? "county-error" : undefined} />
                                {formErrors.county && <p id="county-error" className="text-red-500 text-xs mt-1" role="alert">{formErrors.county}</p>}
                            </div>
                             <div>
                                <label htmlFor="course" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Choose Your Course</label>
                                <div className="relative">
                                    <select id="course" name="course" value={formData.course} onChange={handleChange} className={`${formElementClasses(!!formErrors.course)} bg-white dark:bg-slate-700 appearance-none`} required aria-describedby={formErrors.course ? "course-error" : undefined}>
                                        <option value="" disabled>Select a course</option>
                                        {courseOptions.map(course => (
                                            <option key={course.name} value={course.name}>
                                                {`${course.name} - KES ${course.price.toLocaleString()}`}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                                {formErrors.course && <p id="course-error" className="text-red-500 text-xs mt-1" role="alert">{formErrors.course}</p>}
                            </div>
                             <div>
                                <label htmlFor="level" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Current AI Level</label>
                                <div className="relative">
                                    <select id="level" name="level" value={formData.level} onChange={handleChange} className={`${formElementClasses(!!formErrors.level)} bg-white dark:bg-slate-700 appearance-none`} required aria-describedby={formErrors.level ? "level-error" : undefined}>
                                        <option value="" disabled>Select a level</option>
                                        <option value="Beginner">Beginner (Just starting out)</option>
                                        <option value="Intermediate">Intermediate (Some experience)</option>
                                        <option value="Advanced">Advanced (Ready for complex topics)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                                {formErrors.level && <p id="level-error" className="text-red-500 text-xs mt-1" role="alert">{formErrors.level}</p>}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="goals" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">What do you hope to achieve?</label>
                            <textarea id="goals" name="goals" value={formData.goals} onChange={handleChange} rows={4} className={`${formElementClasses(!!formErrors.goals)} bg-slate-50 dark:bg-slate-700`} placeholder="e.g., Build my own AI projects, automate business tasks..." required aria-describedby={formErrors.goals ? "goals-error" : undefined}></textarea>
                            {formErrors.goals && <p id="goals-error" className="text-red-500 text-xs mt-1" role="alert">{formErrors.goals}</p>}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full text-white font-bold px-6 py-4 rounded-xl hover:opacity-90 transition-opacity duration-300 shadow-lg text-center flex items-center justify-center disabled:opacity-50"
                                style={{ background: 'var(--gradient)' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Submitting...
                                    </>
                                ) : 'Submit Registration'}
                            </button>
                        </div>
                    </form>
                );
            case 2: // Success
                return (
                    <div className="p-8 text-center">
                        <svg className="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Registration Submitted!</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Thank you, {formData.name}. We've received your details. Please proceed to payment to secure your spot.</p>
                        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg mb-6">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.course}</p>
                            <p className="text-2xl font-bold gradient-text">KES {selectedCoursePrice.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={proceedToPayment}
                            disabled={isSubmitting}
                            className="w-full text-white font-bold px-6 py-4 rounded-xl hover:opacity-90 transition-opacity duration-300 shadow-lg flex items-center justify-center disabled:opacity-50"
                            style={{ background: 'var(--gradient)' }}
                        >
                             {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                    </div>
                );
            case 3: // Payment
                return (
                    <div className="p-8 text-center">
                        <MpesaIcon />
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 my-4">Confirm Payment</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">An M-PESA payment request of <span className="font-bold">KES {selectedCoursePrice.toLocaleString()}</span> has been sent to your phone number <span className="font-bold">{formData.phone}</span>.</p>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Please enter your M-PESA PIN to authorize the transaction.</p>
                         <div className="animate-pulse text-slate-500 dark:text-slate-400 text-sm">
                            Waiting for payment confirmation...
                        </div>
                        <button onClick={onClose} className="mt-6 text-sm text-teal-600 dark:text-teal-400 hover:underline">I have paid</button>
                    </div>
                );
             case 4: // Error
                return (
                     <div className="p-8 text-center">
                        <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Something went wrong</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">{serverError || "We couldn't process your registration. Please try again."}</p>
                        <button
                            onClick={() => setFormStep(1)}
                            className="w-full text-white font-bold px-6 py-4 rounded-xl hover:opacity-90 transition-opacity duration-300 shadow-lg"
                            style={{ background: 'var(--gradient)' }}
                        >
                            Try Again
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 flex items-center justify-center p-4 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-modal-title"
        >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>
            <div 
                ref={modalRef}
                className={`relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <h2 id="registration-modal-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {formStep === 1 ? 'Register for a Course' : 'Registration'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-2" aria-label="Close registration form">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default RegistrationModal;