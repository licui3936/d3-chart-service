//Once the DOM has loaded and the OpenFin API is ready
if (window.hasOwnProperty("fin")) {
  const app: any = fin.desktop.Application.getCurrent();
  fin.desktop.System.showDeveloperTools(app.uuid, app.uuid);
  fin.desktop.System.getVersion(version => {
    const ofVersion = document.querySelector("#of-version") as any;
    ofVersion.innerText = version;
  });
}
else {
  const ofVersion = document.querySelector("#of-version") as any;
  ofVersion.innerText = "OpenFin is not available - you are probably running in a browser.";
}