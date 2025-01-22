UPD: the terms here are a bit dated (well, just like the script itself!), comparing to newer HB.
I.e., here, "blockset" means not a blocks dataset, but just a directory containing textures. Sorry!

After the "coversion" finished, the simplest way to use it in HB is to replace "blocks" folder and
"blocks.js" blockdata with your ones. Keep in mind that, in this case, the palettes will stop working!

----

blox2rgb.py is a very simple Python script for converting blocksets (a directory with Minecraft textures)
to a blockdata (color data of every single block from a blockset) .js (sic!) file.


==== WHAT DO I NEED TO RUN IT?
here's what you need to run this script:
- Python 3.8 on newer (sorry Windows XP users!)
- PILLOW module (run "pip install pillow" in CMD.EXE)


==== OKAY, SO HOW TO USE IT?
[1] put your blockset's folder to the same directory where blox2rgb is stored
[2] run blox2rgb.py (if it doesn't work, make sure you've installed PILLOW and using at least Python 3.8)
[3] enter the blockset's directory's name in a command prompt and wait...
[4] ...w...a...i...t... (actually it takes less then a second even on my potato PC)
[5] PROFIT! if you want to convert another blockset, type it's directory's name, or hit Enter to quit.
