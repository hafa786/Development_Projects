# Question: Write a program which will find all such numbers which are divisible by 7 but are not a multiple of 5,
# between between two numbers range included.


def multiple_finder(x, y):
    list_of_required = []
    for i in range(x, y):
        if(i % 7 == 0) and (i % 5 != 0):
            list_of_required.append(str(i))
    print ','.join(list_of_required)


print("********** Question 1 ***********")
lower_boundary = input("Please enter lower boundary :  ")
upper_boundary = input("Please enter upper_boundary :  ")
print multiple_finder(lower_boundary, upper_boundary)