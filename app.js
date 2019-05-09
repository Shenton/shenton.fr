const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const sass = require('node-sass');
const fs = require('fs-extra');
const jsonfile = require('jsonfile');
const geoip = require('geoip-lite');
const minify = require('express-minify');
const uglifyEs = require('uglify-es');
var minifyHTML = require('express-minify-html');

// Main app object
var app = express();

// Make modules available to ejs views
app.locals.fs = fs;
app.locals.jsonfile = jsonfile;
app.locals.path = path;
app.locals.geoip = geoip;

// app root dir available to ejs views
app.locals.baseDir = __dirname;

// Server port
const port = process.env.PORT || 3000;

// ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// express layout
app.use(expressLayouts);
app.set('layout', path.join(__dirname, 'layouts/layout'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Minify
//if (process.env.NODE_ENV === 'production') {
    app.use(minifyHTML({
        override:      true,
        exception_url: false,
        htmlMinifier: {
            removeComments:            true,
            collapseWhitespace:        true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes:     true,
            removeEmptyAttributes:     true,
            minifyJS:                  true
        }
    }));
    app.use(minify({
        uglifyJsModule: uglifyEs,
    }));
//}

// Public directory
app.use('/assets', express.static(path.join(__dirname, 'public')));

// Log
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    var accessLogStream = rfs('access.log', {
        interval: '7d',
        size: "10M",
        compress: true,
        path: path.join(__dirname, 'log')
    });
    app.use(morgan('combined', { stream: accessLogStream }));
}

// css/js compilation
if (process.env.NODE_ENV === 'development') {
    sass.render({
        file: path.join(__dirname, 'src/sass/style.scss'),
    }, function(err, result) {
        if (!err) {
            fs.writeFile(path.join(__dirname, 'public/css/style.css'), result.css);
        } else {
            console.log(err);
        };
    });
}

// home page
app.get('/', function(req, res) {
    res.render('index', {req : req}, function(err, html) {
        if (!err) {
            res.send(html);
        } else {
            console.log(err)
        }
    });
});

// views
var filteredViews = ['index.ejs', 'error.ejs', '404.ejs'];
function filterViews(element) {
    if (filteredViews.includes(element)) {
        return false;
    }
    return true;
}

var views = fs.readdirSync(path.join(__dirname, 'views'));
views.filter(filterViews).forEach(view => {
    view = path.basename(view, path.extname(view));
    app.get('/' + view, function(req, res) {
        res.render(view, {req : req}, function(err, html) {
            if (!err) {
                res.send(html);
            } else {
                console.log(err)
            }
        });
    });
});

// 404
app.get('*', function(req, res) {
    res.render('404', {req : req}, function(err, html) {
        if (!err) {
            res.send(html);
        } else {
            console.log(err);
        }
    });
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, function() {
    console.log('Server listening on port ' + port);
});
