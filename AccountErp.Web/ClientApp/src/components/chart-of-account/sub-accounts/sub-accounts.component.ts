import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sub-accounts',
  templateUrl: './sub-accounts.component.html',
  styleUrls: ['./sub-accounts.component.css']
})
export class SubAccountsComponent implements OnInit {
  @Input() data: any={};
  @Output() openAddAccountModal = new EventEmitter();
  
  //public data: any = {};
  constructor() { }

  ngOnInit() {
  }

}
