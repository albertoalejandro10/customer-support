const fs = require('fs');
const path = require('path');
const replace = require('replace-in-file');
const escapeRegExp = require('lodash.escaperegexp');

// the directory in which you're outputting your build
let baseDir = 'public'
// the name for the directory where your static files will be moved to
let staticDir = 'static'
// the directory where your built files (css and JavaScript) will be moved  to
let assetsDir = 'build'

// if the staticDir directory isn't there, create it
if (!fs.existsSync(path.join(__dirname, baseDir, staticDir))){
  fs.mkdirSync(path.join(__dirname, baseDir, staticDir));
}

// same for the assetsDir directory
if (!fs.existsSync(path.join(__dirname, baseDir, assetsDir))){
  fs.mkdirSync(path.join(__dirname, baseDir, assetsDir));
}

let html = []

fs.readdir(`./${baseDir+'\\Clientes'}`, (err, files1) => {
  files1.forEach(file => {
    if(file.match(/.+\.(html)$/)) {
      console.log('html match', file)
      html.push(file)        
    }
  });

  console.log('html', html)
});

fs.readdir(`./${baseDir+'\\ConsultaComprobantes'}`, (err, files1) => {
  files1.forEach(file => {
    if(file.match(/.+\.(html)$/)) {
      console.log('html match', file)
      html.push(file)        
    }
  });

  console.log('html', html)
});

fs.readdir(`./${baseDir+'\\Contabilidad'}`, (err, files1) => {
  files1.forEach(file => {
    if(file.match(/.+\.(html)$/)) {
      console.log('html match', file)
      html.push(file)        
    }
  });

  console.log('html', html)
});

fs.readdir(`./${baseDir+'\\Gestion'}`, (err, files1) => {
  files1.forEach(file => {
    if(file.match(/.+\.(html)$/)) {
      console.log('html match', file)
      html.push(file)        
    }
  });

  console.log('html', html)
});

fs.readdir(`./${baseDir+'\\Inventario'}`, (err, files1) => {
  files1.forEach(file => {
    if(file.match(/.+\.(html)$/)) {
      console.log('html match', file)
      html.push(file)        
    }
  });

  console.log('html', html)
});

fs.readdir(`./${baseDir+'\\Legales'}`, (err, files1) => {
  files1.forEach(file => {
    if(file.match(/.+\.(html)$/)) {
      console.log('html match', file)
      html.push(file)        
    }
  });

  console.log('html', html)
});

fs.readdir(`./${baseDir+'\\PendientesClientes'}`, (err, files1) => {
  files1.forEach(file => {
    if(file.match(/.+\.(html)$/)) {
      console.log('html match', file)
      html.push(file)        
    }
  });

  console.log('html', html)
});

fs.readdir(`./${baseDir+'\\Proveedores'}`, (err, files1) => {
  files1.forEach(file => {
    if(file.match(/.+\.(html)$/)) {
      console.log('html match', file)
      html.push(file)        
    }
  });

  console.log('html', html)
});

fs.readdir(`./${baseDir+'\\ServiciosClientes'}`, (err, files1) => {
  files1.forEach(file => {
    if(file.match(/.+\.(html)$/)) {
      console.log('html match', file)
      html.push(file)        
    }
  });

  console.log('html', html)
});

fs.readdir(`./${baseDir+'\\Valores'}`, (err, files1) => {
  files1.forEach(file => {
    if(file.match(/.+\.(html)$/)) {
      console.log('html match', file)
      html.push(file)        
    }
  });

  console.log('html', html)
});

//await delay(60000);
setTimeout(() => {
  

// Loop through the baseDir directory
fs.readdir(`./${baseDir}`, (err, files) => {
  // store all files in custom arrays by type
  
  let js = []
  let css = []
  let maps = []
  let staticAssets = [] 

  files.forEach(file => {
    // first HTML files
    if(file.match(/.+\.(html)$/)) {
      console.log('html match', file)
      html.push(file)
    } else  if(file.match(/.+\.(js)$/)) { // then JavaScripts
      js.push(file)
    } else if(file.match(/.+\.(map)$/)) { // then CSS
      maps.push(file)
    } else if(file.match(/.+\.(css)$/)) { // then sourcemaps
      css.push(file)
    } else if(file.match(/.+\..+$/)){ // all other files, exclude current directory and directory one level up
      staticAssets.push(file)
    }
  });  

  // check what went where
  console.log('html', html, 'css', css, 'js', js, 'staticAssets', staticAssets)

  // create an array for all compiled assets
  let assets = css.concat(js).concat(maps)

  // replace all other resources in html Clientes
  html.forEach(
    file => {
      staticAssets.forEach(name => {
        let options = {
          files: path.join('public\\Clientes', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' + staticDir + '/' + name
        }
        //console.log('a_' + options.files + '-' + name + '-' + options.to) ;
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
      assets.forEach(name => {
        let options = {
          files: path.join('public\\Clientes', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' +assetsDir + '/' + name
        }
        //console.log('b_' + options.files + '-' + name + '-' + options.to) ;
        try {          
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace all other resources in html ConsultaComprobantes
  html.forEach(
    file => {
      staticAssets.forEach(name => {
        let options = {
          files: path.join('public\\ConsultaComprobantes', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' + staticDir + '/' + name
        }
        //console.log('a_' + options.files + '-' + name + '-' + options.to) ;
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
      assets.forEach(name => {
        let options = {
          files: path.join('public\\ConsultaComprobantes', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' +assetsDir + '/' + name
        }
        //console.log('b_' + options.files + '-' + name + '-' + options.to) ;
        try {          
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace all other resources in html Contabilidad
  html.forEach(
    file => {
      staticAssets.forEach(name => {
        let options = {
          files: path.join('public\\Contabilidad', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' + staticDir + '/' + name
        }
        //console.log('a_' + options.files + '-' + name + '-' + options.to) ;
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
      assets.forEach(name => {
        let options = {
          files: path.join('public\\Contabilidad', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' +assetsDir + '/' + name
        }
        //console.log('b_' + options.files + '-' + name + '-' + options.to) ;
        try {          
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace all other resources in html Gestion
  html.forEach(
    file => {
      staticAssets.forEach(name => {
        let options = {
          files: path.join('public\\Gestion', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' + staticDir + '/' + name
        }
        //console.log('a_' + options.files + '-' + name + '-' + options.to) ;
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
      assets.forEach(name => {
        let options = {
          files: path.join('public\\Gestion', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' +assetsDir + '/' + name
        }
        //console.log('b_' + options.files + '-' + name + '-' + options.to) ;
        try {          
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace all other resources in html Inventario
  html.forEach(
    file => {
      staticAssets.forEach(name => {
        let options = {
          files: path.join('public\\Inventario', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' + staticDir + '/' + name
        }
        //console.log('a_' + options.files + '-' + name + '-' + options.to) ;
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
      assets.forEach(name => {
        let options = {
          files: path.join('public\\Inventario', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' +assetsDir + '/' + name
        }
        //console.log('b_' + options.files + '-' + name + '-' + options.to) ;
        try {          
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace all other resources in html Legales
  html.forEach(
    file => {
      staticAssets.forEach(name => {
        let options = {
          files: path.join('public\\Legales', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' + staticDir + '/' + name
        }
        //console.log('a_' + options.files + '-' + name + '-' + options.to) ;
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
      assets.forEach(name => {
        let options = {
          files: path.join('public\\Legales', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' +assetsDir + '/' + name
        }
        //console.log('b_' + options.files + '-' + name + '-' + options.to) ;
        try {          
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          ///console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace all other resources in html PendientesClientes
  html.forEach(
    file => {
      staticAssets.forEach(name => {
        let options = {
          files: path.join('public\\PendientesClientes', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' + staticDir + '/' + name
        }
        //console.log('a_' + options.files + '-' + name + '-' + options.to) ;
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
      assets.forEach(name => {
        let options = {
          files: path.join('public\\PendientesClientes', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' +assetsDir + '/' + name
        }
        //console.log('b_' + options.files + '-' + name + '-' + options.to) ;
        try {          
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace all other resources in html Proveedores
  html.forEach(
    file => {
      staticAssets.forEach(name => {
        let options = {
          files: path.join('public\\Proveedores', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' + staticDir + '/' + name
        }
        //console.log('a_' + options.files + '-' + name + '-' + options.to) ;
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
      assets.forEach(name => {
        let options = {
          files: path.join('public\\Proveedores', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' +assetsDir + '/' + name
        }
        //console.log('b_' + options.files + '-' + name + '-' + options.to) ;
        try {          
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace all other resources in html ServiciosClientes
  html.forEach(
    file => {
      staticAssets.forEach(name => {
        let options = {
          files: path.join('public\\ServiciosClientes', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' + staticDir + '/' + name
        }
        //console.log('a_' + options.files + '-' + name + '-' + options.to) ;
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
      assets.forEach(name => {
        let options = {
          files: path.join('public\\ServiciosClientes', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' +assetsDir + '/' + name
        }
        //console.log('b_' + options.files + '-' + name + '-' + options.to) ;
        try {          
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace all other resources in html Valores
  html.forEach(
    file => {
      staticAssets.forEach(name => {
        let options = {
          files: path.join('public\\Valores', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' + staticDir + '/' + name
        }
        //console.log('a_' + options.files + '-' + name + '-' + options.to) ;
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
      assets.forEach(name => {
        let options = {
          files: path.join('public\\Valores', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: 'solu_externo/' +assetsDir + '/' + name
        }
        //console.log('b_' + options.files + '-' + name + '-' + options.to) ;
        try {          
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          //console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace map links in js
  js.forEach(
    file => {
      maps.forEach(name => {
        let options = {
          files: path.join('public', file),
          from: name,
          to: '../' + assetsDir + '/' + name
        }
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace links in css
  css.forEach(
    file => {
      staticAssets.forEach(name => {
        let options = {
          files: path.join('public', file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: '../solu_externo/' + staticDir + '/' + name
        }
        try {
          let changedFiles = replace.sync(options);
          //console.log('Modified files:', changedFiles.join(', '));
        }
        catch (error) {
          console.error('Error occurred:', error);
        }
      })
    }
  )

  // move js and css and maps
  assets.forEach(
    name => {
      fs.rename(path.join(__dirname, 'public', name), path.join(__dirname, 'public', assetsDir,  name), function (err) {
        if (err) throw err
        //console.log(`Successfully moved ${name}`)
      })
    }
  )
  // move staticAssets
  staticAssets.forEach(
    name => {
      fs.rename(path.join(__dirname, 'public', name), path.join(__dirname, 'public', staticDir,  name), function (err) {
        if (err) throw err
        //console.log(`Successfully moved ${name}`)
      })
    }
  )


});
}, 120000);