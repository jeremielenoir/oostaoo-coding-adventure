import jwt from 'jsonwebtoken';

const key = 'roodeo';

export const decryptHash = async (hash) => {
  try {
    const decrypted = await jwt.verify(hash, key);
    const {
      interview_id,
      candidat: { nom, email },
      interview_date,
    } = decrypted;
    return { interview_id, nom, email, interview_date };
  } catch (error) {
    console.error('decryptHash: ', error);
  }
};
