const {google} = require('googleapis');
const {JWT} = require('google-auth-library');
const fs = require('fs');
const path = require('path');
const serviceAccount = require('./d2-autobuild-706cddedf98f.json');

const PACKAGE_NAME = 'com.alan.imode';
const BUILD_GRADLE_FILE = path.join(
  __dirname,
  '../android/app',
  'build.gradle',
);

async function authenticate() {
  const authClient = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  return google.androidpublisher({version: 'v3', auth: authClient});
}

async function createEdit(packageName) {
  try {
    const androidPublisher = await authenticate();

    const {data: edit} = await androidPublisher.edits.insert({
      packageName: packageName,
    });

    return edit.id;
  } catch (error) {
    console.error('Error creating edit:', error);
  }
}

async function getLatestVersionCode(packageName) {
  try {
    const androidPublisher = await authenticate();

    const editId = await createEdit(packageName);

    if (editId) {
      const {data} = await androidPublisher.edits.tracks.get({
        packageName: packageName,
        track: 'alpha',
        editId,
      });

      const latestRelease = data.releases[0];
      const versionCode = latestRelease.versionCodes[0];

      console.log(`The latest versionCode is: ${versionCode}`);
      return versionCode;
    }
  } catch (error) {
    console.error('Error fetching the latest versionCode:', error);
  }
}

function updateBuildGradleVersionCode(newVersionCode) {
  try {
    let gradleFile = fs.readFileSync(BUILD_GRADLE_FILE, 'utf8');

    const versionCodeRegex = /versionCode\s+(\d+)/;

    gradleFile = gradleFile.replace(
      versionCodeRegex,
      `versionCode ${newVersionCode}`,
    );

    fs.writeFileSync(BUILD_GRADLE_FILE, gradleFile, 'utf8');

    console.log(`Updated versionCode in build.gradle to: ${newVersionCode}`);
  } catch (error) {
    console.error('Error updating build.gradle:', error);
  }
}

async function main() {
  console.log(process.argv);
  const latestVersionCode = await getLatestVersionCode(PACKAGE_NAME);

  if (latestVersionCode) {
    const newVersionCode = Number(latestVersionCode) + 1;
    updateBuildGradleVersionCode(newVersionCode);
  }
}

main();
