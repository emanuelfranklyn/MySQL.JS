# MySQL.JS
A implementation of mysql commands as functions in javascript (also allows you to not break everything if your database is offline)

Short description:
Creates a Ready event when connect sucefully with database (also you can use .then after the connect command)
All commands than are been runned before connection with mysql database stays in a waiting state, and then after the 
connection are runned so you can use a then after the command and doesn't make your code await the database connection to
start.
