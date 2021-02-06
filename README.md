# RepositóriDOIS

## About

This project consists in a educational resource sharing platform for students and teachers built for DAW @ University of Minho. The platform allows users to register and upload their own resources, as well as seeing and downloading resources from other users. Resources can be books, presentations or code contained in a zip file. The system also allows adminsitrative use cases such as importing/exporting resources or analising some stats about the platform usage.

## Getting started

In order to run the platform you need to install `mongo`and `npm`. After installing all required software run the following commands in each folder (`auth-server`, `interface-server` and `api-server`):

```
npm i
npm start
```

After executing these commands, the platform should be running at [localhost:8000](http://localhost:8000). 
Before beeing able to use the platform you need to populate some values in the database. In the folder `data` are some example datasets that can be used to populate the database, and, there are 2 programs to generate example users and resources.

### Converting user to admin

In order to have a user with administrative privileges you need to update the record in `mongo`with the following line:

```
db.utilizadores.update({username: "USERNAME"},{$set: {admin: true}})
```

## Built With

- Node.js
- MongoDB
- Express
- Javascript
