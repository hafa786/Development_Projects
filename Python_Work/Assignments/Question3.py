# Question:
# With a given integral number n, write a program to generate a dictionary that contains (i, i*i) such that
# is an integral number between 1 and n (both included). and then the program should print the dictionary.
# Suppose the following input is supplied to the program:


def generate_dictionary(x):
    result = dict()
    for i in range(1, x+1):
        result[i] = str(i) + ':' + str(i*i)
    return result


number = input("enter you your number = ")
print(generate_dictionary(int(number)))
