"use client"

import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Upload, FileText, Sparkles } from "lucide-react"

export default function EmptyState({ onGetStarted }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="max-w-md mx-auto">
          {/* Illustration */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Ready to Get Started?</h3>
            <p className="text-gray-600 leading-relaxed">
              You haven't tailored a resume yet. Upload your resume and a job description to see how AI can optimize
              your application for any role.
            </p>

            <div className="pt-4">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-16 py-5 text-xl font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                Get Started
              </button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">Upload Resume</p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <p className="text-xs text-gray-600">Add Job Description</p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">Get Tailored Resume</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 