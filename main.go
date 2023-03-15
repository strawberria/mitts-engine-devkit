package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the bridge
	bridge := NewBridge()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "Mitts-Engine Development Kit",
		Width:     1600,
		Height:    900,
		Assets:    assets,
		OnStartup: bridge.startup,
		Bind: []interface{}{
			bridge,
		},
	})

	if err != nil {
		println("Error:", err)
	}
}
