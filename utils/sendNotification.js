const axios = require('axios');
require('dotenv').config();

const sendNotification = async ({ title, message, deviceTokens }) => {
  const apiKey = process.env.ONESIGNALAPPKEY; // Your OneSignal REST API Key
  try {
    const response = await axios.post(
      process.env.ONE_SIGNAL_URL,
      {
        app_id: process.env.ONESIGNALAPPID, // replace with your app ID
        include_player_ids: deviceTokens,
        headings: { en: title },
        contents: { en: message },
        android_channel_id: process.env.ANDROID_CHANNEL_ID, // optional, for custom sound
        android_sound: process.env.ANDROID_SOUND,
        ios_sound: process.env.ISO_SOUND,
        priority: process.env.PRIORITY,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${apiKey}`,
        },
      }
    );

    console.log('Notification Sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Notification Error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = sendNotification;

// exports.sendOneSignalNotificationtest = async (req, res) => {
//   const appId = '74a59bde-55c3-4926-ad38-aeae62f88137'; // Replace with your OneSignal App ID
//   const apiKey = 'MjgxNTcwY2ItMTQzNC00NjUwLTg1ZTQtMTJlZTIxMGE5MTk4'; // Your OneSignal REST API Key
//   const deviceToken = '3bf2be3f-88ca-4775-b31e-1cafa0cec307'; // From OneSignal.User.getOnesignalId()
//   //
//   const notificationData = {
//     app_id: appId,
//     include_player_ids: [deviceToken],
//     headings: { en: 'Jeeyo Ride' },
//     contents: { en: 'Your OTP is 1234' },
//     ios_sound: 'ring.mp3',
//     android_sound: 'ring',
//     android_channel_id: 'ce0fad4f-0f20-4d1f-9e73-098cab7a86fe',
//     priority: 10,
//   };

//   try {
//     const response = await axios.post(
//       'https://onesignal.com/api/v1/notifications',
//       notificationData,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Basic ${apiKey}`,
//         },
//       }
//     );

//     console.log('✅ Notification Sent:', response.data);
//   } catch (error) {
//     console.error(
//       '❌ Notification Error:',
//       error.response?.data || error.message
//     );
//   }
// };
