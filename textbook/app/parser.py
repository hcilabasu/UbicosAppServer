import os
from bs4 import BeautifulSoup

class parser():
    def activityParser(self):
        # TODO: get number of html files in folder
        #os.getcwd() gives the path for current root directory
        path = os.getcwd()+'/app/static/pages/'

        #returns the total number of file in the given folder location
        #https://stackoverflow.com/questions/2632205/how-to-count-the-number-of-files-in-a-directory-using-python
        length = len([1 for x in list(os.scandir(path)) if x.is_file()])

        #returns name of the file list in the specified directory
        #used sorted() to sort the names of the files
        #https://stackoverflow.com/questions/44532641/order-in-which-files-are-read-using-os-listdir
        names_files = sorted(os.listdir(path))

        with open(path+names_files[0], "r") as myfile:
            data = myfile.read()
            for line in data:
                line.rstrip()

            soup = BeautifulSoup(data)
            soup.prettify()

            return soup.find_all("a")