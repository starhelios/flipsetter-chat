
import MobileCoreServices
import UIKit
import Social
import RNShareMenu

class ShareViewController: SLComposeServiceViewController {
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    didSelectPost()
  }

  override func isContentValid() -> Bool {
    return true
  }
  
  override func configurationItems() -> [Any]! {
      return []
  }

  override func didSelectPost() {
    guard let item = extensionContext?.inputItems.first as? NSExtensionItem else {
      cancelRequest()
      return
    }

    handlePost(item)
  }

  func handlePost(_ item: NSExtensionItem) {
    guard let provider = item.attachments?.first else {
      cancelRequest()
      return
    }
    
    if provider.isText {
      storeText(withProvider: provider)
    } else if provider.isURL {
      storeUrl(withProvider: provider)
    } else {
      storeFile(withProvider: provider)
    }
  }
  
  func storeText(withProvider provider: NSItemProvider) {
    
    provider.loadItem(forTypeIdentifier: kUTTypeText as String, options: nil) { (data, error) in
      guard (error == nil) else {
        self.exit(withError: error.debugDescription)
        return
      }
      guard let text = data as? String else {
        self.exit(withError: COULD_NOT_FIND_STRING_ERROR)
        return
      }
      self.openHostApp(text)
    }
  }
  
  func storeUrl(withProvider provider: NSItemProvider) {
    
    provider.loadItem(forTypeIdentifier: kUTTypeURL as String, options: nil) { (data, error) in
      guard (error == nil) else {
        self.exit(withError: error.debugDescription)
        return
      }
      guard let url = data as? URL else {
        self.exit(withError: COULD_NOT_FIND_URL_ERROR)
        return
      }
      
      self.openHostApp(url.absoluteString)
    }
  }
  
  func storeFile(withProvider provider: NSItemProvider) {
    
    provider.loadItem(forTypeIdentifier: kUTTypeData as String, options: nil) { (data, error) in
      guard (error == nil) else {
        self.exit(withError: error.debugDescription)
        return
      }
      guard let url = data as? URL else {
        self.exit(withError: COULD_NOT_FIND_IMG_ERROR)
        return
      }
     
      guard let groupFileManagerContainer = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.com.flipsetter.mobile") else {
        self.exit(withError: NO_APP_GROUP_ERROR)
        return
      }
      
//      let mimeType = url.extractMimeType()
      let fileExtension = url.pathExtension
      let fileName = UUID().uuidString
      let filePath = groupFileManagerContainer.appendingPathComponent("\(fileName).\(fileExtension)")
      guard self.moveFileToDisk(from: url, to: filePath) else {
        self.exit(withError: COULD_NOT_SAVE_FILE_ERROR)
        return
      }
      
      self.openHostApp(filePath.absoluteString)
    }
  }

  func moveFileToDisk(from srcUrl: URL, to destUrl: URL) -> Bool {
    do {
      if FileManager.default.fileExists(atPath: destUrl.path) {
        try FileManager.default.removeItem(at: destUrl)
      }
      try FileManager.default.copyItem(at: srcUrl, to: destUrl)
    } catch (let error) {
      print("Could not save file from \(srcUrl) to \(destUrl): \(error)")
      return false
    }
    
    return true
  }
  
  func exit(withError error: String) {
    print("Error: \(error)")
    cancelRequest()
  }
  
  internal func openHostApp(_ text: String) {
    let url = NSURL(string: "com.flipsetter.mobile://page1/\(text)")
    let selectorOpenURL = sel_registerName("openURL:")
    let context = NSExtensionContext()
    context.open(url! as URL, completionHandler: nil)
    
    var responder: UIResponder? = self.parent
    while responder != nil {
      if responder?.responds(to: selectorOpenURL) == true {
        responder?.perform(selectorOpenURL, with: url)
      }
      responder = responder!.next
    }
    
    completeRequest()
  }
  
  func completeRequest() {
    extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
  }
  
  func cancelRequest() {
    extensionContext!.cancelRequest(withError: NSError())
  }
}
