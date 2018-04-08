#Question: Write a program which will find all such numbers which are divisible by 7 but are not a multiple of 5,
#between 1000 and 2000 (both included).
list_of_required = []
for i in range(1000,2000):
    if(i%7 == 0) and (i%5!=0):
       list_of_required.append(str(i))
print ','.join(list_of_required)

