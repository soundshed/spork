// note that the fs package does not exist on a normal browser
const {fs, ipcRenderer, ipcMain } = require( "electron");

ipcRenderer.invoke('perform-action', {action:"hello"})

//a dialog box module from electron
const { dialog } = require("electron").remote;

// Also note that document does not exist in a normal node environment
// button click event
document.getElementById("mybutton").addEventListener("click", () => {

    ipcRenderer.invoke('perform-action', ...args)

  /*const data = "Successfully wrote to the desktop"; // the data we want to save to the desktop

  //launch save dialog window
  dialog.showSaveDialog(filename => {
    //save file at the destination indicated by filename
    fs.writeFileSync(filename + ".txt", data, "utf-8", () => {
      console.log("attempted to write to the desktop");
    });
  });*/
});