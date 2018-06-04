import * as d3 from 'd3';

export class ChartService {
    public static MSG_GETDATA: string = "D3Chart.getData";

    public async register(): Promise<void> {
        console.log('register chart service');
        // @ts-ignore: type definition for service doesn't exist in openfin
        const service = await fin.desktop.Service.register();

        service.register(ChartService.MSG_GETDATA, this.onGetData.bind(this));
    }
    
    constructor() {}

    private async onGetData(symbol: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (symbol) {
                //todo: get actual data
                d3.tsv('data.tsv', (data: any) => {
                    resolve(data);
                });          

            } else {
                reject(new Error("Failed to get data for " + symbol));
            }
        });
    }    
}