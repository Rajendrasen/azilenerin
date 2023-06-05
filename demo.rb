# Name of the new schema and target
new_schema_name = 'Azilen_erin_dd'
new_target_name = 'Azilen_erin'

# Path to the Xcode project directory
project_directory = '/Users/rajendrakumar/ERIN-IOS/mobile-whitelabel/ios/erinMobile.xcodeproj'

# Add a new scheme
`xcodebuild -project "#{project_directory}" -list | grep -oP "(?<=Schemes:\n).*" | awk '{print $1}' | tr -d '\n' > scheme_list.txt`
`sed -i '' -e "s/$(cat scheme_list.txt)/$(cat scheme_list.txt)\\n    #{new_schema_name}/" "#{project_directory}/project.pbxproj"`

# Add a new target
`xcodebuild -project "#{project_directory}" -scheme "#{new_schema_name}" -configuration Debug -showBuildSettings > build_settings.txt`
target_id = `awk '/^TARGET_ID/ {print $NF}' build_settings.txt`.chomp
`xcodebuild -project "#{project_directory}" -target "#{target_id}" -configuration Debug -arch x86_64`

# Update the scheme with the new target
`xcodebuild -project "#{project_directory}" -scheme "#{new_schema_name}" -configuration Debug -settarget "#{new_target_name}"`

