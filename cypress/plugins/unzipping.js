const decompress = require('decompress');

const unzip = ({ path, file }) => decompress(path + file, path)

module.exports = {
    unzip,
}