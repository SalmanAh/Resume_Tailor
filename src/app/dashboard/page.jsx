"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabase"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback } from "../../../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import {
  Sparkles,
  Upload,
  FileText,
  Download,
  Eye,
  RefreshCw,
  LogOut,
  ChevronDown,
  Target,
  Plus,
  Copy,
  ExternalLink,
  Star,
  Brain,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react"
import TailorResumeModal from "../../../components/tailor-resume-modal"
import ResumeMatchChart from "../../../components/resume-match-chart"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false)
  const [expandedResume, setExpandedResume] = useState(false)
  const [expandedHistory, setExpandedHistory] = useState({})
  const [showHistory, setShowHistory] = useState(false)
  const [expandedResource, setExpandedResource] = useState(null)
  const [dashboardData, setDashboardData] = useState({
    latestReport: null,
    suggestions: null,
    resumeHistory: []
  })
  const [userName, setUserName] = useState(null)
  const [selectedResumeId, setSelectedResumeId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true;
    const getUser = async () => {
      let tries = 0;
      let user = null;
      while (tries < 10) {
        const { data } = await supabase.auth.getUser();
        user = data.user;
        if (user) break;
        await new Promise(res => setTimeout(res, 200));
        tries++;
      }
      if (isMounted) {
        if (!user) {
          router.replace("/login");
        } else {
          setUser(user);
          // Fetch user name and dashboard data after user is authenticated
          fetchUserName(user.id);
          fetchDashboardData(user.id); // Re-enabled - fetching real data from MongoDB
        }
        setLoading(false);
      }
    };
    getUser();
    return () => { isMounted = false; };
  }, [router]);

  const fetchDashboardData = async (userId) => {
    try {
      // Fetch latest analysis, suggestions, and resume history
      const response = await fetch(`/api/dashboard-data?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchUserName = async (userId) => {
    try {
      // Fetch user name from Users_Log table
      const { data, error } = await supabase
        .from('Users_Log')
        .select('Name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user name:', error);
        return;
      }

      if (data && data.Name) {
        setUserName(data.Name);
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const loadResumeData = async (resumeId) => {
    try {
      setSelectedResumeId(resumeId);
      const response = await fetch(`/api/dashboard-data?userId=${user.id}&resumeId=${resumeId}`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
    }
  };

  const loadLatestData = async () => {
    try {
      setSelectedResumeId(null);
      const response = await fetch(`/api/dashboard-data?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error loading latest data:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const downloadResumeAsPDF = async (resumeText, filename) => {
    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Set font and size
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      // Split text into lines that fit the page width
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const maxLineWidth = pageWidth - margin * 2;

      const lines = doc.splitTextToSize(resumeText, maxLineWidth);

      // Add text to PDF
      let yPosition = margin;
      const lineHeight = 5;

      lines.forEach((line) => {
        if (yPosition > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      // Save the PDF
      doc.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }

  const toggleHistoryExpansion = (id) => {
    setExpandedHistory((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-600"
    if (score >= 80) return "text-purple-600"
    if (score >= 70) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (score) => {
    if (score >= 90) return "bg-green-100 text-green-700 border border-green-200"
    if (score >= 80) return "bg-purple-100 text-purple-700 border border-purple-200"
    if (score >= 70) return "bg-yellow-100 text-yellow-700 border border-yellow-200"
    return "bg-red-100 text-red-700 border border-red-200"
  }

  // Use real data from MongoDB with proper fallbacks
  const latestReport = dashboardData.latestReport || null;
  const suggestions = dashboardData.suggestions || null;
  const resumeHistory = dashboardData.resumeHistory || [];

  // Only show sections if we have real data
  const hasLatestReport = latestReport && latestReport.jobTitle;
  const hasSuggestions = suggestions && suggestions.suggestedSkills;
  const hasResumeHistory = resumeHistory && resumeHistory.length > 0;

  // Show loading spinner while data is being fetched
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  if (!user) {
    return null // Redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="relative z-50 px-6 py-4 shadow-[0_3px_6px_rgba(255,255,255,0.3)]">
        <nav className="flex items-center justify-between max-w-full mx-auto">
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
            {/* Dashboard user/account dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-slate-800 hover:text-white rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center relative">
                    <img 
                      src={`https://www.gravatar.com/avatar/${user.email ? user.email.toLowerCase().trim() : ''}?d=mp&s=80`}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center absolute inset-0" style={{ display: 'none' }}>
                      <span className="text-white font-bold text-lg">
                      {(userName || user.user_metadata?.full_name?.split(" ")[0])?.[0] || user.email[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white transition-colors" style={{ color: 'white' }}>{userName || user.email.split("@")[0]}</div>
                    <div className="text-xs text-gray-300 transition-colors" style={{ color: 'rgb(209 213 219)' }}>{user.email}</div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuItem className="text-gray-700 rounded-xl p-3 hover:bg-gray-50" onSelect={handleLogout}>
                  <LogOut className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <div className="font-semibold">Logout</div>
                    <div className="text-xs text-gray-500">Sign out of your account</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </nav>
      </header>

      <div className="max-w-full mx-auto px-8 py-12">
        {/* Enhanced Welcome Section */}
        <div className="mb-12 animate-fade-in">
          <div className="bg-transparent rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {userName || user.user_metadata?.full_name?.split(" ")[0] || user.email.split("@")[0]}! 👋
                </h1>
                <p className="text-xl text-gray-100">Your AI-powered resume optimization dashboard</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-2xl font-bold">{resumeHistory.length}</div>
                <div className="text-gray-100">Resumes Tailored</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-2xl font-bold">
                  {resumeHistory.length > 0 
                    ? Math.round(resumeHistory.reduce((acc, item) => acc + item.matchScore, 0) / resumeHistory.length)
                    : 0}%
                </div>
                <div className="text-gray-100">Average Match</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-2xl font-bold">
                  {resumeHistory.length > 0 
                    ? Math.max(...resumeHistory.map((item) => item.matchScore))
                    : 0}%
                </div>
                <div className="text-gray-100">Best Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* 1. Resume Match Report - Enhanced */}
            {hasLatestReport && (
              <Card className="border-0 shadow-2xl shadow-blue-500/20 animate-slide-up" style={{ background: 'linear-gradient(to right, #2b5876 0%, #2b5876 20%, #4e4376 40%, #4e4376 100%)' }}>
                <CardHeader className="pb-0 bg-transparent text-white rounded-t-xl">
                  <CardTitle className="text-4xl font-bold flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      Resume Match Report
                    </div>
                    {selectedResumeId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadLatestData}
                        className="text-black border-white/30 hover:bg-white/20 te rounded-xl px-4 transition-all duration-300"
                      >
                        ← Back to Latest
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-8 pl-8 pr-8 bg-transparent">
                  <div className="grid lg:grid-cols-2 gap-12">
                    {/* Chart - Enhanced */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-6">
                        <ResumeMatchChart
                          matchPercentage={latestReport?.matchPercentage}
                          matchedSkills={latestReport?.matchedSkills}
                          totalSkills={latestReport?.totalSkills}
                        />
                      </div>
                      
                      {/* Skills Stats moved here from right side */}
                      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
                          <div className="text-2xl font-bold text-white mb-1">
                            {latestReport?.matchedKeywords?.length || 0}
                          </div>
                          <div className="text-white font-semibold text-sm">Matched Skills</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
                          <div className="text-2xl font-bold text-white mb-1">{latestReport?.missingSkills?.length || 0}</div>
                          <div className="text-white font-semibold text-sm">Missing Skills</div>
                        </div>
                      </div>
                    </div>

                    {/* Details - Enhanced */}
                    <div className="space-y-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{latestReport?.jobTitle || "N/A"}</h3>
                        <p className="text-white/80 text-lg mb-3">{latestReport?.company || "N/A"}</p>
                        <div className="flex items-center text-white/70">
                          <Calendar className="w-5 h-5 mr-2" />
                          <span>{latestReport?.uploadDate ? new Date(latestReport.uploadDate).toLocaleDateString() : "N/A"}</span>
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <h4 className="text-lg font-semibold text-white mb-3">Tailored Summary</h4>
                        <p className="text-white/90 leading-relaxed text-lg">{latestReport?.tailoredSummary || "No tailored summary available."}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 2. Suggestions - Enhanced */}
            {hasSuggestions && (
              <Card className="border-0 shadow-2xl shadow-purple-100/50 animate-slide-up" style={{ background: 'linear-gradient(to right, #2b5876 0%, #2b5876 20%, #4e4376 40%, #4e4376 100%)', animationDelay: '0.2s' }}>
                <CardHeader className="pb-0 bg-transparent text-white rounded-t-xl">
                  <CardTitle className="text-4xl font-bold flex items-center">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    Suggested Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-8 pl-0 pr-8 bg-transparent">
                  <div className="bg-transparent rounded-2xl pt-6 pr-6 pb-6 pl-8 mt-0 mb-8">
                    <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Plus className="w-6 h-6 mr-3 text-white" />
                      Skills to Learn
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {suggestions?.suggestedSkills?.map((skill, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-4 py-2 text-base font-semibold rounded-xl border-2 border-purple-200 transition-all duration-300 hover:scale-105">
                          <Plus className="w-4 h-4 mr-2" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pl-8">
                    <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <ExternalLink className="w-6 h-6 mr-3 text-white" />
                      Learning Resources
                    </h4>
                    <div className="space-y-4">
                      {suggestions?.learningResources?.map((resource, index) => (
                        <div key={index} className="bg-gray-100 rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
                          <div
                            onClick={() => setExpandedResource(expandedResource === index ? null : index)}
                            className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <div>
                              <h5 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h5>
                              <div className="flex items-center space-x-4 text-gray-600">
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {resource.type}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {resource.duration}
                                </span>
                              </div>
                            </div>
                            <ChevronDown
                              className={`w-6 h-6 text-purple-600 transition-transform duration-300 ${expandedResource === index ? "rotate-180" : ""}`}
                            />
                          </div>

                          {expandedResource === index && (
                            <div className="p-6 bg-gray-100 border-t border-gray-200 animate-slide-down">
                              <Button
                                size="lg"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white rounded-xl py-3 shadow-lg transition-all duration-300"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(resource.url, "_blank")
                                }}
                              >
                                <ExternalLink className="w-5 h-5 mr-2" />
                                Start Learning Now
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 3. Resume History Section - Enhanced */}
            {showHistory && hasResumeHistory && (
              <Card className="border-0 shadow-2xl shadow-emerald-500/20 bg-gradient-to-br from-emerald-800 via-blue-800 to-indigo-900 overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <CardHeader className="bg-transparent text-white border-b border-white/20">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                        <Clock className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <span className="text-3xl font-bold text-white">Your Tailoring History</span>
                        <p className="text-emerald-100 text-lg mt-2">Track your progress and achievements over time</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHistory(false)}
                      className="text-white hover:bg-white/20 rounded-xl p-3 transition-all duration-300 hover:scale-105"
                    >
                      <span className="text-2xl">✕</span>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {resumeHistory.map((item, index) => (
                      <div 
                        key={item.id} 
                        className={`bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] animate-slide-up cursor-pointer ${
                          selectedResumeId === item.id 
                            ? 'border-emerald-400 shadow-emerald-500/40 ring-2 ring-emerald-400/60 bg-white/20' 
                            : 'hover:border-white/50 hover:bg-white/20'
                        }`}
                        style={{ animationDelay: `${0.1 * index}s` }}
                        onClick={() => loadResumeData(item.id)}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-4 mb-4">
                                <h4 className="text-2xl font-bold text-white truncate">{item.jobTitle}</h4>
                                <Badge className={`${getScoreBadgeColor(item.matchScore)} font-bold text-base px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm`}>
                                  {item.matchScore}% Match
                                </Badge>
                              </div>
                              <p className="text-xl text-white font-semibold mb-4">{item.company}</p>
                              <div className="flex items-center space-x-8 text-white text-lg">
                                <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                                  <Calendar className="w-5 h-5" />
                                  <span className="font-medium">{new Date(item.uploadDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                                  <span className="font-medium">{item.matchedKeywords} matched</span>
                                </div>
                                <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                                  <AlertCircle className="w-5 h-5 text-red-400" />
                                  <span className="font-medium">{item.missingSkills} missing</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 ml-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:text-emerald-300 hover:bg-white/25 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:scale-110"
                              >
                                <Eye className="w-5 h-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:text-emerald-300 hover:bg-white/25 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:scale-110"
                              >
                                <Download className="w-5 h-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleHistoryExpansion(item.id)}
                                className="text-white hover:text-emerald-300 hover:bg-white/25 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:scale-110"
                              >
                                <ChevronDown
                                  className={`w-5 h-5 transition-transform duration-300 ${
                                    expandedHistory[item.id] ? "rotate-180" : ""
                                  }`}
                                />
                              </Button>
                            </div>
                          </div>

                          {expandedHistory[item.id] && (
                            <div className="mt-6 bg-white/20 backdrop-blur-xl rounded-2xl p-6 animate-slide-down border border-white/30 shadow-xl">
                              <h5 className="text-lg font-bold text-white mb-3 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-emerald-300" />
                                Analysis Summary
                              </h5>
                              <p className="text-emerald-100 text-base leading-relaxed">{item.summary}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Data Message */}
            {!hasLatestReport && !hasSuggestions && !hasResumeHistory && (
              <Card className="border-0 shadow-2xl shadow-gray-100/50 bg-white animate-slide-up">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard!</h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Upload your first resume and job description to get started with AI-powered resume optimization.
                  </p>
                  <Button
                    onClick={() => setIsTailorModalOpen(true)}
                    className="bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg transition-all duration-300"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Your First Resume
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Enhanced */}
          <div className="space-y-8">
            {/* CTA - Enhanced */}
            <Card className="bg-gradient-to-r from-blue-600 via-purple-700 to-pink-700 text-white border-0 shadow-2xl shadow-blue-500/25 overflow-hidden relative animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-white/10"></div>
              <CardContent className="p-8 text-center relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Ready for Next Application?</h3>
                <p className="text-blue-100 text-lg mb-6">Upload resume and job description to get started</p>
                <Button
                  onClick={() => setIsTailorModalOpen(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl text-lg shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Upload className="w-6 h-6 mr-3" />
                  Tailor Resume
                </Button>
              </CardContent>
            </Card>

            {/* Custom Notes - Moved from Suggested Improvements */}
            {suggestions?.customNotes && (
              <Card className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <h4 className="text-xl font-bold text-amber-900 mb-3 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-amber-600" />
                  Custom Notes
                </h4>
                <p className="text-amber-800 text-lg leading-relaxed">{suggestions.customNotes}</p>
              </Card>
            )}

            {/* Collapsible Resume - Moved from Suggested Improvements */}
            {latestReport?.tailoredResume && (
              <Card className="rounded-2xl p-6 animate-slide-up" style={{ 
                animationDelay: '0.5s',
                background: expandedResume 
                  ? 'linear-gradient(135deg, #373B44 0%, #373B44 25%, #4b134f 50%, #4b134f 75%, #4b134f 100%)'
                  : 'transparent',
                transition: 'all 1.2s ease-in-out'
              }}>
                <Button
                  variant="outline"
                  className="w-full justify-between text-lg bg-white hover:bg-gray-50 border-2 border-gray-400 hover:border-gray-500 rounded-xl p-4 transition-all duration-300"
                  style={{
                    background: expandedResume 
                      ? 'linear-gradient(to right, #373B44 0%, #373B44 20%, #4b134f 40%, #4b134f 60%, #4b134f 80%, #4b134f 100%)'
                      : 'white',
                    color: expandedResume ? 'white' : '#374151',
                    transition: 'all 1s ease-in-out'
                  }}
                  onClick={() => setExpandedResume(!expandedResume)}
                >
                  <span className="flex items-center font-semibold">
                    <FileText className="w-6 h-6 mr-3" style={{ color: expandedResume ? 'white' : '#6B7280' }} />
                    View Tailored Resume
                  </span>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-300`} style={{ color: expandedResume ? 'white' : '#6B7280' }} />
                </Button>
                
                {expandedResume && (
                  <div className="mt-6 rounded-2xl p-8 shadow-xl border border-white/30 animate-slide-down" style={{
                    animationDelay: '0.8s',
                    transition: 'all 1.5s ease-in-out',
                    background: 'linear-gradient(135deg, #373B44 0%, #373B44 50%, #4b134f 50%, #4b134f 100%)'
                  }}>
                    <div className="flex flex-col gap-4 mb-6">
                      <h3 className="text-2xl font-bold text-white">Tailored Resume</h3>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-xl px-6 transition-all duration-300 w-full sm:w-auto"
                        >
                          <Copy className="w-5 h-5 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          size="lg" 
                          className="text-white rounded-xl px-6 py-4 shadow-lg transition-all duration-300 w-full sm:w-auto"
                          style={{
                            background: 'linear-gradient(to right, #1488CC 0%, #1E90FF 25%, #4169E1 50%, #2B32B2 75%, #2B32B2 100%)'
                          }}
                          onClick={async () => {
                            await downloadResumeAsPDF(latestReport.tailoredResume, `${latestReport.jobTitle}_Resume.pdf`);
                          }}
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <pre className="whitespace-pre-wrap text-white font-mono leading-relaxed text-base">
                        {latestReport.tailoredResume}
                      </pre>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* History Toggle Button - Enhanced */}
            {hasResumeHistory && (
              <Card className="bg-gradient-to-r from-emerald-800 via-blue-800 to-indigo-900 text-white shadow-2xl shadow-emerald-500/25 overflow-hidden relative animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <div className="absolute inset-0 bg-white/10"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">View Your History</h3>
                  <p className="text-emerald-100 text-lg mb-6">See all your tailored resumes and track your progress</p>
                  <Button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-bold py-4 rounded-2xl text-lg shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {showHistory ? "Hide History" : "Show History"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <TailorResumeModal isOpen={isTailorModalOpen} onClose={() => setIsTailorModalOpen(false)} />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-down {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}