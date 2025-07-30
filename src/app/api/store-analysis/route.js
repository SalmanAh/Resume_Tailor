import { connectDB, getModels } from '../../../../lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, resumeId, jobId, aiData } = body;

    await connectDB();
    const { Analysis, Suggestion, Resume } = await getModels();

    await Analysis.create({
      userId,
      resumeId,
      jobId,
      matchPercentage: aiData.matchPercentage,
      matchedKeywords: aiData.matchedKeywords,
      missingSkills: aiData.missingSkills,
      tailoredSummary: aiData.tailoredSummary,
    });

    await Suggestion.create({
      userId,
      resumeId,
      suggestedSkills: aiData.suggestedSkills,
      learningResources: aiData.learningResources,
      customNotes: aiData.customNotes,
    });

    await Resume.findByIdAndUpdate(resumeId, {
      tailoredResumeText: aiData.tailoredResumeText,
      tailoredSummary: aiData.tailoredSummary
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
} 