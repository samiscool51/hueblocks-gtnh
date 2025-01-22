from PIL import Image
import os
import sys
import shutil
import datetime

print('[][][][][] blox2rgb v3 [][][][][]\n')
dirname = 'input'



# start conversion again or quit
def postConvert():
    global dirname
    dirname = input('If you wish to convert another blockset, please enter its directory name,\nor press Enter to terminate... ')
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
    outputTxt.write('var ' + dirname + ' = [\n')
    outputTxt.close()

    failedImgCnt = 0
    # cycle through the images starting from the LAST one until -1 is reached
    i = len(listImgFound) -1
    while i >= 0:
        imgName = listImgFound[i]

        # try to open an image
        try:  
            imgProc = Image.open('./' + dirname + '/' + imgName)
            #print('opened "' + imgName + '" --', imgProc.format, imgProc.size, imgProc.mode)

            # resize the image to 1px and convert to RGBA
            # UPD: Image.ANTIALIAS is now deprecated, so use Image.LANCZOS, which gives around
            # the same colours (not 100% precise but other methods produce values even worse)
            imgProc = imgProc.resize((1, 1), Image.BICUBIC).convert('RGBA')
            # imgProc = imgProc.resize((1, 1), Image.HAMMING).convert('RGBA')
            #print('converted "' + imgName + '" to 1px RGBA temp image')

            # load temp image and take the color of the only pixel from it
            imgTemp = imgProc.load()
            imgColor = imgTemp[0, 0]
            #print('rgb data of "' + imgName + '" is', str(imgColor[0]) + ', ' + str(imgColor[1]) + ', ' + str(imgColor[2]))

            # append result to the block-storing JS object
            outputTxt = open(dirname + '.js', 'a')
            if i == 0:
                outputTxt.write('	{ id: "' + imgName + '", rgb: [' + str(imgColor[0]) + ', ' + str(imgColor[1]) + ', ' + str(imgColor[2]) + '] }\n')
            else:
                outputTxt.write('	{ id: "' + imgName + '", rgb: [' + str(imgColor[0]) + ', ' + str(imgColor[1]) + ', ' + str(imgColor[2]) + '] },\n')
            #print('saved', imgName, 'as "block' + str(i) + '" with colour data ' + str(imgColor[0]) + ', ' + str(imgColor[1]) + ', ' + str(imgColor[2]))

        # skip to the next image if the current one cannot be processed
        except:  
            print('[!] Warning -- "' + imgName + '" cannot be processed.')
            failedImgCnt += 1

        # substract 1 to go to the next image
        i -= 1

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
