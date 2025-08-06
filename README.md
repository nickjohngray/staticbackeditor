<pre>                                                                                                                                                                                                             
   _____ ___ __          
  (_  | _ |o/  |_  _  _| 
  __) |(_|||\__|_)(_|(_|< EDITOR
</pre>

## This is the Editor for Static Back

[Static Back Editor](https://github.com/nickjohngray/staticbackeditor)

Static Back Editor is a Decoupled CMS built with the MERN Stack.  
The Static Back Editor allows a user to edit their static website. The static website must be a clone of my Static Back repo: [Static Back](https://github.com/nickjohngray/staticback).  
These two repos work together.

**This is how it works:**

When a new application or website is needed, a clone of Static Back is created and kept on GitHub.  
Changes are made to the `Manifest.json` file. This file describes the website, including the pages' content, products, Facebook, YouTube, and PayPal account data.  
When Static Back is started up, it will build itself according to the manifest file.

### Login
When the user wants to make a change, they will go to the Static Back Editor Application Website and log in.  
The endpoint route will be hit in Node Express (once for React and again through the API call for login).  
Node will then connect to the Mongo database and check if the user exists (these users get added to my system admin (me) when the new repo is cloned).

The login process on the backend is straightforward. After checking if the user exists, it retrieves the user’s repo name from the database, connects to GitHub, clones the repo, copies all images and PDFs over to the public folder, and finally starts a child process to run `npm install` and `npm start` (started with hot reloading). These tasks are done in the background.  
It must start up the repo so when the user clicks the preview button, it will work.

The Preview works by creating a new window with JavaScript and loading the built repo into it. More on that below.  
Once logged in, the user will be taken to their dashboard. The dashboard is created according to the manifest file from their repo.  
It first shows a list of current pages. The user can CRUD any page and any product.

### Save
When the user makes a change and saves it, a few things happen:  
First, the save API endpoint route is hit in the Express Node backend.  
It has a controller that does a few things, like checking for deleted pages, copying over any uploaded assets from the upload folder into the repo, and of course replacing the old manifest with the new one. As soon as the manifest is saved, something really cool happens:

### Preview

The preview window (which is a separate window) is updated immediately without the user having to refresh.  
How is this possible?  
While Static Back is running (in DEV mode), it monitors its manifest file for changes. As soon as a change is made (that change is made by Static Back Editor), it rebuilds the website and injects the changes into the live instance.  
Therefore, the user can see what their changes did immediately.  
If they are unhappy with the changes, they can undo or redo them whenever they like, as it supports unlimited undo/redo. Another cool thing is that even if the user logs out and logs back in a week later, they can still undo/redo their last changes as they are restored from local storage. (I may change this feature, but it's good for development.)

### Publish

When the user is ready to go live, they click the publish button. This is interesting; somehow, the website is going to be built and put on the web live.  
This is achieved by Static Back Editor: as soon as the publish button is clicked, Axios is used to make a call to the backend. It will hit the publish API endpoint in Node Express.  
This will perform a `git add .` (adding the manifest and any asset files), followed by a `git commit` and `git push`.  

### Build and Deploy
As soon as Git is updated, CI kicks in. [Netlify](https://www.netlify.com) will be notified that the GitHub repo got changed. Netlify will then run the build process for production. Once it builds the repo, it will then publish it and make it live.

### Static Back Editor Frontend Features
- Unlimited undo/redo
- Dynamic path creation linked into Redux
- CRUD of pages, products & variations
- Recursive tree nodes with nested drag & drop
- Written with TypeScript
- TSLint, StyleLint & Prettier
- User can login, preview, and perform CRUD operations and publish
- Editor Components:
  - Rich text editor
  - Tree editor: recursive, uses sub-editors
  - Section editor
  - Product editor
  - Page editor
  - Pages editor
  - Layout editor (coming soon...)
  - Image editor: allows image uploads

### Static Back Frontend Features
- Uses React Static, a Static Site Generator, making it lightning-fast: [React Static](https://github.com/react-static/react-static)
- Integrated with YouTube, Facebook, and PayPal APIs
- Written with TypeScript
- TSLint, StyleLint & Prettier
- Shopping cart, product variations (configured by the manifest)
- Unlimited pages and content (configured by the manifest)

### Future Plans
- Layout editor: to take the best from WordPress and React worlds, like **DIVI** ([YouTube link](https://www.youtube.com/watch?v=_Ggmuf38NYE))
- Editor for menus (allowing nested menus)
- Theming (allow creation, save, and use themes)
- Plugins (allow custom plugins, visual components, and editors)
- Use React Hooks more often to keep the code cleaner
- Write end-to-end tests and unit tests
- Build a React Native app from the manifest file (in the same way) and automatically build and deploy to the Play Store and App Store using Bitrise
- And much more...

### In Progress
This repo is in the early stages.

If you want to help, give me a buzz at [nickjohngray@gmail.com](mailto:nickjohngray@gmail.com).

