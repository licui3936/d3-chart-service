import { ChartService } from './chartService';

//event listeners.
document.addEventListener("DOMContentLoaded", () => {
    if (typeof fin != "undefined") {
      fin.desktop.main(onMain);
    } else {
      let ofVersion: any = document.querySelector("#of-version");
      ofVersion.innerText =
        "OpenFin is not available - you are probably running in a browser.";
    }
  });
  
  //Once the DOM has loaded and the OpenFin API is ready
  async function onMain() {
    const app = fin.desktop.Application.getCurrent();
    //fin.desktop.System.showDeveloperTools(app.uuid, app.uuid);
    fin.desktop.System.getVersion(version => {
      let ofVersion: any = document.querySelector("#of-version");
      ofVersion.innerText = version;
    });

    // register service
    let service = new ChartService();
    await service.register();
  }