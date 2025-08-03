import { NextResponse } from 'next/server';
import { connectDB, getModels } from '../../../../lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const { resumeId, tailoredResumeText } = body;

    if (!resumeId || !tailoredResumeText) {
      return NextResponse.json({
        error: 'Resume ID and tailored resume text are required.',
        received: { resumeId, hasText: !!tailoredResumeText }
      }, { status: 400 });
    }
    
    // Parse the tailored resume text to extract sections
    const parsedData = parseResumeText(tailoredResumeText);

    // Call n8n PDF workflow
    const pdfWebhookUrl = "https://internshipkaam123.app.n8n.cloud/webhook/pro_PDF_generator";
    const pdfResponse = await fetch(pdfWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedData),
    });

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      throw new Error(`PDF generation failed: ${pdfResponse.statusText} - ${errorText}`);
    }

    const pdfResult = await pdfResponse.json();

    // Update MongoDB with PDF data
    await connectDB();
    const { Resume } = await getModels();

    const updateData = {};
    if (pdfResult.success) {
      updateData.tailoredPdfUrl = pdfResult.pdfDownloadUrl;
      updateData.pdfFileName = pdfResult.pdfFileName;
      updateData.pdfMessage = pdfResult.pdfMessage;
    }

    await Resume.findByIdAndUpdate(resumeId, updateData);

    return NextResponse.json({
      success: true,
      pdfData: pdfResult
    });

  } catch (error) {
    console.error('❌ Error in PDF generation:', error);
    console.error('❌ Error stack:', error.stack);
    return NextResponse.json({
      error: 'Failed to generate PDF.',
      details: error.message
    }, { status: 500 });
  }
}

// Simplified parsing function that correctly extracts all sections
function parseResumeText(text) {
  const sections = {
    name: "",
    contact: "",
    summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: []
  };

  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  let currentSection = "";
  let currentExperience = null;
  let currentEducation = null;
  let currentProject = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Extract name (first line with ** but not section headers)
    if (!sections.name && line.includes('**') && !line.includes('**CONTACT:**') && !line.includes('**SUMMARY:**') && !line.includes('**WORK EXPERIENCE**') && !line.includes('**EDUCATION**') && !line.includes('**PROJECTS**') && !line.includes('**SKILLS**')) {
      sections.name = line.replace(/\*\*/g, '').trim();
      continue;
    }

    // Extract contact info
    if (line.includes('**CONTACT:**')) {
      sections.contact = line.replace('**CONTACT:**', '').trim();
      continue;
    }

    // Extract summary
    if (line.includes('**SUMMARY:**')) {
      currentSection = "summary";
      sections.summary = line.replace('**SUMMARY:**', '').trim();
      continue;
    }

    // Extract experience
    if (line.includes('**WORK EXPERIENCE**')) {
      currentSection = "experience";
      continue;
    }

    // Extract education
    if (line.includes('**EDUCATION**')) {
      currentSection = "education";
      continue;
    }

    // Extract projects
    if (line.includes('**PROJECTS**')) {
      currentSection = "projects";
      continue;
    }

    // Extract skills
    if (line.includes('**SKILLS**')) {
      currentSection = "skills";
      continue;
    }

    // Add content to current section
    if (currentSection === "summary" && line && !line.includes('**')) {
      sections.summary += line + " ";
    } else if (currentSection === "experience" && line) {
      // Parse experience lines into structured objects
      if (line.includes('**') && !line.includes('**WORK EXPERIENCE**')) {
        // This is a job title/company line
        if (currentExperience) {
          sections.experience.push(currentExperience);
        }
        const jobInfo = line.replace(/\*\*/g, '').trim();
        currentExperience = {
          title: jobInfo,
          company: "",
          duration: "",
          description: ""
        };
      } else if (currentExperience && line.includes('•')) {
        // This is a bullet point description
        currentExperience.description += line.replace('•', '').trim() + " ";
      } else if (currentExperience && line.includes('-')) {
        // This might be duration info
        currentExperience.duration = line.trim();
      } else if (currentExperience && line && !line.includes('**')) {
        // This might be company info
        currentExperience.company = line.trim();
      }
    } else if (currentSection === "education" && line) {
      // Parse education lines into structured objects
      if (line.includes('**') && !line.includes('**EDUCATION**')) {
        // This is a degree/school line
        if (currentEducation) {
          sections.education.push(currentEducation);
        }
        const eduInfo = line.replace(/\*\*/g, '').trim();
        currentEducation = {
          degree: eduInfo,
          school: "",
          year: ""
        };
      } else if (currentEducation && line.includes('-')) {
        // This might be year info
        currentEducation.year = line.trim();
      } else if (currentEducation && line && !line.includes('**')) {
        // This might be school info
        currentEducation.school = line.trim();
      }
    } else if (currentSection === "projects" && line) {
      // Parse project lines into structured objects
      if (line.includes('**') && !line.includes('**PROJECTS**')) {
        // This is a project name line
        if (currentProject) {
          sections.projects.push(currentProject);
        }
        const projectInfo = line.replace(/\*\*/g, '').trim();
        currentProject = {
          name: projectInfo,
          techStack: "",
          description: ""
        };
      } else if (currentProject && line.includes('•')) {
        // This is a bullet point description
        if (line.includes('Tech Stack:')) {
          currentProject.techStack = line.replace('• Tech Stack:', '').trim();
        } else {
          currentProject.description += line.replace('•', '').trim() + " ";
        }
      }
    } else if (currentSection === "skills" && line && !line.includes('**')) {
      // Parse skills (comma-separated or bullet points)
      const skillItems = line.split(/[,•]/).map(skill => skill.trim()).filter(skill => skill);
      sections.skills.push(...skillItems);
    }
  }

  // Add any remaining experience/education/project entries
  if (currentExperience) {
    sections.experience.push(currentExperience);
  }
  if (currentEducation) {
    sections.education.push(currentEducation);
  }
  if (currentProject) {
    sections.projects.push(currentProject);
  }

  // Clean up summary
  sections.summary = sections.summary.trim();

  // Clean up descriptions
  sections.experience.forEach(exp => {
    if (exp.description) {
      exp.description = exp.description.trim();
    }
  });

  sections.projects.forEach(proj => {
    if (proj.description) {
      proj.description = proj.description.trim();
    }
  });

  return sections;
} 