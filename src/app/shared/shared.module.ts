import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { PaginationComponent } from './pagination/pagination.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TrimPipe } from './pipes/trim.pipe';
import { FilterTextboxComponent } from './filter-textbox/filter-textbox.component';
import {Pager} from './pager/pager.component';
import {AlertComponent} from './alert/alert.component';

@NgModule({
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  // declarations: [CapitalizePipe, TrimPipe, FilterTextboxComponent, PaginationComponent ],
  declarations: [ Pager, AlertComponent, CapitalizePipe, TrimPipe, FilterTextboxComponent],
  // exports: [ CommonModule, FormsModule, ReactiveFormsModule, CapitalizePipe, TrimPipe, FilterTextboxComponent, PaginationComponent ]
  exports: [ Pager, AlertComponent, CommonModule, FormsModule, ReactiveFormsModule, CapitalizePipe, TrimPipe, FilterTextboxComponent ]
})
export class SharedModule { }
