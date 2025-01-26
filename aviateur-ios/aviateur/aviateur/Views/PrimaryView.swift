//
//  PrimaryView.swift
//  Adapted from Apple for Aviatuer
//
//  Abstract:
//  The main view that includes both the image capture and reconstruction.
//

import SwiftUI

import os

private let logger = Logger(subsystem: Aviateur.subsystem, category: "PrimaryView")

struct PrimaryView: View {
    @Environment(AppDataModel.self) var appModel

    @State private var showReconstructionView: Bool = false
    @State private var showErrorAlert: Bool = false
    private var showProgressView: Bool {
        appModel.state == .completed || appModel.state == .restart || appModel.state == .ready
    }

    var body: some View {
        VStack {
            if appModel.state == .capturing {
                if let session = appModel.objectCaptureSession {
                    CapturePrimaryView(session: session)
                }
            } else if showProgressView {
                CircularProgressView()
            }
        }
        .onChange(of: appModel.state) { _, newState in
            if newState == .failed {
                showErrorAlert = true
                showReconstructionView = false
            } else {
                showErrorAlert = false
                showReconstructionView = newState == .reconstructing || newState == .viewing
            }
        }
        .sheet(isPresented: $showReconstructionView) {
            if let folderManager = appModel.captureFolderManager {
                ReconstructionPrimaryView(outputFile: folderManager.modelsFolder.appendingPathComponent("model-mobile.usdz"))
                    .interactiveDismissDisabled()
                    .overlay(
                        VStack {
                            Spacer()
                            if appModel.state == .viewing {
                                Button(action: {
                                    uploadModel(fileURL: folderManager.modelsFolder.appendingPathComponent("model-mobile.usdz"))
                                }) {
                                    Text("Upload Model")
                                        .font(.headline)
                                        .foregroundColor(.white)
                                        .frame(maxWidth: .infinity, maxHeight: 50)
                                        .background(Color.blue)
                                        .cornerRadius(10)
                                        .padding()
                                }
                            }
                        }
                    )
            }
        }
        .alert(
            "Failed:  " + (appModel.error != nil  ? "\(String(describing: appModel.error!))" : ""),
            isPresented: $showErrorAlert,
            actions: {
                Button("OK") {
                    logger.log("Calling restart...")
                    appModel.state = .restart
                }
            },
            message: {}
        )
    }
}

private struct CircularProgressView: View {
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        VStack {
            Spacer()
            ZStack {
                Spacer()
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: colorScheme == .light ? .black : .white))
                Spacer()
            }
            Spacer()
        }
    }
}

func uploadModel(fileURL: URL) {
    let uploadURL = URL(string: "https://api.aviateur.tech/upload")!

    var request = URLRequest(url: uploadURL)
    request.httpMethod = "POST"
    let boundary = UUID().uuidString
    request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

    var body = Data()
    let filename = fileURL.lastPathComponent
    let mimeType = "application/octet-stream"

    // Add file data to the request body
    body.append("--\(boundary)\r\n".data(using: .utf8)!)
    body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(filename)\"\r\n".data(using: .utf8)!)
    body.append("Content-Type: \(mimeType)\r\n\r\n".data(using: .utf8)!)
    if let fileData = try? Data(contentsOf: fileURL) {
        body.append(fileData)
    }
    body.append("\r\n".data(using: .utf8)!)
    body.append("--\(boundary)--\r\n".data(using: .utf8)!)

    // Add the body to the request
    request.httpBody = body

    // Perform the request
    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            logger.error("Upload failed: \(error.localizedDescription)")
            return
        }

        if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
            logger.log("Upload successful")
        } else {
            logger.error("Upload failed: Unexpected response")
        }
    }.resume()
}
