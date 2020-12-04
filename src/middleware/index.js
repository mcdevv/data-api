export * from './middleware';

/*
Express documentation describes a middleware as:
https://expressjs.com/en/guide/using-middleware.html
“[...] functions that have access to the request object (req), the response object (res),
and the next middleware function in the application’s request-response cycle.
The next middleware function is commonly denoted by a variable named next.”
A middleware can perform any number of functions such as authentication, 
modifying the request body, and so on


*/
