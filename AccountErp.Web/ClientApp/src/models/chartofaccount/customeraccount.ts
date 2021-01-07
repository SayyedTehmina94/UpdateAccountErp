

export class customerAccountModel {
  public id:number;
    public coA_AccountTypeId: string;
    public accountName: string;
    public accountCode: string;
    public Description:string;

  
    public accountNumber: string;
    public accountHolderName: string;
    public bankName: string;
    public branchName: string;
    public ifsc: string;
  
    public description: string;
   
    public ledgerTyp: string;
    public ledgerType: number;
   
    public accountId: string;
    public status: boolean;
    
   

    constructor() {
       this.accountNumber=null;
      
    }
}