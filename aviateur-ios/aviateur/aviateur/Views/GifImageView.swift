//
//  GifImageView.swift
//  Adapter for Aviateur from hackmd.io/@rizzyD/rksCKHALq
//
//
//  Created by Ryan Lahlou on 1/26/25.
//

import SwiftUI
import WebKit

struct GifImage: UIViewRepresentable {
    private let name: String
    
//initialize a name
    init(_ name: String){
        self.name = name
    }
   
    func makeUIView(context: Context) -> some WKWebView {
        let webView = WKWebView()
        
        let url = Bundle.main.url(forResource: name, withExtension: "gif")!
       
        let data = try! Data(contentsOf: url)
       
        webView.load(
            data,
            mimeType: "image/gif",
            characterEncodingName: "UTF-8",
            baseURL: url.deletingLastPathComponent()
        )
 
        webView.scrollView.isScrollEnabled = false
        
        return webView
    }
    
    func updateUIView(_ uiView: UIViewType, context: Context) {
        uiView.reload()
    }
}
