import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Configuration } from '../configuration';
import { DataService } from '../data.service';
import { TransactionUMComponent } from './TransactionUM.component';
import {TransactionUMService} from './TransactionUM.service';

describe('TransactionComponent', () => {
  let component: TransactionUMComponent;
  let fixture: ComponentFixture<TransactionUMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionUMComponent ],
      imports: [
          BrowserModule,
          FormsModule,
          ReactiveFormsModule,
          HttpModule
        ],
      providers: [TransactionUMService,DataService,Configuration]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionUMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
