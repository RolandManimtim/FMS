export interface IClient {
  [key: string]: any;
  availment?: IAvailment[];
}

export interface IAvailment {
  [key: string]: any;
  availmentDetails?: IAvailmentDetails[];
}

export interface IAvailmentDetails {
  [key: string]: any;

}
