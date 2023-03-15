<h2 align="center">
    <b>Mitts-Engine Development Kit</b> (v0.3.0)
</h2>
<p align="center">
    Development kit assisting with creating DiD escape games using the <i>Mitts-Engine</i><br />
    Developed using Svelte / TypeScript / Tailwind CSS (frontend) and Go + Wails v2 (backend) <br />
    <b>Community-uploaded games repository:</b> <a href="https://github.com/strawberria/mitts-engine-games">strawberria/mitts-engine-games</a> <br />
    <b>Experience the games here:</b> <a href="https://strawberria.github.io/s">strawberria.github.io</a> <br />
    <br />
    <a href="https://ko-fi.com/G2G2G0ZG3">
        <img alt="Kofi" src="https://ko-fi.com/img/githubbutton_sm.svg"/>
    </a>
</p>

## Quick Links
- [Installation](#Installation)
- [Changelog](#Changelog)
- [Usage Guide and Tips](usage-guide-tips.md)

## Installation
- For simple, self-bundled downloads, download the latest release for your operating system [here](https://github.com/strawberria/mitts-engine-devkit/releases)
- Otherwise, follow the given instructions to hot-compile a development environment:
    - Install Node.js 15+ through their installation page [here](https://nodejs.org/en/download/)
    - Install Go 1.18+ through their installation page [here](https://go.dev/doc/install)
    - Then, install Wails by following their instructions through their [guide](https://wails.io/docs/gettingstarted/installation/) 
    - Clone this repository `git@github.com:strawberria/mitts-engine-games.git` to your system
    - Open a command prompt / terminal and navigate to the cloned repository folder:
        - Run `cd frontend` then `npm install` to install the frontend Node.js package requirements
        - Then, `cd ..` back to the top-level folder and run `wail dev` to run the application

## Changelog
- **0.1.0 - Initial Release (nothing new)**
- **0.2.0 - Minimap support and additional interaction criteria/results**
    - Added in-game support for non-normal states including `transition`, `goodEnding`, and `badEnding` 
    - Added in-game support for minimap clicking which shows dialog and/or reveals object (executing custom interaction planned for the future, eventually.)
    - Added additional interaction criteria `targetTag_component1`  and `targetTag_component2` which check whether the given tag exists on target object or restraint (targeted restraint locations in this case are ignoredx`)
    - Added additional interaction results `restraintAddTarget` and `restraintRemoveTarget` which add or remove the targeted restraint if criteria are met (currently only target 1)
- **0.3.0 - Maximum attempts implementation and automatic transpiling from older versions**
    - Added 'maximum attempts' feature per-state which automatically transitions states when maximum attempts is reached, which is useful for implementing time-based bad ends (and also optimization-heavy puzzles eventually?)
    - Added automatic transpilation from older versions (currently 0.1.0/0.2.0 to 0.3.0) which adds/modifies/removes the necessary data from the project before updating the officially supported engine version
    - Fixed bug causing interactions filter to not work properly
- **0.3.1 - Added backup location to `locationRemove` interaction result for seamless 'replacement' of minimap locations**
    - Make sure to `locationAdd` the new location before `locationRemove` the old location, setting the "Backup Location" to the newly added location - this results in a seamless 'update' of the minimap.
    