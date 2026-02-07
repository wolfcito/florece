/**
 * POST /api/upload-evidence
 *
 * Handle evidence file uploads and create evidence records.
 * Returns a signed URL for direct upload to Firebase Storage.
 *
 * Request Body:
 * {
 *   actionId: string;          // Action being completed
 *   caseId: string;            // Case ID
 *   fileType: 'image' | 'audio' | 'document';
 *   fileName: string;          // Original file name
 *   fileSize: number;          // File size in bytes
 * }
 *
 * Response:
 * {
 *   success: boolean;
 *   uploadUrl: string;         // Signed URL for direct upload
 *   evidenceId: string;        // Created evidence document ID
 *   fileUrl: string;           // Final file URL after upload
 *   error?: string;
 * }
 *
 * Auth: Requires Firebase Auth token in Authorization header
 *
 * Flow:
 * 1. Verify auth and validate file metadata
 * 2. Generate signed upload URL for Firebase Storage
 * 3. Create evidence document in Firestore (status: pending)
 * 4. Return upload URL to client
 * 5. Client uploads directly to Storage using signed URL
 * 6. Client calls /api/verify-evidence when upload complete
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, getFirebaseAdmin } from '@/lib/firebase/admin';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image', 'audio', 'document'];

/**
 * Get content type for signed URL based on file type
 */
function getContentType(fileType: string): string {
  switch (fileType) {
    case 'image':
      return 'image/*';
    case 'audio':
      return 'audio/*';
    case 'document':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const userId = await verifyAuthToken(authHeader);

    // Parse request body
    const body = await request.json();
    const { actionId, caseId, fileType, fileName, fileSize } = body;

    // Validation
    if (!actionId || !caseId || !fileType || !fileName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const { db, storage } = getFirebaseAdmin();
    const evidenceRef = db.collection('evidence').doc();

    // Generate unique file path in Storage
    const storagePath = `evidence/${userId}/${evidenceRef.id}/${fileName}`;
    const bucket = storage.bucket();
    const file = bucket.file(storagePath);

    // Generate signed upload URL (valid for 15 minutes)
    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: getContentType(fileType),
    });

    // Final file URL (gs:// format for internal use)
    const fileUrl = `gs://${bucket.name}/${storagePath}`;

    // Create evidence document
    await evidenceRef.set({
      actionId,
      caseId,
      userId,
      fileUrl,
      storagePath,
      fileType,
      fileName,
      fileSize,
      uploadedAt: new Date(),
      verificationStatus: 'pending',
    });

    return NextResponse.json({
      success: true,
      uploadUrl,
      evidenceId: evidenceRef.id,
      fileUrl,
    });
  } catch (error) {
    console.error('Error in /api/upload-evidence:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
