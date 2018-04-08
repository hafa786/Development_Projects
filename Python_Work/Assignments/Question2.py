# Question: Write a program which can compute the factorial of a given numbers.
# The results should be printed in a comma-separated sequence on a single line.
# Suppose the following input is supplied to the program:


def factorial_calculate(digit):
    if digit == 0:
        return 1
    return digit * factorial_calculate(digit - 1)


print("********** Question 2 ***********")


number = input("Please enter your number :  ")


print factorial_calculate(int(number))