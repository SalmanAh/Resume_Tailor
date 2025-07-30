"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import Textarea from "./ui/textarea"
import Switch from "./ui/switch"
import { Upload, Sparkles } from "lucide-react"
import { supabase } from "../lib/supabase";
import { connectDB, getModels } from "../lib/mongodb";

export default function TailorResumeModal({ isOpen, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && (file.type === "application/pdf" || file.name.endsWith(".pdf"))) {
      setSelectedFile(file)
    } else {
      alert("Please select a PDF file")
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile || !jobTitle.trim() || !jobDescription.trim()) {
      alert("Please upload a resume, enter the job title, and paste the job description");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Get current user from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("User not authenticated. Please log in again.");
        setIsProcessing(false);
        return;
      }
      const userId = user.id;

      // 2. Upload PDF to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const timestamp = Date.now();
      const filePath = `${userId}/${timestamp}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from("resumes").upload(filePath, selectedFile);
      if (uploadError) {
        alert("Failed to upload resume PDF: " + uploadError.message);
        setIsProcessing(false);
        return;
      }
      // Get public URL (since bucket is public)
      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(filePath);
      const fileURL = urlData.publicUrl;

          // 3. Send data to n8n webhook
    const n8nWebhookUrl = "https://internshipkaam123.app.n8n.cloud/webhook/ai-resume-tailor-pdf";
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfUrl: fileURL,
          jobDescription: jobDescription.trim(),
        }),
      });
      const n8nResult = await n8nResponse.json();

      // 4. Send data to API route to create JobDescription and Resume
      const response = await fetch("/api/tailor-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          jobTitle: jobTitle.trim(),
          companyName: companyName.trim(),
          jobDescription: jobDescription.trim(),
          fileURL,
        }),
      });
      const result = await response.json();
      if (!result.success) {
        alert("An error occurred: " + (result.error || "Unknown error"));
        setIsProcessing(false);
        return;
      }
      const resumeId = result.resumeId;
      const jobId = result.jobId;

      // Parse the AI result from n8n
      let aiData;
      try {
        aiData = JSON.parse(n8nResult.message.content);
      } catch (e) {
        alert("Failed to parse AI result: " + e.message);
        setIsProcessing(false);
        return;
      }

      // Store analysis and suggestions in MongoDB via API route
      try {
        const storeResponse = await fetch('/api/store-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            resumeId,
            jobId,
            aiData,
          }),
        });
        const storeResult = await storeResponse.json();
        if (!storeResult.success) {
          alert("Failed to store analysis/suggestions: " + (storeResult.error || 'Unknown error'));
          setIsProcessing(false);
          return;
        }
      } catch (e) {
        alert("Failed to store analysis/suggestions: " + e.message);
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);
      onClose();
      alert("Resume tailored successfully! Check your dashboard for the results.");
    } catch (err) {
      setIsProcessing(false);
      alert("An error occurred: " + (err.message || err));
    }
  };

  const handleClose = () => {
    setSelectedFile(null)
    setJobTitle("")
    setCompanyName("")
    setJobDescription("")
    setIsProcessing(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-slate-800/90 backdrop-blur-md border-purple-200/30 max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-transparent rounded-xl flex items-center justify-center shadow-lg">
              <img src="/File.png" alt="TailorHire Logo" className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
              Tailor New Resume
              </h2>
              <p className="text-sm text-gray-300">AI-Powered Resume Optimization</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">Upload Your Resume</Label>
            <div className="border-2 border-dashed border-purple-300/50 rounded-xl p-8 text-center bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="text-purple-300 font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-purple-400">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-purple-300 font-medium">Click to upload your resume</p>
                    <p className="text-sm text-purple-400">PDF files only, max 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Job Title Section */}
          <div className="space-y-3">
            <Label htmlFor="job-title" className="text-sm font-medium text-white">
              Job Title <span className="text-red-400">*</span>
            </Label>
            <input
              id="job-title"
              type="text"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              className="w-full rounded-xl border-purple-300/50 bg-slate-700/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 px-4 py-3 backdrop-blur-sm"
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          {/* Company Name Section */}
          <div className="space-y-3">
            <Label htmlFor="company-name" className="text-sm font-medium text-white">
              Company Name
            </Label>
            <input
              id="company-name"
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full rounded-xl border-purple-300/50 bg-slate-700/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 px-4 py-3 backdrop-blur-sm"
              placeholder="e.g. Tech Corp (optional)"
            />
          </div>

          {/* Job Description Section */}
          <div className="space-y-3">
            <Label htmlFor="job-description" className="text-sm font-medium text-white">
              Job Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="job-description"
              placeholder="Paste the complete job description here. Include requirements, responsibilities, and preferred qualifications for best results..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[150px] rounded-xl border-purple-300/50 bg-slate-700/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 resize-none backdrop-blur-sm"
              required
              style={{ width: "100%", paddingLeft: "10px", paddingTop: "10px" }}
            />
            <p className="text-xs text-gray-400">Tip: Include the full job posting for more accurate tailoring</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-slate-700 rounded-xl bg-transparent"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || !jobTitle.trim() || !jobDescription.trim() || isProcessing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-5 px-8 text-xl font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Tailoring Resume...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Tailor Now</span>
                </div>
              )}
            </Button>
          </div>

          {/* Processing Info */}
          {isProcessing && (
            <div className="bg-purple-500/10 border border-purple-300/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <p className="text-sm font-medium text-purple-200">AI is analyzing your resume...</p>
                  <p className="text-xs text-purple-300">This usually takes 13-16 seconds</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 