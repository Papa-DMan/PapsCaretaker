const pkg = require('./package.json');
const { YouTube } = require('popyt');
const youtube = new YouTube(pkg.YOUTUBE_API)