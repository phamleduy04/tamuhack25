//
//  CaptureOverlayView.swift
//  Adapted from Apple for Aviatuer
//
//  Abstract:
//  Full-screen overlay UI with buttons to control the capture, intended to placed in a `ZStack` over the `ObjectCaptureView`.
//

import AVFoundation
import RealityKit
import SwiftUI
import os

private let logger = Logger(subsystem: Aviateur.subsystem, category: "CaptureOverlayView")

struct CaptureOverlayView: View {
    @Environment(AppDataModel.self) var appModel
    var session: ObjectCaptureSession
    
    @State private var showCaptureModeGuidance: Bool = false
    @State private var hasDetectionFailed = false
    @State private var deviceOrientation: UIDeviceOrientation = UIDevice.current.orientation

    var body: some View {
        ZStack {
            VStack(spacing: 20) {
                TopOverlayButtons(session: session,
                                  showCaptureModeGuidance: showCaptureModeGuidance)

                Spacer()

                BoundingBoxGuidanceView(session: session, hasDetectionFailed: hasDetectionFailed)

                BottomOverlayButtons(session: session,
                                     hasDetectionFailed: $hasDetectionFailed,
                                     showCaptureModeGuidance: $showCaptureModeGuidance,
                                     rotationAngle: rotationAngle)
            }
            .padding()
            .padding(.horizontal, 15)
            .background {
                VStack {
                    Spacer().frame(height: UIDevice.current.userInterfaceIdiom == .pad ? 65 : 80)

                    FeedbackView(messageList: appModel.messageList)
                        .layoutPriority(1)
                }
                .rotationEffect(rotationAngle)
            }
            .task {
                for await _ in NotificationCenter.default.notifications(named: UIDevice.orientationDidChangeNotification) {
                    withAnimation {
                        deviceOrientation = UIDevice.current.orientation
                    }
                }
            }
        }
        // When camera tracking isn't normal, display the AR coaching view and hide the overlay view.
        .opacity(shouldShowOverlayView ? 1.0 : 0.0)
    }

    private var shouldShowOverlayView: Bool {
        return (session.cameraTracking == .normal && !session.isPaused)
    }


    private var rotationAngle: Angle {
        switch deviceOrientation {
            case .landscapeLeft:
                return Angle(degrees: 90)
            case .landscapeRight:
                return Angle(degrees: -90)
            case .portraitUpsideDown:
                return Angle(degrees: 180)
            default:
                return Angle(degrees: 0)
        }
    }
}


private struct BoundingBoxGuidanceView: View {
    @Environment(AppDataModel.self) var appModel
    var session: ObjectCaptureSession
    var hasDetectionFailed: Bool

    @Environment(\.horizontalSizeClass) private var horizontalSizeClass

    var body: some View {
        HStack {
            if let guidanceText {
                Text(guidanceText)
                    .font(.callout)
                    .bold()
                    .foregroundColor(.white)
                    .transition(.opacity)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: horizontalSizeClass == .regular ? 400 : 360)
            }
        }
    }

    private var guidanceText: String? {
        if case .ready = session.state {
            return NSLocalizedString(
                "Look at your subject (Object Capture, State).",
                bundle: Bundle.main,
                value: "Focus on the subject.",
                comment: "Feedback message to look at the subject in the area mode.")
        } else if case .detecting = session.state {
            return NSLocalizedString(
                "Move around to ensure that the whole object is inside the box. Drag handles to manually resize. (Object Capture, State)",
                bundle: Bundle.main,
                value: "Move around to ensure that the whole object is inside the box. Drag handles to manually resize.",
                comment: "Feedback message to resize the box to the object.")
        } else {
            return nil
        }
    }
}

protocol OverlayButtons {
    func isCapturingStarted(state: ObjectCaptureSession.CaptureState) -> Bool
}

extension OverlayButtons {
    func isCapturingStarted(state: ObjectCaptureSession.CaptureState) -> Bool {
        switch state {
            case .initializing, .ready, .detecting:
                return false
            default:
                return true
        }
    }
}
