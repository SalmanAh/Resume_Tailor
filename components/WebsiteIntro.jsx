"use client"

import React, { useState, useEffect } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Shield,
  Clock,
  Target,
  Globe,
  Smartphone,
  MessageCircle,
  Upload,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  Github,
  Linkedin,
  Twitter,
  Heart,
  ChevronDown,
  Search,
  Edit3,
  X,
  Keyboard,
  Brain,
  Check,
} from "lucide-react"
import Image from "next/image"

// Typing Animation Component
const TypingText = ({ text, speed = 50, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default function WebsiteIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const [faqAnimations, setFaqAnimations] = useState([0, 0, 0, 0, 0, 0]); // For 6 FAQ items
  const [activeFaq, setActiveFaq] = useState(-1);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const faqSection = document.querySelector('#faq-section');
      if (!faqSection) return;
      const faqCards = Array.from(faqSection.querySelectorAll('.faq-card'));
      let closestIdx = -1;
      let minDistance = Infinity;
      const viewportCenter = window.innerHeight / 2;
      faqCards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        let cardCenter = rect.top + rect.height / 2;
        // Add offset for the first FAQ so it animates a little late
        if (idx === 0) cardCenter += 180; // Increased offset for first FAQ to start animation later
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });
      setActiveFaq(closestIdx);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // run on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Get your tailored resume in seconds, not hours. AI-powered optimization at your fingertips.",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered",
      description: "Advanced AI analyzes job descriptions and optimizes your resume for maximum impact.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "ATS Optimized",
      description: "Pass through Applicant Tracking Systems with keyword-optimized resumes that get noticed.",
    },
    {
      icon: <Check className="h-8 w-8" />,
      title: "Job Matched",
      description: "Perfect alignment with job requirements increases your interview chances significantly.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      avatar: "/placeholder.svg?height=60&width=60",
      content: "TailorHire helped me land my dream job at Google. The AI optimization was incredible!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager",
      avatar: "/placeholder.svg?height=60&width=60",
      content: "I went from 0 interviews to 5 in just 2 weeks. This tool is a game-changer.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Marketing Director",
      avatar: "/placeholder.svg?height=60&width=60",
      content: "The ATS optimization feature alone is worth the investment. Highly recommended!",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Individual",
      price: "$19",
      period: "per month",
      description: "Perfect for job seekers who want to stand out from the crowd",
      features: [
        "AI-powered resume tailoring",
        "Unlimited resume optimizations",
        "ATS-friendly formatting",
        "Keyword optimization",
        "Real-time feedback",
        "Export to PDF/DOCX",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Built for professionals who need advanced features and insights",
      features: [
        "Everything in Individual",
        "Advanced analytics",
        "Multiple resume versions",
        "Priority support",
        "Cover letter generation",
        "Interview preparation tips",
      ],
      popular: true,
    },
  ]

  const faqs = [
    {
      question: "How does TailorHire work?",
      answer:
        "Simply upload your resume and paste the job description. Our AI analyzes both, identifies key requirements, and generates a perfectly tailored resume that matches the role's language and expectations.",
    },
    {
      question: "Do I need to change my resume format?",
      answer:
        "No! TailorHire works with your existing resume in any format (PDF, DOC, DOCX). We optimize the content while maintaining your preferred structure and formatting.",
    },
    {
      question: "How accurate is the AI matching?",
      answer:
        "Our AI achieves 92% accuracy in matching your skills to job requirements. It identifies relevant keywords, optimizes content for ATS systems, and ensures your resume gets past automated filters.",
    },
    {
      question: "What about my privacy and data security?",
      answer:
        "Security is our top priority. We use bank-level encryption, are SOC 2 compliant, and never store your personal information. Your data is encrypted in transit and at rest.",
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Notification Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20 px-4 py-3 text-center relative animate-in slide-in-from-top duration-500">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-purple-300">🎉</span>
            <span className="text-gray-200">TailorHire is now trusted by 10,000+ job seekers worldwide</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
                </div>
      )}

      {/* Header */}
      <header className="relative z-50 px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-transparent rounded-xl flex items-center justify-center shadow-lg">
              <img src="/File.png" alt="TailorHire Logo" className="w-10 h-10" />
              </div>
            <div>
              <h1 className="text-3xl font-bold text-white">TailorHire</h1>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#features" className="text-white hover:text-gray-200 transition-colors text-lg font-medium">Features</a>
            <a href="#how-it-works" className="text-white hover:text-gray-200 transition-colors text-lg font-medium">How It Works</a>
            <a href="#testimonials" className="text-white hover:text-gray-200 transition-colors text-lg font-medium">Testimonials</a>
            <Link href="/login" className="tailor-btn-gradient text-white px-12 py-4 text-xl rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25">
              Get Started
            </Link>
        </div>
      </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <TypingText 
              text="Land Your Dream Job with AI-Powered Resumes" 
              speed={80}
              className="text-white"
            />
          </h2>

          <div
            className={`space-y-6 mb-12 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              <TypingText 
                text="Upload your resume and job description. Get a perfectly tailored resume in seconds that matches the job requirements perfectly." 
                speed={30}
                className="text-gray-300"
              />
            </p>
          </div>

          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <style>{`
                .tailor-btn-gradient {
                  background: linear-gradient(to right, rgb(158,150,198) 0%, rgb(158,150,198) 20%, rgb(138,58,174) 50%, rgb(138,58,174) 100%);
                  border: 3px solid #e066c7;
                  transition: filter 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1);
                  filter: brightness(1);
                }
                .tailor-btn-gradient:hover {
                  filter: brightness(0.75);
                  border-color: #e066c7;
                }
              `}</style>
              <Link href="/login"
                className="tailor-btn-gradient text-white px-16 py-6 text-2xl rounded-2xl shadow-xl shadow-purple-500/30"
              >
                Start Tailoring Now
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Interface Mockup */}
      <section
        className={`px-6 pb-16 transition-all duration-1000 delay-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
            <div className="bg-slate-800/90 border-b border-slate-700/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-white font-medium">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Resume Builder</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <span>Job Matcher</span>
                    <span className="bg-slate-700 text-xs px-2 py-1 rounded">92%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <span>ATS Optimizer</span>
                    <span className="bg-slate-700 text-xs px-2 py-1 rounded">100%</span>
                    </div>
                  <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <span>Cover Letters</span>
                    <span className="bg-slate-700 text-xs px-2 py-1 rounded">AI</span>
                    </div>
                  <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <span>Analytics</span>
                    <span className="bg-slate-700 text-xs px-2 py-1 rounded">Live</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                  <Edit3 className="h-5 w-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="relative h-96 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20">
                <img
                  src="https://wallpaperaccess.com/full/1116882.jpg"
                  alt="Resume optimization interface"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>

              <div className="absolute top-8 right-8 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4 w-80 shadow-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                  <div>
                    <div className="text-white font-medium">Resume Optimized</div>
                    <div className="text-gray-400 text-sm">2 minutes ago</div>
                  </div>
                    </div>
                <p className="text-gray-300 text-sm">Your resume now matches 92% of job requirements...</p>
                    </div>

              <div className="absolute bottom-8 left-8 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4 w-72 shadow-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
                  <div>
                    <div className="text-white font-medium">ATS Score: 95%</div>
                    <div className="text-gray-400 text-sm">1 hour ago</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">Your resume will pass through all ATS filters...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-0 py-32 relative overflow-hidden w-full">
        <div className="w-full h-full relative z-10">
          <div className="relative w-full h-full">
            {/* Background Image with Gradient Opacity */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20">
              <img 
                src="/1000+.png" 
                alt="Statistics Background" 
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-center min-h-[800px] px-6">
              <div className="text-center max-w-4xl">
                <h3 className="text-4xl md:text-6xl font-bold text-white mb-8">
                  TailorHire saves professionals over
                  <span className="text-orange-400 block">1000+ hours</span>
                  every single month.
                </h3>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of job seekers who have transformed their careers with AI-optimized resumes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Built for speed and efficiency</h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every feature is designed to help you get through your job search faster and focus on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-white">{feature.title}</h4>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="px-6 py-24 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold mb-6">The fastest resume optimization ever built</h3>
              <p className="text-xl text-gray-300 mb-8">
                Every optimization is completed in under 6 seconds. Upload your resume, paste the job description,
                and let AI handle the rest.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-300">AI-powered keyword matching</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-300">ATS-friendly formatting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-300">Real-time optimization feedback</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-300">Multiple format exports</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-700/50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Upload Resume</span>
                      <span className="text-purple-400 text-sm">Drag & Drop</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      AI analyzes: "Software Engineer with 5 years experience..."
                    </div>
                  </div>
                  <div className="bg-slate-700/50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Paste Job Description</span>
                      <span className="text-purple-400 text-sm">Ctrl+V</span>
                    </div>
                    <div className="text-gray-400 text-sm">Extract key requirements and skills</div>
                  </div>
                  <div className="bg-slate-700/50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Get Tailored Resume</span>
                      <span className="text-purple-400 text-sm">&lt;6s</span>
                    </div>
                    <div className="text-gray-400 text-sm">Perfect match for the role</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Loved by thousands of job seekers</h3>
            <p className="text-xl text-gray-300">See what our users have to say about their TailorHire experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="text-white font-medium">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-24 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h3>
            <p className="text-xl text-gray-300">Choose the plan that works best for your job search</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "border-purple-500 bg-slate-800/70" : "bg-slate-800/50 border-slate-700/50"} hover:bg-slate-800/70 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
                    <p className="text-gray-300">{plan.description}</p>
              </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/login" passHref>
                    <Button
                      className={`w-full py-7 px-16 text-lg font-semibold ${plan.popular ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800" : "bg-slate-700 hover:bg-slate-600"} transition-all duration-200`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Frequently asked questions</h3>
            <p className="text-xl text-gray-300">Everything you need to know about TailorHire</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => {
              const isActive = index === activeFaq;
              const textColor = isActive 
                ? 'bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-700 bg-clip-text text-transparent' 
                : 'text-white';
              const fontSize = isActive ? 'text-2xl' : 'text-xl';
              const fontWeight = isActive ? 'font-bold' : 'font-semibold';
              return (
                <Card
                key={index}
                  className="faq-card bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <h4 
                      className={`mb-3 transition-all duration-500 ${textColor} ${fontSize} ${fontWeight}`}
                      style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      {faq.question}
                    </h4>
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Ready to land your dream job?</h3>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of job seekers who have already transformed their careers with TailorHire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" passHref>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-20 py-6 text-2xl font-bold rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-xl shadow-purple-500/30">
                Get Started Free
                </Button>
            </Link>
              </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center">
                  <img src="/File.png" alt="TailorHire Logo" className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold">TAILORHIRE</h4>
              </div>
              <p className="text-gray-400 mb-4">The fastest resume optimization ever built.</p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm">𝕏</span>
                </div>
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-white">Product</h5>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Features</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
                <li className="hover:text-white transition-colors cursor-pointer">Security</li>
                <li className="hover:text-white transition-colors cursor-pointer">Integrations</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-white">Resources</h5>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors cursor-pointer">Resume Tips</li>
                <li className="hover:text-white transition-colors cursor-pointer">Status</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-white">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">About</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 TailorHire. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">Made with 💜 for job seekers</p>
          </div>
        </div>
      </footer>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
    </div>
  )
} 