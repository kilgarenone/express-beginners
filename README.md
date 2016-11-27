## Motivation

I'd dabbled with NodeJS before, but it wasn't until 2 months ago(Oct 2016) that I really tried to put as much of everything together to serve as a decent basis for web development for beginners.

I started with the [Web Development With Node and Express](https://github.com/EthanRBrown/web-development-with-node-and-express) book by Ethan Brown. But soon I realized, since the book was published in 2014, lots that were covered in the book have changed, and things that weren't covered have gained tractions since then. 

Therefore, this repo consolidates and structures all of my knowledges of the opinions/experiences from StackOverflow's users, blog posts, and official docs regarding various aspects of the book, libraries and more, hoping that this would ease a beginner's learning experience that could get somewhat overwhelming like it did for me trying to catch up in the sea of information towards the latest developments.

## Features
Codes are well commented, and credits and sources are linked in the comments.

#### Here are the things covered in this repo
- [ES2015](http://www.2ality.com/2015/08/getting-started-es6.html) features.
- [MVVM](https://addyosmani.com/blog/understanding-mvvm-a-guide-for-javascript-developers/) structure.
- Separate 'node_modules' folder for shared app's local modules. [See here](https://stackoverflow.com/questions/10860244/how-to-make-the-require-in-node-js-to-be-always-relative-to-the-root-folder-of-t/24461606#24461606)
- [Promises](https://developers.google.com/web/fundamentals/getting-started/primers/promises) pattern.
- Templating with Handlebars using [express-handlebars](https://github.com/ericf/express-handlebars).
- Static files serving. 
- Email services using [Nodemailer](https://github.com/nodemailer/nodemailer).
- Facebook Login user authentication using [Passport.js](https://github.com/jaredhanson/passport).
- File uploading to local using [Multer](https://github.com/expressjs/multer).
- Logging to console and file rotation using [Winston](https://github.com/winstonjs/winston) and [Morgan](https://github.com/expressjs/morgan).
- MongoDB database interaction using [Mongoose](https://github.com/Automattic/mongoose).
- Persistent sessions using [connect-redis](https://github.com/tj/connect-redis).
- GZIP compression using [compression](https://github.com/expressjs/compression).
- Parse request body data using [body-parser](https://github.com/expressjs/body-parser).
- Basic security measures using [Helmet](https://github.com/helmetjs/helmet).
- Favicon using [serve-favicon](https://github.com/expressjs/serve-favicon).
- A [file](https://github.com/kilgarenone/express-consensus/blob/master/learnMiddlewareFlow.js) to quickly learn the concept of how logic flows through Middlewares.

#### Things covered in the gulpfile.js
- Hot reload using 'Browser Sync'.
- SCSS to CSS conversion using 'gulp-sass'.
- CSS sourcemap using 'gulp-sourcemaps'.
- CSS autoprefix using 'gulp-autoprefixer'.
- Files revisioning and cache busting using 'gulp-rev' and 'gulp-rev-replace'.

## Get Started
#### Step 1
Run `git clone https://github.com/kilgarenone/express-consensus` in a new directory.
#### Step 2
Run `npm install` from the root directory to install all of the dependencies listed in the package.json
#### Step 3
Run `npm start` to start the app with hot-reloading enabled.
Run `npm test` to run tests.
#### Step 4
Go to `localhost:3000/nursery-rhyme` for demo of client-side and server-side rendering templates.
#### Step 5
Go to `localhost:3000/vacation-photo` for demo of file uploading.
#### Step 6
Go to `localhost:3000/shops/all` for demo of facebook login authentication.

Click any of the three currencies for persistent sessions demo.
#### Step 7
Run `node learnMiddlewareFlow` from the root directory to learn about the concept of Nodejs's middleware flow controls.
