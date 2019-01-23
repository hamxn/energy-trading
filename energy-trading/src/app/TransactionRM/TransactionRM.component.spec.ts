import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Configuration } from '../configuration';
import { DataService } from '../data.service';
import { TransactionRMComponent } from './TransactionRM.component';
import {TransactionRMService} from './TransactionRM.service';

describe('TransactionComponent', () => {
  let component: TransactionRMComponent;
  let fixture: ComponentFixture<TransactionRMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionRMComponent ],
      imports: [
          BrowserModule,
          FormsModule,
          ReactiveFormsModule,
          HttpModule
        ],
      providers: [TransactionRMService,DataService,Configuration]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionRMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
