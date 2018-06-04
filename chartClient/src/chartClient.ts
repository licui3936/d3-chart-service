// @ts-ignore: type definition for service doesn't exist in openfin
const serviceClient: Promise<fin.OpenFinServiceClient> = fin.desktop.Service.connect({uuid: "D3ChartService", name: "D3ChartService"});
// @ts-ignore: type definition for service doesn't exist in openfin
serviceClient.then((service: fin.OpenFinServiceClient) => {
    console.log("Service ready " + Date.now());
    //(window as any).service = service;
}, (err) => console.log(err));

export async function getData(symbol: string): Promise<any> {
    // @ts-ignore: type definition for service doesn't exist in openfin
    const service: fin.OpenFinServiceClient = await serviceClient;
    return service.dispatch("D3Chart.getData", symbol).catch((err:any) => console.log(err));
}
