1. copy paste in terminal to compile req lib
Set classpath with all required JARs-
set CP=lib\gson-2.8.9.jar;lib\mysql-connector-j-8.0.33.jar;lib\jakarta.servlet-api-5.0.0.jar

javac -cp "%CP%" -d src\main\webapp\WEB-INF\classes src\main\java\DatabaseConnection.java

javac -cp "lib\gson-2.8.9.jar;lib\mysql-connector-j-8.0.33.jar;lib\jakarta.servlet-api-5.0.0.jar;src\main\webapp\WEB-INF\classes" -d src\main\webapp\WEB-INF\classes src\main\java\SearchPatientsServlet.java


