import sys;

from inputData.InputGenerator import InputGenerator;

from processing.Process import Process;

# calling Rondom input generator
inputgenertor = InputGenerator()
input_data = inputgenertor.run()

# calling processing
process = Process()
running_process = process.run()

if (running_process):
    print("Success")
else:
    print("Failure")

