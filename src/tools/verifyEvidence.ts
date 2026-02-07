/**
 * Tool: verifyEvidence
 *
 * Analyze uploaded evidence to confirm action completion.
 * Uses Gemini Vision for images and Gemini Audio for audio files.
 */

import type { VerifyEvidenceInput, VerifyEvidenceOutput, ToolResult } from '@/types/tools';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerEnv } from '@/lib/env';
import { getFirebaseAdmin } from '@/lib/firebase/admin';

export async function verifyEvidence(
  input: VerifyEvidenceInput,
  context: { userId: string; caseId: string }
): Promise<ToolResult<VerifyEvidenceOutput>> {
  // Input validation
  if (!input.actionId || !input.evidenceId || !input.fileUrl || !input.actionDescription) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Action ID, evidence ID, file URL, and action description are required',
      },
    };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const { storage } = getFirebaseAdmin();

    // Extract file path from gs:// URL
    const gsUrlMatch = input.fileUrl.match(/^gs:\/\/([^/]+)\/(.+)$/);
    if (!gsUrlMatch) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid file URL format. Expected gs://bucket/path',
        },
      };
    }

    const [, bucketName, filePath] = gsUrlMatch;
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return {
        success: false,
        error: {
          code: 'EXTERNAL_SERVICE_ERROR',
          message: 'Evidence file not found in storage',
        },
      };
    }

    // Get file metadata
    const [metadata] = await file.getMetadata();
    const mimeType = metadata.contentType || 'application/octet-stream';

    let verified = false;
    let confidence = 0;
    let reasoning = '';
    let suggestions: string[] | undefined;

    // Handle different file types
    if (mimeType.startsWith('image/')) {
      // Gemini Vision for images
      const result = await verifyImageEvidence(genAI, file, input.actionDescription, mimeType);
      verified = result.verified;
      confidence = result.confidence;
      reasoning = result.reasoning;
      suggestions = result.suggestions;
    } else if (mimeType.startsWith('audio/')) {
      // Gemini Audio for audio files
      const result = await verifyAudioEvidence(genAI, file, input.actionDescription, mimeType);
      verified = result.verified;
      confidence = result.confidence;
      reasoning = result.reasoning;
      suggestions = result.suggestions;
    } else {
      // For documents, accept with moderate confidence
      // TODO: Implement document analysis if needed
      verified = true;
      confidence = 0.7;
      reasoning = 'Document uploaded. Manual review recommended for detailed verification.';
    }

    return {
      success: true,
      data: {
        verified,
        confidence,
        reasoning,
        suggestions: !verified ? suggestions : undefined,
      },
    };
  } catch (error) {
    console.error('Error in verifyEvidence:', error);
    return {
      success: false,
      error: {
        code: 'EXTERNAL_SERVICE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to verify evidence',
      },
    };
  }
}

/**
 * Verify image evidence using Gemini Vision
 */
async function verifyImageEvidence(
  genAI: GoogleGenerativeAI,
  file: any,
  actionDescription: string,
  mimeType: string
): Promise<{ verified: boolean; confidence: number; reasoning: string; suggestions?: string[] }> {
  // Download image data
  const [fileData] = await file.download();
  const base64Image = fileData.toString('base64');

  // Use Gemini Vision model
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are verifying evidence for a micro-venture action plan.

**Action to verify:** ${actionDescription}

**Your task:**
1. Analyze the provided image
2. Determine if it shows evidence of completing the described action
3. Be encouraging but honest - accept reasonable effort
4. Only reject if completely unrelated or obviously fake

**Respond in JSON format:**
{
  "verified": true or false,
  "confidence": 0.0 to 1.0,
  "reasoning": "Brief explanation in Spanish (2-3 sentences)",
  "suggestions": ["suggestion1", "suggestion2"] (only if rejected)
}`;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: base64Image,
      },
    },
    { text: prompt },
  ]);

  const response = result.response.text();

  // Parse JSON response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      verified: parsed.verified || false,
      confidence: Math.max(0, Math.min(1, parsed.confidence || 0)),
      reasoning: parsed.reasoning || 'No reasoning provided',
      suggestions: parsed.suggestions,
    };
  }

  // Fallback if JSON parsing fails
  return {
    verified: response.toLowerCase().includes('verified') || response.toLowerCase().includes('approved'),
    confidence: 0.5,
    reasoning: response.substring(0, 200),
  };
}

/**
 * Verify audio evidence using Gemini Audio
 */
async function verifyAudioEvidence(
  genAI: GoogleGenerativeAI,
  file: any,
  actionDescription: string,
  mimeType: string
): Promise<{ verified: boolean; confidence: number; reasoning: string; suggestions?: string[] }> {
  // Download audio data
  const [fileData] = await file.download();
  const base64Audio = fileData.toString('base64');

  // Use Gemini model with audio support
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are verifying audio evidence for a micro-venture action plan.

**Action to verify:** ${actionDescription}

**Your task:**
1. Listen to and transcribe the audio
2. Analyze if it shows evidence of completing the described action
3. Be encouraging but honest - accept reasonable effort
4. Only reject if completely unrelated or obviously fake

**Respond in JSON format:**
{
  "verified": true or false,
  "confidence": 0.0 to 1.0,
  "reasoning": "Brief explanation in Spanish including what you heard (2-3 sentences)",
  "suggestions": ["suggestion1", "suggestion2"] (only if rejected)
}`;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: base64Audio,
      },
    },
    { text: prompt },
  ]);

  const response = result.response.text();

  // Parse JSON response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      verified: parsed.verified || false,
      confidence: Math.max(0, Math.min(1, parsed.confidence || 0)),
      reasoning: parsed.reasoning || 'No reasoning provided',
      suggestions: parsed.suggestions,
    };
  }

  // Fallback if JSON parsing fails
  return {
    verified: response.toLowerCase().includes('verified') || response.toLowerCase().includes('approved'),
    confidence: 0.5,
    reasoning: response.substring(0, 200),
  };
}
