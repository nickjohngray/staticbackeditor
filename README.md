<pre>                                                                                                                                                                                                             
   _____ ___ __          
  (_  | _ |o/  |_  _  _| 
  __) |(_|||\__|_)(_|(_|< EDITOR
</pre>

## This is the Editor for Static Back

Static Back Editor
https://github.com/nickjohngray/staticbackeditor.

Static Back Editor is a Decoupled CMS built with the MERN Stack.
The Static Back Editor allows a user to edit their static website . The static website must be a clone of my Static Back repo https://github.com/nickjohngray/staticback
These two repos work together.

**This is how it works**

When a new application or website is needed a clone of Static Back is created and kept on Github
Changes are made to the Manifest.json file. This file describes the website , including the pages content, products , facebook, youtube and paypaw account data.
When Static Back is started up it will build it self according to the manifest file.

#Login
When the user wants to make a change they will go to the Static Back Editor Application Website and log in.
The end point rout will be hit in Node Express ( once for the React and and again through the API call for login ), Node will then connect to the Mongo database and check if the user exist ( these users get added to my system admin (me) when the new repo is cloned )

The login process on the backend is cool. Checking if the user exist or not is the simple step , it then gets the user repo name from the database and then makes a connection to Github and clones the repo, it then copies all images and pdfs over to the public folder, and fnally it starts a child process the repo it self running npm install and then npm start, ( started with hot reloading ) . These things are done in a background process . It must start up the repo , so when the user clicks the preview button it will work.

This Preview works by creating a new window with Javascript and loading the built repo into it. More on that below
So once logged in the user will be taken to their dashboard. The dashboard is created according to the manifest file from their repo.
It frst shows a list of current pages. The user can CRUD any page and any product.

#Save
When the user makes a change and saves it a few things happen,
frst the save API end point rout is hit in express node backend.
It has a controller that does a few things like checking for deleted pages , copying over any upload assets from the upload folder into the repo and of course replacing the old manifest with the new manifest. As soon as the manifest is saved something really cool happens:

#Preview

The preview window ( that is a separate window ) is updated immediately without the user having to refresh.
How is this possible ?
While the Static Back is running ( in DEV mode) it monitors its manifest file for changes. As soon as a change is made ( that change is made by Static Back Editor ) it rebuilds the website and injects the changes into the live instance.
Therefor the user can see what their changes did immediately .
If they are unhappy with them they can undo them , or redo them whenever they like , as it supports unlimited undo/redo . Another cool thing is that even if the user logs out , and logs back a week later , they can still undo/redo their last changes as they are restored from local storage. ( I may change this feature but its good for development)

#Publish

When the user is ready to go live they click the publish button, this is interesting , somehow the website is going to be built and put on the web live. This is achieved by Static Back Editor , as soon as the publish button is clicked axios is used to make a call to the backend , it will hit the publish API end point in node express. This will perform a Git add . ( adding the manifest and any asset files ) and then a Git commit and Push.
Build and Deploy
As soon as git is updated CI kicks in. Netify https://www.netlify.com will be notifed that the github repo got changed. Netify will then run the build processes for production. Once it builds the repo , it will then publish it and make it go live .

#Static Back Editor Frontend Features

-   Unlimited undo/ redo
-   Dynamic path creation linked into redux
-   CRUD of pages, products & variations.
-   Recursive tree nodes with nested Drop & Drag.
-   Written with type script.
-   Tslint , StyleLint & pretty.
-   User can login, preview and perform CRUD and publish.
-   Editor Components:
-   Rich text editor
-   Tree editor : recursive that uses sub editors
-   Section editor
-   Product editor
-   Page editor
-   Pages editor
-   Layout Editor ( coming soon...)
-   Image Editor : allows images to be uploaded

#Static Back Frontend Features

-   Uses React Static , a Static Site Generator , this makes is lighting fast. https://github.com/react-static/react-static
-   Static Back is integrated with Youtube, Facebook and Paypaw APIs'
-   Written with type script.
-   Tslint , StyleLint & pretty.
-   Shopping cart , products product variations ( confgured by manifest )
-   unlimited pages and content ( confgured by manifest )

#Future Plans

-   Layout editor , to take the best from Wordpress worlds and React worlds. Like DIVI https://www.youtube.com/watch?v=_Ggmuf38NYE

-   Editor for menus ( allowing nested menus )

-   Theming ( allow creation and save and use )

-   Plugins ( allow custom plugins , visual components and with editor )

-   Use React Hooks more often , these can keep the code cleaner. Write End to End tests and unit tests-

-   Build React Native App from the manifest file (in the same way) and automatically build and deploy to play store and app store using Bitrise.

-   and much more...

# In Progress

This repo is in the early stages

If you want to help give me a buzz at nickjohngray@gmail.com
