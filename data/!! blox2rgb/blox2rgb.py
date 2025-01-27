from PIL import Image
from colormath.color_objects import XYZColor, sRGBColor
from colormath.color_conversions import convert_color
from colormath.color_objects import XYZColor, sRGBColor
from colormath.color_conversions import convert_color
import os
import sys
import datetime

print('[][][][][] blox2rgb v3 [][][][][]\n')
dirname = 'input'



# start conversion again or quit
def postConvert():
    global dirname
    dirname = input('\nIf you wish to convert another blockset, please enter its directory name,\nor press Enter to terminate... ')
    if dirname == '':
        sys.exit()
    else:
        checkmate()



def converter():
    # create a new empty file
    try:
        outputTxt = open(dirname + '.js', 'x')
    except FileExistsError:
        input('\n[!] Warning -- "' + dirname + '.js" already exists. \nPress Enter to overwrite it... ')

    outputTxt = open(dirname + '.js', 'w')

    # add timestamp
    outputTxt.write('/* generated at ' + str(datetime.datetime.now()) + ' */\n\n')

    # add starting part of a block-storing JS object
    varName = dirname.removeprefix('data\\blocksets\\')
    outputTxt.write('var ' + varName + ' = [\n')
    varName = dirname.removeprefix('data\\blocksets\\')
    outputTxt.write('var ' + varName + ' = [\n')
    outputTxt.close()

    failedImgCnt = 0

    # cycle through the images starting from the LAST one until -1 is reached
    for i in range(len(listImgFound)-1, 0, -1):
        imgName = listImgFound[i]

        imgProc = Image.open('./' + dirname + '/' + imgName).convert('RGBA')
        
        # XYZ Space for averaging colours.      (later converted back to rgb)
        xyzSum = [0, 0, 0, 0]
        imgExpld = list(imgProc.getdata());
        count = 0
        
        for a in imgExpld:
            if a[3] != 0:  # skip empty pixel

                # convert pixel from srgb to xzy
                rgb = sRGBColor(a[0]/255, a[1]/255, a[2]/255)    #normalised values
                xyz = convert_color(rgb, XYZColor, target_illuminant='d50')

                xyzSum[0] += float(xyz.xyz_x)       #|
                xyzSum[1] += float(xyz.xyz_y)       #|
                xyzSum[2] += float(xyz.xyz_z)       #| sum with total
                xyzSum[3] += a[3]                   #|
                count += 1
        # (semi-transparent blocks aren't allowed, because they work REALLY
        # BAD for buildings; I'll leave the code for computation alpha channel
        # here, but, as of now, it is not used...)

        # divide by imgExpld.len()
        imgColor = [xyzSum[0]/count, xyzSum[1]/count, xyzSum[2]/count, xyzSum[3]/count]

        # convert from XYZ to sRGB
        xyzImgColor = XYZColor(imgColor[0], imgColor[1], imgColor[2])
        rgbImgColor = convert_color(xyzImgColor, sRGBColor)
        
        rgb = str(round(rgbImgColor.rgb_r * 255)) + ', ' + str(round(rgbImgColor.rgb_g * 255)) + ', ' + str(round(rgbImgColor.rgb_b * 255))
        xyz = str(xyzImgColor.xyz_x) + ', ' + str(xyzImgColor.xyz_y) + ', ' + str(xyzImgColor.xyz_z)
        print(f'Added {str(imgName)} with RGB value [{rgb}]')

        # append result to the block-storing JS object
        outputTxt = open(dirname + '.js', 'a')
        
        # write to the .js file
        outputTxt.write('    { id: "' + imgName + '", rgb: [' + rgb + '] },\n')

    # close the block-storing JS object and add a *beep* message
    outputTxt.write('];\n\nconsole.log("*beep* ' + dirname + '.js values initialized");')
    outputTxt.close()
    print('\n[][][][][] Conversion finished --', str(len(listImgFound) -failedImgCnt), '/', str(len(listImgFound)), 'textures converted.')
    postConvert()



def checkmate():
    # check if the directory exists
    if os.path.isdir('./' + dirname) == False:
        input('\n[!] Error -- directory "' + dirname + '" not found. \nMake sure its placed in the same directory with this script. \nPress Enter to enter another directory name... ')
        getDirname()
        return

    # get list of all .png files in the directory folder
    global listImgFound
    listImgFound = [f for f in os.listdir('./' + dirname) if f.endswith('.png')]
    # UPD: Sort images (they used to be read last to first, but now they apparently aren't?)
    listImgFound.sort(reverse=True)

    # check if the list is not empty
    if listImgFound == []:
        input('\n[!] Error -- no textures found. \nPlease check if all the textures placed DIRECTLY in the "' + dirname + '" directory (not in subfolders) and have ".png" extension. \nPress Enter to enter another directory name... ')
        getDirname()
        return

    print('[i] Found', len(listImgFound), 'textures in the "' + dirname + '" directory')
    converter()



# get directory name
def getDirname():
    global dirname
    dirname = str(input("Welcome! Enter the blockset's directory name to convert and press Enter... "))
    if dirname == '':
        getDirname()
    else:
        checkmate()
getDirname()
