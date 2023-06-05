/usr/bin/xcodebuild archive -workspace /Users/rajendrakumar/ERIN-IOS/mobile-whitelabel/ios/erinMobile.xcworkspace -scheme erinMobile -UseModernBuildSystem=NO -archivePath /Users/rajendrakumar/ERIN-IOS/mobile-whitelabel/erinMobile.xcarchive -allowProvisioningUpdates "OTHER_CODE_SIGN_FLAGS=--keychain /Users/rajendrakumar/Library/Keychains/login.keychain-db " -sdk iphoneos CODE_SIGNING_ALLOWED=NO


/usr/bin/xcodebuild -exportArchive -archivePath /Users/rajendrakumar/ERIN-IOS/mobile-whitelabel/erinMobile.xcarchive  -exportPath /Users/rajendrakumar/ERIN-IOS/ -allowProvisioningUpdates