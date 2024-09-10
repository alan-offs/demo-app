# Introduction

## 1. Setup the project
[https://devcenter.bitrise.io/en/getting-started/quick-start-guides.html](https://devcenter.bitrise.io/en/getting-started/quick-start-guides.html)

## 2. Project settings > Integrations > Stores
- [Connecting to an Apple service with API key](https://devcenter.bitrise.io/en/connectivity/connecting-to-services/connecting-to-an-apple-service-with-api-key)
- [Connecting a Google Play Console service account to Bitrise](https://devcenter.bitrise.io/en/connectivity/connecting-to-services/connecting-a-google-service-account-to-bitrise.html)

## 3. Project settings > Code signing
- [Setting up iOS code signing on Bitrise ](https://devcenter.bitrise.io/en/code-signing/ios-code-signing.html)
- [Setting up Android code signing on Bitrise ](https://devcenter.bitrise.io/en/code-signing/android-code-signing.html)

## 4. Setup workflows
See example Configuration YAML:
```
---
format_version: '13'
default_step_lib_source: https://github.com/bitrise-io/bitrise-steplib.git
project_type: react-native
workflows:
  Deploy-Android:
    steps:
    - git-clone@8: {}
    - restore-npm-cache@1: {}
    - npm@1:
        inputs:
        - workdir: "$WORKDIR"
        - command: install
    - save-npm-cache@1: {}
    - set-java-version@1:
        inputs:
        - set_java_version: '17'
    - file-downloader@1:
        inputs:
        - destination: "$PROJECT_LOCATION/app/upload.keystore"
        - source: "$BITRISEIO_ANDROID_KEYSTORE_URL"
    - file-downloader@1:
        inputs:
        - destination: "$BITRISE_SOURCE_DIR/scripts/d2-autobuild-706cddedf98f.json"
        - source: "$BITRISEIO_d2_autobuild_service_account_URL"
    - script@1:
        inputs:
        - script_file_path:
        - content: |-
            #!/usr/bin/env bash
            # fail if any commands fails
            set -e
            # make pipelines' return status equal the last command to exit with a non-zero status, or zero if all commands exit successfully
            set -o pipefail
            # debug log
            set -x

            # write your script here
            node scripts/increaseVersionCode.js
    - android-build@1:
        inputs:
        - module: "$MODULE"
        - variant: "$VARIANT"
        - build_type: aab
        - project_location: "$PROJECT_LOCATION"
    - deploy-to-bitrise-io@2: {}
  Deploy-IOS:
    steps:
    - git-clone@8: {}
    - restore-npm-cache@1: {}
    - npm@1:
        inputs:
        - workdir: "$WORKDIR"
        - command: install
        title: Install dependencies
    - npm@1:
        inputs:
        - cache_local_deps: 'true'
        - command: install -g detox-cli
        title: Install detox cli
        run_if: '{{enveq "CUSTOM_ENV_VAR_KEY" "test value to test against"}}'
    - script@1:
        inputs:
        - script_file_path:
        - content: "#!/bin/bash\n   \n# applesimutils is a collection of utils for
            Apple simulators\nbrew tap wix/brew\nbrew install applesimutils"
        title: Install IOS Simulators
        run_if: '{{enveq "CUSTOM_ENV_VAR_KEY" "test value to test against"}}'
    - cocoapods-install@2: {}
    - script@1:
        title: Prepare .env
        inputs:
        - script_file_path:
        - content: |-
            #!/usr/bin/env bash
            # fail if any commands fails
            set -e
            # make pipelines' return status equal the last command to exit with a non-zero status, or zero if all commands exit successfully
            set -o pipefail
            # debug log
            set -x

            # write your script here
            echo "BASE_API_URL=$BASE_API_URL" >> $BITRISE_SOURCE_DIR/.env
            echo "RESET_PASSWORD_URL=$RESET_PASSWORD_URL" >> $BITRISE_SOURCE_DIR/.env
            echo "F45_TIMELINE_URL=$F45_TIMELINE_URL" >> $BITRISE_SOURCE_DIR/.env
            echo "MOVEMENT_PATH=$MOVEMENT_PATH" >> $BITRISE_SOURCE_DIR/.env
            echo "EXERCISE_PATH=$EXERCISE_PATH" >> $BITRISE_SOURCE_DIR/.env

            echo "UDP_PORT=$UDP_PORT" >> $BITRISE_SOURCE_DIR/.env
            echo "UDP_PORT_SERVER=$UDP_PORT_SERVER" >> $BITRISE_SOURCE_DIR/.env

            echo "BEAMER_URL=$BEAMER_URL" >> $BITRISE_SOURCE_DIR/.env
            echo "BEAMER_API_KEY=$BEAMER_API_KEY" >> $BITRISE_SOURCE_DIR/.env

            echo "FRESH_CHAT_APP_ID=$FRESH_CHAT_APP_ID" >> $BITRISE_SOURCE_DIR/.env
            echo "FRESH_CHAT_APP_KEY=$FRESH_CHAT_APP_KEY" >> $BITRISE_SOURCE_DIR/.env

            echo "AUTHORIZATION_KEY=$AUTHORIZATION_KEY" >> $BITRISE_SOURCE_DIR/.env
            echo "STUDIO_TRAINING_URL=$STUDIO_TRAINING_URL" >> $BITRISE_SOURCE_DIR/.env
            echo "RADIO_CDN_PATH=$RADIO_CDN_PATH" >> $BITRISE_SOURCE_DIR/.env

            echo "AUTH_API=$AUTH_API" >> $BITRISE_SOURCE_DIR/.env

            echo "TEST_EMAIL=$TEST_EMAIL" >> $BITRISE_SOURCE_DIR/.env
            echo "TEST_PASSWORD=$TEST_PASSWORD" >> $BITRISE_SOURCE_DIR/.env

            cat $BITRISE_SOURCE_DIR/.env
    - script@1:
        title: Prepare .env.test
        inputs:
        - script_file_path:
        - content: |-
            #!/usr/bin/env bash
            # fail if any commands fails
            set -e
            # make pipelines' return status equal the last command to exit with a non-zero status, or zero if all commands exit successfully
            set -o pipefail
            # debug log
            set -x

            # write your script here
            echo "BASE_API_URL=$BASE_API_URL" >> $BITRISE_SOURCE_DIR/.env.test
            echo "RESET_PASSWORD_URL=$RESET_PASSWORD_URL" >> $BITRISE_SOURCE_DIR/.env.test
            echo "F45_TIMELINE_URL=$F45_TIMELINE_URL" >> $BITRISE_SOURCE_DIR/.env.test
            echo "MOVEMENT_PATH=$MOVEMENT_PATH" >> $BITRISE_SOURCE_DIR/.env.test
            echo "EXERCISE_PATH=$EXERCISE_PATH" >> $BITRISE_SOURCE_DIR/.env.test

            echo "UDP_PORT=$UDP_PORT" >> $BITRISE_SOURCE_DIR/.env.test
            echo "UDP_PORT_SERVER=$UDP_PORT_SERVER" >> $BITRISE_SOURCE_DIR/.env.test

            echo "BEAMER_URL=$BEAMER_URL" >> $BITRISE_SOURCE_DIR/.env.test
            echo "BEAMER_API_KEY=$BEAMER_API_KEY" >> $BITRISE_SOURCE_DIR/.env.test

            echo "FRESH_CHAT_APP_ID=$FRESH_CHAT_APP_ID" >> $BITRISE_SOURCE_DIR/.env.test
            echo "FRESH_CHAT_APP_KEY=$FRESH_CHAT_APP_KEY" >> $BITRISE_SOURCE_DIR/.env.test

            echo "AUTHORIZATION_KEY=$AUTHORIZATION_KEY" >> $BITRISE_SOURCE_DIR/.env.test
            echo "STUDIO_TRAINING_URL=$STUDIO_TRAINING_URL" >> $BITRISE_SOURCE_DIR/.env.test
            echo "RADIO_CDN_PATH=$RADIO_CDN_PATH" >> $BITRISE_SOURCE_DIR/.env.test

            echo "AUTH_API=$AUTH_API" >> $BITRISE_SOURCE_DIR/.env.test

            echo "TEST_EMAIL=$TEST_EMAIL" >> $BITRISE_SOURCE_DIR/.env.test
            echo "TEST_PASSWORD=$TEST_PASSWORD" >> $BITRISE_SOURCE_DIR/.env.test

            cat $BITRISE_SOURCE_DIR/.env.test
    - certificate-and-profile-installer@1: {}
    - script@1:
        inputs:
        - script_file_path:
        - content: |-
            #!/usr/bin/env bash
            detox build -c ios.sim.release
        title: Detox build
        run_if: '{{enveq "CUSTOM_ENV_VAR_KEY" "test value to test against"}}'
    - script@1:
        inputs:
        - script_file_path:
        - content: |-
            #!/usr/bin/env bash
            # fail if any commands fails
            set -e
            # make pipelines' return status equal the last command to exit with a non-zero status, or zero if all commands exit successfully
            set -o pipefail
            # debug log
            set -x

            #!/usr/bin/env bash
            detox clean-framework-cache && detox build-framework-cache && detox test -c ios.sim.release --cleanup
        title: Detox test
        run_if: '{{enveq "CUSTOM_ENV_VAR_KEY" "test value to test against"}}'
    - save-npm-cache@1: {}
    - file-downloader@1:
        inputs:
        - destination: "$BITRISE_SOURCE_DIR/scripts/AuthKey_ZMKWA9GPU9.p8"
        - source: "$BITRISEIO_d2_autobuild_api_key_URL"
    - script@1:
        inputs:
        - script_file_path:
        - content: "#!/usr/bin/env bash\n# fail if any commands fails\nset -e\n# make
            pipelines' return status equal the last command to exit with a non-zero
            status, or zero if all commands exit successfully\nset -o pipefail\n#
            debug log\nset -x\n\n# write your script here\nnode scripts/updateCFBundleVersion.js "
        title: Script updateCFBundleVersion
    - xcode-archive@5:
        inputs:
        - distribution_method: app-store
        - export_development_team: 277U42X8HF
        - automatic_code_signing: api-key
    after_run:
    - Deploy-Android
meta:
  bitrise.io:
    stack: osx-xcode-15.4.x
    machine_type_id: g2.mac.medium
app:
  envs:
  - opts:
      is_expand: false
    WORKDIR: "."
  - opts:
      is_expand: false
    PROJECT_LOCATION: android
  - opts:
      is_expand: false
    MODULE: app
  - opts:
      is_expand: false
    VARIANT: Release
  - opts:
      is_expand: false
    BITRISE_PROJECT_PATH: ios/iMode.xcworkspace
  - opts:
      is_expand: false
    BITRISE_SCHEME: iMode
  - opts:
      is_expand: false
    BITRISE_DISTRIBUTION_METHOD: development
trigger_map:
- push_branch: main
  type: push
  workflow: Deploy-IOS
```

## 5. Releases > Release Management
[Getting started with Release Management](https://devcenter.bitrise.io/en/release-management/getting-started-with-release-management.html)
- Connect Android & IOS apps
- Add new Release