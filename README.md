# 🎯 TailorHire - AI-Powered Resume Optimization Platform

## 📋 Overview

TailorHire is a cutting-edge web application that uses artificial intelligence to optimize resumes for specific job descriptions. Built with modern technologies, it helps job seekers create tailored resumes that pass through ATS (Applicant Tracking Systems) and increase their chances of landing interviews.

## ✨ Features

### �� Core Features
- **AI-Powered Resume Tailoring**: Upload your resume and job description, get a perfectly tailored resume in seconds
- **ATS Optimization**: Ensures your resume passes through automated screening systems
- **Real-time Analysis**: Get instant feedback on resume-job match percentage
- **Multiple Export Formats**: Download optimized resumes in PDF/DOCX formats
- **Learning Resources**: Personalized skill recommendations and learning paths

### 🎨 User Experience
- **Modern UI/UX**: Superhuman-inspired design with smooth animations
- **Responsive Design**: Works seamlessly across all devices
- **Magic Link Authentication**: Secure, passwordless login via email
- **Dashboard Analytics**: Track your tailoring history and progress

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.4.2** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization for analytics

### Backend & Database
- **Supabase** - Authentication and user management
- **MongoDB** - NoSQL database for resume data
- **Mongoose** - MongoDB object modeling

### AI & Automation
- **n8n** - Workflow automation for AI processing
- **Custom AI Logic** - Resume analysis and optimization algorithms

### Deployment
- **Vercel** - CI/CD deployment platform
- **GitHub** - Version control and collaboration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB database
- Supabase account
- n8n instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SalmanAh/Resume_Tailor.git
   cd resume_tailor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_MONGODB_URL=your_mongodb_connection_string
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
