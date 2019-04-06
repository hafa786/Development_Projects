# This class basically making a array of record using different functions


from random import randint
import datetime
import json

class InputGenerator:
    def __init__(self): 
        self.foo = []
    
    # run - the inputGenerator's class functions
    def run(self):
        rondom_data = self.generating_data()
        #print(rondom_data)
        self.inserting_records_in_files(rondom_data)
        return True
    
    # generating the data array (array of records)
    def generating_data(self):
        numbers = []
        now = datetime.datetime.now()
        message = "write a library which takes in an array of records of variable size and splits the input to batches of records (array of arrays) suitably sized for delivery to a system which has following limits: maximum size of output record is 1 MB, larger records should be discarded maximum size of output batch is 5 MB maximum number of records in an output batch is 500 Input for the library is: [, , , … , ] Output is: [, , …, ] where each batch is an array of records just like in the input. The records can be assumed to be strings of variable length and they have to pass intact through the system and records should stay in the order that they arrive."
        for i in range(5000):
            #numbers.append(i)
            values = randint(1, 5)
            #print(values)
            if values == 1:
                numbers.append({"id":i})
            if values == 2:
                numbers.append({"id":i,"message":message})
            if values == 3:
                numbers.append({"id":i,"name":"testing","message":message})
            if values == 4:
                numbers.append({"id":i,"name":"testing","message":message,"status":"active"})
            if values == 5:
                numbers.append({"id":i,"name":"testing","message":message,"status":"active","dated":now})
        return numbers
    
    # params -  generated data
    # records file from 0 to 99 - total 100 records
    # making record of variale size - 1 to any betwee 500-4990
    def inserting_records_in_files(self,data):
        print("********************************  Generate_input_files ************************************")
        for i in range(100):
            number_of_records = randint(500, 4999)
            file_name = "records_files/record_file"+ str(i) +".txt"
            print(file_name)
            file = open(file_name,"w")
            file.writelines(str(data[1:number_of_records]))
            file.close()
        return True