import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetDefaultCredentialsComponent } from './reset-default-credentials';


describe( 'ResetDefaultCredentialsComponent', () =>
{
  let component: ResetDefaultCredentialsComponent;
  let fixture: ComponentFixture<ResetDefaultCredentialsComponent>;

  beforeEach( async( () =>
  {
    TestBed.configureTestingModule( {
      declarations: [ ResetDefaultCredentialsComponent ]
    } )
      .compileComponents();
  } ) );

  beforeEach( () =>
  {
    fixture = TestBed.createComponent( ResetDefaultCredentialsComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  } );

  it( 'should create', () =>
  {
    expect( component ).toBeTruthy();
  } );
} );
