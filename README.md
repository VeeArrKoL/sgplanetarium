# sgplanetarium
KoLmafia relay script for finding [Spacegate](https://wiki.kingdomofloathing.com/Through_the_Spacegate) planets.

The data provided by sgplanetarium is based on spading by Veracity (#121572), Semenar (#3275442), Asmodais (#2071543), Crowther (#533281), VeeArr (#2045369), and others.

## Installation
Install sgplanetarium into KoLmafia by using this command in the gCLI:
```
git checkout VeeArrKoL/sgplanetarium
```

Note that sgplanetarium includes several large pre-computed planet data files, and takes up around 70MB of disk space.

## Usage
Open the relay script, select which options are acceptable options for the planet you want to find, and click Search. Note that the time taken to search may be between a few seconds and a minute or so, depending on the options selected and computer performance.

If a planet is found, it will match the specified filter for each category. The behavior of the filters varies slightly by category:

* **Difficulty:** The planet must be in one of the selected difficulty ranges.
* **Hazards:** The planet must not have any hazard that is not selected.
* **Aliens:** The planet's aliens must have an appropriate disposition according to whether None/Friendly/Hostile are checked. If the aliens are friendly, they must offer to trade one of the selected tradable items and if the Max Price box has a positive value, the trade price must be at most that much. If the aliens are hostile, they must drop one of the selected droppable items.
* **Plants/Animals:** The planet's plants/animals must match one of the selected disposition/complexity pairs.
* **Spants/Murderbots:** The planet's spants/murderbots presence must match one of the selected options.
* **Quest:** Unless None is selected, the planet must have a quest stage for one of the selected quest types. If the planet has a quest, its step must match one of the selected quest step values.

## Questions
* Why does the interface look so bad?
  * Because I'm not a front-end developer, and this is simple and gets the job done.
  