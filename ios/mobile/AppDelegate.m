/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

/**
  Addons
 */
//CallKeep
#import <RNCallKeep/RNCallKeep.h>
//Pushkit
#import <PushKit/PushKit.h>
#import "RNVoipPushNotificationManager.h"
//Firebase
#import <Firebase.h>
// add this import statement at the top of your `AppDelegate.m` file
#import "RNFBMessagingModule.h"
//SplashScreen
#import "RNSplashScreen.h"
//AppCenter Analytics
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate


//FireBase
//- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
//  [[RNFirebaseMessaging instance] didReceiveLocalNotification:notification];
//}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  
  NSDictionary *data = [NSJSONSerialization JSONObjectWithData:[[userInfo objectForKey:@"extraPayload"] dataUsingEncoding:NSUTF8StringEncoding] options:0 error:nil];
  NSNumber *type = [data valueForKey:@"notification_type"];
  NSNumber *check = @7;
  
  
  if([type isEqualToNumber:check]){
    if([RNCallKeep isCallActive:[data valueForKey:@"call_id"]]){
      [RNCallKeep endCallWithUUID:[data valueForKey:@"call_id"] reason:4];
    }
//    [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
    
  }
  else{
//    [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
  }
}
//- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
////  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
//}

/* Add PushKit delegate method */

//Called when a notification is delivered to a foreground app.
//-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
//{
//  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
//}

 // Handle updated push credentials
 - (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(NSString *)type {
   // Register VoIP push token (a property of PKPushCredentials) with server
   [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
 }

- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
// Process the received push
[RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
  
    // Retrieve information like handle and callerName here
    NSString *uuid = [payload.dictionaryPayload valueForKeyPath:@"extraPayload.call_id"];
    NSString *callerName = [payload.dictionaryPayload valueForKeyPath:@"extraPayload.sender_name"];
    NSString *handle = @"generic";
      
      
    //  [RNCallKeep reportNewIncomingCall:uuid handle:handle handleType:@"generic" hasVideo:true localizedCallerName:callerName fromPushKit: YES];
    [RNCallKeep reportNewIncomingCall:uuid handle:handle handleType:@"generic" hasVideo:true localizedCallerName:callerName fromPushKit:YES payload:payload.dictionaryPayload];
      
      
completion();
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [application registerForRemoteNotifications];
  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];
  [FIRApp configure];
//  [RNFirebaseNotifications configure];
  
  // in "(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions" method
  // Use `addCustomPropsToUserProps` to pass in props for initialization of your app
  // Or pass in `nil` if you have none as per below example
  // For `withLaunchOptions` please pass in `launchOptions` object
  NSDictionary *appProperties = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"mobile"
                                            initialProperties:appProperties];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [RNSplashScreen show];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
//- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray * __nullable restorableObjects))restorationHandler
//{
//  return [RNCallKeep application:application
//           continueUserActivity:userActivity
//             restorationHandler:restorationHandler];
//}

- (BOOL)application:(UIApplication *)application
openURL:(NSURL *)url
options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
return [RCTLinkingManager application:application openURL:url options:options];
}

#if RCT_DEV
- (BOOL)bridge:(RCTBridge *)bridge didNotFindModule:(NSString *)moduleName {
  return YES;
}
#endif

@end
