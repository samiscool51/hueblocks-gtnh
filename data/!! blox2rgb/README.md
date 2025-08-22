<h1>basic info</h1>
This is the folder for the blox2rgb tool, this takes in textures from a specifed folder and turns it into a `.js` file containing the blockSets for use in the site (the palette).

<h1>requirments</h1>
Python 3.8, `pillow`, and `python-colormath`

<h1>basic use</h1>

1. Install the following python packages: `pillow` and `python-colormath` (if you haven't already) via `pip` or your systems package manager (if on Debain or something)
2. execute `blox2rgb.py`
   - If you haven't made `blox2rgb.py` file executable, running `python3 blox2rgb.py` will work.
3. type in the folder name, ensure it's typed in correctly or it'll complain.
4. wait until it finishes (depending on the amount of files in the folder, it may take a few secs)
5. done

<h1>Limitations</h1>

- The program crashes when trying to process textures that are basicly nothing. (don't include them in your blocksets)
- Batch Processing takes time
- Animated textures aren't supported (nor are custom blockstates or tints)

<h1>batch use</h1>

1. execute `blox2rgb.py` with the arguments `--batch` it'll then process all folders within the current directory.
2. wait until it finishes, it'll take a minute.
3. done.


