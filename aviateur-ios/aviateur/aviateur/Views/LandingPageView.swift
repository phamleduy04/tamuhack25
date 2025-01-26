//
//  LandingPageView.swift
//  By Aviatuer
//
//  Abstract: Minimalist and professional landing page for the app.
//

import SwiftUI

struct LandingPageView: View {
    var onContinue: () -> Void

    var body: some View {
        ZStack {
            Color(.systemBackground)
                .ignoresSafeArea()
                
            VStack(spacing: 30) {
                Spacer()
                
                Image("AviateurDark")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .foregroundColor(.primary)
                    .opacity(0.9)

                VStack(spacing: 10) {
                    Text("Aviateur")
                        .font(.system(size: 40, weight: .bold, design: .default))
                        .foregroundColor(.primary)

                    Text("American Airlines 3D Maintenance Auditing Tool")
                        .font(.system(size: 18, weight: .regular, design: .default))
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 30)
                }

                Spacer()

                Button(action: {
                    onContinue()
                }) {
                    Text("Create Audit Capture")
                        .font(.body)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .shadow(color: Color.black.opacity(0.1), radius: 5, x: 0, y: 2)
                        .frame(maxWidth: .infinity)
                        .padding(.horizontal, 25)
                        .padding(.vertical, 20)
                        .background(.blue)
                        .cornerRadius(10)
                }
                .padding(.horizontal, 20)
            }
            .padding()
        }
    }
}
