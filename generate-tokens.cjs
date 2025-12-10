const { RtcTokenBuilder, RtcRole } = require('agora-token');

const appId = '79727223422d46f19514d0c5a40708ca';
const appCertificate = '2e643c8e38cd420182aee450dea4f55e';
const role = RtcRole.PUBLISHER;
const expirationTimeInSeconds = 3600 * 24; // 24 hours
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

const channels = ['room-1', 'room-2'];

const fs = require('fs');

const tokens = {};

channels.forEach(channelName => {
    // Generate token for UID 12345 to avoid 0 ambiguity
    const uid = 12345;
    const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
    tokens[channelName] = token;
    console.log(`Generated token for ${channelName} with uid ${uid}`);
});

fs.writeFileSync('tokens.json', JSON.stringify(tokens, null, 2));
console.log('Tokens saved to tokens.json');
