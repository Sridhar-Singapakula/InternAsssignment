﻿# Ctruh Backend InternAsssignment

1.clone this repository

2.open terminal in the same folder and run => npm install

3.it will install all the packages of node i.e, node_modules folder will be visible

4.index.js contains all the routes like for the users routes you have to use : /api/clients 
   and for the userAuthentification: /api/login
   for the taskRoutes: /api/task

5.Registering a user with the schema given through postman or anyother similar tool.
  After registering login the user with the specific routes there we get response as "token"
  So this is the usertoken that expires in one day, to verify anyof the routes related to user or task,in the headers you have to write x-auth-token and paste the token of the user got from login as the value. 

6.Like the above we can verify every route .
