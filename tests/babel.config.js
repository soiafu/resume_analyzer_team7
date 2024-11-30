module.exports = {
    presets: [
      '@babel/preset-env',    // Handles modern JavaScript syntax
      '@babel/preset-react'   // Handles JSX syntax
    ],
    
    ignore: [
      '**/*.png',  // Ignore image files
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.gif',
      '**/*.svg',
    ],
  };
  