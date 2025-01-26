//
//  ModelView.swift
//  Adapted from Apple for Aviatuer
//
//  Abstract:
//  A wrapper for AR QuickLook viewer that lets you view the reconstructed USDZ model file directly.
//

import SwiftUI
import RealityKit
import QuickLook
import os

private let logger = Logger(subsystem: Aviateur.subsystem, category: "ModelView")

struct ModelView: View {
    let modelFile: URL
    let endCaptureCallback: () -> Void

    @State private var isUploading = false
    @State private var uploadMessage: String?

    var body: some View {
        ZStack {
            ARQuickLookWithOverlay(
                modelFile: modelFile,
                onDismiss: {
                    endCaptureCallback()
                }
            )

            VStack {
                Spacer()

                if let message = uploadMessage {
                    Text(message)
                        .foregroundColor(.green)
                        .padding(.bottom, 8)
                        .transition(.opacity)
                }

                Button(action: {
                    uploadModel()
                }) {
                    Text(isUploading ? "Uploading..." : "Upload Model")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(isUploading ? Color.gray : Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                        .padding(.horizontal, 16)
                }
                .disabled(isUploading)
                .padding(.bottom, 16)
            }
        }
        .onAppear {
            UIApplication.shared.isIdleTimerDisabled = false
        }
    }

    private func uploadModel() {
        isUploading = true
        uploadMessage = nil

        var request = URLRequest(url: URL(string: "https://api.aviateur.tech/upload")!)
        request.httpMethod = "POST"

        let boundary = UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        let formData = createFormData(fileURL: modelFile, boundary: boundary)

        let task = URLSession.shared.uploadTask(with: request, from: formData) { data, response, error in
            DispatchQueue.main.async {
                isUploading = false

                if let error = error {
                    uploadMessage = "Upload failed: \(error.localizedDescription)"
                    logger.error("Upload failed: \(error.localizedDescription)")
                    return
                }

                if let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) {
                    uploadMessage = "Upload successful!"
                    logger.log("Upload successful!")
                    
                    let feedbackGenerator = UINotificationFeedbackGenerator()
                    feedbackGenerator.notificationOccurred(.success)
    
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        endCaptureCallback()
                    }
                } else {
                    uploadMessage = "Upload failed. Please try again."
                    logger.error("Upload failed. HTTP Status Code: \((response as? HTTPURLResponse)?.statusCode ?? 0)")
                }
            }
        }

        task.resume()
    }
    
    private func createFormData(fileURL: URL, boundary: String) -> Data {
        var body = Data()
        let filename = fileURL.lastPathComponent
        let mimeType = "model/vnd.usdz+zip"

        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(filename)\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: \(mimeType)\r\n\r\n".data(using: .utf8)!)
        
        if let fileData = try? Data(contentsOf: fileURL) {
            body.append(fileData)
        }
        
        body.append("\r\n".data(using: .utf8)!)
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        
        return body
    }
    
    private func clearQuickLookCache() {
        DispatchQueue.global(qos: .background).async {
            do {
                let cacheURLs = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)
                if let cacheURL = cacheURLs.first {
                    let quickLookCacheURL = cacheURL.appendingPathComponent("com.apple.quicklook.ThumbnailsAgent")
                    if FileManager.default.fileExists(atPath: quickLookCacheURL.path) {
                        try FileManager.default.removeItem(at: quickLookCacheURL)
                        logger.log("QuickLook cache cleared successfully.")
                    }
                }
            } catch {
                logger.error("Failed to clear QuickLook cache: \(error.localizedDescription)")
            }
        }
    }
}

struct ARQuickLookWithOverlay: UIViewControllerRepresentable {
    let modelFile: URL
    let onDismiss: () -> Void

    func makeUIViewController(context: Context) -> UIViewController {
        let controller = UIViewController()
        let quickLookController = QLPreviewController()
        quickLookController.dataSource = context.coordinator

        quickLookController.delegate = context.coordinator

        controller.addChild(quickLookController)
        controller.view.addSubview(quickLookController.view)
        quickLookController.view.frame = controller.view.bounds
        quickLookController.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        quickLookController.didMove(toParent: controller)

        let exitButtonOverlay = UIHostingController(rootView: ExitButtonOverlay(onDismiss: onDismiss))
        exitButtonOverlay.view.backgroundColor = .clear
        exitButtonOverlay.view.translatesAutoresizingMaskIntoConstraints = false
        controller.view.addSubview(exitButtonOverlay.view)

        NSLayoutConstraint.activate([
            exitButtonOverlay.view.topAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.topAnchor, constant: 16),
            exitButtonOverlay.view.leadingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.leadingAnchor, constant: 16)
        ])

        return controller
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self, onDismiss: onDismiss)
    }

    class Coordinator: NSObject, QLPreviewControllerDataSource, QLPreviewControllerDelegate {
        let parent: ARQuickLookWithOverlay
        let onDismiss: () -> Void

        init(_ parent: ARQuickLookWithOverlay, onDismiss: @escaping () -> Void) {
            self.parent = parent
            self.onDismiss = onDismiss
        }

        func numberOfPreviewItems(in controller: QLPreviewController) -> Int {
            return 1
        }

        func previewController(_ controller: QLPreviewController, previewItemAt index: Int) -> QLPreviewItem {
            return parent.modelFile as QLPreviewItem
        }

        func previewControllerDidDismiss(_ controller: QLPreviewController) {
            onDismiss()
        }
    }
    
    struct ExitButtonOverlay: View {
        let onDismiss: () -> Void

        var body: some View {
            Button(action: {
                onDismiss()
            }) {
                Image(systemName: "xmark")
                    .padding(16.0)
                    .font(.subheadline)
                    .bold()
                    .foregroundColor(.white)
                    .background(.ultraThinMaterial)
                    .environment(\.colorScheme, .dark)
                    .cornerRadius(15)
                    .multilineTextAlignment(.center)
            }
            .shadow(radius: 4)
        }
    }
}
