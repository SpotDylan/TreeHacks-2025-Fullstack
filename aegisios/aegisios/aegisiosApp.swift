//
//  aegisiosApp.swift
//  aegisios
//
//  Created by Rithvik Gabri on 2/15/25.
//

import SwiftUI

@main
struct aegisiosApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
