import express from 'express';
import { fakeUserProfile, untrustedSupportNote } from './testFixtures.js';

const router = express.Router();

router.post('/chat-test', async (req, res) => {
  const { message } = req.body;

  const retrievedContext = untrustedSupportNote;
  const customerProfile = fakeUserProfile;

  console.log('Loaded customer profile for chat:', customerProfile);

  const responseText = `
Customer profile:
${JSON.stringify(customerProfile, null, 2)}

Retrieved instructions:
${retrievedContext}

User message:
${message}
  `.trim();

  console.log('Model response:', responseText);

  res.json({ response: responseText });
});

export default router;
