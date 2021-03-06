# Showroom api

Nodejs Api, using Express and localDb 

## Api methods 

**Fetch the last five users created in the DB**
```
GET /users

Params :
No params required

Success code : 200
```

**Create a user in the db**
```
POST /users

Params :
username : String -> name of the user
(optional) upload : Blob -> photo of the user

Success code : 201
Error code : 409
```

**Get the user with the id :id**
```
get /users/:id

Params :
No params required

Success code : 200
Error code : 404
```

**Update the user with the id :id**
```
PATCH /users/:id

params :
change : Object -> Changements sur l'utilisateur ex {username: 'yourstring'}

Success code : 201
Error code : 404
```

**Upload image to the server and update the user with the id :id**
```
POST /users/:id

params :
upload : Blob -> photo of the user's creation
type : String -> type of creation [possible values : ['audiovisuel', 'infographie', 'web'] ]

Success code : 201
Error code : 404
```


##ERROR FORMAT

```javascript
{
    error: true,
    message: 'Infos about the error'
}
```