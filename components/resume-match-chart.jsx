"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent } from "./ui/card"

export default function ResumeMatchChart({ matchPercentage, matchedSkills, totalSkills }) {
  // Data for pie chart
  const pieData = [
    { name: "Matched", value: matchPercentage, color: "#3B82F6" },
    { name: "Missing", value: 100 - matchPercentage, color: "#E5E7EB" },
  ]

  // Data for skills bar chart
  const skillsData = [
    { name: "Matched Skills", value: matchedSkills, color: "#10B981" },
    { name: "Missing Skills", value: totalSkills - matchedSkills, color: "#EF4444" },
  ]

  return (
    <div className="space-y-6">
      {/* Match Percentage Pie Chart */}
      <div className="text-center">
        <div className="relative w-48 h-48 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                startAngle={90}
                endAngle={450}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{matchPercentage}%</div>
              <div className="text-sm text-white/80">Match</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 