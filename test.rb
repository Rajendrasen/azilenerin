require 'xcodeproj'

# Path to your Xcode project file
project_path = '/Users/rajendrakumar/ERIN-IOS/mobile-whitelabel/ios/erinMobile.xcodeproj'

# Name of the new schema and target
new_schema_name = 'azilen_demo'
new_target_name = 'erin_demo'

# Open the Xcode project
project = Xcodeproj::Project.open(project_path)

# Create a new scheme
new_scheme = Xcodeproj::XCScheme.new
new_scheme.add_build_target(new_target_name, project.targets.first)
new_scheme.set_launch_target(new_target_name)

# Add the scheme to the project
project.shared_data.add_scheme(new_scheme)

# Create a new target
new_target = project.new_target(:framework, new_target_name, :ios)

# Add the new target to the project
project.targets << new_target

# Save the changes
project.save

