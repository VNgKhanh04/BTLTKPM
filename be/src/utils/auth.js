const crypto = require('crypto');

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || 'nckh-demo-secret';
const TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
}

function encodeBase64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function decodeBase64Url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signToken(payload) {
  const normalizedPayload = {
    ...payload,
    exp: Date.now() + TOKEN_EXPIRES_IN_MS,
  };

  const serializedPayload = JSON.stringify(normalizedPayload);
  const encodedPayload = encodeBase64Url(serializedPayload);
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    throw new Error('Token không hợp lệ');
  }

  const [encodedPayload, signature] = token.split('.');
  const expectedSignature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (signature !== expectedSignature) {
    throw new Error('Token không hợp lệ');
  }

  const payload = JSON.parse(decodeBase64Url(encodedPayload));

  if (!payload.exp || payload.exp < Date.now()) {
    throw new Error('Phiên đăng nhập đã hết hạn');
  }

  return payload;
}

module.exports = {
  hashPassword,
  signToken,
  verifyToken,
};
