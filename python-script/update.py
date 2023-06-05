import os

# Name of the new target obtained from the environment variable
new_target_name = os.environ.get('NEW_TARGET_NAME')

# Podfile path
podfile_path = 'Podfile'

# Target block content
target_block_content = '''target '{target_name}' do
  # Pods for {target_name}
  pod 'FBLazyVector', :path => "../node_modules/react-native/Libraries/FBLazyVector"
  pod 'FBReactNativeSpec', :path => "../node_modules/react-native/Libraries/FBReactNativeSpec"
  pod 'RCTRequired', :path => "../node_modules/react-native/Libraries/RCTRequired"
  pod 'RCTTypeSafety', :path => "../node_modules/react-native/Libraries/TypeSafety"
  pod 'React', :path => '../node_modules/react-native/'
  pod 'React-Core', :path => '../node_modules/react-native/'
  pod 'React-CoreModules', :path => '../node_modules/react-native/React/CoreModules'
  pod 'React-Core/DevSupport', :path => '../node_modules/react-native/'
  pod 'React-RCTActionSheet', :path => '../node_modules/react-native/Libraries/ActionSheetIOS'
  pod 'React-RCTAnimation', :path => '../node_modules/react-native/Libraries/NativeAnimation'
  pod 'React-RCTBlob', :path => '../node_modules/react-native/Libraries/Blob'
  pod 'React-RCTImage', :path => '../node_modules/react-native/Libraries/Image'
  pod 'React-RCTLinking', :path => '../node_modules/react-native/Libraries/LinkingIOS'
  pod 'React-RCTNetwork', :path => '../node_modules/react-native/Libraries/Network'
  pod 'React-RCTSettings', :path => '../node_modules/react-native/Libraries/Settings'
  pod 'React-RCTText', :path => '../node_modules/react-native/Libraries/Text'
  pod 'React-RCTVibration', :path => '../node_modules/react-native/Libraries/Vibration'
  pod 'React-Core/RCTWebSocket', :path => '../node_modules/react-native/'
  pod 'React-cxxreact', :path => '../node_modules/react-native/ReactCommon/cxxreact'
  pod 'React-jsi', :path => '../node_modules/react-native/ReactCommon/jsi'
  pod 'React-jsiexecutor', :path => '../node_modules/react-native/ReactCommon/jsiexecutor'
  pod 'React-jsinspector', :path => '../node_modules/react-native/ReactCommon/jsinspector'
  pod 'ReactCommon/callinvoker', :path => "../node_modules/react-native/ReactCommon"
  pod 'ReactCommon/turbomodule/core', :path => "../node_modules/react-native/ReactCommon"
  pod 'Yoga', :path => '../node_modules/react-native/ReactCommon/yoga', :modular_headers => true
  pod 'DoubleConversion', :podspec => '../node_modules/react-native/third-party-podspecs/DoubleConversion.podspec'
  pod 'glog', :podspec => '../node_modules/react-native/third-party-podspecs/glog.podspec'
  pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec'
  pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'
  pod 'GoogleSignIn', '~> 5.0.2'
  pod 'react-native-splash-screen', :path => '../node_modules/react-native-splash-screen'
  
  use_native_modules!

  # Enables Flipper.
  #
  # Note that if you have use_frameworks! enabled, Flipper will not work and
  # you should disable these next few lines.
  # add_flipper_pods!

end\n\n\n'''

# Read the existing Podfile content
with open(podfile_path, 'r') as file:
    podfile_content = file.read()

# Check if the new target already exists
if new_target_name and new_target_name not in podfile_content:
    # Find the line number of the specified line
    line_number = podfile_content.index('# ADD NEW TARGET HERE')

    # Insert the new target block above the specified line
    updated_podfile_content = podfile_content[:line_number] + target_block_content.format(target_name=new_target_name) + podfile_content[line_number:]

    # Write the updated Podfile content to the file
    with open(podfile_path, 'w') as file:
        file.write(updated_podfile_content)
else:
    print(f'The target "{new_target_name}" already exists or no new target name provided.')

