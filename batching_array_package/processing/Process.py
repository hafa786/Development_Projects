# the main processing of data
# discarding the the size greater than 1MB
# making batch of records having size of less than 5MB
import sys
import os
import shutil
from humanize import naturalsize
from glob2 import iglob
import re
from scandir import scandir
import subprocess

class Process:
    def __init__(self): 
        self.foo = []
    
    # starting process
    def run(self):
        self.discarding_and_batching_records()
        return True
    
    # discarding the largest record over 1MB
    def discarding_and_batching_records(self):
        all_files = os.listdir("records_files")
        number_batch = 0
        total = 0
        for i in all_files:
            # print("---------------------")
            # print(i)
            file_size = int(int(os.path.getsize("records_files/"+i))/ 1024)
            if not os.path.isdir("results_files/batch_group_"+str(number_batch)):
                os.makedirs("results_files/batch_group_"+str(number_batch))
            # print(file_size)
            if file_size < 1024 :
                total += file_size
                if total < 5000 :
                    shutil.move("records_files/"+i, "results_files/batch_group_"+str(number_batch)+"/"+i)
                else:
                    total = file_size
                    number_batch +=1
                    os.makedirs("results_files/batch_group_"+str(number_batch))
                    shutil.move("records_files/"+i, "results_files/batch_group_"+str(number_batch)+"/"+i)
        return True