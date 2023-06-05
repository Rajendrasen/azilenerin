// WhiteLabelConfig.m
#import "WhiteLabelConfig.h"

@implementation WhiteLabelConfig
  
  RCT_EXPORT_MODULE(WhiteLabelConfig);
  
  RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getAppName) {
    return @"erin";
  }
  
@end
