import 'server-only';
import admin from 'firebase-admin';

interface FirebaseAdminAppParams {
  projectId: string;
  clientEmail: string;
  storageBucket: string;
  privateKey: string;
}

function formatFirebasePrivateKey(key: string) {
  return key.replace(/\\n/g, '\n');
}

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const privateKey = formatFirebasePrivateKey(params.privateKey);

  if (admin.apps.length > 0) {
    return admin.app();
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}

export async function initializeAdmin() {
  const params = {
    projectId: process.env.PROJECT_ID as string,
    clientEmail: process.env.CLIENT_EMAIL as string,
    storageBucket: process.env.STORAGE_BUCKET as string,
    privateKey: process.env.PRIVATE_KEY as string,
  };

  return createFirebaseAdminApp(params);
}
