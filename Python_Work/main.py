import math
print('****************** Simple Calculator ***************************')
print('****************** Please Select the Operation ***************************')
print('****************** 1 For Addition ***************************')
print('****************** 2 For Subtraction ***************************')
print('****************** 3 For Division ***************************')
print('****************** 4 For Multiplication ***************************')
print ('\n')
option = input("Please enter your option :  ")
print('\n')
var_one = input("Please enter your first number :  ")
var_two = input("Please enter your second number :  ")
# print(option)


if (option == 1):
    add_value = var_one + var_two
    print "Addition =  " + str(add_value)


if (option == 2):
    subtract_value = var_one - var_two
    print 'Subtraction = ' + str(subtract_value)


if (option == 3):
    divided_value = var_one / var_two
    print 'Division = ' + str(divided_value)


if (option == 4):
    multiply_value = var_one * var_two
    print 'Multiplication = ' + str(multiply_value)
