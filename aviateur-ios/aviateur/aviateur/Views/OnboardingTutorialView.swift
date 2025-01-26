//
//  OnboardingTutorialView.swift
//  Adapted from Apple for Aviatuer
//
//  Abstract:
//  The guidance view that shows the video tutorial or the point cloud on the review screen.
//  

import RealityKit
import SwiftUI

/// The view that either shows the point cloud or plays the guidance tutorials on the review screens, depending on
/// `currentState` in `onboardingStateMachine`.
struct OnboardingTutorialView: View {
    @Environment(AppDataModel.self) var appModel
    var session: ObjectCaptureSession
    var onboardingStateMachine: OnboardingStateMachine
    @Binding var showShotLocations: Bool
    var viewSize: CGSize

    var body: some View {
        VStack {
            let frameSize = min(viewSize.width, viewSize.height) * (UIDevice.current.userInterfaceIdiom == .pad ? 0.5 : 0.8)
            Spacer().frame(height: 50)
            ObjectCapturePointCloudView(session: session)
                .showShotLocations(showShotLocations)
                .frame(width: frameSize, height: frameSize)

            VStack {
                Text(title)
                    .font(.largeTitle)
                    .lineLimit(3)
                    .minimumScaleFactor(0.5)
                    .bold()
                    .multilineTextAlignment(.center)
                    .padding(.bottom)
                    .frame(maxWidth: .infinity)

                Text(detailText)
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)

                Spacer()

                if appModel.captureMode == .area {
                    Text(LocalizedString.estimatedProcessingTime)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    if let numberOfShotsTaken = appModel.objectCaptureSession?.numberOfShotsTaken,
                       let maximumNumberOfInputImages = appModel.objectCaptureSession?.maximumNumberOfInputImages,
                       numberOfShotsTaken > maximumNumberOfInputImages {
                        Text(String(format: LocalizedString.transferToMacGuidance,
                                    maximumNumberOfInputImages, numberOfShotsTaken))
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    Spacer().frame(height: 130)
                }
            }
            .foregroundColor(.primary)
            .frame(maxHeight: .infinity)
            .padding([.leading, .trailing], UIDevice.current.userInterfaceIdiom == .pad ? 50 : 30)
        }
    }

    private var shouldShowTutorialInReview: Bool {
        switch onboardingStateMachine.currentState {
            case .flipObject, .flipObjectASecondTime, .captureFromLowerAngle, .captureFromHigherAngle:
                return true
            default:
                return false
        }
    }

    private func getOrbitImageName(orbit: AppDataModel.Orbit) -> String? {
        guard let session = appModel.objectCaptureSession else { return nil }
        let orbitCompleted = session.userCompletedScanPass
        let orbitCompleteImage = orbit <= appModel.orbit ? orbit.imageSelected : orbit.image
        let orbitNotCompleteImage = orbit < appModel.orbit ? orbit.imageSelected : orbit.image
        return orbitCompleted ? orbitCompleteImage : orbitNotCompleteImage
    }

    private let onboardingStateToTitleMap: [ OnboardingState: String ] = [
        .tooFewImages: LocalizedString.tooFewImagesTitle,
        .firstSegmentNeedsWork: LocalizedString.firstSegmentNeedsWorkTitle,
        .firstSegmentComplete: LocalizedString.firstSegmentCompleteTitle,
        .secondSegmentNeedsWork: LocalizedString.secondSegmentNeedsWorkTitle,
        .secondSegmentComplete: LocalizedString.secondSegmentCompleteTitle,
        .thirdSegmentNeedsWork: LocalizedString.thirdSegmentNeedsWorkTitle,
        .thirdSegmentComplete: LocalizedString.thirdSegmentCompleteTitle,
        .flipObject: LocalizedString.flipObjectTitle,
        .flipObjectASecondTime: LocalizedString.flipObjectASecondTimeTitle,
        .flippingObjectNotRecommended: LocalizedString.flippingObjectNotRecommendedTitle,
        .captureFromLowerAngle: LocalizedString.captureFromLowerAngleTitle,
        .captureFromHigherAngle: LocalizedString.captureFromHigherAngleTitle,
        .captureInAreaMode: LocalizedString.captureInAreaModeTitle
    ]

    private var title: String {
        onboardingStateToTitleMap[onboardingStateMachine.currentState] ?? ""
    }

    private let onboardingStateToDetailTextMap: [ OnboardingState: String ] = [
        .tooFewImages: String(format: LocalizedString.tooFewImagesDetailText, AppDataModel.minNumImages),
        .firstSegmentNeedsWork: LocalizedString.firstSegmentNeedsWorkDetailText,
        .firstSegmentComplete: LocalizedString.firstSegmentCompleteDetailText,
        .secondSegmentNeedsWork: LocalizedString.secondSegmentNeedsWorkDetailText,
        .secondSegmentComplete: LocalizedString.secondSegmentCompleteDetailText,
        .thirdSegmentNeedsWork: LocalizedString.thirdSegmentNeedsWorkDetailText,
        .thirdSegmentComplete: LocalizedString.thirdSegmentCompleteDetailText,
        .flipObject: LocalizedString.flipObjectDetailText,
        .flipObjectASecondTime: LocalizedString.flipObjectASecondTimeDetailText,
        .flippingObjectNotRecommended: LocalizedString.flippingObjectNotRecommendedDetailText,
        .captureFromLowerAngle: LocalizedString.captureFromLowerAngleDetailText,
        .captureFromHigherAngle: LocalizedString.captureFromHigherAngleDetailText,
        .captureInAreaMode: LocalizedString.captureInAreaModeDetailText
    ]

    private var detailText: String {
        onboardingStateToDetailTextMap[onboardingStateMachine.currentState] ?? ""
    }
}
