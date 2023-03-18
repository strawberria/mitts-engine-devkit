## Starting Slow - the `Metadata` Tab
- When you first open the development kit, you're greeted with the `Metadata` tab which contains basic game information and available actions (later segregated by state if necessary)
- Fill in some basic game information including title, author, version, and synopsis (which shows up on the homepage, providing a basic overview of your game!)
- Create some actions like "Cut", "Unlock", "Use", etc. if desired:
    - **Note that the default action "Examine" displays examine text along with any other interaction results if specified!**
    - The `verb` describes the intermediate verb when describing your action, and is only necessary when `Optional Second Argument` is ticked - for instance, the action "Unlock" with the verb "with" would generate text like: `Unlock [Small Padlock] with [Small key]`
    - `Order Matters` describes whether your actions are order-sensitive - for instance, you can `Combine [Box] and [Marbles]` in any order, but you can't `Unlock [Small Key] with [Small Padlock]`!

## Vivid Imagery - the `Images` Tab
- The `Images` tab is fairly self-explanatory and allows you to 'store' any images you're using within the game for future reference by name (without having to individually upload each time and duplicate images everywhere and- yeah). There's also a preview for the selected image which is pretty cool.

## Flow Charts - the `States` Tab
- The `States` tab controls the flow of your game and through interactions, can link with any other state (more details below) - the `Description` and `State Image` determine what information and perhaps fluff the player will be given
    - There are four different types of states - `Normal` states with normal gameplay, `Transition` 'transitioning' between two states (`Transition` states can be chained!), and `Good Ending` / `Bad Ending` states ending the game.
        - For transition states, the state marked as "Transition State" will be used as the next state.
        - **Note that the first non-ending state listed will be used as the introduction state!**
    - The `Available Actions` section determines what subset of actions detailed in the `Metadata` tab are currently available to the player - this is useful if you don't want your players to get sidetracked with actions that are only used later
    - The `Hints` section allows you to choose what hints to give to the player after a given number of (failed) attempts - this could be anything from vague hints like "What can you currently reach?" to very specific actions like `Unlock the [Small Padlock] with the [Small Key]` to help players seriously stuck. 
        - **All hints are disabled by default, set the number of attempts for each hint to not -1 to enable them!**
    - The last section details what should happen once the maximum attempts are reached (**-1 means no maximum attempts**) - this usually represents a time-based bad end such as getting caught or other perilous scenarios, pretty self explanatory.

## The Good Stuff - the `Restraints` Tab
- The `Restraints` tab contains all restraints and restraint locations within the game, each of which can be assigned tags (more details below) to interact with certain interactions (examples towards the end!):
    - In the `Restraint Locations` section, you'll want to create some restraint locations such as "Mouth", "Arms", "Legs", "Neck", etc. - these are where restraints will be 'located' and there can only be one restraint on any given location at a time. You can select the `Initial Restraint` once you've created a restraint and assigned it a restraint location.
        - **You can use interaction results to 'reveal' hidden restraints - for instance, upon successfully removing an "Armbinder", the restraint could be replaced (removed and then others added) with the lower-layer "Leather Cuffs" and/or "Taped Hands".**
    - Under the `Restraints` section, you can create individual restraints and assign them a restraint location and examine text (then set them as initial restraint per restraint location if desired). 
        - Restraint tags can be used to represent different classes of restraints for ease of interaction - for instance, any restraints with tag "steel" could be restricted from being cut by scissors.
        - Here are some ideas for restraint tags:
            - "covers-hands" restraints preventing any hand-based interactions while worn
            - "reachable-cuffed" restraints reachable for cutting/removal while arms are cuffed
            - "locked-star_key" restraints unable to be removed unless unlocked first with the appropriate key (or perhaps, cut depending on the material and the appropriate tag)

## Stuff Coincidentally Laying Around - the `Objects` Tab
- The `Objects` tab contains all the interactables within the game other than restraints - this could include everything from keys, tables, doors - you name it! Objects can also be assigned tags just like restraints and used the same way (though they can't be 'removed' from inventory based on their tag).
    - Each object can be `Initially Revealed`, meaning that it's initially available for the player to interact with from the onset - however, remember that you can still restrict its use with tags and interaction criteria (more below).
    - Here are some ideas for object tags:
        - A key tagged with "unlocks-star_key" can unlock any restraints with the appropriate "locked-star_key" tag
        - Scissors tagged with "reachable-unchained" can be properly interacted with (instead of telling the player it's not reachable) once their collar chain has been unlocked
        - A dull knife tagged with "cuts-leather-weak" can cut any restraints tagged with "leather-weak" such as thin body harness straps, but not stiffer leather such as collars and arm/leg cuffs (tagged with "leather-strong" or otherwise).

## The Bulk of Development - the `Interactions` Tab
- The `Interactions` tab is where all the magic happens and where you'll spend the most time developing - **luckily, the filter lets you filter interactions based on their development name, action name, and component development names / names**.
    - Within the `Selected Interaction` section, you can choose which `Action` to bind to the interaction, as well as an optional `Attached State` for when you want the interaction to only execute in a specific state (for some reason).
    - You can select different interaction component types from `Restraint`, `Restraint Location`, and `Object` - note that if the action does not have `Order Matters`, then it doesn't matter which order the components come in (though criteria will still be evaluated normally).
- The `Criteria` tab shows all the criteria which must be fulfilled (logical AND) for the interaction results to be executed. Most interaction criteria are pretty straightforward, but here are some notes for those which are more ambiguous:
    - When matching tags, you can also delimit with `,` to pass if any tags are matched
    - `targetTag_component1` / `targetTag_component2` - whether the components have the given tag, for instance trying to cut restraints with the "leather" tag. **Currently, when order does not matter, the criteria evaluates component 1 anyway - it should not be used in this way. TODO: update to a more reasonable interaction**
- The `Results` tab shows all the results which are executed (in-order, if that matters) when all of an interaction's criteria are met. Most interaction results are pretty straightforward, but here are some notes for those which are more ambiguous:
    - `locationAdd` / `locationRemove` - add or remove the given minimap location from the player. This can either be used to completely close-off a location (by removing it), or "updating" a location's state by removing the old location and adding the new one. **The `Backup Location` select can be used to 'choose' the replacement location (if replacement location is available) when the previous location is removed**
        - **Remember to ADD the new location before removing the previous location if using this method.**

## Minimap Galore - the `Locations` Tab
- The `Locations` tab is where all your minimap data is stored including click hitboxes, click results, etc. **TODO: add filter for minimap locations by development name and name** - you can select the image in the `Selected Location` section 
    - For each minimap location, you can create individual minimap objects with their own hitbox and click results - **minimap objects are processed from top to bottom, so the top-most minimap object should come first!**
        - Click around on the minimap to display the click hitbox for the minimap object - then, depending on whether the referenced object is defined and whether the dialog text is non-empty, when clicked the game will either reveal an object or show dialog (usually fluff) text.
        - You can click the `Clear Hitbox` button to clear the minimap object hitbox and restart - vectors have their hitbox within the highlighted area, just to let you know.