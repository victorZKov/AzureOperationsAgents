export type IDashboard = {
    TotalSpace: number;
    UsedSpace: number;
    TotalImages: number;
    UsedImages: number;
    Series: Series[];
}
export type Series = {
    Year: string;
    Data: SeriesData[];
    Comparison: number;
}
export type SeriesData = {
    Name: string;
    Data: number[];
}
export type SeriesLower = {
    year: string;
    data: {
        name: string;
        data: number[];
    }[];
    comparison: number;
}
export type SeriesDataLower = {
    name: string;
    data: number[];
}
export type ILatestImage = {
    Id: string;
    Title: string;
    Description: string;
    CoverUrl: string;
}