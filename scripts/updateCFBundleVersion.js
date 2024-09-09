const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const plist = require('plist');

// App Store Connect API Credentials
const privateKey = fs.readFileSync(
  path.join(__dirname, 'AuthKey_ZMKWA9GPU9.p8'),
); // Path to your .p8 file
const keyId = 'ZMKWA9GPU9'; // Your API Key ID
const issuerId = '4793478b-c6ab-4f4d-a81a-bec93b9f4874'; // Your Issuer ID
const bundleId = 'com.offspringdigital.autodeploy'; // Your app's bundle ID

const plistPath = path.join(__dirname, '../ios/iMode/Info.plist');

// Function to generate a JWT token for App Store Connect API
function generateJWT() {
  const token = jwt.sign(
    {
      aud: 'appstoreconnect-v1',
    },
    privateKey,
    {
      algorithm: 'ES256',
      expiresIn: '15m',
      issuer: issuerId,
      header: {
        alg: 'ES256',
        kid: keyId,
        typ: 'JWT',
      },
    },
  );
  return token;
}

// Function to get the latest CFBundleVersion (build number) from TestFlight
async function getLatestBuildVersion(bundleId) {
  const token = generateJWT();

  try {
    // Fetch all builds for the app using App Store Connect API
    const response = await axios({
      method: 'GET',
      url: `https://api.appstoreconnect.apple.com/v1/builds?filter[app]=6667110156&sort=-version&fields[builds]=version&filter[preReleaseVersion.version]=1.0&limit=1`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const builds = response.data.data;

    if (builds.length === 0) {
      console.log('No builds found in TestFlight for this app.');
      return;
    }

    // Get the latest build information (first item in the sorted list)
    const latestBuild = builds[0];
    const latestCFBundleVersion = latestBuild.attributes.version;

    return latestCFBundleVersion;
  } catch (error) {
    console.error(
      'Error fetching the latest build from TestFlight:',
      error.response ? error.response.data : error.message,
    );
  }
}

function incrementCFBundleVersion(plistPath, _newVersion) {
  try {
    // Read the Info.plist file
    const plistData = fs.readFileSync(plistPath, 'utf8');
    const parsedPlist = plist.parse(plistData);

    // Get the current CFBundleVersion and increment it
    let currentVersion = parsedPlist.CFBundleVersion;
    console.log(`Current CFBundleVersion: ${currentVersion}`);

    // Increment the version number
    let newVersion = _newVersion || (parseInt(currentVersion) || 0) + 1;
    parsedPlist.CFBundleVersion = String(newVersion);

    console.log(`Updated CFBundleVersion to: ${newVersion}`);

    // Write the updated version back to Info.plist
    const updatedPlist = plist.build(parsedPlist);
    fs.writeFileSync(plistPath, updatedPlist, 'utf8');

    console.log('Successfully updated CFBundleVersion in Info.plist.');
  } catch (error) {
    console.error('Error updating CFBundleVersion:', error);
  }
}

// Call the function to retrieve and increment the latest CFBundleVersion
async function main() {
  const latestCFBundleVersion = await getLatestBuildVersion();
  if (latestCFBundleVersion) {
    const newCFBundleVersion = parseInt(latestCFBundleVersion) + 1;
    incrementCFBundleVersion(plistPath, newCFBundleVersion);
  }
}

main();
