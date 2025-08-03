import { NextResponse } from 'next/server';
import { connectDB, getModels } from '../../../../lib/mongodb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const resumeId = searchParams.get('resumeId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    await connectDB();
    const { Resume, JobDescription, Analysis, Suggestion } = await getModels();

    // If resumeId is provided, get that specific resume, otherwise get the latest
    const latestResume = resumeId 
      ? await Resume.findById(resumeId).populate('jobId').populate('analysisId')
      : await Resume.findOne({ userId }).sort({ createdAt: -1 }).populate('jobId').populate('analysisId');

    if (!latestResume) {
      return NextResponse.json({
        latestReport: null,
        suggestions: null,
        resumeHistory: []
      });
    }

    // Get the latest analysis
    const latestAnalysis = await Analysis.findOne({ 
      userId, 
      resumeId: latestResume._id 
    }).sort({ createdAt: -1 });



    // Get the latest suggestions
    const latestSuggestions = await Suggestion.findOne({ 
      userId, 
      resumeId: latestResume._id 
    }).sort({ createdAt: -1 });

    // Get resume history (all resumes for this user)
    const resumeHistory = await Resume.find({ userId })
      .populate('jobId')
      .populate('analysisId')
      .sort({ createdAt: -1 })
      .limit(10); // Limit to last 10

    // Format latest report data
    const latestReport = latestAnalysis ? {
      id: latestResume._id.toString(), // Add resume ID
      jobTitle: latestResume.jobId?.jobTitle || 'Unknown Position',
      company: latestResume.jobId?.company || 'Unknown Company',
      matchPercentage: latestAnalysis.matchPercentage || 0,
      matchedSkills: latestAnalysis.matchedKeywords?.length || 0,
      totalSkills: (latestAnalysis.matchedKeywords?.length || 0) + (latestAnalysis.missingSkills?.length || 0),
      matchedKeywords: latestAnalysis.matchedKeywords || [],
      missingSkills: latestAnalysis.missingSkills || [],
      uploadDate: latestResume.createdAt,
      tailoredSummary: latestResume.tailoredSummary || latestAnalysis.tailoredSummary || 'No summary available.',
      tailoredResume: latestResume.tailoredResumeText || 'No tailored resume available.',
      tailoredPdfUrl: latestResume.tailoredPdfUrl || null,
      pdfFileName: latestResume.pdfFileName || null,
      pdfMessage: latestResume.pdfMessage || null
    } : {
      // Even if no analysis, still return basic resume data with ID
      id: latestResume._id.toString(),
      jobTitle: latestResume.jobId?.jobTitle || 'Unknown Position',
      company: latestResume.jobId?.company || 'Unknown Company',
      matchPercentage: 0,
      matchedSkills: 0,
      totalSkills: 0,
      matchedKeywords: [],
      missingSkills: [],
      uploadDate: latestResume.createdAt,
      tailoredSummary: latestResume.tailoredSummary || 'No summary available.',
      tailoredResume: latestResume.tailoredResumeText || 'No tailored resume available.',
      tailoredPdfUrl: latestResume.tailoredPdfUrl || null,
      pdfFileName: latestResume.pdfFileName || null,
      pdfMessage: latestResume.pdfMessage || null
    };

    // Format suggestions data
    const suggestions = latestSuggestions ? {
      suggestedSkills: latestSuggestions.suggestedSkills || [],
      learningResources: latestSuggestions.learningResources ? latestSuggestions.learningResources.map(resource => ({
        title: resource.name || 'Learning Resource',
        type: 'Course',
        duration: '2-3 hours',
        url: resource.url || '#'
      })) : [],
      customNotes: latestSuggestions.customNotes || 'No custom notes available.'
    } : null;

    // Format resume history
    const formattedHistory = await Promise.all(
      resumeHistory.map(async (resume) => {
        const analysis = await Analysis.findOne({ 
          userId, 
          resumeId: resume._id 
        }).sort({ createdAt: -1 });

        return {
          id: resume._id.toString(),
          jobTitle: resume.jobId?.jobTitle || 'Unknown Position',
          company: resume.jobId?.company || 'Unknown Company',
          uploadDate: resume.createdAt,
          matchScore: analysis?.matchPercentage || 0,
          matchedKeywords: analysis?.matchedKeywords?.length || 0,
          missingSkills: analysis?.missingSkills?.length || 0,
          summary: resume.tailoredSummary || analysis?.tailoredSummary || 'No summary available.'
        };
      })
    );

    return NextResponse.json({
      latestReport,
      suggestions,
      resumeHistory: formattedHistory
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch dashboard data.',
      details: error.message 
    }, { status: 500 });
  }
} 