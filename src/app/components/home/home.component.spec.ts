import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TrialService } from '../../services/trial.service';
import { FavoritesService } from '../../services/favorites.service';
import { AutoFetchService } from '../../services/auto-fetch.service';

class MockTrialService {
  fetchTrialList = jasmine.createSpy().and.returnValue(
    Promise.resolve(
      Array.from({ length: 10 }, (_, i) => ({
        NCTId: `${i + 1}`,
        BriefTitle: `Trial ${i + 1}`,
        OverallStatus: 'Active',
        HasResults: false
      }))
    )
  );
}

class MockAutoFetchService {
  toggler = jasmine.createSpy().and.returnValue(false);
  toggleAutoFetch = jasmine.createSpy();
}

class MockFavoritesService {
  addFavorite = jasmine.createSpy();
  removeFavorite = jasmine.createSpy();
  getFavorites = jasmine.createSpy().and.returnValue(() => []);
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let trialService: MockTrialService;
  let favoritesService: MockFavoritesService;
  let autoFetchService: MockAutoFetchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: TrialService, useClass: MockTrialService },
        { provide: FavoritesService, useClass: MockFavoritesService },
        { provide: AutoFetchService, useClass: MockAutoFetchService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    trialService = TestBed.inject(TrialService) as unknown as MockTrialService;
    favoritesService = TestBed.inject(FavoritesService) as unknown as MockFavoritesService;
    autoFetchService = TestBed.inject(AutoFetchService) as unknown as MockAutoFetchService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch trials and set trialList', async () => {
    await component['fetchTrialList']();
    expect(component.trialList().length).toBe(10);
    expect(component.trialList()[0].NCTId).toBe('1');
  });

  it('should add to selectedTrials on toggleSelection(true)', () => {
    component.toggleSelection('1', true);
    expect(component.selectedTrials()).toContain('1');
  });

  it('should remove from selectedTrials on toggleSelection(false)', () => {
    component.selectedTrials.set(['1']);
    component.toggleSelection('1', false);
    expect(component.selectedTrials()).not.toContain('1');
  });

  it('should call addFavorite for each selected trial', () => {
    component.selectedTrials.set(['1', '2']);
    component.onAddSelectedToFavorites();
    expect(component.favoritesService.addFavorite).toHaveBeenCalledWith('1');
    expect(component.favoritesService.addFavorite).toHaveBeenCalledWith('2');
    expect(component.selectedTrials().length).toBe(0);
  });

  it('should call removeFavorite for each selected trial', () => {
    component.selectedTrials.set(['1', '2']);
    component.onRemoveSelectedFromFavorites();
    expect(component.favoritesService.removeFavorite).toHaveBeenCalledWith('1');
    expect(component.favoritesService.removeFavorite).toHaveBeenCalledWith('2');
    expect(component.selectedTrials().length).toBe(0);
  });

  it('should call toggleAutoFetch on onToggleChange', () => {
    component.onToggleChange(true);
    expect(component.autoFetchService.toggleAutoFetch).toHaveBeenCalledWith(true);
  });

  it('should add selected trials to favorites and clear selection', () => {
    component.selectedTrials.set(['1', '2']);
    component.onAddSelectedToFavorites();
    expect(component.favoritesService.addFavorite).toHaveBeenCalledWith('1');
    expect(component.favoritesService.addFavorite).toHaveBeenCalledWith('2');
    expect(component.selectedTrials().length).toBe(0);
  });
});
