var fs = require('fs');

class MoveReadmeWebPackPlugin {
    apply() {
        if (!fs.existsSync('./build')) {
            fs.mkdirSync('./build');
        }
        fs.createReadStream('./README.md').pipe(fs.createWriteStream('./build/README.md'));
    }
}

module.exports = MoveReadmeWebPackPlugin;