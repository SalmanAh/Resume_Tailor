import { NextResponse } from 'next/server';
import { connectDB, getModels } from '../../../../lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, jobTitle, companyName, jobDescription, fileURL } = body;
    if (!userId || !jobTitle || !jobDescription || !fileURL) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    await connectDB();
    const { JobDescription, Resume } = await getModels();

    // Insert JobDescription
    const jobDoc = await JobDescription.create({
      userId,
      jobTitle: jobTitle.trim(),
      company: companyName ? companyName.trim() : '',
      jobText: jobDescription.trim(),
    });

    // Insert Resume
    const resumeDoc = await Resume.create({
      userId,
      fileURL,
      tailoredResumeText: '', // Will be updated by n8n
      tailoredSummary: '', // Will be updated by n8n
      jobId: jobDoc._id,
    });

    return NextResponse.json({ success: true, jobId: jobDoc._id, resumeId: resumeDoc._id });
  } catch (err) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
} 