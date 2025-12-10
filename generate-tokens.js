import { RtcTokenBuilder, RtcRole } from 'agora-token';

const appId = '79727223422d46f19514d0c5a40708ca';
const appCertificate = '2e643c8e38cd420182aee450dea4f55e';
const role = RtcRole.PUBLISHER;
const expirationTimeInSeconds = 3600 * 24; // 24 hours
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

const channels = ['room-1', 'room-2'];

console.log('Generating tokens...');

channels.forEach(channelName => {
    // Generate token with uid 0 (wildcard for any user, simplified for demo) or we can just let Agora generate UID. 
    // Actually, for better security usually we specify UID. But for this demo, let's use 0 to allow the client to join with any UID (if SDK supports) or we generate for a specific range.
    // However, the client is joining with `null` which means Agora assigns UID.
    // If we use `0` as uid in token generation, it allows joining with any uid? No, it allows joining with that specific UID.
    // Wait, if client joins with `null` (random UID), we need a token valid for that random UID. 
    // Is it possible to generate a token for "any" uid? 
    // Yes, by using uid 0 in the builder? No, 0 usually means "the user with uid 0".

    // Correction: When joining with `null`, the server assigns a UID. We need a token that matches that assigned UID? No, we can't predict it.
    // The standard practice for backend-less demo is to either:
    // 1. Client joins with a specific UID (e.g. random int) and we use that same UID to generate token.
    // 2. Use UID 0 in token generation IF it allows "wildcard" (it doesn't, 0 is just a number).

    // Let's modify the client to use a fixed UID or a random one that we know.
    // Actually, `activeSession` just joins with `null`.

    // Let's generate a token specifically for UID 0. 
    // AND we must tell the client to join with UID 0? Or does `null` work with token 0?
    // "If the user ID is 0, the token is valid for any user ID." -> This is true for some older SDKs/versions. 
    // Let's verify RtcTokenBuilder.buildTokenWithUid

    const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, 0, role, privilegeExpiredTs);
    console.log(`Channel: ${channelName}`);
    console.log(`Token: ${token}`);
});
