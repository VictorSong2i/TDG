const fs = require('fs-extra');
const path = require('path');

module.exports = (on, config) => {
  on('task', {
    moveFile({ source, destination }) {
      const resolvedSourcePath = path.resolve(source);
      const resolvedDestinationPath = path.resolve(destination);

      fs.moveSync(resolvedSourcePath, resolvedDestinationPath, { overwrite: true });

      return null;
    },
  });
};