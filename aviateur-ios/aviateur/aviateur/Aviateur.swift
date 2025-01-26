//
//  Aviateur.swift
//  Adapted from Apple for Aviatuer
//
//  Abstract:
//  The single entry point of the app.
//

import SwiftUI

@main
struct Aviateur: App {
    static let subsystem: String = "lryanle.aviateur"

    @State private var showLandingPage: Bool = true

    var body: some Scene {
        WindowGroup {
            if showLandingPage {
                LandingPageView(onContinue: {
                    withAnimation {
                        showLandingPage = false
                    }
                })
                .environment(AppDataModel.instance)
            } else {
                ContentView()
                    .environment(AppDataModel.instance)
            }
        }
    }
}
