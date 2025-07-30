const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the NEXT_PUBLIC_MONGODB_URL environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// --- Schemas & Models ---
let Resume, JobDescription, Analysis, Suggestion;

const getModels = async () => {
  const mongoose = (await import('mongoose')).default;
  const { Schema, model, models } = mongoose;

  const ResumeSchema = new Schema({
    userId: { type: String, required: true },
    fileURL: { type: String, required: true },
    tailoredResumeText: { type: String },
    tailoredSummary: { type: String },
    jobId: { type: Schema.Types.ObjectId, ref: 'JobDescription' },
    analysisId: { type: Schema.Types.ObjectId, ref: 'Analysis' },
    createdAt: { type: Date, default: Date.now },
  });

  const JobDescriptionSchema = new Schema({
    userId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    jobText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });

  const AnalysisSchema = new Schema({
    userId: { type: String, required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    jobId: { type: Schema.Types.ObjectId, ref: 'JobDescription' },
    matchPercentage: { type: Number, min: 0, max: 100 },
    matchedKeywords: [{ type: String }],
    missingSkills: [{ type: String }],
    tailoredSummary: { type: String },
    createdAt: { type: Date, default: Date.now },
  });

  const SuggestionSchema = new Schema({
    userId: { type: String, required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    suggestedSkills: [{ type: String }],
    learningResources: [{ name: String, url: String }],
    customNotes: { type: String },
    createdAt: { type: Date, default: Date.now },
  });

  Resume = (models && models.Resume) ? models.Resume : model('Resume', ResumeSchema, 'resumes');
  JobDescription = (models && models.JobDescription) ? models.JobDescription : model('JobDescription', JobDescriptionSchema, 'job_descriptions');
  Analysis = (models && models.Analysis) ? models.Analysis : model('Analysis', AnalysisSchema, 'analyses');
  Suggestion = (models && models.Suggestion) ? models.Suggestion : model('Suggestion', SuggestionSchema, 'suggestions');

  return { Resume, JobDescription, Analysis, Suggestion };
};

async function insertSampleData() {
  // Job Description
  let job;
  if (await JobDescription.countDocuments() === 0) {
    job = await JobDescription.create({
      userId: 'sample-supabase-uid',
      jobTitle: 'Frontend Developer',
      company: 'Tech Corp',
      jobText: 'We are looking for a skilled frontend developer to join our team.',
    });
            // console.log('Inserted sample job description');
  } else {
    job = await JobDescription.findOne();
  }

  // Resume
  let resume;
  if (await Resume.countDocuments() === 0) {
    resume = await Resume.create({
      userId: 'sample-supabase-uid',
      fileURL: 'https://example.com/resume.pdf',
      tailoredResumeText: 'Tailored resume text from AI analysis',
      tailoredSummary: 'You are an 85% match for this role. Your React and JavaScript skills are excellent.',
      jobId: job._id,
    });
            // console.log('Inserted sample resume');
  } else {
    resume = await Resume.findOne();
  }

  // Analysis
  let analysis;
  if (await Analysis.countDocuments() === 0) {
    analysis = await Analysis.create({
      userId: 'sample-supabase-uid',
      resumeId: resume._id,
      jobId: job._id,
      matchPercentage: 85,
      matchedKeywords: ['React', 'JavaScript'],
      missingSkills: ['TypeScript'],
      tailoredSummary: 'You are an 85% match for this role. Your React and JavaScript skills are excellent.',
    });
            // console.log('Inserted sample analysis');
  } else {
    analysis = await Analysis.findOne();
  }

  // Suggestion
  if (await Suggestion.countDocuments() === 0) {
    await Suggestion.create({
      userId: 'sample-supabase-uid',
      resumeId: resume._id,
      suggestedSkills: ['TypeScript', 'Redux'],
      learningResources: [
        { name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/' },
        { name: 'Redux Docs', url: 'https://redux.js.org/' },
      ],
      customNotes: 'Focus on TypeScript for better job matches.',
    });
            // console.log('Inserted sample suggestion');
  }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoose = (await import('mongoose')).default;
    const opts = {
      bufferCommands: false,
      dbName: 'Tailored_Resume',
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // console.log('✅ Connected to MongoDB successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    await getModels();
    await insertSampleData();
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export { connectDB, getModels };
export default connectDB; 